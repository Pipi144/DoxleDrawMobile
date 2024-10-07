import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';

import {shallow} from 'zustand/shallow';
import {DoxleFile} from '../../../../../../Models/files';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import FilesAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/fileQueryAPI';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';

type Props = {};
interface IGetFileQueryRoot {
  fileListSuccess: DoxleFile[];
  isFetchingFileList: boolean;
  isSuccessFetchingFileList: boolean;
  isErrorFetchingFileList: boolean;
  handleFetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetchFileList: () => void;
  isRefetchingFileList: boolean;
}
const useGetProjectFileQuery = (props: Props): IGetFileQueryRoot => {
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {notifierRootAppRef} = useNotification();
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
    ) => {
      notifierRootAppRef.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const {filterProjectFileQuery} = useProjectFileStore(
    useShallow(state => ({
      filterProjectFileQuery: state.filterProjectFileQuery,
    })),
  );
  const isFocused = useIsFocused();
  const getFileListQuery = FilesAPI.useGetFilesQuery({
    company,
    accessToken,
    showNotification,
    filter: filterProjectFileQuery,
    enable: Boolean(filterProjectFileQuery.projectId && isFocused),
  });

  const fileListSuccess = useMemo(
    () =>
      getFileListQuery.isSuccess
        ? getFileListQuery.data?.pages.reduce((acc, data) => {
            return acc.concat(data.data.results);
          }, [] as DoxleFile[])
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
