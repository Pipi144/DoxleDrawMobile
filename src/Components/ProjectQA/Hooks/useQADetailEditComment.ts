import {LayoutChangeEvent, StyleSheet} from 'react-native';
import {useMemo, useState} from 'react';
import {QA, QAComment} from '../../../../../../Models/qa';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';

type Props = {
  qaItem: QA;
};
interface QADetailEditComment {
  commentList: QAComment[];
  isFetchingComment: boolean;
  isErrorFetchingComment: boolean;
  isSuccessFetchingComment: boolean;
  onLayoutChange: (event: LayoutChangeEvent) => void;
  layoutQACommentSectionYPos: number;
}
const useQADetailEditComment = ({qaItem}: Props): QADetailEditComment => {
  const [layoutQACommentSectionYPos, setlayoutQACommentSectionYPos] =
    useState<number>(0);
  const {company} = useCompany();

  const {accessToken} = useAuth();
  const getQACommentQuery = QAQueryAPI.useRetrieveQACommentList({
    accessToken,
    company,
    qaItem,
  });

  const commentList: QAComment[] = useMemo(
    () =>
      getQACommentQuery.isSuccess ? getQACommentQuery.data.data.results : [],
    [getQACommentQuery.isSuccess, getQACommentQuery.data],
  );

  const onLayoutChange = (event: LayoutChangeEvent) => {
    setlayoutQACommentSectionYPos(event.nativeEvent.layout.y);
  };
  return {
    commentList,
    isFetchingComment: getQACommentQuery.isLoading,
    isErrorFetchingComment: getQACommentQuery.isError,
    isSuccessFetchingComment: getQACommentQuery.isSuccess,
    onLayoutChange,
    layoutQACommentSectionYPos,
  };
};

export default useQADetailEditComment;

const styles = StyleSheet.create({});
