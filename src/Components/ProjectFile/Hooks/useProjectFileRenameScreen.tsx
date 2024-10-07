import {Keyboard, StyleSheet} from 'react-native';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useNotification} from '../../../Providers/NotificationProvider';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';
import FilesAPI from '../../../API/fileQueryAPI';

const useProjectFileRenameScreen = () => {
  const [fileRename, setFileRename] = useState<string>('');
  const navigator = useNavigation();

  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {showNotification} = useNotification();
  const {staticMenuColor} = useDOXLETheme();
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,

        setBackBtn: state.setBackBtn,
      })),
    );
  const {
    currentFile,
    edittedFolder,
    setCurrentFile,
    setEdittedFolder,

    currentFolder,
  } = useProjectFileStore(
    useShallow(state => ({
      currentFile: state.currentFile,
      edittedFolder: state.edittedFolder,
      currentFolder: state.currentFolder,
      setCurrentFile: state.setCurrentFile,
      setEdittedFolder: state.setEdittedFolder,

      filterProjectFolderQuery: state.filterProjectFolderQuery,
      filterProjectFileQuery: state.filterProjectFileQuery,
    })),
  );

  const updateFileQuery = FilesAPI.useUpdateFileQuery({
    accessToken,
    company,
    showNotification,
  });

  const updateFolderQuery = FilesAPI.useUpdateFolder({
    accessToken,
    company,
    showNotification,
  });

  const handleTextInputChange = (value: string) => {
    setFileRename(value);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const handleNavBack = () => {
    navigator.goBack();
    dismissKeyboard();

    setBackBtn(null);
    setCurrentFile(undefined);
    setEdittedFolder(undefined);
  };
  const updateButtonPressed = () => {
    if (currentFile) {
      updateFileQuery.mutate({
        fileId: currentFile.fileId,
        fileName: fileRename,
        currentFolderId: currentFolder?.folderId ?? undefined,
      });
    }
    //* TYPE IS FOLDER
    else {
      if (edittedFolder) {
        updateFolderQuery.mutate({
          folderId: edittedFolder.folderId,
          folderName: fileRename,
        });
      }
    }
    handleNavBack();
  };

  useEffect(() => {
    if (currentFile) setFileRename(currentFile.fileName);
    else if (edittedFolder) setFileRename(edittedFolder.folderName);
    else setFileRename('');
  }, [currentFile, edittedFolder]);

  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(null);
      setOveridenRouteName(`Rename ${currentFile ? 'File' : 'Folder'}`);
      setBackBtn({
        onPress: handleNavBack,
      });
    }, []),
  );
  return {
    handleTextInputChange,
    fileRename,
    updateButtonPressed,

    isUpdatingFile: updateFileQuery.isPending || updateFolderQuery.isPending,
  };
};

export default useProjectFileRenameScreen;

const styles = StyleSheet.create({});
