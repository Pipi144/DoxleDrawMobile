import {Keyboard, StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useNotification} from '../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../DesignPattern/Notification/Notification';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';
import FilesAPI from '../../../API/fileQueryAPI';
import {DoxleFolder} from '../../../Models/files';

const useProjectNewFolderScreen = () => {
  const [newFolderName, setNewFolderName] = useState<string>('');

  const {accessToken} = useAuth();
  const {company, selectedProject} = useCompany();
  const {staticMenuColor} = useDOXLETheme();
  const {notifierRootAppRef} = useNotification();
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
    ) => {
      notifierRootAppRef.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );
  const navigator = useNavigation();
  const {filterProjectFolderQuery} = useProjectFileStore(
    useShallow(state => ({
      filterProjectFolderQuery: state.filterProjectFolderQuery,
    })),
  );
  const handleNavBack = () => {
    navigator.goBack();
    setBackBtn(null);
  };
  const addFolderSuccessCallback = () => {
    handleNavBack();
  };

  const addFolderQuery = FilesAPI.useAddFolder({
    accessToken,
    company,
    showNotification,
    onAddFolderSuccessCallback: addFolderSuccessCallback,
  });

  const handleNewFolderNameChange = (value: string) => {
    setNewFolderName(value);
  };

  const addFolderPressed = () => {
    Keyboard.dismiss();

    const newFolderObject: DoxleFolder = {
      folderId: '',
      folderName: newFolderName,
      createdOn: '',
      lastModified: '',
      project: selectedProject?.projectId ?? null,
      docket: null,
      company: company?.companyId ?? '',
    };

    addFolderQuery.mutate(newFolderObject);
  };

  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(null);
      setOveridenRouteName('Add Folder');
      setBackBtn({
        onPress: handleNavBack,
      });
    }, []),
  );
  return {
    newFolderName,
    handleNewFolderNameChange,
    addFolderPressed,
    isAddingFolder: addFolderQuery.isPending,
  };
};

export default useProjectNewFolderScreen;

const styles = StyleSheet.create({});
