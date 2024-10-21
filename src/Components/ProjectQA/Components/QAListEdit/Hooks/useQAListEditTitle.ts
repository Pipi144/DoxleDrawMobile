import {Keyboard, StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {QAList} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../DesignPattern/Notification/Notification';
import useSetQAListQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAListQueryData';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {
  handleQAListTitleChange: (value: string) => void;
  edittedQAList: QAList;
};

interface QAListEditTitle {
  newTitleText: string;
  handleNewTitleTextChange: (value: string) => void;
  handleUpdateTitle: () => void;
  isUpdatingTitle: boolean;
}
const useQAListEditTitle = ({
  handleQAListTitleChange,
  edittedQAList,
}: Props): QAListEditTitle => {
  const [newTitleText, setNewTitleText] = useState<string>(
    edittedQAList.defectListTitle,
  );

  const handleNewTitleTextChange = (value: string) => {
    setNewTitleText(value);
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
  const onUpdateSuccessCb = (newQAList?: QAList) => {
    handleQAListTitleChange(newTitleText);
    if (newQAList) handleEditQAList(newQAList);
  };
  const updateQAListQuery = QAQueryAPI.useUpdateQAListQuery({
    company,
    accessToken,

    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateTitle = () => {
    Keyboard.dismiss();
    if (!newTitleText) {
      updateQAListQuery.mutate({
        qaList: edittedQAList,
        updateParams: {defectListTitle: 'Untitled QA List'},
      });
    } else if (newTitleText !== edittedQAList.defectListTitle)
      updateQAListQuery.mutate({
        qaList: edittedQAList,
        updateParams: {defectListTitle: newTitleText},
      });
  };
  return {
    newTitleText,
    handleNewTitleTextChange,
    handleUpdateTitle,
    isUpdatingTitle: updateQAListQuery.isPending,
  };
};

export default useQAListEditTitle;

const styles = StyleSheet.create({});
