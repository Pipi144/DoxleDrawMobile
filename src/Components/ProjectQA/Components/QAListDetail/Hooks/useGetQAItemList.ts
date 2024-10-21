import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import QAQueryAPI, {TFilterQAItemsQuery} from '../../../../../API/qaQueryAPI';
import {QAWithFirstImg} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';

type Props = {filter: TFilterQAItemsQuery};
interface QAItemList {
  qaItemList: QAWithFirstImg[];
  isFetchingQAItemList: boolean;
  isSuccessFetchingQAItemList: boolean;
  isErrorFetchingQAItemList: boolean;
  hasNextPage: boolean;
  handleFetchNextPage: () => void;
  isFetchingNextPage: boolean;
  handleRefetchQAList: () => void;
  isRefetchingQAList: boolean;
}
const useGetQAItemList = ({filter}: Props): QAItemList => {
  const {company} = useCompany();
  const {showNotification} = useNotification();

  const {accessToken} = useAuth();
  const getQAItemListQuery = QAQueryAPI.useRetrieveQAItemsQuery({
    showNotification,
    accessToken,
    company,
    filter,
  });

  const qaItemList = useMemo(
    () =>
      getQAItemListQuery.isSuccess
        ? getQAItemListQuery.data.pages.flatMap(page => page.data.results)
        : [],
    [getQAItemListQuery.data],
  );

  const handleRefetchQAList = () => {
    getQAItemListQuery.refetch();
  };
  const handleFetchNextPage = () => {
    if (getQAItemListQuery.hasNextPage) getQAItemListQuery.fetchNextPage();
  };
  return {
    qaItemList,
    isFetchingQAItemList: getQAItemListQuery.isLoading,
    isSuccessFetchingQAItemList: getQAItemListQuery.isSuccess,
    isErrorFetchingQAItemList: getQAItemListQuery.isError,
    hasNextPage: Boolean(getQAItemListQuery.hasNextPage),
    handleFetchNextPage,
    isFetchingNextPage: getQAItemListQuery.isFetchingNextPage,
    handleRefetchQAList,
    isRefetchingQAList: getQAItemListQuery.isRefetching,
  };
};

export default useGetQAItemList;

const styles = StyleSheet.create({});
