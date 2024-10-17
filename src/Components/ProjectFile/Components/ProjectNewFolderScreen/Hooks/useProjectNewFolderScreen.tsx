import {Keyboard, StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';
import {useShallow} from 'zustand/shallow';
import FilesAPI from '../../../../../API/fileQueryAPI';
import {DoxleFolder} from '../../../../../Models/files';

const useProjectNewFolderScreen = () => {
  const [newFolderName, setNewFolderName] = useState<string>('');

  const {accessToken} = useAuth();
  const {company, selectedProject} = useCompany();
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );
  const navigator = useNavigation();
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
  useEffect(() => {
    console.log('FOLDER FOCUS');
  }, []);

  return {
    newFolderName,
    handleNewFolderNameChange,
    addFolderPressed,
    isAddingFolder: addFolderQuery.isPending,
  };
};

export default useProjectNewFolderScreen;

const styles = StyleSheet.create({});
