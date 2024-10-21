import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {QA} from '../../../../../Models/qa';
import {TDateISODate} from '../../../../../Models/dateFormat';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {formatTDateISODate} from '../../../../../Utilities/FunctionUtilities';

type Props = {
  qaItem: QA;
  handleDueDateChange: (newDate: TDateISODate | null) => void;
};
interface QADetailEditDueDate {
  showDatePicker: boolean;
  handleCloseDatePicker: () => void;
  handleShowDatePicker: () => void;
  handleUpdateDueDate: (date: Date) => void;
  isUpdatingDueDate: boolean;
}
const useQADetailEditDueDate = ({
  qaItem,
  handleDueDateChange,
}: Props): QADetailEditDueDate => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };
  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const onUpdateSuccessCb = (edittedQA: QA) => {
    if (edittedQA.dueDate !== undefined) handleDueDateChange(edittedQA.dueDate);
  };
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,
    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateDueDate = (date: Date) => {
    handleCloseDatePicker();
    updateQAQuery.mutate({
      defectId: qaItem.defectId,
      dueDate: formatTDateISODate(date),
    });
  };
  return {
    showDatePicker,
    handleCloseDatePicker,
    handleShowDatePicker,
    handleUpdateDueDate,
    isUpdatingDueDate: updateQAQuery.isPending,
  };
};

export default useQADetailEditDueDate;

const styles = StyleSheet.create({});
