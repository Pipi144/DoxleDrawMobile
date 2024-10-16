import {StyleSheet} from 'react-native';
import useGetProjectFolderQuery from '../../../Hooks/useGetProjectFolderQuery';
import useGetProjectFileQuery from '../../../Hooks/useGetProjectFileQuery';

type Props = {};

const useProjectFileListView = (props: Props) => {
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
  return {isLoaderShow, handleRefetchList, isListRefetching};
};

export default useProjectFileListView;

const styles = StyleSheet.create({});
