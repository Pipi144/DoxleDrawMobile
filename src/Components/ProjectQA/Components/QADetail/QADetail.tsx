import {Platform, RefreshControl, StyleSheet} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import Animated, {LinearTransition} from 'react-native-reanimated';

import {useProjectQAStore} from '../../Store/useProjectQAStore';
import {QA, QAVideo, TQAStatus} from '../../../../../../../Models/qa';
import useQADetail from '../../Hooks/useQADetail';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {LocalQAImage} from '../../../../../../../Providers/CacheQAProvider/CacheQAType';
import QAImageItem from '../QAImage/QAImageItem';
import {StyledQADetailPageContainer} from './StyledComponentQADetail';
import QADetailHeader from './QADetailHeader';
import useQAImageList from '../../Hooks/useQAImageList';
import {useRoute} from '@react-navigation/native';
import QATopNavSection from '../QATopNavSection';
import EditAssigneeModal from '../EditAssigneeModal/EditAssigneeModal';
import QADetailLandscapeMode from './QADetailLandscapeMode';
import {TDateISODate} from '../../../../../../../Models/dateFormat';
import {QASelectedAssignee} from '../../Hooks/useEditAssigneeModal';
import {
  IBgVideoUploadData,
  useBgUploadVideoStore,
} from '../../../../../../../GeneralStore/useBgUploadVideoStore';
import QAPendingVideo from '../QAImage/QAPendingVideo';
import useQAVideoList from '../../Hooks/useQAVideoList';
import QAVideoItem from '../QAImage/QAVideoItem';
import RetryUploadVideo from './RetryUploadVideo';
import {TQATabStack} from '../../Routes/QARouteType';
import {useShallow} from 'zustand/react/shallow';
import CompressProgressModal from '../../../../../../DesignPattern/CompressProgressModal/CompressProgressModal';

type Props = {navigation: any};

interface QADetailContextValue {
  listRef: React.RefObject<Animated.FlatList<QA>>;
  edittedQA: QA;
  handleQADescriptionChange: (value: string) => void;
  handleDueDateChange: (newDate: TDateISODate | null) => void;
  handleAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;
  handleStatusChange: (status: TQAStatus) => void;
  handleUpdateAssignee: (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => void;
  handleCloseAddAssigneeModal: () => void;
  setEdittedQA: React.Dispatch<React.SetStateAction<QA>>;
}

const QADetailContext = createContext<QADetailContextValue | null>(null);
const QADetail = ({navigation}: Props) => {
  const {qaItem} = useRoute().params as TQATabStack['QAItemDetails'];
  const {
    edittedQA,
    handleQADescriptionChange,
    handleDueDateChange,
    handleAssigneeChange,
    handleStatusChange,
    handleUpdateAssignee,
    handleCloseAddAssigneeModal,
    setEdittedQA,
  } = useQADetail({qaItem});

  const {
    isFetchingQAImage,
    handleSetIsProcessingImage,
    handleSelectAnnotationImage,
    handleRefetchQAImgList,
    isRefetchingQAImgList,
  } = useQAImageList({
    qaItem,
  });
  const {localPendingVideoList, cachedVideoList} = useBgUploadVideoStore(
    useShallow(state => ({
      localPendingVideoList: state.localPendingVideoList,
      cachedVideoList: state.cachedVideoList,
    })),
  );
  const pendingUploadItems = useMemo(
    () =>
      localPendingVideoList
        .filter(item => item.hostId === qaItem.defectId)
        .concat(
          cachedVideoList.filter(
            item => item.hostId === qaItem.defectId && item.status === 'error',
          ),
        ),
    [localPendingVideoList, cachedVideoList, qaItem.defectId],
  );

  const layout = LinearTransition.springify().damping(16);
  const {THEME_COLOR} = useDOXLETheme();
  const listRef = useRef<Animated.FlatList<QA>>(null);
  const {qaImageList, showEditAssigneeQAModal, resetQAImgStore, compressState} =
    useProjectQAStore(
      useShallow(state => ({
        qaImageList: state.qaImageList,
        showEditAssigneeQAModal: state.showEditAssigneeQAModal,
        resetQAImgStore: state.resetQAImgStore,
        compressState: state.compressState,
      })),
    );

  const {deviceSize, deviceType, isPortraitMode} = useOrientation();
  const numOfListColumns: number = useMemo(
    () =>
      deviceSize.deviceWidth <= 350
        ? 1
        : deviceSize.deviceWidth <= 700
        ? 2
        : deviceSize.deviceWidth <= 1024
        ? 3
        : 5,
    [deviceSize.deviceWidth],
  );

  const {videoList, isRefetchingVideo, refetchVideoList} = useQAVideoList({
    qaItem,
  });

  //*render list
  const renderItem = useCallback(
    (props: {
      item: LocalQAImage | IBgVideoUploadData | QAVideo;
      index: number;
    }) =>
      'imageId' in props.item ? (
        <QAImageItem
          imageItem={props.item}
          numOfListColumns={numOfListColumns}
          handleSelectAnnotationImage={handleSelectAnnotationImage}
          // selectedAnnotationImage={selectedAnnotationImage}
        />
      ) : 'videoId' in props.item ? (
        <QAPendingVideo
          numOfListColumns={numOfListColumns}
          pendingItem={props.item}
        />
      ) : (
        <QAVideoItem numOfListColumns={numOfListColumns} item={props.item} />
      ),
    [numOfListColumns, handleSelectAnnotationImage],
  );

  const keyExtractor = useCallback(
    (item: LocalQAImage | IBgVideoUploadData | QAVideo, index: number) =>
      'imageId' in item
        ? item.imageId
        : 'videoId' in item
        ? 'pending#' + item.videoId
        : 'server#' + item.fileId,
    [],
  );

  const qaDetailContextValue: QADetailContextValue = {
    listRef,
    edittedQA,
    handleQADescriptionChange,
    handleDueDateChange,
    handleAssigneeChange,
    handleStatusChange,
    handleUpdateAssignee,
    handleCloseAddAssigneeModal,
    setEdittedQA,
  };

  const listHeaderComponent = useMemo(
    () => (
      <QADetailHeader
        edittedQA={edittedQA}
        handleQADescriptionChange={handleQADescriptionChange}
        handleDueDateChange={handleDueDateChange}
        handleAssigneeChange={handleAssigneeChange}
        handleSetIsProcessingImage={handleSetIsProcessingImage}
        isFetchingQAImage={isFetchingQAImage}
        handleStatusChange={handleStatusChange}
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
  useEffect(() => {
    return () => {
      resetQAImgStore();
    };
  }, []);

  return (
    <QADetailContext.Provider value={qaDetailContextValue}>
      <StyledQADetailPageContainer>
        {isPortraitMode && (
          <Animated.FlatList
            style={styles.listStyle}
            data={[...pendingUploadItems, ...videoList, ...qaImageList]}
            key={`qaImageList_${numOfListColumns}`}
            ref={listRef as any}
            itemLayoutAnimation={layout}
            contentContainerStyle={{flexGrow: 0}}
            extraData={[edittedQA, numOfListColumns]}
            initialNumToRender={14}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  handleRefetchQAImgList();
                  refetchVideoList();
                }}
                refreshing={isRefetchingQAImgList || isRefetchingVideo}
                tintColor={
                  Platform.OS === 'ios'
                    ? THEME_COLOR.primaryFontColor
                    : undefined
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
            ListHeaderComponent={listHeaderComponent}
            numColumns={numOfListColumns}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            automaticallyAdjustContentInsets={true}
            automaticallyAdjustsScrollIndicatorInsets
            automaticallyAdjustKeyboardInsets
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          />
        )}

        {!isPortraitMode && <QADetailLandscapeMode qaItem={qaItem} />}
        <EditAssigneeModal
          showModal={showEditAssigneeQAModal}
          handleCloseModal={handleCloseAddAssigneeModal}
          qaItem={qaItem}
          handleUpdateAssignee={handleUpdateAssignee}
        />

        <RetryUploadVideo />

        <CompressProgressModal
          isVisble={Boolean(compressState)}
          totalFilesNumber={compressState?.totalProgress ?? 1}
          currentFileNumber={compressState?.currentProgress ?? 0}
          type="inline"
        />
      </StyledQADetailPageContainer>
    </QADetailContext.Provider>
  );
  // return null;
};

export const useQADetailContext = () =>
  useContext(QADetailContext) as QADetailContextValue;
export default QADetail;

const styles = StyleSheet.create({
  fieldWrapper: {
    width: '100%',
    display: 'flex',
  },
  listStyle: {width: '100%', flex: 1},
  landscapeViewWrapper: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
});
