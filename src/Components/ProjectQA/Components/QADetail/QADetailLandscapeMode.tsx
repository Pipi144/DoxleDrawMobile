import {Platform, RefreshControl, StyleSheet} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {
  StyledQACommentColumn,
  StyledQALandscapeViewWrapper,
} from './StyledComponentQADetail';
import useQAImageList from './Hooks/useQAImageList';
import useQADetailEditComment from './Hooks/useQADetailEditComment';
import CommentInputSection from './CommentInputSection';
import Animated, {LinearTransition} from 'react-native-reanimated';
import QACommentItem from './QACommentItem';
import QADetailHeader from './QADetailHeader';
import {useProjectQAStore} from '../../Store/useProjectQAStore';

import QAImageItem from './QAImageItem';
import {useQADetailContext} from './QADetail';
import {useShallow} from 'zustand/react/shallow';
import {QA, QAComment} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {LocalQAImage} from '../../Provider/CacheQAType';

type Props = {qaItem: QA};

const QADetailLandscapeMode = ({qaItem}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {
    edittedQA,
    handleQADescriptionChange,
    handleDueDateChange,
    handleAssigneeChange,
    handleStatusChange,
    handleUpdateAssignee,
    handleCloseAddAssigneeModal,
  } = useQADetailContext();
  const {
    isFetchingQAImage,
    handleSetIsProcessingImage,
    handleSelectAnnotationImage,
    handleRefetchQAImgList,
    isRefetchingQAImgList,
  } = useQAImageList({
    qaItem: qaItem,
  });

  const {
    commentList,
    isFetchingComment,
    isErrorFetchingComment,
    isSuccessFetchingComment,
    onLayoutChange,
    layoutQACommentSectionYPos,
  } = useQADetailEditComment({qaItem});
  const {qaImageList, showEditAssigneeQAModal} = useProjectQAStore(
    useShallow(state => ({
      qaImageList: state.qaImageList,
      showEditAssigneeQAModal: state.showEditAssigneeQAModal,
    })),
  );
  const listCmtHeaderComponent = useMemo(
    () => (
      <QADetailHeader
        edittedQA={edittedQA}
        handleQADescriptionChange={handleQADescriptionChange}
        handleDueDateChange={handleDueDateChange}
        handleAssigneeChange={handleAssigneeChange}
        handleSetIsProcessingImage={handleSetIsProcessingImage}
        isFetchingQAImage={isFetchingQAImage}
        handleStatusChange={handleStatusChange}
        mode="landscapeComment"
      />
    ),
    [
      edittedQA,
      handleQADescriptionChange,
      handleDueDateChange,
      handleAssigneeChange,
      handleSetIsProcessingImage,
      isFetchingQAImage,
      handleStatusChange,
    ],
  );
  const listImgComponent = useMemo(
    () => (
      <QADetailHeader
        edittedQA={edittedQA}
        handleQADescriptionChange={handleQADescriptionChange}
        handleDueDateChange={handleDueDateChange}
        handleAssigneeChange={handleAssigneeChange}
        handleSetIsProcessingImage={handleSetIsProcessingImage}
        isFetchingQAImage={isFetchingQAImage}
        handleStatusChange={handleStatusChange}
        mode="landscapeImg"
      />
    ),
    [
      edittedQA,
      handleQADescriptionChange,
      handleDueDateChange,
      handleAssigneeChange,
      handleSetIsProcessingImage,
      isFetchingQAImage,
      handleStatusChange,
    ],
  );

  const listImgRef = useRef<Animated.FlatList<QA>>(null);

  //*render list
  const renderItem = useCallback(
    (props: {item: LocalQAImage; index: number}) => (
      <QAImageItem
        imageItem={props.item}
        numOfListColumns={3}
        handleSelectAnnotationImage={handleSelectAnnotationImage}
        // selectedAnnotationImage={selectedAnnotationImage}
      />
    ),
    [handleSelectAnnotationImage],
  );

  const keyExtractor = useCallback(
    (item: LocalQAImage, index: number) => item.imageId,
    [],
  );
  return (
    <StyledQALandscapeViewWrapper
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <StyledQACommentColumn onLayout={onLayoutChange}>
        <Animated.FlatList
          style={styles.commentList}
          data={commentList}
          initialNumToRender={14}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={100}
          renderItem={({item, index}) => <QACommentItem commentItem={item} />}
          keyExtractor={(item, index) => (item as QAComment).commentId}
          ListHeaderComponent={listCmtHeaderComponent}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={true}
          automaticallyAdjustsScrollIndicatorInsets
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
        <CommentInputSection
          qaItem={qaItem}
          layoutQACommentSectionYPos={layoutQACommentSectionYPos}
        />
      </StyledQACommentColumn>

      <Animated.FlatList
        style={styles.imgList}
        data={qaImageList}
        ref={listImgRef as any}
        itemLayoutAnimation={LinearTransition.springify().damping(16)}
        contentContainerStyle={{flexGrow: 1}}
        extraData={[edittedQA]}
        initialNumToRender={14}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefetchQAImgList}
            refreshing={isRefetchingQAImgList}
            tintColor={
              Platform.OS === 'ios' ? THEME_COLOR.primaryFontColor : undefined
            }
            colors={
              Platform.OS === 'android'
                ? [THEME_COLOR.primaryFontColor]
                : undefined
            }
            progressBackgroundColor={THEME_COLOR.primaryContainerColor}
            progressViewOffset={Platform.OS === 'android' ? -30 : 0}
          />
        }
        ListHeaderComponent={listImgComponent}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        automaticallyAdjustContentInsets={true}
        automaticallyAdjustsScrollIndicatorInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />
    </StyledQALandscapeViewWrapper>
  );
};

export default QADetailLandscapeMode;

const styles = StyleSheet.create({
  commentList: {
    width: '100%',
    flex: 1,
  },
  imgList: {
    width: '50%',
    height: '100%',
  },
});
