import {StyleSheet} from 'react-native';
import {useEffect, useMemo} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import {QA, QAWithFirstImg} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import useSetQAListDetailQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAListDetailQueryData';
import useSetQAQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAQueryData';
import {TQATabStack} from '../../../Routes/QARouteType';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {qaItem: QAWithFirstImg};

const useQAItem = ({qaItem}: Props) => {
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const {handleDeleteSingleQAFolder} = useCacheQAContext();
  const {
    handleUpdateQAListDetailQueryData,
    getQAListDetailQueryData,
    refetchQAListDetailQueryData,
  } = useSetQAListDetailQueryData({});

  const {handleEditQAQueryData, handleDeleteQAQueryData} = useSetQAQueryData(
    {},
  );

  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const handlePressItem = () => {
    const {firstImage, ...rest} = qaItem;
    navigation.navigate('QAItemDetails', {
      qaItem,
    });
  };

  //* useEffect control navigate to edit page if the item is new
  useEffect(() => {
    if (qaItem.isNew) {
      handleEditQAQueryData({...qaItem, isNew: false});
    }
  }, []);

  const deleteQAQuery = QAQueryAPI.useDeleteQAQuery({
    company,
    accessToken,
    // showNotification,
  });
  const getQAListDetail = QAQueryAPI.useRetrieveQAListDetailQuery({
    company,
    accessToken,
    defectListId: qaItem.defectList,
  });

  const qaListDetail = useMemo(
    () => (getQAListDetail.isSuccess ? getQAListDetail.data.data : undefined),
    [getQAListDetail.data],
  );
  const handleDeleteQAItem = async () => {
    handleDeleteQAQueryData(qaItem.defectId, qaItem.defectList);

    if (qaListDetail) {
      if (qaItem.status === 'Completed') {
        handleUpdateQAListDetailQueryData({
          defectListId: qaItem.defectList,
          completedCount: qaListDetail.completedCount - 1,
        });
      } else
        handleUpdateQAListDetailQueryData({
          defectListId: qaItem.defectList,
          unattendedCount: qaListDetail.unattendedCount - 1,
        });
    }
    await handleDeleteSingleQAFolder(qaItem);
    deleteQAQuery.mutate(qaItem.defectId);
  };

  const onUpdateSuccessCb = (edittedQA: QA) => {
    const qaListDetailQueryData = getQAListDetailQueryData(qaItem.defectList);
    if (qaListDetailQueryData) {
      if (edittedQA.status === 'Completed') {
        handleUpdateQAListDetailQueryData({
          defectListId: qaItem.defectList,
          completedCount: qaListDetailQueryData.completedCount + 1,
          unattendedCount: qaListDetailQueryData.unattendedCount - 1,
        });
      } else
        handleUpdateQAListDetailQueryData({
          defectListId: qaItem.defectList,
          completedCount: qaListDetailQueryData.completedCount - 1,
          unattendedCount: qaListDetailQueryData.unattendedCount + 1,
        });
    } else refetchQAListDetailQueryData(qaItem.defectList);
  };
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,

    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateStatusQA = () => {
    handleEditQAQueryData({
      ...qaItem,
      status: qaItem.status !== 'Completed' ? 'Completed' : 'Unattended',
    });
    updateQAQuery.mutate({
      status: qaItem.status !== 'Completed' ? 'Completed' : 'Unattended',
      defectId: qaItem.defectId,
    });
  };

  return {
    handlePressItem,

    handleDeleteQAItem,
    isDeletingQA: deleteQAQuery.isPending,
    handleUpdateStatusQA,
  };
};

export default useQAItem;

const styles = StyleSheet.create({});
