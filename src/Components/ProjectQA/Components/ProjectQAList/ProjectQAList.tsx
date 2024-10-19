import {Platform, RefreshControl, StyleSheet} from 'react-native';

import QAListMenuModal from './QAListMenuModal';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useVibration} from '../../../../Providers/VibrationProvider';
import useProjectQAList from './Hooks/useProjectQAList';
import {QAList} from '../../../../Models/qa';
import React, {useCallback, useMemo} from 'react';
import DraggableFlatList, {RenderItem} from 'react-native-draggable-flatlist';
import ProjectQAListItem from './ProjectQAListItem';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {QAEmptyBanner} from '../QAIcons';
import {StyledProjectQAListContainer} from './StyledComponentsProjectQAList';
import {LinearTransition} from 'react-native-reanimated';
import SearchSection from '../../../DesignPattern/SearchSection/SearchSection';
import ProjectQAListSkeleton from './ProjectQAListSkeleton';
import AddQAList from './AddQAList';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';

type Props = {};

const ProjectQAList = () => {
  const {THEME_COLOR} = useDOXLETheme();
  const {shortVibrateTrigger, tickVibrateTrigger} = useVibration();
  const {
    qaList,
    isErrorFetchingQAList,
    isFetchingQAList,
    showAddQAListHeader,
    handleRefetchQAList,
    isRefetchingQAList,
    fetchMoreQAList,
    isFetchingMoreQAList,

    setShowAddQAListHeader,
    editedQAList,
    setEditedQAList,
    setSearchInput,
  } = useProjectQAList({});

  //render qalist list
  const renderItem: RenderItem<QAList> = useCallback(
    ({item, drag, isActive}) => (
      <ProjectQAListItem
        qaListItem={item}
        drag={drag}
        isActiveDragged={isActive}
        setEditedQAList={setEditedQAList}
      />
    ),
    [],
  );
  const keyExtractor = useCallback((item: QAList) => item.defectListId, []);

  const listEmptycomponent = useMemo(
    () =>
      isErrorFetchingQAList ? (
        <DoxleEmptyPlaceholder
          headTitleText="Something Wrong!"
          subTitleText="We are sorry, please try to pull down to get data again..."
        />
      ) : (
        <DoxleEmptyPlaceholder
          illustrationComponent={<QAEmptyBanner {...THEME_COLOR} />}
          headTitleText="No QA List!"
          subTitleText="Add a qa collection to handle your issues"
          addButton={{
            btnText: 'New QA List',
            btnContainerStyle: {},
            btnFunction: () => setShowAddQAListHeader(true),
          }}
        />
      ),
    [isErrorFetchingQAList],
  );
  return (
    <StyledProjectQAListContainer
      layout={LinearTransition.springify().damping(16)}>
      <SearchSection
        placeholder="Search list..."
        containerStyle={{
          marginVertical: 14,
        }}
        onSearch={setSearchInput}
      />
      {isFetchingQAList && <ProjectQAListSkeleton />}
      {!isFetchingQAList && (
        <DraggableFlatList
          data={qaList}
          containerStyle={styles.listStyle}
          contentContainerStyle={styles.listContainerStyle}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchMoreQAList}
          windowSize={5}
          removeClippedSubviews={true}
          initialNumToRender={20}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={500}
          onEndReachedThreshold={0.5}
          onDragBegin={() => shortVibrateTrigger()}
          onPlaceholderIndexChange={index => tickVibrateTrigger()}
          ListHeaderComponent={showAddQAListHeader ? <AddQAList /> : null}
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
          ListEmptyComponent={listEmptycomponent}
          // automaticallyAdjustKeyboardInsets
          automaticallyAdjustsScrollIndicatorInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
        />
      )}

      {isFetchingMoreQAList && (
        <ListLoadingMoreBottom
          containerStyle={styles.preloaderContainer}
          size={44}
        />
      )}

      <QAListMenuModal
        editedQAList={editedQAList}
        setEditedQAList={setEditedQAList}
      />
    </StyledProjectQAListContainer>
  );
};

export default ProjectQAList;

const styles = StyleSheet.create({
  listContainerStyle: {
    flexGrow: 1,
  },
  listStyle: {
    flex: 1,
    width: '100%',
  },
  preloaderContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  addBtn: {
    alignSelf: 'flex-end',

    padding: 5,
  },
});
