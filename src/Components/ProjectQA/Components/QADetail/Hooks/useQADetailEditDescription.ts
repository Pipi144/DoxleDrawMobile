import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {QA} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {
  qaItem: QA;
  handleQADescriptionChange: (value: string) => void;
};

interface QADetailEditDescription {
  newDescriptionText: string;
  handleNewDescriptionTextChange: (value: string) => void;
  handleUpdateDescription: () => void;
  isUpdatingDescription: boolean;
}
const useQADetailEditDescription = ({
  qaItem,
  handleQADescriptionChange,
}: Props): QADetailEditDescription => {
  const [newDescriptionText, setNewDescriptionText] = useState<string>(
    qaItem.description,
  );

  const handleNewDescriptionTextChange = (value: string) => {
    setNewDescriptionText(value);
  };

  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const onUpdateSuccessCb = () => {
    handleQADescriptionChange(newDescriptionText);
  };
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,
    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateDescription = () => {
    if (newDescriptionText !== qaItem.description)
      updateQAQuery.mutate({
        defectId: qaItem.defectId,
        description: newDescriptionText,
      });
  };

  return {
    newDescriptionText,
    handleNewDescriptionTextChange,
    handleUpdateDescription,
    isUpdatingDescription: updateQAQuery.isPending,
  };
};

export default useQADetailEditDescription;

const styles = StyleSheet.create({});
