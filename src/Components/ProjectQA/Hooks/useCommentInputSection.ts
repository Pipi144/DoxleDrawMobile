import {
  Keyboard,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  NEW_QA_COMMENT_TEMPLATE,
  QA,
  QAComment,
} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import useSetQAQueryData from '../../../../../../CustomHooks/SetQueryDataHooks/useSetQAQueryData';

type Props = {qaItem: QA};
interface CommentInputSection {
  newCommentText: string;
  handleNewCommentTextChange: (value: string) => void;
  handleAddCmt: () => void;
  isAddingComment: boolean;
  onLayoutChange: (event: LayoutChangeEvent) => void;
  layoutInputSectionYPos: number;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
}
const useCommentInputSection = ({qaItem}: Props): CommentInputSection => {
  const [newCommentText, setNewCommentText] = useState<string>('');
  const handleNewCommentTextChange = (value: string) => {
    setNewCommentText(value);
  };
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [layoutInputSectionYPos, setlayoutInputSectionYPos] =
    useState<number>(0);
  const {company} = useCompany();
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
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const {handleUpdateLatestCommentQA} = useSetQAQueryData({});
  const onSuccessAddCb = (newComment?: QAComment) => {
    setNewCommentText('');
    if (newComment)
      handleUpdateLatestCommentQA(
        qaItem.defectId,
        qaItem.defectList,
        newComment,
      );
  };
  const {accessToken, user} = useAuth();
  const addCmtQuery = QAQueryAPI.useAddQACommentQuery({
    showNotification,
    accessToken,
    company,
    qaItem,
    onSuccessCB: onSuccessAddCb,
  });

  const handleAddCmt = () => {
    Keyboard.dismiss();
    if (newCommentText) {
      const newCmtData = NEW_QA_COMMENT_TEMPLATE({
        commentText: newCommentText,
        company: company?.companyId || '',
        defect: qaItem.defectId,
        author: user?.userId || '',
      });
      addCmtQuery.mutate(newCmtData);
    }
  };

  const onLayoutChange = (event: LayoutChangeEvent) =>
    setlayoutInputSectionYPos(event.nativeEvent.layout.y);
  return {
    newCommentText,
    handleNewCommentTextChange,
    handleAddCmt,
    isAddingComment: addCmtQuery.isLoading,
    onLayoutChange,
    layoutInputSectionYPos,
    isInputFocused,
    setIsInputFocused,
  };
};

export default useCommentInputSection;

const styles = StyleSheet.create({});
