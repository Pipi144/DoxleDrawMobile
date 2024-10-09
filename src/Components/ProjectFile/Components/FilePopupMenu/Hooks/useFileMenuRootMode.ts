import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';

import {useProjectFileStore} from '../../../Store/useProjectFileStore';

import {TProjectFileTabStack} from '../../../Routes/ProjectFileRouteTypes';
import {useShallow} from 'zustand/react/shallow';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {TAPIServerFile} from '../../../../../Models/utilityType';

import uuid from 'react-native-uuid';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';

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
  const {selectedProject} = useCompany();
  const {currentView, setCurrentView} = useProjectFileStore(
    useShallow(state => ({
      currentView: state.currentView,
      setCurrentView: state.setCurrentView,
    })),
  );

  const {addCachedFiles} = useFileBgUploadStore(
    useShallow(state => ({addCachedFiles: state.addCachedFiles})),
  );
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
        let addedFiles: TAPIServerFile[] = [];
        result.forEach(file => {
          if (file.uri && file.name && file.type) {
            const fileBlob: TAPIServerFile = {
              uri: file.uri,
              name: file.name,
              type: file.type,
              size: file.size ?? 1,
              fileId: uuid.v4().toString(),
            };
            addedFiles.push(fileBlob);
          }
        });

        addCachedFiles({
          files: addedFiles,
          hostId: selectedProject?.projectId ?? '',
          variants: 'Project',
        });
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
    console.log('handlePressAddPhotoLibrary');
    try {
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchImageLibrary({
          selectionLimit: 0,
          mediaType: 'mixed',
          presentationStyle: 'formSheet',
          quality: 1,
          maxHeight: 950,
        });

      if (imagePickerResult.didCancel) {
      }
      if (imagePickerResult.assets) {
        let pickedImgs: TAPIServerFile[] = [];

        for await (const [, img] of imagePickerResult.assets.entries()) {
          if (img.uri && img.fileName && img.type) {
            pickedImgs.push({
              uri: img.uri,
              name: img.fileName,
              type: img.type,
              size: img.fileSize ?? 1,
              fileId: uuid.v4().toString(),
            });
          }
        }
        addCachedFiles({
          files: pickedImgs,
          hostId: selectedProject?.projectId ?? '',
          variants: 'Project',
        });
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
