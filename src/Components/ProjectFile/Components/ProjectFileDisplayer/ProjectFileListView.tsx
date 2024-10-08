import {Platform, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import useGetProjectFolderQuery from '../../Hooks/useGetProjectFolderQuery';
import useGetProjectFileQuery from '../../Hooks/useGetProjectFileQuery';
import useProjectFileListView from '../../Hooks/useProjectFileListView';
import Animated, {Layout, LinearTransition} from 'react-native-reanimated';
import ProjectFileListItem from './ProjectFileListItem';

import EmptyFileScreen from '../AddFileAndFolderEmptyScreen/EmptyFileScreen';
import {StyledProjectFileListViewContainer} from './StyledComponentProjectFileDisplayer';
import FileListSkeleton from './FileListSkeleton';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {DoxleFile, DoxleFolder} from '../../../../Models/files';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';
import {useFileBgUploadStore} from '../../Store/useFileBgUploadStore';
import {useShallow} from 'zustand/shallow';
import {useCompany} from '../../../../Providers/CompanyProvider';
import {TFileBgUploadData} from '../../Provider/StorageModels';
import FilePendingItem from './FilePendingItem';

type Props = {};

const ProjectFileListView = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceType, deviceSize, isPortraitMode} = useOrientation();
  const {folderListSuccess, isErrorFetchingFolderList, isFetchingFolderList} =
    useGetProjectFolderQuery({});

  const {
    fileListSuccess,
    isErrorFetchingFileList,
    isFetchingFileList,
    handleFetchNextPage,
    isFetchingNextPage,
  } = useGetProjectFileQuery({});
  const {isLoaderShow, handleRefetchList, isListRefetching} =
    useProjectFileListView({});
  const {selectedProject} = useCompany();
  const {cachedFiles} = useFileBgUploadStore(
    useShallow(state => ({
      // cachedProjectFile: state.cachedFiles.filter(
      //   item =>
      //     item.uploadVariant === 'Project' &&
      //     item.hostId === selectedProject?.projectId &&
      //     (item.status === 'pending' || item.status === 'processing'),
      // ),
      cachedFiles: state.cachedFiles,
    })),
  );
  const pendingFiles = useMemo(
    () =>
      cachedFiles.filter(
        item =>
          item.uploadVariant === 'Project' &&
          item.hostId === selectedProject?.projectId &&
          (item.status === 'pending' || item.status === 'processing'),
      ),
    [selectedProject, cachedFiles],
  );
  const combinedFileFolders: Array<
    DoxleFile | DoxleFolder | TFileBgUploadData
  > = useMemo(
    () => [
      ...pendingFiles,
      ...folderListSuccess.sort((a, b) =>
        a.folderName < b.folderName ? -1 : 1,
      ),
      ...fileListSuccess.sort((a, b) => (a.fileName < b.fileName ? -1 : 1)),
    ],
    [folderListSuccess, fileListSuccess, pendingFiles],
  );

  //* render list
  const layout = LinearTransition.springify().damping(16);
  const renderItem = useCallback(
    (props: {
      item: DoxleFile | DoxleFolder | TFileBgUploadData;
      index: number;
    }) =>
      (props.item as DoxleFile).fileId !== undefined ? (
        <ProjectFileListItem fileItem={props.item as DoxleFile} />
      ) : (props.item as DoxleFolder).folderId !== undefined ? (
        <ProjectFileListItem folderItem={props.item as DoxleFolder} />
      ) : (
        <FilePendingItem item={props.item as TFileBgUploadData} />
      ),
    [],
  );
  const keyExtractor = useCallback(
    (item: DoxleFile | DoxleFolder | TFileBgUploadData, index: number) =>
      (item as DoxleFolder).folderId !== undefined
        ? `listItem#${(item as DoxleFolder).folderId}`
        : (item as DoxleFile).fileId !== undefined
        ? `listItem#${(item as DoxleFile).fileId}`
        : (item as TFileBgUploadData).file.fileId,
    [],
  );

  const listEmptyComponent = useMemo(
    () =>
      isErrorFetchingFolderList && isErrorFetchingFileList ? (
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
    [
      isErrorFetchingFolderList,
      isErrorFetchingFileList,
      deviceSize.deviceWidth,
      isPortraitMode,
    ],
  );
  return (
    <StyledProjectFileListViewContainer layout={layout}>
      {isLoaderShow && <FileListSkeleton />}
      {!isLoaderShow && (
        <Animated.FlatList
          itemLayoutAnimation={layout}
          data={combinedFileFolders}
          key={`fileList`}
          keyExtractor={keyExtractor}
          style={styles.listStyle}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={4}
          automaticallyAdjustKeyboardInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          updateCellsBatchingPeriod={200}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={styles.contentContainerStyle}
          onEndReached={handleFetchNextPage}
          refreshControl={
            <RefreshControl
              refreshing={isListRefetching}
              onRefresh={handleRefetchList}
              tintColor={
                Platform.OS === 'ios' ? THEME_COLOR.primaryFontColor : undefined
              }
              colors={
                Platform.OS === 'android'
                  ? [THEME_COLOR.primaryFontColor]
                  : undefined
              }
              progressBackgroundColor={THEME_COLOR.primaryContainerColor}
            />
          }
        />
      )}

      {isFetchingNextPage && (
        <ListLoadingMoreBottom
          containerStyle={styles.preloaderContainer}
          size={44}
        />
      )}
    </StyledProjectFileListViewContainer>
  );
};

export default ProjectFileListView;

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    height: '100%',
  },
  contentContainerStyle: {
    flexGrow: 1,
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
});
