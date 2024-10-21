import {StyleSheet} from 'react-native';
import {useState} from 'react';

import {useQueryClient} from '@tanstack/react-query';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import useSetQAListDetailQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAListDetailQueryData';
import useSetQAQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAQueryData';
import {QA} from '../../../../../Models/qa';
import QAQueryAPI, {
  getQAItemListMutationKey,
} from '../../../../../API/qaQueryAPI';

type Props = {qaItem: QA};

interface QADetailEditStatus {
  statusToggleValue: boolean;
  handleToggleStatus: (value: boolean) => void;
}
const useQADetailEditStatus = ({qaItem}: Props): QADetailEditStatus => {
  const [statusToggleValue, setStatusToggleValue] = useState(
    qaItem.status === 'Completed' ? true : false,
  );
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const queryClient = useQueryClient();
  const {
    handleUpdateQAListDetailQueryData,
    getQAListDetailQueryData,
    refetchQAListDetailQueryData,
  } = useSetQAListDetailQueryData({qaListId: qaItem.defectList});

  const {handleEditQAQueryData} = useSetQAQueryData({});
  const onUpdateSuccessCb = (edittedQA: QA) => {
    handleEditQAQueryData(edittedQA);
    const qaListDetailQueryData = getQAListDetailQueryData(
      edittedQA.defectList,
    );
    if (qaListDetailQueryData) {
      if (edittedQA.status === 'Completed') {
        handleUpdateQAListDetailQueryData({
          defectListId: edittedQA.defectList,
          completedCount: qaListDetailQueryData.completedCount + 1,
          unattendedCount: qaListDetailQueryData.unattendedCount - 1,
        });
      } else
        handleUpdateQAListDetailQueryData({
          defectListId: edittedQA.defectList,
          completedCount: qaListDetailQueryData.completedCount - 1,
          unattendedCount: qaListDetailQueryData.unattendedCount + 1,
        });
    } else refetchQAListDetailQueryData(edittedQA.defectList);
  };
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,
    onSuccessCB: onUpdateSuccessCb,
  });
  const updateMutationKey = getQAItemListMutationKey('update');

  const handleToggleStatus = (value: boolean) => {
    setStatusToggleValue(value);
    queryClient.cancelQueries({queryKey: updateMutationKey});
    if (value) {
      updateQAQuery.mutate({
        status: 'Completed',
        defectId: qaItem.defectId,
      });
    } else
      updateQAQuery.mutate({
        status: 'Unattended',
        defectId: qaItem.defectId,
      });
  };
  return {
    statusToggleValue,
    handleToggleStatus,
  };
};

export default useQADetailEditStatus;

const styles = StyleSheet.create({});
