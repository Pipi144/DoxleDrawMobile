import {useIsFocused} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';

import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useNotification} from '../../../Providers/NotificationProvider';
import FilesAPI, {IFilterGetFileQueryFilter} from '../../../API/fileQueryAPI';

type Props = {};

const useGetProjectFileInsideFolder = (props: Props) => {
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {notifierRootAppRef} = useNotification();
  //handle show notification

  const {currentFolder} = useProjectFileStore(
    useShallow(state => ({
      currentFolder: state.currentFolder,
    })),
  );
  const filterGetFileInsideFolder: IFilterGetFileQueryFilter = useMemo(
    () => ({
      folderId: currentFolder ? currentFolder.folderId : undefined,
    }),
    [currentFolder],
  );
  const isFocused = useIsFocused();
  const getFilesInsideFolderQuery = FilesAPI.useGetFilesInsideFolderQuery({
    company,
    accessToken,
    filter: filterGetFileInsideFolder,
    enable: Boolean(currentFolder && isFocused),
  });

  const filesInsideFolderList = useMemo(
    () =>
      getFilesInsideFolderQuery.isSuccess
        ? getFilesInsideFolderQuery.data?.pages.flatMap(
            data => data.data.results,
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