import {Platform, StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {QAWithFirstImg} from '../../../../../Models/qa';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';

type Props = {qaDetail: QAWithFirstImg};

const useQAItemImageSection = ({qaDetail}: Props) => {
  const [isLoadingImg, setIsLoadingImg] = useState<boolean>(true);
  const [isImageFailed, setIsImageFailed] = useState<boolean>(false);
  const [displayedImgUrl, setdisplayedImgUrl] = useState<string | undefined>(
    undefined,
  );
  const onLoadImgEnd = () => {
    setIsLoadingImg(false);
    setIsImageFailed(false);
  };
  const onErrorLoadImg = () => {
    setIsLoadingImg(false);
    setIsImageFailed(true);
  };
  const {handleGetThumbnailLocalQA, handleDownloadQAThumb} =
    useCacheQAContext();
  const handleGetInitialThumbLocal = async () => {
    try {
      const localResult = await handleGetThumbnailLocalQA(qaDetail);
      if (localResult) {
        setdisplayedImgUrl('file://' + localResult);
      } else {
        if (qaDetail.firstImage) handleDownloadQAThumb(qaDetail);
        setdisplayedImgUrl(qaDetail.firstImage ?? undefined);
      }
    } catch (error) {
      console.log('ERROR handleGetInitialThumbLocal:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      handleGetInitialThumbLocal();
    }, []),
  );

  return {
    isLoadingImg,
    onLoadImgEnd,
    onErrorLoadImg,
    isImageFailed,
    displayedImgUrl,
  };
};

export default useQAItemImageSection;

const styles = StyleSheet.create({});
