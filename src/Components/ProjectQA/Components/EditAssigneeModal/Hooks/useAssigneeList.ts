import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {Contact} from '../../../../../Models/contacts';
import ContactQueryAPI, {
  FilterRetrieveContactQuery,
} from '../../../../../API/contactQueryAPI';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';

type Props = {searchAssigneeText: string};
interface AssigneeList {
  contactList: Contact[];
  isFetchingContactList: boolean;
  isSuccessFetchingContactList: boolean;
  isErrorFetchingContactList: boolean;
  hasNextPageContact: boolean | undefined;
  fetchNextPageFunction: () => void;
  isFetchingNextPage: boolean;

  filterRetrieveContactListQuery: FilterRetrieveContactQuery;
}
const useAssigneeList = ({searchAssigneeText}: Props): AssigneeList => {
  const {company} = useCompany();
  const {accessToken, user} = useAuth();

  const filterRetrieveContactListQuery: FilterRetrieveContactQuery = useMemo(
    () => ({
      searchInput: searchAssigneeText,
    }),
    [searchAssigneeText],
  );
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

  const fetchNextPageFunction = () => {
    if (getContactQuery.hasNextPage) getContactQuery.fetchNextPage();
  };

  return {
    contactList,
    isFetchingContactList: getContactQuery.isLoading,
    isSuccessFetchingContactList: getContactQuery.isSuccess,
    isErrorFetchingContactList: getContactQuery.isError,
    hasNextPageContact: getContactQuery.hasNextPage,
    fetchNextPageFunction,
    isFetchingNextPage: getContactQuery.isFetchingNextPage,

    filterRetrieveContactListQuery,
  };
};

export default useAssigneeList;

const styles = StyleSheet.create({});
