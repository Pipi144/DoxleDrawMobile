import {StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';

import {TQATabStack} from '../../../Routes/QARouteType';
import {useShallow} from 'zustand/react/shallow';
import {
  QA,
  QAMarkupRectangle,
  QAMarkupCircle,
  QAMarkupStraightLine,
  QAMarkupLabel,
  QAMarkupArrow,
  QAMarkupPath,
  QAMedia,
} from '../../../../../Models/qa';
import {LocalQAImage} from '../../../Provider/CacheQAType';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {qaItem: QA};

export interface AnnotationQAImage {
  qaImage: LocalQAImage;
  markupList: Array<
    | QAMarkupRectangle
    | QAMarkupCircle
    | QAMarkupStraightLine
    | QAMarkupLabel
    | QAMarkupArrow
    | QAMarkupPath
  >;
}

const useQAImageList = ({qaItem}: Props) => {
  const [isDownloadingQAImages, setIsDownloadingQAImages] =
    useState<boolean>(false);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();
  const {company} = useCompany();
  const {showNotification} = useNotification();
  const {accessToken} = useAuth();
  const {
    handleGetLocalQAImages,
    handleCacheQAImageList,
    handleCollectDeletedQAImages,
    handleCacheSingleQAImage,
    uploadPendingFiles,
    deleteThumbnailLocalQA,
  } = useCacheQAContext();
  const {addDownloadedQAImage, setQAImageList, removeMultipleQAImages} =
    useProjectQAStore(
      useShallow(state => ({
        addDownloadedQAImage: state.addDownloadedQAImage,
        setQAImageList: state.setQAImageList,
        removeMultipleQAImages: state.removeMultipleQAImages,
      })),
    );

  const handleGetInitialLocalQAImages = useCallback(async () => {
    try {
      setIsDownloadingQAImages(true);
      const localQAImages = await handleGetLocalQAImages(qaItem);
      if (localQAImages.length > 0) setQAImageList(localQAImages);
    } catch (error) {
      console.log('ERROR handleGetInitialLocalQAImages:', error);
    } finally {
      setIsDownloadingQAImages(false);
    }
  }, [handleGetLocalQAImages, qaItem]);

  const onSuccessGetQAImage = async (serverList: QAMedia[]) => {
    try {
      console.log('SUCCESS GET QA IMAGES FROM SERVER, run ONSUCCESS');
      setIsDownloadingQAImages(true);
      //loop thru the list and download 1 by 1 item
      for (const serverQA of serverList) {
        const cacheResult = await handleCacheSingleQAImage(serverQA);

        if (cacheResult) addDownloadedQAImage(cacheResult);
      }
      //*remove any items that is deleted from server
      const removedItems = await handleCollectDeletedQAImages({
        qaItem,
        qaImageList: serverList,
      });
      if (uploadPendingFiles.length === 0) {
        removeMultipleQAImages(removedItems);
      }
      if (serverList.length === 0) deleteThumbnailLocalQA(qaItem);
    } catch (error) {
      console.log('ERROR onSuccessGetQAImage: ', error);
    } finally {
      setIsDownloadingQAImages(false);
    }
  };
  const getQAImageQuery = QAQueryAPI.useRetrieveQAImageList({
    showNotification,
    accessToken,
    company,
    qaItem,
    onSuccessCB: onSuccessGetQAImage,
  });

  useEffect(() => {
    handleGetInitialLocalQAImages();
  }, [qaItem]);

  const handleSetIsProcessingImage = (value: boolean) => {
    setIsProcessingImage(value);
  };
  const isFetchingQAImage =
    getQAImageQuery.isLoading || isDownloadingQAImages || isProcessingImage;

  const handleSelectAnnotationImage = useCallback(
    (props: {
      qaImage: LocalQAImage;
      markupList: Array<
        | QAMarkupRectangle
        | QAMarkupCircle
        | QAMarkupStraightLine
        | QAMarkupLabel
        | QAMarkupArrow
        | QAMarkupPath
      >;
    }) => {
      // setSelectedAnnotationImage({
      //   qaImage: props.qaImage,
      //   markupList: props.markupList,
      // });
      navigation.navigate('QAMarkup', {
        selectedAnnotationImage: {
          qaImage: props.qaImage,
          markupList: props.markupList,
        },
      });
    },
    [],
  );

  const handleRefetchQAImgList = async () => {
    try {
      handleGetInitialLocalQAImages();
      getQAImageQuery.refetch();
    } catch (error) {
      console.log('ERROR handleRefetchQAImgList:', error);
    }
  };
  return {
    isFetchingQAImage,
    handleSetIsProcessingImage,
    handleSelectAnnotationImage,
    handleRefetchQAImgList,
    isRefetchingQAImgList: getQAImageQuery.isRefetching,
  };
};

export default useQAImageList;

const styles = StyleSheet.create({});
