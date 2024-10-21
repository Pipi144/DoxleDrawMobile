import {Alert, StyleSheet} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import {useState} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {Video} from 'react-native-compressor';
import {NEW_QA_IMAGE_TEMPLATE, QA} from '../../../../../Models/qa';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import useSetQAQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAQueryData';
import useLocalQAVideo from './useLocalQAVideo';
import {IQAVideoUploadData, LocalQAImage} from '../../../Provider/CacheQAType';
type Props = {qaItem: QA; handleSetIsProcessingImage: (value: boolean) => void};

const useQAImageMenuSection = ({qaItem, handleSetIsProcessingImage}: Props) => {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const {user} = useAuth();
  const {addQAImage, addPendingVideoList, addMultiCachedVideoList} =
    useProjectQAStore(
      useShallow(state => ({
        addQAImage: state.addQAImage,
        addPendingVideoList: state.addPendingVideoList,
        addMultiCachedVideoList: state.addMultiCachedVideoList,
      })),
    );
  const {handleCreateMultiQAImageFolder, handleSaveQAThumbnailMarkup} =
    useCacheQAContext();
  const {handleUpdateFirstImageQA} = useSetQAQueryData({});
  const {isGenerating, handleGeneratePendingLocalVideo} = useLocalQAVideo({});

  // useTrimmingVideoEffect({
  //   onFinishTrimming: async e => {
  //     if (e) {
  //       const compressedVid = await Video.compress(
  //         e.outputPath,
  //         {
  //           maxSize: 1280,
  //           progressDivider: 1,
  //           compressionMethod: 'auto',
  //         },
  //         progress => {
  //           setCompressState({
  //             currentProgress: Math.floor(progress * 100),
  //             totalProgress: 100,
  //             onCancel: () => {},
  //           });
  //         },
  //       );
  //       setCompressState(undefined);
  //       const data = await handleGeneratePendingLocalVideo({
  //         videoFile: {
  //           uri: compressedVid ?? e?.outputPath,
  //           name: `DefectVideo-${new Date().getTime()}.mp4`,
  //           type: 'video/mp4',

  //         },
  //         videoId: uuid.v4().toString(),
  //         // uniqueId(qaItem.defectId)
  //         hostId: qaItem.defectId,
  //       });
  //       if (data)
  //         addPendingVideoList({
  //           ...data,

  //         });
  //     }
  //   },
  //   onCancelTrimming: e => {
  //     setShowMediaModal(false);
  //   },
  //   onError: e => {
  //     Alert.alert('Trimming failed!', `Unable to trim video ${e ?? ''}`);
  //     setShowMediaModal(false);
  //   },
  // });
  const handlePressCameraBtn = async () => {
    try {
      handleSetIsProcessingImage(true);
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchCamera({
          mediaType: 'mixed',
          videoQuality: 'high',
          presentationStyle: 'fullScreen',
          quality: 1,
          cameraType: 'back',
          maxHeight: 900,
          maxWidth: 700,
          assetRepresentationMode: 'current',
        });

      if (imagePickerResult.didCancel) {
      }
      if (imagePickerResult.errorMessage) {
        Alert.alert('Error media', imagePickerResult.errorMessage);
      }
      if (imagePickerResult.assets) {
        const mediaItem = imagePickerResult.assets[0];
        if (mediaItem.uri && mediaItem.fileName && mediaItem.type) {
          if (mediaItem.type?.startsWith('image/')) {
            const tempId = uuid.v4().toString();
            const tempQAImage: LocalQAImage = {
              ...NEW_QA_IMAGE_TEMPLATE({
                imageId: tempId,
                imagePath: mediaItem.uri,
                imagePathWithMarkup: mediaItem.uri,
                imageHeight: mediaItem.height || 0,
                imageWidth: mediaItem.width || 0,

                company: qaItem.company,

                defectList: qaItem.defectList,
                defect: qaItem.defectId,
                imageName: `IMG#${new Date().getTime()}.jpeg`,
                imageType: 'image/jpeg',
                thumbPath: mediaItem.uri,
                project: qaItem.project,
                imageSize: mediaItem.fileSize || 0,
                createdBy: user?.userId || undefined,
              }),
              status: 'pending',
            };

            const movedList = await handleCreateMultiQAImageFolder(
              [tempQAImage],
              qaItem,
            );
            // listRef.current?.scrollToIndex({index: 0, animated: true});
            //* add to qaImageStore to display on the list
            addQAImage(movedList);

            //*update the thumnail for qa item
            handleUpdateFirstImageQA(
              qaItem.defectId,
              qaItem.defectList,
              movedList[movedList.length - 1].imagePath,
            );

            //*save thumbnail to local device
            handleSaveQAThumbnailMarkup({
              qaImage: movedList[movedList.length - 1],
              thumbUri: movedList[movedList.length - 1].imagePath,
            });
          } else if (mediaItem.type?.startsWith('video/')) {
            if (mediaItem.fileSize && mediaItem.fileSize / (1024 * 1024) > 50) {
              Alert.alert(
                'Video too large',
                'We only support video less than 50Mb',
              );
              return;
            }
            const data = await handleGeneratePendingLocalVideo({
              videoFile: {
                uri: mediaItem.uri,
                name: `DefectVideo-${new Date().getTime()}.mp4`,
                type: 'video/mp4',
                size: mediaItem.fileSize,
                fileId: uuid.v4().toString(),
              },
              videoId: uuid.v4().toString(),
              // uniqueId(qaItem.defectId)
              hostId: qaItem.defectId,
            });
            if (data)
              addPendingVideoList({
                ...data,
              });
          }
        }
      }
      if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
    } catch (error) {
      console.log('ERROR handlePressCameraBtn:', error);
    } finally {
      handleSetIsProcessingImage(false);
    }
  };

  const handlePressGalleryPhotoBtn = async () => {
    try {
      handleSetIsProcessingImage(true);
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchImageLibrary({
          selectionLimit: 0,
          mediaType: 'mixed',
          presentationStyle: 'formSheet',
          videoQuality: 'high',
          quality: 0.6,
          maxHeight: 900,
          maxWidth: 600,
          assetRepresentationMode: 'current',
        });

      if (imagePickerResult.didCancel) {
        return;
      }
      if (imagePickerResult.assets) {
        setShowMediaModal(false);

        let tempQAImageList: LocalQAImage[] = [];
        let tempQAVideoList: IQAVideoUploadData[] = [];
        let oversizeVideoList: ImagePicker.Asset[] = [];
        for await (const asset of imagePickerResult.assets) {
          if (asset.uri && asset.fileName && asset.type) {
            if (asset.type.startsWith('image/')) {
              const tempId = uuid.v4().toString();
              const tempQAImage: LocalQAImage = {
                ...NEW_QA_IMAGE_TEMPLATE({
                  imageId: tempId,
                  imagePath: asset.uri,
                  imagePathWithMarkup: asset.uri,
                  imageHeight: asset.height || 0,
                  imageWidth: asset.width || 0,

                  company: qaItem.company,

                  defectList: qaItem.defectList,
                  defect: qaItem.defectId,
                  imageName: `IMG#${new Date().getTime()}.jpeg`,
                  imageType: 'image/jpeg',
                  thumbPath: asset.uri,
                  project: qaItem.project,
                  imageSize: asset.fileSize || 0,
                  createdBy: user?.userId || undefined,
                }),
                status: 'pending',
              };
              tempQAImageList.push(tempQAImage);
            } else if (asset.type.startsWith('video/')) {
              // if (asset.fileSize && asset.fileSize / (1024 * 1024) > 50) {
              //   console.log('OVERSIZE VIDEO:', asset.fileSize / (1024 * 1024));
              //   oversizeVideoList.push(asset);
              // } else {
              //   const data = await handleGeneratePendingLocalVideo({
              //     videoFile: {
              //       uri: asset.uri,
              //       name: `DefectVideo-${new Date().getTime()}.mp4`,
              //       type: 'video/mp4',
              //       size: asset.fileSize,
              //       fileId: uuid.v4().toString(),
              //     },
              //     videoId: uuid.v4().toString(),
              //     // uniqueId(qaItem.defectId)
              //     hostId: qaItem.defectId,
              //   });

              //   if (data) tempQAVideoList.push(data);
              // }
              const data = await handleGeneratePendingLocalVideo({
                videoFile: {
                  uri: asset.uri,
                  name: `DefectVideo-${new Date().getTime()}.mp4`,
                  type: 'video/mp4',
                  size: asset.fileSize,
                  fileId: uuid.v4().toString(),
                },
                videoId: uuid.v4().toString(),
                // uniqueId(qaItem.defectId)
                hostId: qaItem.defectId,
              });

              if (data) tempQAVideoList.push(data);
            }
          }
        }
        if (tempQAImageList.length > 0) {
          const movedList = await handleCreateMultiQAImageFolder(
            tempQAImageList,
            qaItem,
          );
          // listRef.current?.scrollToIndex({index: 0, animated: true});
          // //* add to qaImageStore to display on the list
          addQAImage(movedList);

          //*update the thumnail for qa item
          handleUpdateFirstImageQA(
            qaItem.defectId,
            qaItem.defectList,
            movedList[movedList.length - 1].imagePath,
          );

          //*save thumbnail to local device
          handleSaveQAThumbnailMarkup({
            qaImage: movedList[movedList.length - 1],
            thumbUri: movedList[movedList.length - 1].imagePath,
          });
        }
        if (tempQAVideoList.length > 0)
          addMultiCachedVideoList(tempQAVideoList);

        if (oversizeVideoList.length > 0)
          Alert.alert(
            'Some Videos Are Too Large',
            `Some videos exceed the 50MB size limit, we weren't able to upload them! Please choose smaller videos to proceed.`,
          );
      }
      if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
    } catch (error) {
      console.log('ERROR:', error);
    } finally {
      setShowMediaModal(false);
      handleSetIsProcessingImage(false);
    }
  };

  // const handlePressGalleryVideoBtn = async () => {
  //   try {
  //     handleSetIsProcessingImage(true);
  //     let imagePickerResult: ImagePicker.ImagePickerResponse =
  //       await ImagePicker.launchImageLibrary({
  //         selectionLimit: 1,
  //         mediaType: 'video',
  //         presentationStyle: 'formSheet',
  //         videoQuality: 'high',
  //         assetRepresentationMode: 'current',
  //       });

  //     if (imagePickerResult.didCancel) {
  //       return;
  //     }
  //     if (imagePickerResult.assets) {
  //       const mediaItem = imagePickerResult.assets[0];
  //       if (mediaItem.type?.startsWith('video/')) {
  //         setShowMediaModal(false);
  //         setTimeout(() => {
  //           showEditor(mediaItem?.uri || '', {
  //             cancelButtonText: 'Cancel',
  //             enableSaveDialog: false,
  //             enableCancelDialog: false,
  //             saveToPhoto: false,
  //             cancelDialogConfirmText: 'Ok',
  //           });
  //         }, 300);
  //       }
  //     }
  //     if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
  //   } catch (error) {
  //     console.log('ERROR:', error);
  //     setShowMediaModal(false);
  //   } finally {
  //     handleSetIsProcessingImage(false);
  //   }
  // };
  return {
    handlePressCameraBtn,
    handlePressGalleryPhotoBtn,
    showMediaModal,
    setShowMediaModal,
    // handlePressGalleryVideoBtn,
  };
};

export default useQAImageMenuSection;

const styles = StyleSheet.create({});
