import {StyleSheet} from 'react-native';

import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';

import {useProjectFileStore} from '../Store/useProjectFileStore';

import {TProjectFileTabStack} from '../Routes/ProjectFileRouteTypes';
import {useShallow} from 'zustand/react/shallow';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';
import {useAuth} from '../../../Providers/AuthProvider';
import {useNotification} from '../../../Providers/NotificationProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import FilesAPI, {
  AddFileMutateProps,
  TAddDoxleFile,
} from '../../../API/fileQueryAPI';

type Props = {};

const useFileMenuRootMode = ({}: Props) => {
  const navigator = useNavigation<StackNavigationProp<TProjectFileTabStack>>();
  const {setOpenPopupMenu} = useAppModalHeaderStore(
    useShallow(state => ({
      setOpenPopupMenu: state.setOpenPopupMenu,
    })),
  );
  const handlePressAddFolder = () => {
    setOpenPopupMenu(false);

    setTimeout(() => {
      navigator.navigate('ProjectNewFolderScreen', {});
    }, 500);
  };

  const {accessToken} = useAuth();
  const {showNotification} = useNotification();
  const {company, selectedProject} = useCompany();
  const {currentView, setCurrentView} = useProjectFileStore(
    useShallow(state => ({
      currentView: state.currentView,
      setCurrentView: state.setCurrentView,
    })),
  );

  const addFileQuery = FilesAPI.useAddFilesQuery({
    accessToken: accessToken,
    company: company,
    showNotification: showNotification,
  });
  const handlePressAddDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.xls,
          DocumentPicker.types.doc,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.csv,
        ],
        allowMultiSelection: true,
        presentationStyle: 'overFullScreen',
        transitionStyle: 'flipHorizontal',
        copyTo: 'cachesDirectory',
      });

      if (result) {
        let addedFiles: TAddDoxleFile[] = [];
        result.forEach((file, fileIndex) => {
          if (file.uri && file.name && file.type) {
            const fileBlob: TAddDoxleFile = {
              uri: file.uri,
              name: file.name,
              type: file.type,
            };
            addedFiles.push(fileBlob);
          }
        });

        const addFileData: AddFileMutateProps = {
          files: addedFiles,

          projectId: selectedProject?.projectId,
        };
        addFileQuery.mutate(addFileData);
      }
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('Canceled from single doc picker');
      } else {
        //For Unknown Error
        console.error('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    } finally {
      setOpenPopupMenu(false);
    }
  };

  const handlePressAddPhotoLibrary = async () => {
    try {
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchImageLibrary({
          selectionLimit: 0,
          mediaType: 'photo',
          presentationStyle: 'formSheet',
          quality: 1,
          maxHeight: 950,
        });

      if (imagePickerResult.didCancel) {
      }
      if (imagePickerResult.assets) {
        setOpenPopupMenu(false);
        let pickedImgs: TAddDoxleFile[] = [];
        for await (const [index, img] of imagePickerResult.assets.entries()) {
          if (img.uri && img.fileName && img.type && img.width && img.height) {
            pickedImgs.push({
              uri: img.uri,
              name: img.fileName,
              type: img.type,
            });
          }
        }
        const addFileData: AddFileMutateProps = {
          files: pickedImgs,

          projectId: selectedProject?.projectId,
        };
        addFileQuery.mutate(addFileData);
      }
      if (imagePickerResult.errorMessage) throw imagePickerResult.errorMessage;
    } catch (error) {
      console.log('ERROR handlePressCameraMenu:', error);
    } finally {
      setOpenPopupMenu(false);
    }
  };

  const toggleView = () => {
    setOpenPopupMenu(false);
    if (currentView === 'GridView') setCurrentView('ListView');
    else setCurrentView('GridView');
  };
  const isGridView = currentView === 'GridView' ? true : false;

  return {
    handlePressAddFolder,
    handlePressAddPhotoLibrary,
    handlePressAddDocument,
    isGridView,
    toggleView,
  };
};

export default useFileMenuRootMode;

const styles = StyleSheet.create({});
