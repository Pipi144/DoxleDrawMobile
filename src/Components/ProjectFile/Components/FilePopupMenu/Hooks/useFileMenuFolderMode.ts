import {Alert, StyleSheet} from 'react-native';
import {useCallback, useMemo} from 'react';

import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';

import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';
import {TAPIServerFile} from '../../../../../Models/utilityType';
import uuid from 'react-native-uuid';

type Props = {};

const useFileMenuFolderMode = ({}: Props) => {
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const {company} = useCompany();
  const {currentFolder, currentView, setCurrentView} = useProjectFileStore(
    useShallow(state => ({
      currentFolder: state.currentFolder,

      currentView: state.currentView,
      setCurrentView: state.setCurrentView,
    })),
  );
  const {setOpenPopupMenu} = useAppModalHeaderStore(
    useShallow(state => ({
      setOpenPopupMenu: state.setOpenPopupMenu,
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
        ],
        allowMultiSelection: true,
        presentationStyle: 'overFullScreen',
        transitionStyle: 'flipHorizontal',
        copyTo: 'cachesDirectory',
      });

      if (result) {
        let addedFiles: TAPIServerFile[] = [];
        result.forEach((file, fileIndex) => {
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
          hostId: currentFolder?.folderId ?? '',
          variants: 'Folder',
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
    try {
      let imagePickerResult: ImagePicker.ImagePickerResponse =
        await ImagePicker.launchImageLibrary({
          selectionLimit: 0,
          mediaType: 'mixed',
          presentationStyle: 'formSheet',
          videoQuality: 'low',
          quality: 1,
          assetRepresentationMode: 'current',
        });

      if (imagePickerResult.didCancel) {
      }
      if (imagePickerResult.assets) {
        setOpenPopupMenu(false);
        let pickedImgs: TAPIServerFile[] = [];
        for await (const [index, img] of imagePickerResult.assets.entries()) {
          if (img.uri && img.fileName && img.type && img.width && img.height) {
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
          hostId: currentFolder?.folderId ?? '',
          variants: 'Folder',
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
    handlePressAddPhotoLibrary,
    handlePressAddDocument,
    toggleView,
    isGridView,
  };
};

export default useFileMenuFolderMode;

const styles = StyleSheet.create({});
