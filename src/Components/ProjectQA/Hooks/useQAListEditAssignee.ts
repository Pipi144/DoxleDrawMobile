import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';

import {QASelectedAssignee} from './useEditAssigneeModal';
import {QAList} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {shallow} from 'zustand/shallow';
import useSetQAListQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAListQueryData';

type Props = {
  edittedQAList: QAList;
  handleQAListAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;
};
interface QAListEditAssignee {
  showAddAssigneeModal: boolean;
  handleShowAddAssigneeModal: () => void;
  handleCloseAddAssigneeModal: () => void;
  handleUpdateAssignee: (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => void;
  isUpdatingAssignee: boolean;
}
const useQAListEditAssignee = ({
  edittedQAList,
  handleQAListAssigneeChange,
}: Props): QAListEditAssignee => {
  const [showAddAssigneeModal, setshowAddAssigneeModal] =
    useState<boolean>(false);

  const handleShowAddAssigneeModal = () => {
    setshowAddAssigneeModal(true);
  };
  const handleCloseAddAssigneeModal = () => {
    setshowAddAssigneeModal(false);
  };

  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {notifierRootAppRef} = useNotification();
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
    ) => {
      notifierRootAppRef.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        duration: 800,
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const {filterQAListQuery} = useProjectQAStore(
    state => ({
      filterQAListQuery: state.filterQAListQuery,
    }),
    shallow,
  );
  const {handleEditQAList} = useSetQAListQueryData({});
  const onUpdateSuccessCb = (edittedQAListServer?: QAList) => {
    if (edittedQAListServer) {
      handleQAListAssigneeChange({
        assignee: edittedQAListServer.assignee,
        assigneeName: edittedQAListServer.assigneeName,
      });
      handleEditQAList(edittedQAListServer);
    }
  };
  const updateQAListQuery = QAQueryAPI.useUpdateQAListQuery({
    company,
    accessToken,

    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateAssignee = (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => {
    if (selectedAssignee)
      updateQAListQuery.mutate({
        updateParams: {
          assignee: selectedAssignee.assigneeId,
          assigneeName: selectedAssignee.assigneeName,
        },
        qaList: edittedQAList,
      });
    else
      updateQAListQuery.mutate({
        updateParams: {
          assignee: null,
          assigneeName: '',
        },
        qaList: edittedQAList,
      });
  };

  return {
    showAddAssigneeModal,
    handleShowAddAssigneeModal,
    handleCloseAddAssigneeModal,
    handleUpdateAssignee,
    isUpdatingAssignee: updateQAListQuery.isLoading,
  };
};

export default useQAListEditAssignee;

const styles = StyleSheet.create({});
