import {Alert, GestureResponderEvent, StyleSheet} from 'react-native';
import {
  IBgVideoUploadData,
  useBgUploadVideoStore,
} from '../../../../../../GeneralStore/useBgUploadVideoStore';
import QAQueryAPI, {
  IBgUploadQAVideoParams,
  qaBGVideoUploadMutationKey,
} from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useIsMutating} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useProjectQAStore} from '../Store/useProjectQAStore';
import useSetQAVideoQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAVideoQueryData';
import {useShallow} from 'zustand/react/shallow';
import {TQATabStack} from '../Routes/QARouteType';

type Props = {
  pendingItem: IBgVideoUploadData;
};

interface IQAPendingVideo {
  isInUploadingProcess: boolean;
  onPressItem: () => void;
  onPressErrorBtn: (e: GestureResponderEvent) => void;
  handlePressUploadBtn: () => void;
}
const useQAPendingVideo = ({pendingItem}: Props): IQAPendingVideo => {
  const {setRetryVideo} = useProjectQAStore(
    useShallow(state => ({
      setRetryVideo: state.setRetryVideo,
    })),
  );
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {movePendingToCacheVideoList} = useBgUploadVideoStore(
    useShallow(state => ({
      movePendingToCacheVideoList: state.movePendingToCacheVideoList,
    })),
  );

  const {handleAddQAVideo} = useSetQAVideoQueryData({});
  const addVideoQuery = QAQueryAPI.useBgUploadQAVideoQuery({
    company,
    accessToken,
  });
  const handlePressUploadBtn = () => {
    Alert.alert(
      'Upload Item',
      'Upload process may take long due to weak connection, Do you want to upload this item?',
      [
        {
          text: 'Cancel',
          style: 'destructive',
        },
        {
          text: 'Upload',
          onPress: () => {
            addVideoQuery.mutate({
              uploadData: pendingItem,
              postSuccessHandler: data => {
                movePendingToCacheVideoList(data.fileId, 'success');

                handleAddQAVideo(data);
              },
              postErrorHandler: data => {
                movePendingToCacheVideoList(data.videoId, 'error');
              },
            });
          },
        },
      ],
    );
  };
  const isInUploadingProcess =
    useIsMutating({
      mutationKey: qaBGVideoUploadMutationKey,
      predicate: query =>
        Boolean(
          (query.state.variables as IBgUploadQAVideoParams).uploadData
            .videoId === pendingItem.videoId,
        ),
    }) > 0;
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const onPressItem = () => {
    navigation.navigate('QAViewVideo', {
      videoUrl: pendingItem.videoFile.uri,
    });
  };

  const onPressErrorBtn = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setRetryVideo(pendingItem);
  };
  return {
    isInUploadingProcess,
    onPressItem,
    onPressErrorBtn,
    handlePressUploadBtn,
  };
};

export default useQAPendingVideo;

const styles = StyleSheet.create({});
