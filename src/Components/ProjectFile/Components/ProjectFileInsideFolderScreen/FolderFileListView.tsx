import {Platform, RefreshControl, StyleSheet} from 'react-native';
import React, {useCallback, useMemo} from 'react';

import Animated, {FadeInLeft, LinearTransition} from 'react-native-reanimated';

import useGetProjectFileInsideFolder from '../../Hooks/useGetProjectFileInsideFolder';

import ProjectFileListItem from '../ProjectFileDisplayer/ProjectFileListItem';
import {StyledFolderFileListViewContainer} from '../ProjectFileDisplayer/StyledComponentProjectFileDisplayer';
import FileListSkeleton from '../ProjectFileDisplayer/FileListSkeleton';

import EmptyFileScreen from '../AddFileAndFolderEmptyScreen/EmptyFileScreen';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {DoxleFile} from '../../../../Models/files';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import {useFileBgUploadStore} from '../../Store/useFileBgUploadStore';
import {useShallow} from 'zustand/shallow';
import {useProjectFileStore} from '../../Store/useProjectFileStore';
import {TFileBgUploadData} from '../../Provider/StorageModels';
import FilePendingItem from '../ProjectFileDisplayer/FilePendingItem';

const FolderFileListView = () => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceSize} = useOrientation();
  const {
    filesInsideFolderList,
    isFetchingFileInsideFolder,
    isErrorFetchingFileInsideFolder,
    isRefetchingFileInsideFolder,
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
        <ProjectFileListItem fileItem={props.item as DoxleFile} />
      ) : (
        <FilePendingItem item={props.item as TFileBgUploadData} />
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
    [isErrorFetchingFileInsideFolder, deviceSize.deviceWidth],
  );
  return (
    <StyledFolderFileListViewContainer entering={FadeInLeft.delay(200)}>
      {isFetchingFileInsideFolder && <FileListSkeleton />}

      {!isFetchingFileInsideFolder && (
        <Animated.FlatList
          data={[...pendingFiles, ...filesInsideFolderList]}
          itemLayoutAnimation={layout}
          initialNumToRender={8}
          maxToRenderPerBatch={4}
          style={styles.listStyle}
          contentContainerStyle={styles.contentContainerStyle}
          automaticallyAdjustKeyboardInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          updateCellsBatchingPeriod={200}
          ListEmptyComponent={listEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingFileInsideFolder}
              onRefresh={refetchFileInsideFolder}
              // size={16}
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
          key={'fileInsideFolder'}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </StyledFolderFileListViewContainer>
  );
};

export default FolderFileListView;

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    height: '100%',
  },
  contentContainerStyle: {flexGrow: 1},
});
