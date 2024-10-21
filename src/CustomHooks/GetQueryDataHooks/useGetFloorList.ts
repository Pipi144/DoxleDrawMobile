import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {IFilterGetFloorListQuery} from '../../Models/location';
import {useCompany} from '../../Providers/CompanyProvider';
import {useAuth} from '../../Providers/AuthProvider';
import LocationAPI from '../../API/locationQueryAPI';

type Props = {
  filter: IFilterGetFloorListQuery;
};

const useGetFloorList = ({filter}: Props) => {
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const getFloorQuery = LocationAPI.useRetrieveFloorList({
    accessToken,
    company,
    filter,
    enableQuery: Boolean(filter.project),
  });

  const floorList = useMemo(
    () =>
      getFloorQuery.isSuccess
        ? getFloorQuery.data.pages.flatMap(data => data.data.results)
        : [],
    [getFloorQuery.data],
  );
  const fetchNextPageFloor = () => {
    if (getFloorQuery.hasNextPage) getFloorQuery.fetchNextPage();
  };
  return {
    floorList,
    isFetchingFloorList: getFloorQuery.isLoading,
    isSuccessFetchingFloorList: getFloorQuery.isSuccess,
    isErrorFetchingFloorList: getFloorQuery.isError,
    refetchFloorList: getFloorQuery.refetch,
    isRefetchingFloorList: getFloorQuery.isRefetching,
    fetchNextPageFloor,
    isFetchingNextPageFloor: getFloorQuery.isFetchingNextPage,
  };
};

export default useGetFloorList;

const styles = StyleSheet.create({});
