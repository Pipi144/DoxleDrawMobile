import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {QA} from '../../../../../../Models/qa';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import useSetQAListDetailQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAListDetailQueryData';
import useSetQAQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAQueryData';
import QAQueryAPI, {
  getQAItemListMutationKey,
} from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useQueryClient} from '@tanstack/react-query';

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
    qaListDetailQueryData,
    refetchQAListDetailQueryData,
  } = useSetQAListDetailQueryData({qaListId: qaItem.defectList});

  const {handleEditQAQueryData} = useSetQAQueryData({});
  const onUpdateSuccessCb = (edittedQA: QA) => {
    handleEditQAQueryData(edittedQA);
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
    onSuccessCB: onUpdateSuccessCb,
  });
  const updateMutationKey = getQAItemListMutationKey('update');

  const handleToggleStatus = (value: boolean) => {
    setStatusToggleValue(value);
    queryClient.cancelQueries(updateMutationKey);
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
