import {Linking, Platform, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';

import {useIsMutating} from '@tanstack/react-query';

import {useShallow} from 'zustand/react/shallow';
import {DoxleFile, DoxleFolder} from '../../../../../Models/files';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import {TProjectFileTabStack} from '../../../Routes/ProjectFileRouteTypes';
import {
  DeleteFileParams,
  getFileMutationKey,
  getFolderMutationKey,
} from '../../../../../API/fileQueryAPI';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';

type Props = {fileItem?: DoxleFile; folderItem?: DoxleFolder};

const useProjectFileGridItem = ({fileItem, folderItem}: Props) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [isErrorImg, setIsErrorImg] = useState(false);
  const [cachedUrl, setCachedUrl] = useState<string | undefined>(undefined);
  const [cachedThumbUrl, setCachedThumbUrl] = useState<string | undefined>(
    undefined,
  );
  const {setCurrentFile, setEdittedFolder, setShowModal, setCurrentFolder} =
    useProjectFileStore(
      useShallow(state => ({
        setCurrentFile: state.setCurrentFile,
        setEdittedFolder: state.setEdittedFolder,
        setCurrentFolder: state.setCurrentFolder,
        setShowModal: state.setShowModal,
      })),
    );
  const {getCacheUrl, cacheSingleFile, getThumbUrl} = useFileBgUploadStore(
    useShallow(state => ({
      getCacheUrl: state.getCacheUrl,
      cacheSingleFile: state.cacheSingleFile,
      getThumbUrl: state.getThumbUrl,
    })),
  );
  const navigator = useNavigation<StackNavigationProp<TProjectFileTabStack>>();

  const onLongPress = (itemPressed: 'file' | 'folder') => {
    if (itemPressed === 'file') {
      if (fileItem) setCurrentFile(fileItem);
    } else {
      if (folderItem) setEdittedFolder(folderItem);
    }

    setShowModal(true);
  };

  const folderPressed = () => {
    setCurrentFolder(folderItem);
    navigator.navigate('ProjectFolderFileScreen', {});
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
  const handleGetCachedData = async () => {
    try {
      if (fileItem) {
        const fileCached = await getCacheUrl(fileItem.fileId);
        const thumbUrl = getThumbUrl(fileItem.fileId);
        if (fileCached)
          setCachedUrl(
            `${Platform.OS === 'ios' ? 'file://' : ''}${fileCached}`,
          );
        if (thumbUrl)
          setCachedThumbUrl(
            `${Platform.OS === 'ios' ? 'file://' : ''}${thumbUrl}`,
          );
      }
    } catch (error) {
      console.log('ERROR handleGetCachedData:', error);
    }
  };
  useEffect(() => {
    handleGetCachedData();
  }, []);
  return {
    onLongPress,
    folderPressed,
    filePressed,

    isLoadingImg,
    setIsLoadingImg,
    isErrorImg,
    setIsErrorImg,
    cachedThumbUrl,
  };
};

export default useProjectFileGridItem;

const styles = StyleSheet.create({});
