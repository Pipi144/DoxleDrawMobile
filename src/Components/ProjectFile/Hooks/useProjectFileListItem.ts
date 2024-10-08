import {Linking, StyleSheet} from 'react-native';
import {useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {SharedValue, useSharedValue, withTiming} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useIsMutating} from '@tanstack/react-query';
import {TProjectFileTabStack} from '../Routes/ProjectFileRouteTypes';
import {useShallow} from 'zustand/react/shallow';
import {DoxleFile, DoxleFolder} from '../../../Models/files';
import {
  DeleteFileParams,
  getFileMutationKey,
  getFolderMutationKey,
  TUpdateFileParams,
  TUpdateFolderParams,
} from '../../../API/fileQueryAPI';

type Props = {fileItem?: DoxleFile; folderItem?: DoxleFolder};

const useProjectFileListItem = ({fileItem, folderItem}: Props) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [isErrorImg, setIsErrorImg] = useState(false);

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

  const filePressed = (url: string, type: string) => {
    if (
      type.toLowerCase().includes('pdf') ||
      type.toLowerCase().includes('png') ||
      type.toLowerCase().includes('jpeg') ||
      type.toLowerCase().includes('mp4') ||
      type.toLowerCase().includes('video')
    ) {
      navigator.navigate('ProjectFileViewerScreen', {
        url: url,
        type: type,
      });
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
  return {
    onLongPress,
    folderPressed,
    filePressed,
    isDeletingFile,
    isDeletingFolder,
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
