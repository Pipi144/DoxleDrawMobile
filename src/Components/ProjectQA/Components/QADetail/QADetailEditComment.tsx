import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledQADetailLabelText,
  StyledQaDetailEditComment,
} from './StyledComponentQADetail';

import Animated, {LinearTransition} from 'react-native-reanimated';
import CommentInputSection from './CommentInputSection';

import useQADetailEditComment from './Hooks/useQADetailEditComment';
import QACommentItem from './QACommentItem';
import {QA, QAComment} from '../../../../Models/qa';

type Props = {qaItem: QA};

const QADetailEditComment = ({qaItem}: Props) => {
  const {commentList, onLayoutChange, layoutQACommentSectionYPos} =
    useQADetailEditComment({qaItem});
  return (
    <StyledQaDetailEditComment
      layout={LinearTransition.springify().damping(16)}
      onLayout={onLayoutChange}>
      <StyledQADetailLabelText>Comment</StyledQADetailLabelText>

      <Animated.FlatList<QAComment>
        style={styles.commentList}
        data={commentList}
        initialNumToRender={14}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={100}
        renderItem={({item}) => <QACommentItem commentItem={item} />}
        keyExtractor={item => item.commentId}
        automaticallyAdjustKeyboardInsets
      />
      <CommentInputSection
        qaItem={qaItem}
        layoutQACommentSectionYPos={layoutQACommentSectionYPos}
      />
    </StyledQaDetailEditComment>
  );
};

export default QADetailEditComment;

const styles = StyleSheet.create({
  commentList: {
    width: '100%',
    flexGrow: 0,
  },
});
