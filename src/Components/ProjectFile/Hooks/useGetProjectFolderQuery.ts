import {useIsFocused} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';

import {shallow, useShallow} from 'zustand/shallow';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../DesignPattern/Notification/Notification';
import FilesAPI from '../../../API/fileQueryAPI';
import {useNotification} from '../../../Providers/NotificationProvider';

type Props = {};

const useGetProjectFolderQuery = (props: Props) => {
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
    useShallow(state => ({
      filterProjectFolderQuery: state.filterProjectFolderQuery,
    })),
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
      getFolderListQuery.isSuccess ? getFolderListQuery.data?.data ?? [] : [],
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
