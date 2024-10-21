import {Platform, RefreshControl, StyleSheet} from 'react-native';
import React, {memo, useCallback, useMemo} from 'react';

import QAItemListSkeleton from './QAItemListSkeleton';
import Animated, {LinearTransition} from 'react-native-reanimated';

import QAItem from './QAItem';
import {StyledQAItemListContainer} from './StyledComponentsQAListDetail';

import QAGridItem from './QAGridItem';
import useQAItemList from './Hooks/useQAItemList';
import {QA, QAList, QAWithFirstImg} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import {EmptyQAItemListBanner} from '../QAIcons';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';

type Props = {
  qaListItem: QAList;
  setSelectedQAForAssignee: React.Dispatch<
    React.SetStateAction<QA | undefined>
  >;
};

const QAItemList: React.FC<Props> = ({
  qaListItem,
  setSelectedQAForAssignee,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {
    listWrapperRef,
    onLayoutWrapper,
    isFetchingQAItemList,
    layoutWrapper,

    numOfCol,
    qaItemList,
    handleFetchNextPage,
    handleRefetchQAList,
    isFetchingNextPage,
    qaListViewMode,
    isErrorFetchingQAItemList,
    isRefetchingQAList,
    listRef,
    viewabilityConfig,
    onViewableItemsChanged,
  } = useQAItemList({qaListItem});
  //render qaItem List
  const renderItem = useCallback(
    (props: {item: QAWithFirstImg}) =>
      qaListViewMode === 'list' ? (
        <QAItem
          qaItem={props.item}
          numOfCol={numOfCol}
          setSelectedQAForAssignee={setSelectedQAForAssignee}
        />
      ) : (
        <QAGridItem
          qaItem={props.item}
          numOfColumns={numOfCol}
          setSelectedQAForAssignee={setSelectedQAForAssignee}
        />
      ),
    [numOfCol, qaListViewMode],
  );

  const keyExtractor = useCallback((item: QAWithFirstImg) => item.defectId, []);

  const listEmptyHolder = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        headTitleText={
          isErrorFetchingQAItemList
            ? 'Something Wrong!'
            : qaItemList.filter(qa => qa.status === 'Completed').length === 0 &&
              qaItemList.length > 0
            ? 'No Completed QA Issue!'
            : 'No QA Issue!'
        }
        subTitleText={
          isErrorFetchingQAItemList
            ? 'We are sorry, please try to pull down to get data again...'
            : 'Add More QA Issue And Image Manage Your Issue...'
        }
        illustrationComponent={
          isErrorFetchingQAItemList ? (
            <ErrorFetchingBanner
              themeColor={THEME_COLOR}
              containerStyle={{
                width: '70%',
                marginBottom: 14,
              }}
            />
          ) : (
            <EmptyQAItemListBanner
              themeColor={THEME_COLOR}
              containerStyle={{
                width: '70%',
                marginBottom: 14,
              }}
            />
          )
        }
      />
    ),
    [isErrorFetchingQAItemList, qaItemList, THEME_COLOR],
  );
  const layout = LinearTransition.springify().damping(16);
  return (
    <StyledQAItemListContainer ref={listWrapperRef} onLayout={onLayoutWrapper}>
      {isFetchingQAItemList && (
        <QAItemListSkeleton listWidth={layoutWrapper.width} />
      )}

      {!isFetchingQAItemList && (
        <Animated.FlatList
          ref={listRef}
          style={styles.listStyle}
          key={`qaList_${numOfCol}`}
          data={qaItemList}
          itemLayoutAnimation={layout}
          contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          windowSize={7}
          numColumns={numOfCol}
          initialNumToRender={25}
          maxToRenderPerBatch={14}
          updateCellsBatchingPeriod={200}
          onEndReached={handleFetchNextPage}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefetchQAList}
              refreshing={isRefetchingQAList}
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
          onViewableItemsChanged={onViewableItemsChanged.current} // Track viewable items
          viewabilityConfig={viewabilityConfig.current} // Configuration for when an item is considered "viewed"
          onEndReachedThreshold={0.8}
          ListEmptyComponent={listEmptyHolder}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustsScrollIndicatorInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
        />
      )}
      {isFetchingNextPage && (
        <ListLoadingMoreBottom
          containerStyle={{
            position: 'absolute',
            zIndex: 10,
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
          size={44}
        />
      )}
    </StyledQAItemListContainer>
  );
};

export default memo(QAItemList);

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    height: '100%',
  },
});
