import {Alert, StyleSheet} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {shallow} from 'zustand/shallow';
import FilesAPI, {
  AddFileMutateProps,
  IFilterGetFileQueryFilter,
  TAddDoxleFile,
} from '../../../../../../service/DoxleAPI/QueryHookAPI/fileQueryAPI';
import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';

import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useOrientation} from '../../../../../../Providers/OrientationContext';

import {useProjectStore} from '../../../Store/useProjectStore';
import {useShallow} from 'zustand/react/shallow';
import {Image, Video} from 'react-native-compressor';
import {showEditor} from 'react-native-video-trim';
import useTrimmingVideoEffect from '../../../../../../CustomHooks/useTrimmingVideoEffect';

type Props = {};

type AddFolderNavProps = {
  ProjectNewFolderScreen: {};
};

const useEmptyFileScreen = (props: Props) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const navigator = useNavigation<StackNavigationProp<AddFolderNavProps>>();
  const {accessToken} = useAuth();
  const {deviceSize} = useOrientation();
  const {showNotification} = useNotification();

  const {selectedProject} = useProjectStore(
    useShallow(state => ({
      selectedProject: state.selectedProject,
    })),
  );
  const {company} = useCompany();
  const {currentFolder, filterProjectFileQuery, setCompressState} =
    useProjectFileStore(
      useShallow(state => ({
        currentFolder: state.currentFolder,
        filterProjectFileQuery: state.filterProjectFileQuery,
        setCompressState: state.setCompressState,
      })),
    );
  const filterFileQuery: IFilterGetFileQueryFilter = useMemo(
    () =>
      currentFolder
        ? {
            folderId: currentFolder.folderId,
          }
        : filterProjectFileQuery,
    [currentFolder, filterProjectFileQuery],
  );
  const addFileQuery = FilesAPI.useAddFilesQuery({
    accessToken: accessToken,
    company: company,
    showNotification: showNotification,
    filter: filterFileQuery,
  });
  // const handlePressAddFolder = () => {
  //   setShowAddModal(false);

  //   setTimeout(() => {
  //     navigator.navigate('ProjectNewFolderScreen', {});
  //   }, 500);
  // };
  // const handlePressAddDocument = async () => {
  //   try {
  //     const result = await DocumentPicker.pick({
  //       type: [
  //         DocumentPicker.types.xls,
  //         DocumentPicker.types.doc,
  //         DocumentPicker.types.pdf,
  //         DocumentPicker.types.docx,
  //         DocumentPicker.types.xlsx,
  //         DocumentPicker.types.csv,
  //       ],
  //       allowMultiSelection: true,
  //       presentationStyle: 'overFullScreen',
  //       transitionStyle: 'flipHorizontal',
  //       copyTo: 'cachesDirectory',
  //     });

  //     if (result) {
  //       let addedFiles: TAddDoxleFile[] = [];
  //       result.forEach((file, fileIndex) => {
  //         if (file.uri && file.name && file.type) {
  //           const fileBlob: TAddDoxleFile = {
  //             uri: file.uri,
  //             name: file.name,
  //             type: file.type,
  //           };
  //           addedFiles.push(fileBlob);
  //         }
  //       });

  //       const addFileData: AddFileMutateProps = {
  //         folderId: currentFolder?.folderId ?? undefined,

  //         projectId: selectedProject?.projectId ?? undefined,
  //         files: addedFiles,
  //       };
  //       addFileQuery.mutate(addFileData);
  //     }
  //   } catch (err) {
  //     //Handling any exception (If any)
  //     if (DocumentPicker.isCancel(err)) {
  //       //If user canceled the document selection
  //       console.log('Canceled from single doc picker');
  //     } else {
  //       //For Unknown Error
  //       console.error('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   } finally {
  //     setShowAddModal(false);
  //   }
  // };

  // const handlePressAddPhotoLibrary = async () => {
  //   try {
  //     let imagePickerResult: ImagePicker.ImagePickerResponse =
  //       await ImagePicker.launchImageLibrary({
  //         selectionLimit: 0,
  //         mediaType: 'photo',
  //         presentationStyle: 'formSheet',
  //         quality: 1,
  //       });

  //     if (imagePickerResult.didCancel) {
  //     }
  //     if (imagePickerResult.assets) {
  //       setShowAddModal(false);
  //       let pickedImgs: TAddDoxleFile[] = [];
  //       for await (const [index, img] of imagePickerResult.assets.entries()) {
  //         if (img.uri && img.fileName && img.type && img.width && img.height) {
  //           setCompressState({
  //             currentProgress: index + 1,
  //             totalProgress: imagePickerResult.assets.length,
  //             onCancel: () => {
  //               setCompressState(undefined);
  //             },
  //           });
  //           try {
  //             const result = await Image.compress(img.uri, {
  //               progressDivider: 1,
  //               downloadProgress: progress => {
  //                 console.log('downloadProgress: ', progress);
  //               },
  //               compressionMethod: 'auto',
  //               quality: 0.7,
  //             });
  //             if (result) {
  //               pickedImgs.push({
  //                 uri: result,
  //                 name: img.fileName,
  //                 type: img.type,
  //               });
  //             }
  //           } catch (error) {
  //             pickedImgs.push({
  //               uri: img.uri,
  //               name: img.fileName,
  //               type: img.type,
  //             });
  //             continue;
  //           }
  //         }
  //       }
  //       setCompressState(undefined);
  //       const addFileData: AddFileMutateProps = {
  //         files: pickedImgs,

  //         projectId: selectedProject?.projectId,
  //       };
  //       addFileQuery.mutate(addFileData);
  //     }
  //     if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
  //   } catch (error) {
  //     console.log('ERROR handlePressCameraMenu:', error);
  //   } finally {
  //     handlePressVideoLibraryMenu;
  //   }
  // };
  // const handlePressVideoLibraryMenu = async () => {
  //   try {
  //     let imagePickerResult: ImagePicker.ImagePickerResponse =
  //       await ImagePicker.launchImageLibrary({
  //         selectionLimit: 1,
  //         mediaType: 'video',
  //         presentationStyle: 'formSheet',
  //         videoQuality: 'high',
  //         assetRepresentationMode: 'current',
  //       });

  //     if (imagePickerResult.didCancel) {
  //     }
  //     if (imagePickerResult.assets) {
  //       const mediaItem = imagePickerResult.assets[0];
  //       if (mediaItem.type?.startsWith('video/')) {
  //         showEditor(mediaItem?.uri || '', {
  //           // maxDuration: 120,
  //           cancelButtonText: 'Cancel',
  //           enableSaveDialog: false,
  //           enableCancelDialog: false,
  //           saveToPhoto: false,
  //           cancelDialogConfirmText: 'Ok',
  //         });
  //       }
  //     }
  //     if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
  //   } catch (error) {
  //     console.log('ERROR handlePressCameraMenu:', error);
  //   } finally {
  //     // setShowAttachmentMenu(false);
  //   }
  // };
  // useTrimmingVideoEffect({
  //   onFinishTrimming: async e => {
  //     if (e) {
  //       setShowAddModal(false);
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
  //       const addFileData: AddFileMutateProps = {
  //         files: [
  //           {
  //             uri: compressedVid ?? e.outputPath,
  //             name: `Vid#${new Date().toTimeString()}.mp4`,
  //             type: 'video/mp4',
  //           },
  //         ],

  //         projectId: selectedProject?.projectId,
  //       };
  //       addFileQuery.mutate(addFileData);
  //     }
  //   },
  //   onCancelTrimming: e => {
  //     setShowAddModal(false);
  //   },
  //   onError: e => {
  //     Alert.alert('Trimming failed!', `Unable to trim video ${e ?? ''}`);
  //   },
  // });

  return {
    showAddModal,
    setShowAddModal,
    // handlePressAddFolder,
    // handlePressAddPhotoLibrary,
    // handlePressAddDocument,
    isAddingFile: addFileQuery.isLoading,
    // handlePressVideoLibraryMenu,
  };
};

export default useEmptyFileScreen;

const styles = StyleSheet.create({});
