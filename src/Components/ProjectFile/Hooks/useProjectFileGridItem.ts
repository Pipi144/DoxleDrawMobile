import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

import {shallow} from 'zustand/shallow';
import {useNavigation} from '@react-navigation/native';

import {useIsMutating} from '@tanstack/react-query';
import {useProjectFileStore} from '../Store/useProjectFileStore';

import {useShallow} from 'zustand/react/shallow';
import {TProjectFileTabStack} from '../Routes/ProjectFileRouteTypes';
import {DoxleFile, DoxleFolder} from '../../../Models/files';
import {
  DeleteFileParams,
  getFileMutationKey,
  getFolderMutationKey,
} from '../../../API/fileQueryAPI';

type Props = {fileItem?: DoxleFile; folderItem?: DoxleFolder};

const useProjectFileGridItem = ({fileItem, folderItem}: Props) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [isErrorImg, setIsErrorImg] = useState(false);
  const {setCurrentFile, setEdittedFolder, setShowModal, setCurrentFolder} =
    useProjectFileStore(
      useShallow(state => ({
        setCurrentFile: state.setCurrentFile,
        setEdittedFolder: state.setEdittedFolder,
        setCurrentFolder: state.setCurrentFolder,
        setShowModal: state.setShowModal,
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

  const filePressed = (url: string, type: string) => {
    if (
      type.toLowerCase().includes('pdf') ||
      type.toLowerCase().includes('png') ||
      type.toLowerCase().includes('jpeg') ||
      type.toLowerCase().includes('mp4') ||
      type.toLowerCase().includes('video')
    ) {
      navigator.navigate('ProjectFileViewerScreen', {url, type});
    } else {
      Linking.openURL(url);
    }
  };
  const isDeletingFile =
    useIsMutating({
      mutationKey: getFileMutationKey('delete'),
      predicate: query =>
        Boolean(
          fileItem &&
            (query.state.variables as DeleteFileParams).files.find(
              deletedFile => deletedFile.fileId === fileItem.fileId,
            ) !== undefined,
        ),
    }) > 0;

  const isDeletingFolder =
    useIsMutating({
      mutationKey: getFolderMutationKey('delete'),
      predicate: query =>
        Boolean(
          folderItem &&
            (query.state.variables as DoxleFolder[]).some(
              d => d.folderId === folderItem?.folderId,
            ),
        ),
    }) > 0;
  return {
    onLongPress,
    folderPressed,
    filePressed,

    isLoadingImg,
    setIsLoadingImg,
    isErrorImg,
    setIsErrorImg,
    isDeletingFile,
    isDeletingFolder,
  };
};

export default useProjectFileGridItem;

const styles = StyleSheet.create({});
