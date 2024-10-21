import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import QAProjectPopupMenu from '../../QAPopupMenu/QAProjectPopupMenu';
import {QAList} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';
import {useShallow} from 'zustand/shallow';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useAuth} from '../../../../../Providers/AuthProvider';
import QAQueryAPI, {FilterGetQAListQuery} from '../../../../../API/qaQueryAPI';
import {useFocusEffect} from '@react-navigation/native';

type Props = {};

const useProjectQAList = (props: Props) => {
  const [editedQAList, setEditedQAList] = useState<QAList | undefined>(
    undefined,
  );
  const [searchInput, setSearchInput] = useState('');
  const {handleCachingQAProject, handleCollectExpiredQAListFolder} =
    useCacheQAContext();

  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );
  const {
    setFilterQAListQuery,

    showAddQAListHeader,
    setShowAddQAListHeader,
    setFilterGetQAItems,
  } = useProjectQAStore(
    useShallow(state => ({
      setFilterQAListQuery: state.setFilterQAListQuery,
      showAddQAListHeader: state.showAddQAListHeader,
      setShowAddQAListHeader: state.setShowAddQAListHeader,
      setFilterGetQAItems: state.setFilterGetQAItems,
    })),
  );

  const {company, selectedProject} = useCompany();

  const {accessToken} = useAuth();
  const filterQAListQuery: FilterGetQAListQuery = useMemo(
    () => ({
      projectId: selectedProject?.projectId || '',
      searchText: searchInput,
      order_by: ['completed', '-created_on'],
    }),
    [selectedProject, searchInput],
  );
  //* useefect to update filter getting qa list to store
  useEffect(() => {
    setFilterQAListQuery(filterQAListQuery);
  }, [filterQAListQuery]);

  const getServerQAListQuery = QAQueryAPI.useRetrieveQAListQuery({
    accessToken,
    company,
    filter: filterQAListQuery,
    enableQuery: Boolean(selectedProject !== undefined),
  });

  const qaList: QAList[] = useMemo(
    () =>
      getServerQAListQuery.isSuccess
        ? getServerQAListQuery.data.pages
            .flatMap(page => page.data.results)
            .sort((a, b) => (a.completed ? 1 : -1))
        : [],
    [getServerQAListQuery.data],
  );

  const handleRefetchQAList = () => {
    getServerQAListQuery.refetch();
  };
  const fetchMoreQAList = () => {
    if (getServerQAListQuery.hasNextPage) getServerQAListQuery.fetchNextPage();
  };
  //* useEffect run initial to save project info to local

  const {
    handleDeleteExpiredProjectFolder,
    handleDeleteExpiredQAListFolder,
    handleDeleteExpiredQAFolder,
    handleDeleteQAImageFolder,
  } = useCacheQAContext();
  const handleDeleteExpiredFile = async () => {
    //!delete from most inner child folder to parent folder
    await handleDeleteQAImageFolder();
    await handleDeleteExpiredQAFolder();
    await handleDeleteExpiredQAListFolder();
    await handleDeleteExpiredProjectFolder();
  };
  useEffect(() => {
    return () => {
      handleDeleteExpiredFile();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      setOveridenRouteName(undefined);
      if (selectedProject) {
        //cache project folder if visit this project, if project folder is already created, reset the expired date to the next 14 days
        handleCachingQAProject(selectedProject);

        //in case the project folder is already created, if there are qa list folder created, collecting all the expired one
        handleCollectExpiredQAListFolder(selectedProject);

        setFilterGetQAItems({
          assignee: undefined,
          floor: undefined,
        });
      }
      setBackBtn(null);
      setCustomisedPopupMenu(<QAProjectPopupMenu />);
      return () => {};
    }, [selectedProject]),
  );

  return {
    qaList,
    isSuccessFetchingQAList: getServerQAListQuery.isSuccess,
    isErrorFetchingQAList: getServerQAListQuery.isError,
    isFetchingQAList: getServerQAListQuery.isLoading,

    showAddQAListHeader,
    handleRefetchQAList,
    isRefetchingQAList: getServerQAListQuery.isRefetching,
    fetchMoreQAList,
    isFetchingMoreQAList: getServerQAListQuery.isFetchingNextPage,

    setShowAddQAListHeader,
    editedQAList,
    setEditedQAList,
    setSearchInput,
  };
};

export default useProjectQAList;

const styles = StyleSheet.create({});
