import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {IFilterGetRoomListQuery} from '../../Models/location';
import {useCompany} from '../../Providers/CompanyProvider';
import {useAuth} from '../../Providers/AuthProvider';
import LocationAPI from '../../API/locationQueryAPI';

type Props = {
  filter: IFilterGetRoomListQuery;
};

const useGetRoomList = ({filter}: Props) => {
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const getRoomQuery = LocationAPI.useRetrieveRoomList({
    accessToken,
    company,
    filter,
    enableQuery: Boolean(filter.project),
  });

  const roomList = useMemo(
    () =>
      getRoomQuery.isSuccess
        ? getRoomQuery.data.pages.flatMap(data => data.data.results)
        : [],
    [getRoomQuery.data],
  );
  const fetchNextPageRoom = () => {
    if (getRoomQuery.hasNextPage) getRoomQuery.fetchNextPage();
  };
  return {
    roomList,
    isFetchingRoomList: getRoomQuery.isLoading,
    isSuccessFetchingRoomList: getRoomQuery.isSuccess,
    isErrorFetchingRoomList: getRoomQuery.isError,
    refetchRoomList: getRoomQuery.refetch,
    isRefetchingRoomList: getRoomQuery.isRefetching,
    fetchNextPageRoom,
    isFetchingNextPageRoom: getRoomQuery.isFetchingNextPage,
  };
};

export default useGetRoomList;

const styles = StyleSheet.create({});
