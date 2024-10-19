import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Contact} from '../../../../../../Models/contacts';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import ContactQueryAPI, {
  FilterRetrieveContactQuery,
} from '../../../../../../service/DoxleAPI/QueryHookAPI/contactQueryAPI';

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

  const fetchNextPageAssignee = () => {
    getContactQuery.fetchNextPage();
  };

  const handleSearchAssigneeTextChange = (value: string) => {
    setSearchAssigneeText(value);
  };

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
