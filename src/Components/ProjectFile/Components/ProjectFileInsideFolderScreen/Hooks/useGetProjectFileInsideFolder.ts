import {useIsFocused} from '@react-navigation/native';
import {useMemo} from 'react';

import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import FilesAPI, {
  IFilterGetFileQueryFilter,
} from '../../../../../API/fileQueryAPI';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';

type Props = {
  search?: string;
};

const useGetProjectFileInsideFolder = ({search}: Props) => {
  const {accessToken} = useAuth();
  const {company} = useCompany();

  const {currentFolder} = useProjectFileStore(
    useShallow(state => ({
      currentFolder: state.currentFolder,
    })),
  );
  const filterGetFileInsideFolder: IFilterGetFileQueryFilter = useMemo(
    () => ({
      folderId: currentFolder ? currentFolder.folderId : undefined,
      search,
    }),
    [currentFolder, search],
  );
  const isFocused = useIsFocused();
  const {synchronizeCachedFiles} = useFileBgUploadStore(
    useShallow(state => ({
      synchronizeCachedFiles: state.synchronizeCachedFiles,
    })),
  );
  const getFilesInsideFolderQuery = FilesAPI.useGetFilesInsideFolderQuery({
    company,
    accessToken,
    filter: filterGetFileInsideFolder,
    enable: Boolean(currentFolder && isFocused),
    onSuccessCallback: synchronizeCachedFiles,
  });

  const filesInsideFolderList = useMemo(
    () =>
      getFilesInsideFolderQuery.isSuccess
        ? getFilesInsideFolderQuery.data?.pages.flatMap(
            data => data?.data.results ?? [],
          )
        : [],
    [getFilesInsideFolderQuery.data],
  );
  const refetchFileInsideFolder = () => {
    getFilesInsideFolderQuery.refetch();
  };
  return {
    filesInsideFolderList,
    filterGetFileInsideFolder,
    isFetchingFileInsideFolder: getFilesInsideFolderQuery.isLoading,
    isSuccessFetchingFileInsideFolder: getFilesInsideFolderQuery.isSuccess,
    isErrorFetchingFileInsideFolder: getFilesInsideFolderQuery.isError,
    isRefetchingFileInsideFolder: getFilesInsideFolderQuery.isRefetching,
    handleFetchNextFileInsideFolder: () => {
      if (getFilesInsideFolderQuery.hasNextPage)
        getFilesInsideFolderQuery.fetchNextPage();
    },
    refetchFileInsideFolder,
  };
};

export default useGetProjectFileInsideFolder;
