import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';

import {shallow} from 'zustand/shallow';
import {DoxleFolder} from '../../../../../../Models/files';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import FilesAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/fileQueryAPI';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import {useProjectFileStore} from '../Store/useProjectFileStore';

type Props = {};
interface IGetDocketFolderQuery {
  folderListSuccess: DoxleFolder[];
  isFetchingFolderList: boolean;
  isSuccessFetchingFolderList: boolean;
  isErrorFetchingFolderList: boolean;
  refetchFolderList: () => void;
  isRefetchingFolderList: boolean;
}
const useGetProjectFolderQuery = (props: Props): IGetDocketFolderQuery => {
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

  const {filterProjectFolderQuery} = useProjectFileStore(
    state => ({
      filterProjectFolderQuery: state.filterProjectFolderQuery,
    }),
    shallow,
  );
  const isFocused = useIsFocused();
  const getFolderListQuery = FilesAPI.useGetFolderQuery({
    company,
    accessToken,
    showNotification,

    filter: filterProjectFolderQuery,
    enable: Boolean(filterProjectFolderQuery.projectId && isFocused),
  });

  const folderListSuccess = useMemo(
    () =>
      getFolderListQuery.isSuccess
        ? (getFolderListQuery.data?.data as DoxleFolder[])
        : [],
    [getFolderListQuery.data],
  );
  const refetchFolderList = () => {
    getFolderListQuery.refetch();
  };
  return {
    folderListSuccess,
    isFetchingFolderList: getFolderListQuery.isLoading,
    isSuccessFetchingFolderList: getFolderListQuery.isSuccess,
    isErrorFetchingFolderList: getFolderListQuery.isError,
    refetchFolderList,
    isRefetchingFolderList: getFolderListQuery.isRefetching,
  };
};

export default useGetProjectFolderQuery;
