import {Platform, StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {QAWithFirstImg} from '../../../../../../Models/qa';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {useFocusEffect} from '@react-navigation/native';

type Props = {qaDetail: QAWithFirstImg};
interface QAItemImageSection {
  isLoadingImg: boolean;
  //   isErrorFetchingImg: boolean;
  onLoadImgStart: () => void;
  onLoadImgEnd: () => void;
  onErrorLoadImg: () => void;
  isImageFailed: boolean;
  displayedImgUrl: string | undefined;
}

const useQAItemImageSection = ({qaDetail}: Props): QAItemImageSection => {
  const [isLoadingImg, setIsLoadingImg] = useState<boolean>(false);
  const [isImageFailed, setIsImageFailed] = useState<boolean>(false);
  const [displayedImgUrl, setdisplayedImgUrl] = useState<string | undefined>(
    undefined,
  );
  const onLoadImgStart = () => {
    setIsLoadingImg(true);
    setIsImageFailed(false);
  };
  const onLoadImgEnd = () => {
    setIsLoadingImg(false);
  };
  const onErrorLoadImg = () => {
    setIsLoadingImg(false);
    setIsImageFailed(true);
  };
  const {handleGetThumbnailLocalQA, handleDownloadQAThumb} =
    useCacheQAContext();
  const handleGetInitialThumbLocal = async () => {
    try {
      // console.log('FOCUS GET THUMGNAIL');
      const localResult = await handleGetThumbnailLocalQA(qaDetail);
      // console.log('LOCAL RESULT:', localResult);
      if (localResult) {
        setdisplayedImgUrl(undefined);

        setdisplayedImgUrl(
          Platform.OS === 'ios' ? localResult : 'file://' + localResult,
        );
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

    // isErrorFetchingImg: getQAFirstImgQuery.isError,
    onLoadImgStart,
    onLoadImgEnd,
    onErrorLoadImg,
    isImageFailed,
    displayedImgUrl,
  };
};

export default useQAItemImageSection;

const styles = StyleSheet.create({});
