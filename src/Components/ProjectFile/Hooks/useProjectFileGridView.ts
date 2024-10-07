import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useGetProjectFolderQuery from './useGetProjectFolderQuery';
import useGetProjectFileQuery from './useGetProjectFileQuery';

type Props = {};

interface GridBottomSection {
  isLoaderShow: boolean;
  handleRefetchList: () => void;
  isListRefetching: boolean;
}
const useProjectFileGridView = (props: Props): GridBottomSection => {
  const {isFetchingFolderList, refetchFolderList, isRefetchingFolderList} =
    useGetProjectFolderQuery({});

  const {
    isFetchingFileList,

    refetchFileList,
    isRefetchingFileList,
  } = useGetProjectFileQuery({});
  const isLoaderShow = Boolean(isFetchingFolderList || isFetchingFileList);

  const handleRefetchList = () => {
    refetchFolderList();
    refetchFileList();
  };

  const isListRefetching = isRefetchingFolderList || isRefetchingFileList;
  return {
    isLoaderShow,
    handleRefetchList,
    isListRefetching,
  };
};

export default useProjectFileGridView;

const styles = StyleSheet.create({});
