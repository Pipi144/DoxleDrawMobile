import {StyleSheet} from 'react-native';

import {useQADetailContext} from '../QADetail';
import {QAComment} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

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
  });

  const handleLongPressComment = () => {
    editCommentQuery.patch.mutate({
      qaId: edittedQA.defectId,
      commentId: commentItem.commentId,
      isOfficial: commentItem.isOfficial ? !commentItem.isOfficial : true,
    });
  };
  return {
    handleLongPressComment,
  };
};

export default useQACommentItem;

const styles = StyleSheet.create({});
