import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {QAVideo} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {IProjectRouting} from '../../../ProjectRoutes';
import useSetQAVideoQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAVideoQueryData';
import useLocalVideo from '../../../../../../CustomHooks/useLocalVideo';
import {TQATabStack} from '../Routes/QARouteType';

type Props = {
  item: QAVideo;
};
interface IQAVideoItem {
  onPressVideo: () => Promise<void>;
  handleDeleteQAImage: () => void;
  isDeletingVideo: boolean;
  localThumbUrl: string | undefined;
}
const useQAVideoItem = ({item}: Props): IQAVideoItem => {
  const {company} = useCompany();
  const {showNotification} = useNotification();
  const [localThumbUrl, setlocalThumbUrl] = useState<string | undefined>(
    undefined,
  );
  const {accessToken} = useAuth();

  const {handleDeleteCachedVideo, findLocalVideoURL, findLocalThumbURL} =
    useLocalVideo();
  const {handleDeleteQAVideo} = useSetQAVideoQueryData({});
  const onDeleteSuccessCb = (qaVideo?: QAVideo) => {
    if (qaVideo) {
      handleDeleteQAVideo(qaVideo);
      handleDeleteCachedVideo(qaVideo.fileId);
    }
  };

  const deleteImgQuery = QAQueryAPI.useDeleteQAVideoQuery({
    showNotification,
    accessToken,
    company,
    onSuccessCb: onDeleteSuccessCb,
  });

  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const onPressVideo = async () => {
    const localUrl = await findLocalVideoURL(item.fileId);
    if (localUrl) {
      navigation.navigate('QAViewVideo', {
        videoUrl: localUrl,
      });
    } else if (item.url) {
      navigation.navigate('QAViewVideo', {
        videoUrl: item.url,
      });
    }
  };
  const handleDeleteQAImage = () => {
    Alert.alert(
      'Confirm Delete!',
      'This video will be deleted permanently, are you sure to proceed?',
      [
        {
          text: 'Cancel',
          style: 'destructive',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteImgQuery.mutate(item);
          },
        },
      ],
    );
  };

  const getLocalThumb = async () => {
    try {
      const thumb = await findLocalThumbURL(item.fileId);
      if (thumb) setlocalThumbUrl(thumb);
    } catch (error) {
      console.log('ERROR getLocalThumb:', error);
    }
  };
  useEffect(() => {
    getLocalThumb();
  }, []);

  return {
    onPressVideo,
    handleDeleteQAImage,
    isDeletingVideo: deleteImgQuery.isLoading,
    localThumbUrl,
  };
};

export default useQAVideoItem;

const styles = StyleSheet.create({});
