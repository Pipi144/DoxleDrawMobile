import {Platform, RefreshControl, StyleSheet} from 'react-native';
import React, {useCallback, useMemo} from 'react';

import Animated, {FadeInRight, LinearTransition} from 'react-native-reanimated';

import useGetProjectFileInsideFolder from './Hooks/useGetProjectFileInsideFolder';

import DocketFileGridItem from '../ProjectFileDisplayer/ProjectFileGridItem';
import {StyledFolderFilesGridViewContainer} from '../ProjectFileDisplayer/StyledComponentProjectFileDisplayer';
import FileListSkeleton from '../ProjectFileDisplayer/FileListSkeleton';

import EmptyFileScreen from '../AddFileAndFolderEmptyScreen/EmptyFileScreen';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {DoxleFile} from '../../../../Models/files';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import {useProjectFileStore} from '../../Store/useProjectFileStore';
import {useShallow} from 'zustand/shallow';
import {useFileBgUploadStore} from '../../Store/useFileBgUploadStore';
import {TFileBgUploadData} from '../../Provider/StorageModels';
import FilePendingItem from '../ProjectFileDisplayer/FilePendingItem';

type Props = {};

const FolderFilesGridView = (props: Props) => {
  const {deviceSize} = useOrientation();
  const numOfCol = useMemo(
    () =>
      deviceSize.deviceWidth <= 300
        ? 1
        : deviceSize.deviceWidth > 300 && deviceSize.deviceWidth <= 700
        ? 2
        : deviceSize.deviceWidth <= 1024 && deviceSize.deviceWidth > 700
        ? 3
        : 4,
    [deviceSize.deviceWidth],
  );

  const {THEME_COLOR} = useDOXLETheme();

  const {
    filesInsideFolderList,
    filterGetFileInsideFolder,
    isFetchingFileInsideFolder,
    isSuccessFetchingFileInsideFolder,
    isErrorFetchingFileInsideFolder,
    isRefetchingFileInsideFolder,
    handleFetchNextFileInsideFolder,
    refetchFileInsideFolder,
  } = useGetProjectFileInsideFolder({});
  const {currentFolder} = useProjectFileStore(
    useShallow(state => ({currentFolder: state.currentFolder})),
  );
  const {cachedFiles} = useFileBgUploadStore(
    useShallow(state => ({
      cachedFiles: state.cachedFiles,
    })),
  );
  const pendingFiles = useMemo(
    () =>
      cachedFiles.filter(
        item =>
          item.uploadVariant === 'Folder' &&
          item.hostId === currentFolder?.folderId &&
          item.status !== 'success',
      ),
    [currentFolder, cachedFiles],
  );

  //*render List
  const layout = LinearTransition.springify().damping(16);
  const renderItem = useCallback(
    (props: {item: DoxleFile | TFileBgUploadData; index: number}) =>
      (props.item as DoxleFile).fileId !== undefined ? (
        <DocketFileGridItem
          fileItem={props.item as DoxleFile}
          numOfCol={numOfCol}
        />
      ) : (
        <FilePendingItem
          item={props.item as TFileBgUploadData}
          mode="grid"
          numOfCol={numOfCol}
        />
      ),
    [],
  );
  const keyExtractor = useCallback(
    (item: DoxleFile | TFileBgUploadData, index: number) =>
      (item as DoxleFile).fileId !== undefined
        ? `listItem#${(item as DoxleFile).fileId}`
        : (item as TFileBgUploadData).file.fileId,
    [],
  );

  const listEmptyComponent = useMemo(
    () =>
      isErrorFetchingFileInsideFolder ? (
        <DoxleEmptyPlaceholder
          headTitleText="Something Wrong!"
          subTitleText="Failed to fetch file and folder"
          illustrationComponent={
            <ErrorFetchingBanner
              themeColor={THEME_COLOR}
              containerStyle={{
                width: deviceSize.deviceWidth * 0.6,
                maxWidth: 450,
                maxHeight: 500,
              }}
            />
          }
        />
      ) : (
        <EmptyFileScreen />
      ),
    [isErrorFetchingFileInsideFolder, deviceSize.deviceWidth, THEME_COLOR],
  );
  return (
    <StyledFolderFilesGridViewContainer entering={FadeInRight.delay(200)}>
      {isFetchingFileInsideFolder && <FileListSkeleton mode="grid" />}

      {!isFetchingFileInsideFolder && (
        <Animated.FlatList
          data={[...pendingFiles, ...filesInsideFolderList]}
          numColumns={numOfCol}
          extraData={[numOfCol]}
          key={`gridFolderFiles`}
          layout={layout}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={200}
          automaticallyAdjustKeyboardInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
          style={styles.listStyle}
          contentContainerStyle={styles.contentContainerStyle}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={listEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingFileInsideFolder}
              onRefresh={refetchFileInsideFolder}
              colors={
                Platform.OS === 'android'
                  ? [THEME_COLOR.primaryFontColor]
                  : undefined
              }
              tintColor={
                Platform.OS === 'ios' ? THEME_COLOR.primaryFontColor : undefined
              }
              progressBackgroundColor={THEME_COLOR.primaryContainerColor}
            />
          }
        />
      )}
    </StyledFolderFilesGridViewContainer>
  );
};

export default FolderFilesGridView;

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    height: '100%',
  },
  contentContainerStyle: {flexGrow: 1},
});
