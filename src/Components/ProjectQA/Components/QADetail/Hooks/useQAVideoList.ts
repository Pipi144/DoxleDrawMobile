import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {QA, QAVideo} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import useLocalQAVideo from './useLocalQAVideo';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {qaItem: QA};

interface IQAVideoList {
  videoList: QAVideo[];
  isFetchingVideo: boolean;
  isSuccessFetchingVideo: boolean;
  isErrorFetchingVideo: boolean;
  isRefetchingVideo: boolean;
  refetchVideoList: () => void;
}
const useQAVideoList = ({qaItem}: Props): IQAVideoList => {
  const {company} = useCompany();
  const {showNotification} = useNotification();

  const {accessToken} = useAuth();
  const {cachedVideoList, updateStatusMultiCachedVideo} = useProjectQAStore(
    useShallow(state => ({
      cachedVideoList: state.cachedVideoList,
      updateStatusMultiCachedVideo: state.updateStatusMultiCachedVideo,
    })),
  );
  const {handleDeleteMultipleCachedVideo} = useLocalQAVideo();
  const onSuccessGetQAVideo = async (serverList: QAVideo[]) => {
    //synchronize data

    try {
      const serverVidIDs = new Set(serverList.map(item => item.fileId));

      //Deleted items case: all local video belong to the qa item with "success" status but not included in the server list (i.e, deleted by another users)

      const deletedItems = cachedVideoList.filter(
        item =>
          item.hostId === qaItem.defectId &&
          !serverVidIDs.has(item.videoId) &&
          item.status === 'success',
      );
      if (deletedItems.length > 0) {
        handleDeleteMultipleCachedVideo(deletedItems);
      }

      // update the status for the error items
      // all the items belong to the qa item which have "error" status but is existed in the server list (i.e, the item is successfully uploaded but for some reason the post handler upload not triggered maybe because the user closed the app)
      const updatedItems = cachedVideoList.filter(
        item =>
          item.hostId === qaItem.defectId &&
          serverVidIDs.has(item.videoId) &&
          item.status === 'error',
      );
      if (updatedItems.length > 0)
        updateStatusMultiCachedVideo(
          updatedItems.map(item => item.videoId),
          'success',
        );
    } catch (error) {
      console.log('ERROR onSuccessGetQAImage: ', error);
    } finally {
    }
  };
  const getQAImageQuery = QAQueryAPI.useRetrieveQAVideoList({
    showNotification,
    accessToken,
    company,
    qaItem,
    onSuccessCB: onSuccessGetQAVideo,
  });
  // useFocusEffect(
  //   useCallback(() => {
  //     handleGetInitialLocalQAImages();
  //   }, []),
  // );

  const videoList = useMemo(
    () => (getQAImageQuery.isSuccess ? getQAImageQuery.data.data.results : []),
    [getQAImageQuery.data],
  );

  const refetchVideoList = () => {
    getQAImageQuery.refetch();
  };
  return {
    videoList,
    isFetchingVideo: getQAImageQuery.isLoading,
    isSuccessFetchingVideo: getQAImageQuery.isSuccess,
    isErrorFetchingVideo: getQAImageQuery.isError,
    isRefetchingVideo: getQAImageQuery.isRefetching,
    refetchVideoList,
  };
};

export default useQAVideoList;

const styles = StyleSheet.create({});
