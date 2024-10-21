import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';

import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {TDateISODate} from '../../../../../Models/dateFormat';
import {QAList} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../DesignPattern/Notification/Notification';
import useSetQAListQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAListQueryData';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {formatTDateISODate} from '../../../../../Utilities/FunctionUtilities';

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
    isUpdatingDueDate: updateQAListQuery.isPending,
  };
};

export default useQAListEditDueDate;

const styles = StyleSheet.create({});
