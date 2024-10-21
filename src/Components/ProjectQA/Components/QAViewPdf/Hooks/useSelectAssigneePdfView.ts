import {StyleSheet} from 'react-native';
import {useEffect, useMemo, useState} from 'react';
import {Contact} from '../../../../../Models/contacts';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import useThrottlingSearch from '../../../../../CustomHooks/useThrottlingSearch';
import ContactQueryAPI, {
  FilterRetrieveContactQuery,
} from '../../../../../API/contactQueryAPI';
import useSetContactsQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetContactsQueryData';

type Props = {};
interface SelectAssigneePdfView {
  handleSearchAssigneeTextChange: (value: string) => void;
  contactList: Contact[];
  hasNextPage: boolean | undefined;
  fetchNextPageAssignee: () => void;
  isFetchingNextPage: boolean;
}
const useSelectAssigneePdfView = (props: Props): SelectAssigneePdfView => {
  const [searchAssigneeText, setSearchAssigneeText] = useState<string>('');
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {searchThrottleValue} = useThrottlingSearch({
    controlledValue: searchAssigneeText,
    delayTime: 500,
  });
  const filterRetrieveContactListQuery: FilterRetrieveContactQuery = useMemo(
    () => ({
      searchInput: searchThrottleValue,
    }),
    [searchThrottleValue],
  );
  const {clearSearchContactQueryData} = useSetContactsQueryData({});
  const getContactQuery = ContactQueryAPI.useRetrieveContactsQuery({
    accessToken,
    company,
    filter: filterRetrieveContactListQuery,
  });
  const contactList: Contact[] = useMemo(
    () =>
      getContactQuery.isSuccess
        ? getContactQuery.data.pages.flatMap(page => page.data.results ?? []) ??
          []
        : [],
    [getContactQuery.data],
  );

  const fetchNextPageAssignee = () => {
    getContactQuery.fetchNextPage();
  };

  const handleSearchAssigneeTextChange = (value: string) => {
    setSearchAssigneeText(value);
  };
  useEffect(() => {
    if (!searchThrottleValue) clearSearchContactQueryData();
  }, [searchThrottleValue]);

  return {
    handleSearchAssigneeTextChange,
    contactList,
    hasNextPage: getContactQuery.hasNextPage,
    fetchNextPageAssignee,
    isFetchingNextPage:
      getContactQuery.isFetchingNextPage || getContactQuery.isLoading,
  };
};

export default useSelectAssigneePdfView;

const styles = StyleSheet.create({});
