import {Platform, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import useGetProjectFolderQuery from '../../Hooks/useGetProjectFolderQuery';
import useGetProjectFileQuery from '../../Hooks/useGetProjectFileQuery';
import useProjectFileGridView from '../../Hooks/useProjectFileGridView';
import Animated, {
  FadeInRight,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import ProjectFileGridItem from './ProjectFileGridItem';
import FileListSkeleton from './FileListSkeleton';
import {StyledProjectFileGridView} from './StyledComponentProjectFileDisplayer';

import EmptyFileScreen from '../AddFileAndFolderEmptyScreen/EmptyFileScreen';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {DoxleFile, DoxleFolder} from '../../../../Models/files';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';

type Props = {};

const ProjectFileGridView = (props: Props) => {
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
  const {folderListSuccess, isErrorFetchingFolderList} =
    useGetProjectFolderQuery({});

  const {fileListSuccess, isErrorFetchingFileList, isFetchingFileList} =
    useGetProjectFileQuery({});

  const combinedFileFolders: Array<DoxleFile | DoxleFolder> = useMemo(
    () => [
      ...folderListSuccess.sort((a, b) =>
        a.folderName < b.folderName ? -1 : 1,
      ),
      ...fileListSuccess.sort((a, b) => (a.fileName < b.fileName ? -1 : 1)),
    ],
    [folderListSuccess, fileListSuccess],
  );

  const {isLoaderShow, handleRefetchList, isListRefetching} =
    useProjectFileGridView({});
  //* render list
  const layout = LinearTransition.springify().damping(16);
  const renderItem = useCallback(
    (props: {item: DoxleFile | DoxleFolder; index: number}) =>
      (props.item as DoxleFile).fileId !== undefined ? (
        <ProjectFileGridItem
          fileItem={props.item as DoxleFile}
          numOfCol={numOfCol}
        />
      ) : (
        <ProjectFileGridItem
          folderItem={props.item as DoxleFolder}
          numOfCol={numOfCol}
        />
      ),
    [numOfCol],
  );
  const keyExtractor = useCallback(
    (item: DoxleFile | DoxleFolder, index: number) =>
      (item as DoxleFolder).folderId !== undefined
        ? `gridItem#${(item as DoxleFolder).folderId}`
        : `gridItem#${(item as DoxleFile).fileId}`,
    [],
  );
  const listEmptyComponent = useMemo(
    () =>
      isErrorFetchingFolderList && isErrorFetchingFileList ? (
        <DoxleEmptyPlaceholder
          headTitleText="Something Wrong!"
          subTitleText="Failed to fetch file and folder"
          illustrationComponent={
            <ErrorFetchingBanner themeColor={THEME_COLOR} />
          }
        />
      ) : (
        <EmptyFileScreen />
      ),
    [isErrorFetchingFolderList, isErrorFetchingFileList, THEME_COLOR],
  );
  return (
    <StyledProjectFileGridView
      entering={FadeInRight}
      exiting={FadeOutRight}
      layout={layout}>
      {isLoaderShow ? (
        <FileListSkeleton mode="grid" />
      ) : (
        <Animated.FlatList
          data={combinedFileFolders}
          contentContainerStyle={styles.contentContainerStyle}
          keyExtractor={keyExtractor}
          numColumns={numOfCol}
          extraData={[numOfCol]}
          style={styles.listStyle}
          itemLayoutAnimation={layout}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={4}
          automaticallyAdjustKeyboardInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          updateCellsBatchingPeriod={200}
          ListEmptyComponent={listEmptyComponent}
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
    </StyledProjectFileGridView>
  );
};

export default ProjectFileGridView;

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    height: '100%',
  },
  contentContainerStyle: {flexGrow: 1},
});
