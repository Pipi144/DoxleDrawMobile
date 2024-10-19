import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {QAComment} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useQADetailContext} from '../Components/QADetail/QADetail';

type Props = {
  commentItem: QAComment;
};

interface IQACommentItem {
  handleLongPressComment: () => void;
}
const useQACommentItem = ({commentItem}: Props): IQACommentItem => {
  const {edittedQA} = useQADetailContext();
  const {company} = useCompany();
  const {showNotification} = useNotification();
  //handle show notification

  const {accessToken} = useAuth();
  const editCommentQuery = QAQueryAPI.useMutateQACommentQuery({
    showNotification,
    accessToken,
    company,
    qaItem: edittedQA,
  });

  const handleLongPressComment = () => {
    editCommentQuery.patch.mutate({
      commentId: commentItem.commentId,
      isOfficial: !commentItem.isOfficial ?? true,
    });
  };
  return {
    handleLongPressComment,
  };
};

export default useQACommentItem;

const styles = StyleSheet.create({});
