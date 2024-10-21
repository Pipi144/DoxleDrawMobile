import {StyleSheet, Text, View} from 'react-native';
import {shallow, useShallow} from 'zustand/shallow';

import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import useSetQAVideoQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAVideoQueryData';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import useLocalQAVideo from './useLocalQAVideo';

type Props = {};

interface IRetryUploadVideo {
  handleRetry: () => void;
  handleCloseRetry: () => void;
  handleDeleteRetryVideo: () => void;
}
const useRetryUploadVideo = (props: Props): IRetryUploadVideo => {
  const {accessToken} = useAuth();
  const {company} = useCompany();

  const {handleAddQAVideo} = useSetQAVideoQueryData({});
  const addVideoQuery = QAQueryAPI.useBgUploadQAVideoQuery({
    company,
    accessToken,
  });

  const {retryVideo, setRetryVideo, movePendingToCacheVideoList} =
    useProjectQAStore(
      useShallow(state => ({
        retryVideo: state.retryVideo,
        setRetryVideo: state.setRetryVideo,
        movePendingToCacheVideoList: state.movePendingToCacheVideoList,
      })),
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

  const {handleDeleteCachedVideo} = useLocalQAVideo();
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
