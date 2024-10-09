import {Linking, Platform, StyleSheet} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {SharedValue, useSharedValue, withTiming} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

import {useIsMutating} from '@tanstack/react-query';

import {useShallow} from 'zustand/react/shallow';
import {DoxleFile, DoxleFolder} from '../../../../../Models/files';
import {TProjectFileTabStack} from '../../../Routes/ProjectFileRouteTypes';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import {
  DeleteFileParams,
  getFileMutationKey,
  getFolderMutationKey,
  TUpdateFileParams,
  TUpdateFolderParams,
} from '../../../../../API/fileQueryAPI';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';

type Props = {fileItem?: DoxleFile; folderItem?: DoxleFolder};

const useProjectFileListItem = ({fileItem, folderItem}: Props) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [isErrorImg, setIsErrorImg] = useState(false);
  const [cachedUrl, setCachedUrl] = useState<string | undefined>(undefined);
  const navigator = useNavigation<StackNavigationProp<TProjectFileTabStack>>();

  const {setCurrentFile, setCurrentFolder, setShowModal, setEdittedFolder} =
    useProjectFileStore(
      useShallow(state => ({
        setCurrentFile: state.setCurrentFile,
        setCurrentFolder: state.setCurrentFolder,
        setShowModal: state.setShowModal,
        setEdittedFolder: state.setEdittedFolder,
      })),
    );

  const {getCacheUrl, cacheSingleFile} = useFileBgUploadStore(
    useShallow(state => ({
      getCacheUrl: state.getCacheUrl,
      cacheSingleFile: state.cacheSingleFile,
    })),
  );
  const onLongPress = (itemPressed: 'file' | 'folder') => {
    if (itemPressed === 'file') {
      if (fileItem) setCurrentFile(fileItem);
    } else {
      if (folderItem) setEdittedFolder(folderItem);
    }

    setShowModal(true);
  };

  //* WHEN A FOLDER IS CLICKED
  const folderPressed = () => {
    //! SET THE CURRENT FOLDER FOR ZUSTAND
    navigator.navigate('ProjectFolderFileScreen', {});
    setCurrentFolder(folderItem);
  };

  const filePressed = async () => {
    if (fileItem) {
      if (
        fileItem.fileType.toLowerCase().includes('pdf') ||
        fileItem.fileType.toLowerCase().includes('png') ||
        fileItem.fileType.toLowerCase().includes('jpeg') ||
        fileItem.fileType.toLowerCase().includes('mp4') ||
        fileItem.fileType.toLowerCase().includes('video')
      ) {
        navigator.navigate('ProjectFileViewerScreen', {
          url: cachedUrl ?? fileItem.url,
          type: fileItem.fileType,
        });
        if (!cachedUrl) {
          try {
            const resCache = await cacheSingleFile(fileItem);
            if (resCache) {
              setCachedUrl(
                `${Platform.OS === 'ios' ? 'file://' : ''}${resCache}`,
              );
            }
          } catch (error) {
            console.log('ERROR filePressed=> cacheSingleFile:', error);
          }
        }
      } else {
        Linking.openURL(fileItem.url);
      }
    }
  };

  const isUpdatingFile =
    useIsMutating({
      mutationKey: getFileMutationKey('update'),
      predicate: query =>
        Boolean(
          fileItem &&
            (query.state.variables as TUpdateFileParams).fileId ===
              fileItem.fileId,
        ),
    }) > 0;

  const isUpdatingFolder =
    useIsMutating({
      mutationKey: getFolderMutationKey('update'),
      predicate: query =>
        Boolean(
          folderItem &&
            (query.state.variables as TUpdateFolderParams).folderId ===
              folderItem.folderId,
        ),
    }) > 0;

  const pressAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const onPressIn = () => {
    pressAnimatedValue.value = withTiming(1, {duration: 200});
  };
  const onPressOut = () => {
    pressAnimatedValue.value = withTiming(0, {duration: 200});
  };

  useEffect(() => {
    if (fileItem) {
      const fileCached = getCacheUrl(fileItem.fileId);
      if (fileCached)
        setCachedUrl(`${Platform.OS === 'ios' ? 'file://' : ''}${fileCached}`);
    }
  }, []);

  return {
    onLongPress,
    folderPressed,
    filePressed,

    isUpdatingFile,
    isUpdatingFolder,
    onPressIn,
    onPressOut,
    pressAnimatedValue,
    isLoadingImg,
    setIsLoadingImg,
    isErrorImg,
    setIsErrorImg,
  };
};

export default useProjectFileListItem;

const styles = StyleSheet.create({});
