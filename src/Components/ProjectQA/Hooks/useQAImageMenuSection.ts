import {Alert, StyleSheet} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {shallow} from 'zustand/shallow';
import {QA} from '../../../../../../Models/qa';
import {LocalQAImage} from '../../../../../../Providers/CacheQAProvider/CacheQAType';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {NEW_QA_IMAGE_TEMPLATE} from '../../../../../../Models/qa';
import useSetQAQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAQueryData';
import useTrimmingVideoEffect from '../../../../../../CustomHooks/useTrimmingVideoEffect';
import {showEditor} from 'react-native-video-trim';
import {useBgUploadVideoStore} from '../../../../../../GeneralStore/useBgUploadVideoStore';
import useLocalVideo from '../../../../../../CustomHooks/useLocalVideo';
import {useState} from 'react';
import {uniqueId} from 'lodash';
import {useShallow} from 'zustand/react/shallow';
import {Video} from 'react-native-compressor';
type Props = {qaItem: QA; handleSetIsProcessingImage: (value: boolean) => void};
interface QAImageMenuSection {
  handlePressCameraBtn: () => Promise<void>;
  handlePressGalleryPhotoBtn: () => Promise<void>;
  showMediaModal: boolean;
  setShowMediaModal: React.Dispatch<React.SetStateAction<boolean>>;
  handlePressGalleryVideoBtn: () => Promise<void>;
}

const useQAImageMenuSection = ({
  qaItem,
  handleSetIsProcessingImage,
}: Props): QAImageMenuSection => {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const {user} = useAuth();
  const {addQAImage, setCompressState} = useProjectQAStore(
    useShallow(state => ({
      addQAImage: state.addQAImage,
      setCompressState: state.setCompressState,
    })),
  );
  const {handleCreateMultiQAImageFolder, handleSaveQAThumbnailMarkup} =
    useCacheQAContext();
  const {handleUpdateFirstImageQA} = useSetQAQueryData({});
  const {isGenerating, handleGeneratePendingLocalVideo} = useLocalVideo({});
  const {addPendingVideoList} = useBgUploadVideoStore(
    useShallow(state => ({
      addPendingVideoList: state.addPendingVideoList,
    })),
  );

  useTrimmingVideoEffect({
    onFinishTrimming: async e => {
      if (e) {
        const compressedVid = await Video.compress(
          e.outputPath,
          {
            maxSize: 1280,
            progressDivider: 1,
            compressionMethod: 'auto',
          },
          progress => {
            setCompressState({
              currentProgress: Math.floor(progress * 100),
              totalProgress: 100,
              onCancel: () => {},
            });
          },
        );
        setCompressState(undefined);
        const data = await handleGeneratePendingLocalVideo({
          videoFile: {
            uri: compressedVid ?? e?.outputPath,
            name: `DefectVideo-${new Date().getTime()}.mp4`,
            type: 'video/mp4',
          },
          videoId: uuidv4(),
          // uniqueId(qaItem.defectId)
          hostId: qaItem.defectId,
        });
        if (data)
          addPendingVideoList({
            ...data,
            uploadVariant: 'QA',
          });
      }
    },
    onCancelTrimming: e => {
      setShowMediaModal(false);
    },
    onError: e => {
      Alert.alert('Trimming failed!', `Unable to trim video ${e ?? ''}`);
      setShowMediaModal(false);
    },
  });
  const handlePressCameraBtn = async () => {
    try {
      handleSetIsProcessingImage(true);
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchCamera({
          mediaType: 'mixed',
          videoQuality: 'high',
          presentationStyle: 'fullScreen',
          quality: 0.6,
          cameraType: 'back',
          maxHeight: 900,
          maxWidth: 700,
        });

      if (imagePickerResult.didCancel) {
      }
      if (imagePickerResult.assets) {
        const mediaItem = imagePickerResult.assets[0];
        if (mediaItem.type?.startsWith('image/')) {
          if (mediaItem.uri && mediaItem.fileName && mediaItem.type) {
            const tempId = uuidv4();
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
          }
        } else if (mediaItem.type?.startsWith('video/')) {
          showEditor(mediaItem?.uri || '', {
            cancelButtonText: 'Cancel',
            enableSaveDialog: false,
            enableCancelDialog: false,
            saveToPhoto: false,
            cancelDialogConfirmText: 'Ok',
          });
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
          mediaType: 'photo',
          presentationStyle: 'formSheet',
          videoQuality: 'high',
          quality: 0.6,
          maxHeight: 600,
          maxWidth: 600,
        });

      if (imagePickerResult.didCancel) {
        return;
      }
      if (imagePickerResult.assets) {
        setShowMediaModal(false);

        let tempQAImageList: LocalQAImage[] = [];

        for await (const photo of imagePickerResult.assets) {
          if (photo.uri && photo.fileName && photo.type) {
            const tempId = uuidv4();
            const tempQAImage: LocalQAImage = {
              ...NEW_QA_IMAGE_TEMPLATE({
                imageId: tempId,
                imagePath: photo.uri,
                imagePathWithMarkup: photo.uri,
                imageHeight: photo.height || 0,
                imageWidth: photo.width || 0,

                company: qaItem.company,

                defectList: qaItem.defectList,
                defect: qaItem.defectId,
                imageName: `IMG#${new Date().getTime()}.jpeg`,
                imageType: 'image/jpeg',
                thumbPath: photo.uri,
                project: qaItem.project,
                imageSize: photo.fileSize || 0,
                createdBy: user?.userId || undefined,
              }),
              status: 'pending',
            };

            tempQAImageList.push(tempQAImage);
          }
        }

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
      if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
    } catch (error) {
      console.log('ERROR:', error);
    } finally {
      setShowMediaModal(false);
      handleSetIsProcessingImage(false);
    }
  };

  const handlePressGalleryVideoBtn = async () => {
    try {
      handleSetIsProcessingImage(true);
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchImageLibrary({
          selectionLimit: 1,
          mediaType: 'video',
          presentationStyle: 'formSheet',
          videoQuality: 'high',
          assetRepresentationMode: 'current',
        });

      if (imagePickerResult.didCancel) {
        return;
      }
      if (imagePickerResult.assets) {
        const mediaItem = imagePickerResult.assets[0];
        if (mediaItem.type?.startsWith('video/')) {
          setShowMediaModal(false);
          setTimeout(() => {
            showEditor(mediaItem?.uri || '', {
              cancelButtonText: 'Cancel',
              enableSaveDialog: false,
              enableCancelDialog: false,
              saveToPhoto: false,
              cancelDialogConfirmText: 'Ok',
            });
          }, 300);
        }
      }
      if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
    } catch (error) {
      console.log('ERROR:', error);
      setShowMediaModal(false);
    } finally {
      handleSetIsProcessingImage(false);
    }
  };
  return {
    handlePressCameraBtn,
    handlePressGalleryPhotoBtn,
    showMediaModal,
    setShowMediaModal,
    handlePressGalleryVideoBtn,
  };
};

export default useQAImageMenuSection;

const styles = StyleSheet.create({});
