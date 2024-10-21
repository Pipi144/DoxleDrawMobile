import {Alert, GestureResponderEvent, StyleSheet} from 'react-native';
import {useIsMutating} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';

import {useShallow} from 'zustand/react/shallow';
import {TQATabStack} from '../../../Routes/QARouteType';
import {IQAVideoUploadData} from '../../../Provider/CacheQAType';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import useSetQAVideoQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAVideoQueryData';
import QAQueryAPI, {
  IBgUploadQAVideoParams,
  qaBGVideoUploadMutationKey,
} from '../../../../../API/qaQueryAPI';

type Props = {
  pendingItem: IQAVideoUploadData;
};

interface IQAPendingVideo {
  isInUploadingProcess: boolean;
  onPressItem: () => void;
  onPressErrorBtn: (e: GestureResponderEvent) => void;
  handlePressUploadBtn: () => void;
}
const useQAPendingVideo = ({pendingItem}: Props): IQAPendingVideo => {
  const {setRetryVideo, movePendingToCacheVideoList} = useProjectQAStore(
    useShallow(state => ({
      setRetryVideo: state.setRetryVideo,
      movePendingToCacheVideoList: state.movePendingToCacheVideoList,
    })),
  );
  const {accessToken} = useAuth();
  const {company} = useCompany();

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
