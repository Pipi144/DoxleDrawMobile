import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useBgUploadVideoStore} from '../../../../../../GeneralStore/useBgUploadVideoStore';
import {shallow} from 'zustand/shallow';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import useSetQAVideoQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAVideoQueryData';
import useLocalVideo from '../../../../../../CustomHooks/useLocalVideo';

type Props = {};

interface IRetryUploadVideo {
  handleRetry: () => void;
  handleCloseRetry: () => void;
  handleDeleteRetryVideo: () => void;
}
const useRetryUploadVideo = (props: Props): IRetryUploadVideo => {
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {movePendingToCacheVideoList} = useBgUploadVideoStore(
    state => ({
      movePendingToCacheVideoList: state.movePendingToCacheVideoList,
    }),
    shallow,
  );

  const {handleAddQAVideo} = useSetQAVideoQueryData({});
  const addVideoQuery = QAQueryAPI.useBgUploadQAVideoQuery({
    company,
    accessToken,
  });

  const {retryVideo, setRetryVideo} = useProjectQAStore(
    state => ({
      retryVideo: state.retryVideo,
      setRetryVideo: state.setRetryVideo,
    }),
    shallow,
  );

  const handleRetry = () => {
    if (retryVideo) {
      addVideoQuery.mutate({
        uploadData: retryVideo,
        postSuccessHandler: data => {
          movePendingToCacheVideoList(data.fileId, 'success');

          handleAddQAVideo(data);
        },
        postErrorHandler: data => {
          movePendingToCacheVideoList(data.videoId, 'error');
        },
      });
    }
    setRetryVideo(undefined);
  };

  const handleCloseRetry = () => {
    setRetryVideo(undefined);
  };

  const {handleDeleteCachedVideo} = useLocalVideo();
  const handleDeleteRetryVideo = () => {
    if (retryVideo) handleDeleteCachedVideo(retryVideo.videoId);
    setRetryVideo(undefined);
  };

  return {
    handleRetry,
    handleCloseRetry,
    handleDeleteRetryVideo,
  };
};

export default useRetryUploadVideo;

const styles = StyleSheet.create({});
