import {StyleSheet} from 'react-native';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {
  SharedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {QA, QAList, QAWithFirstImg} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import useSetQAListDetailQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAListDetailQueryData';
import useSetQAQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAQueryData';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {TQATabStack} from '../Routes/QARouteType';
import {useNavigationMenuStore} from '../../../../../../GeneralStore/useNavigationMenuStore';
import {useShallow} from 'zustand/react/shallow';

type Props = {qaItem: QAWithFirstImg};

const useQAItem = ({qaItem}: Props) => {
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();
  const {setNavBarSearchValueText} = useNavigationMenuStore(
    useShallow(state => ({
      setNavBarSearchValueText: state.setNavBarSearchValueText,
    })),
  );
  const {handleDeleteSingleQAFolder} = useCacheQAContext();
  const {
    handleUpdateQAListDetailQueryData,
    qaListDetailQueryData,
    refetchQAListDetailQueryData,
  } = useSetQAListDetailQueryData({qaListId: qaItem.defectList});

  const {handleEditQAQueryData, handleDeleteQAQueryData} = useSetQAQueryData(
    {},
  );

  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const handlePressItem = () => {
    const {firstImage, ...rest} = qaItem;
    navigation.navigate('QAItemDetails', {
      qaItem,
    });
    setNavBarSearchValueText('');
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
    () =>
      getQAListDetail.isSuccess
        ? (getQAListDetail.data.data as QAList)
        : undefined,
    [getQAListDetail.data],
  );
  const handleDeleteQAItem = async () => {
    handleDeleteQAQueryData(qaItem.defectId, qaItem.defectList);

    if (qaListDetail) {
      if (qaItem.status === 'Completed') {
        handleUpdateQAListDetailQueryData({
          completedCount: qaListDetail.completedCount - 1,
        });
      } else
        handleUpdateQAListDetailQueryData({
          unattendedCount: qaListDetail.unattendedCount - 1,
        });
    }
    await handleDeleteSingleQAFolder(qaItem);
    deleteQAQuery.mutate(qaItem.defectId);
  };

  const onUpdateSuccessCb = (edittedQA: QA) => {
    if (qaListDetailQueryData) {
      if (edittedQA.status === 'Completed') {
        handleUpdateQAListDetailQueryData({
          completedCount: qaListDetailQueryData.completedCount + 1,
          unattendedCount: qaListDetailQueryData.unattendedCount - 1,
        });
      } else
        handleUpdateQAListDetailQueryData({
          completedCount: qaListDetailQueryData.completedCount - 1,
          unattendedCount: qaListDetailQueryData.unattendedCount + 1,
        });
    } else refetchQAListDetailQueryData();
  };
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,

    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateStatusQA = () => {
    updateQAQuery.mutate({
      status: qaItem.status !== 'Completed' ? 'Completed' : 'Unattended',
      defectId: qaItem.defectId,
    });
  };

  return {
    handlePressItem,

    handleDeleteQAItem,
    isDeletingQA: deleteQAQuery.isLoading,
    handleUpdateStatusQA,
  };
};

export default useQAItem;

const styles = StyleSheet.create({});
