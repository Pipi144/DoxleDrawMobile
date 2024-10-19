import {Alert, StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

import {shallow} from 'zustand/shallow';
import {LocalQAImage} from '../../../../../../Providers/CacheQAProvider/CacheQAType';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {QAMedia} from '../../../../../../Models/qa';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {getPathToQaImageThumbnailFile} from '../../../../../../Providers/CacheQAProvider/CacheQAHelperFunctions';
import {useShallow} from 'zustand/react/shallow';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TQATabStack} from '../Routes/QARouteType';
import {GestureResponderEvent} from 'react-native-modal';
import {useQADetailContext} from '../Components/QADetail/QADetail';
import {deleteFileSystemWithPath} from '../../../../../../Utilities/FunctionUtilities';

type Props = {
  imageItem: LocalQAImage;
  // selectedAnnotationImage: AnnotationQAImage | undefined;
};

const useQAImageItem = ({
  imageItem,
}: // selectedAnnotationImage,
Props) => {
  const [isError, setIsError] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [qaImageDisplayedPath, setQaImageDisplayedPath] = useState(
    imageItem.thumbPath,
  );
  const {company} = useCompany();
  const {showNotification} = useNotification();
  const {edittedQA} = useQADetailContext();
  const {accessToken} = useAuth();
  const {
    handleDeleteSingleQAImageFolder,
    setDeletedQAImageStack,
    handleUpdateThumbQA,
    handleSyncQAImageThumb,
  } = useCacheQAContext();
  const {deleteQAImage, updateThumbnailQAImage} = useProjectQAStore(
    useShallow(state => ({
      deleteQAImage: state.deleteQAImage,
      updateThumbnailQAImage: state.updateThumbnailQAImage,
    })),
  );

  const onDeleteSuccessCb = async (qaImage: QAMedia) => {
    await handleDeleteSingleQAImageFolder({...qaImage, status: 'success'});
    handleUpdateThumbQA(edittedQA);
  };
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();
  const deleteImgQuery = QAQueryAPI.useDeleteQAImageQuery({
    showNotification,
    accessToken,
    company,
    onSuccessCb: onDeleteSuccessCb,
  });
  const onLoadImgStart = () => {
    setIsError(false);
    setIsLoadingImage(true);
  };

  const onLoadImgEnd = () => {
    setIsLoadingImage(false);
  };

  const handleGetLocalThumbOnFailed = async () => {
    try {
      const pathToLocalThumbImgFile = await getPathToQaImageThumbnailFile(
        imageItem,
      );
      if (pathToLocalThumbImgFile) {
        setQaImageDisplayedPath(pathToLocalThumbImgFile);
      } else setIsError(true);
    } catch (error) {
      console.log('ERROR IN QA IMAGE handleGetLocalThumbOnFailed:', error);
    }
  };
  const onLoadError = () => {
    setIsLoadingImage(false);
    handleGetLocalThumbOnFailed();
  };

  const handleDeleteQAImage = (e: GestureResponderEvent) => {
    e.stopPropagation();
    Alert.alert(
      'Confirm Delete!',
      'All data belong to this image will be deleted permanently, are you sure to proceed?',
      [
        {
          text: 'Delete',
          onPress: () => {
            if (imageItem.status === 'success') {
              deleteQAImage(imageItem);
              deleteImgQuery.mutate(imageItem);
            } else {
              deleteQAImage(imageItem);

              //! if the img is pending=> add the file to delete stack to avoid crashing
              setDeletedQAImageStack(prev => [...prev, imageItem]);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'destructive',
        },
      ],
    );
  };

  const handleUpdateThumb = async () => {
    console.log('UPDATE THUMB');
    try {
      const newThumbDownloadedPath = await handleSyncQAImageThumb(imageItem);

      if (newThumbDownloadedPath) {
        navigation.dispatch(
          CommonActions.setParams({
            imageURL: newThumbDownloadedPath,
            imageHeight: imageItem.imageHeight,
            imageWidth: imageItem.imageWidth,
          }),
        );

        // navigation.replace('QAViewImage', {
        //   imageURL: newThumbDownloadedPath,
        //   imageHeight: imageItem.imageHeight,
        //   imageWidth: imageItem.imageWidth,
        // });
        // update store the new thumb path
        // delete the old thumb path

        deleteFileSystemWithPath(imageItem.thumbPath);
        updateThumbnailQAImage({
          newThumbnailPath: newThumbDownloadedPath,
          qaImage: imageItem,
        });
      }
    } catch (error) {
      console.log('ERROR IN QA IMAGE handleUpdateThumb:', error);
    }
  };
  const handlePressImg = () => {
    handleUpdateThumb();
    navigation.navigate('QAViewImage', {
      imageURL: imageItem.thumbPath,
      imageHeight: imageItem.imageHeight,
      imageWidth: imageItem.imageWidth,
    });
  };

  useEffect(() => {
    setQaImageDisplayedPath(imageItem.thumbPath);
  }, [imageItem.thumbPath]);

  return {
    isLoadingImage,
    onLoadImgStart,
    onLoadImgEnd,
    handleDeleteQAImage,
    isDeletingImg: deleteImgQuery.isLoading,
    onLoadError,
    qaImageDisplayedPath,
    isError,
    handlePressImg,
  };
};

export default useQAImageItem;

const styles = StyleSheet.create({});
