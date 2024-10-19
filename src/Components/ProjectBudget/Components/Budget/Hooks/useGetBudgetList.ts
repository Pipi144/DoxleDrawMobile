import {StyleSheet} from 'react-native';
import {useEffect, useMemo} from 'react';

import {useShallow} from 'zustand/react/shallow';
import {useBudgetStore} from '../../../Store/useBudgetStore';
import {LightDocket} from '../../../../../Models/docket';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useIsFocused} from '@react-navigation/native';
import DocketQuery from '../../../../../API/docketQueryAPI';

type Props = {};

interface GetBudgetList {
  docketBudgetList: LightDocket[];
  hasNextPage: boolean;
  handleFetchNextPageBudget: () => void;
  isFetchingNextPageBudget: boolean;
  isFetchingBudgetList: boolean;
  isSuccessFetchingBudgetList: boolean;
  isErrorFetchingBudgetList: boolean;
  refetchBudgetList: () => void;
  isRefetchingBudgetList: boolean;
}
const useGetBudgetList = (props: Props): GetBudgetList => {
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const {company, selectedProject} = useCompany();
  const {filterBudgetList} = useBudgetStore(
    useShallow(state => ({
      filterBudgetList: state.filterBudgetList,
    })),
  );

  const isFocused = useIsFocused();
  const docketBudgetListQuery = DocketQuery.useRetrieveFullDetailDocketList({
    accessToken,
    filter: filterBudgetList,
    company,
    showNotification,
    enable: isFocused,
  });

  const docketBudgetList = useMemo(
    () =>
      docketBudgetListQuery.data?.pages
        .flatMap(page => page.data?.results ?? [])
        .sort((a, b) => (a.isSticky ? -1 : 0)) ?? [],
    [docketBudgetListQuery.data],
  );

  const handleFetchNextPageBudget = () => {
    if (docketBudgetListQuery.hasNextPage)
      docketBudgetListQuery.fetchNextPage();
  };

  const refetchBudgetList = () => {
    docketBudgetListQuery.refetch();
  };

  return {
    docketBudgetList,
    hasNextPage: Boolean(docketBudgetListQuery.hasNextPage),
    handleFetchNextPageBudget,
    isFetchingBudgetList: docketBudgetListQuery.isLoading,
    isSuccessFetchingBudgetList: docketBudgetListQuery.isSuccess,
    isErrorFetchingBudgetList: docketBudgetListQuery.isError,
    isFetchingNextPageBudget: docketBudgetListQuery.isFetchingNextPage,
    refetchBudgetList,
    isRefetchingBudgetList: docketBudgetListQuery.isRefetching,
  };
};

export default useGetBudgetList;

const styles = StyleSheet.create({});
