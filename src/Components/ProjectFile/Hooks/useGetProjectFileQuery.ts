import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useNotification} from '../../../Providers/NotificationProvider';
import FilesAPI from '../../../API/fileQueryAPI';

type Props = {};

const useGetProjectFileQuery = (props: Props) => {
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {filterProjectFileQuery} = useProjectFileStore(
    useShallow(state => ({
      filterProjectFileQuery: state.filterProjectFileQuery,
    })),
  );
  const isFocused = useIsFocused();
  const getFileListQuery = FilesAPI.useGetFilesQuery({
    company,
    accessToken,

    filter: filterProjectFileQuery,
    enable: Boolean(filterProjectFileQuery.projectId && isFocused),
  });

  const fileListSuccess = useMemo(
    () =>
      getFileListQuery.isSuccess
        ? getFileListQuery.data?.pages.flatMap(p => p?.data.results ?? [])
        : [],
    [getFileListQuery.data],
  );
  const refetchFileList = () => {
    getFileListQuery.refetch();
  };
  return {
    fileListSuccess,
    isFetchingFileList: getFileListQuery.isLoading,
    isSuccessFetchingFileList: getFileListQuery.isSuccess,
    isErrorFetchingFileList: getFileListQuery.isError,
    handleFetchNextPage: () => {
      if (getFileListQuery.hasNextPage) getFileListQuery.fetchNextPage();
    },
    isFetchingNextPage: getFileListQuery.isFetchingNextPage,
    refetchFileList,
    isRefetchingFileList: getFileListQuery.isRefetching,
  };
};

export default useGetProjectFileQuery;
