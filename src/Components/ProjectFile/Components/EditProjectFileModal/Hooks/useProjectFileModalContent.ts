import {Alert, StyleSheet} from 'react-native';

import {StackNavigationProp} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';

import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import useSetFileQueryData from '../../../../../QueryDataHooks/useSetFileQueryData';
import useSetRootFolderQueryData from '../../../../../QueryDataHooks/useSetRootFolderQueryData';
import FilesAPI from '../../../../../API/fileQueryAPI';

type Props = {};

type FileEditScreenNavProps = {
  ProjectFileHistoryScreen?: {};

  ProjectFileRenameScreen?: {};
};

const useProjectFileModalContent = (props: Props) => {
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {showNotification} = useNotification();

  const {
    currentFile,
    edittedFolder,
    setCurrentFile,
    setEdittedFolder,
    setShowModal,
  } = useProjectFileStore(
    useShallow(state => ({
      currentFile: state.currentFile,
      edittedFolder: state.edittedFolder,
      currentFolder: state.currentFolder,
      setCurrentFile: state.setCurrentFile,
      setEdittedFolder: state.setEdittedFolder,
      setShowModal: state.setShowModal,
      filterProjectFolderQuery: state.filterProjectFolderQuery,
      filterProjectFileQuery: state.filterProjectFileQuery,
    })),
  );
  const navigator =
    useNavigation<StackNavigationProp<FileEditScreenNavProps>>();

  const {handleRemoveMultipleFile} = useSetFileQueryData({});
  const {handleDeleteMultipleFolders} = useSetRootFolderQueryData({});
  //! USE DELETE FOLDER QUERY
  const deleteFolderQuery = FilesAPI.useDeleteFolder({
    accessToken,
    company,
    showNotification,
  });

  const onDeleteFileSuccessCallback = () => {
    setCurrentFile(undefined);
  };
  //! USE DELETE FILE QUERY
  const deleteFileQuery = FilesAPI.useDeleteFileQuery({
    accessToken,
    company,
    showNotification,
    onDeleteFileCallback: onDeleteFileSuccessCallback,
  });

  const onShare = () => {
    console.log('FILE SHARE ...');
    setShowModal(false);
  };
  const onFileComment = () => {
    console.log('FILE COMMENT ...');
    setShowModal(false);
  };

  //THIS IS TO RENAME THE FILE OR FOLDER BASED ON WHAT IS SELECTED
  const onRename = () => {
    setShowModal(false);

    setTimeout(() => {
      navigator.navigate('ProjectFileRenameScreen', {});
    }, 300);
  };

  const onDelete = () => {
    if (currentFile) {
      Alert.alert(
        'Confirm delete file!',
        `File item ***${currentFile.fileName}*** will be deleted permanently, are you sure to proceed?`,
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'Delete',
            onPress: () => {
              handleRemoveMultipleFile([currentFile]);
              deleteFileQuery.mutate({
                files: [currentFile],
              });
            },
          },
        ],
      );
    } else if (edittedFolder) {
      Alert.alert(
        'Confirm delete folder!',
        `All files belong to folder item ***${edittedFolder.folderName}*** will be deleted permanently, are you sure to proceed?`,
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'Delete',
            onPress: () => {
              handleDeleteMultipleFolders([edittedFolder]);
              deleteFolderQuery.mutate([edittedFolder]);
              setTimeout(() => {
                setEdittedFolder(undefined);
              }, 100);
            },
          },
        ],
      );
    }

    setShowModal(false);
    setEdittedFolder(undefined);
    setCurrentFile(undefined);
  };

  const onFileHistory = () => {
    setShowModal(false);

    setTimeout(() => {
      if (currentFile) navigator.navigate('ProjectFileHistoryScreen', {});
    }, 300);
  };
  return {
    onShare,
    onFileComment,
    onRename,
    onDelete,
    onFileHistory,
  };
};

export default useProjectFileModalContent;

const styles = StyleSheet.create({});
