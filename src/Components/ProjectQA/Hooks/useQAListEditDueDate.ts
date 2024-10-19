import {Keyboard, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {TDateISODate} from '../../../../../../Models/dateFormat';
import {QAList} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {formatTDateISODate} from '../../../../../../Utilities/FunctionUtilities';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {shallow} from 'zustand/shallow';
import useSetQAListQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAListQueryData';

type Props = {
  handleQAListDueDateChange: (newDate: TDateISODate | null) => void;
  edittedQAList: QAList;
};
interface QAListEditDueDate {
  showDatePicker: boolean;
  handleCloseDatePicker: () => void;
  handleShowDatePicker: () => void;
  handleUpdateDueDate: (date: Date) => void;
  isUpdatingDueDate: boolean;
}
const useQAListEditDueDate = ({
  handleQAListDueDateChange,
  edittedQAList,
}: Props): QAListEditDueDate => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };
  const handleShowDatePicker = () => {
    setShowDatePicker(true);
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
  const onUpdateSuccessCb = (edittedQAList?: QAList) => {
    if (edittedQAList) {
      handleQAListDueDateChange(edittedQAList.dueDate);
      handleEditQAList(edittedQAList);
    }
  };
  const updateQAListQuery = QAQueryAPI.useUpdateQAListQuery({
    company,
    accessToken,

    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateDueDate = (date: Date) => {
    handleCloseDatePicker();
    updateQAListQuery.mutate({
      qaList: edittedQAList,
      updateParams: {dueDate: formatTDateISODate(date)},
    });
  };

  return {
    showDatePicker,
    handleCloseDatePicker,
    handleShowDatePicker,
    handleUpdateDueDate,
    isUpdatingDueDate: updateQAListQuery.isLoading,
  };
};

export default useQAListEditDueDate;

const styles = StyleSheet.create({});
