// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useShallow} from 'zustand/react/shallow';
import {TFilterQAItemsQuery} from '../../../../../API/qaQueryAPI';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import useThrottlingSearch from '../../../../../CustomHooks/useThrottlingSearch';
import ContactQueryAPI from '../../../../../API/contactQueryAPI';
import {Contact} from '../../../../../Models/contacts';
import useGetFloorList from '../../../../../CustomHooks/GetQueryDataHooks/useGetFloorList';
import {TQAStatus} from '../../../../../Models/qa';
import {produce} from 'immer';
import {IProjectFloor} from '../../../../../Models/location';

type Props = {showModal: boolean; closeModal: () => void};

const useFilterQAModal = ({showModal, closeModal}: Props) => {
  const [editFilter, setEditFilter] = useState<
    Omit<TFilterQAItemsQuery, 'defectListId'>
  >({});
  const [expandAssignee, setExpandAssignee] = useState(false);
  const [expandFloor, setExpandFloor] = useState(false);
  const [searchContactText, setSearchContactText] = useState('');
  const [searchFloorText, setSearchFloorText] = useState('');
  const {company, selectedProject} = useCompany();
  const {accessToken} = useAuth();
  const {filterGetQAItems, setFilterGetQAItems} = useProjectQAStore(
    useShallow(state => ({
      filterGetQAItems: state.filterGetQAItems,
      setFilterGetQAItems: state.setFilterGetQAItems,
    })),
  );
  const {searchThrottleValue: searchContactThrottleValue} = useThrottlingSearch(
    {
      controlledValue: searchContactText,
      delayTime: 300,
    },
  );
  const {searchThrottleValue: searchFloorThrottleValue} = useThrottlingSearch({
    controlledValue: searchFloorText,
    delayTime: 300,
  });
  const getContactQuery = ContactQueryAPI.useRetrieveContactsQuery({
    accessToken,
    company,
    filter: {
      searchInput: searchContactThrottleValue,
    },
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
  const floorQuery = useGetFloorList({
    filter: {
      project: selectedProject?.projectId,
      search: searchFloorThrottleValue,
    },
  });

  const handleSelectStatus = (status: TQAStatus) => {
    setEditFilter(
      produce(draft => {
        if (draft.status !== status) draft.status = status;
        else draft.status = undefined;
        return draft;
      }),
    );
  };

  const handleSelectAssignee = useCallback((item: Contact) => {
    setEditFilter(
      produce(draft => {
        if (draft.assignee?.contactId === item.contactId) {
          draft.assignee = undefined;
        } else draft.assignee = item;
        return draft;
      }),
    );
  }, []);
  const handleFilterFloor = useCallback(
    (floor: 'none' | 'not-none' | IProjectFloor) => {
      setEditFilter(
        produce(draft => {
          if (
            (floor === 'none' && draft.floor === 'none') ||
            (floor === 'not-none' && draft.floor === 'not-none') ||
            (typeof floor === 'object' &&
              typeof draft.floor === 'object' &&
              draft.floor.floorId === floor.floorId)
          ) {
            draft.floor = undefined;
          } else {
            draft.floor = floor;
          }
          return draft;
        }),
      );
    },
    [],
  );

  const applyFilter = () => {
    closeModal();
    setTimeout(() => {
      setFilterGetQAItems({...editFilter});
    }, 200);
  };
  useEffect(() => {
    if (showModal) setEditFilter({...filterGetQAItems});
  }, [showModal, filterGetQAItems]);

  return {
    editFilter,
    handleSelectStatus,
    expandAssignee,
    setExpandAssignee,
    contactList,
    isFetchingContactList: getContactQuery.isLoading,
    isSuccessFetchingContactList: getContactQuery.isSuccess,
    isErrorFetchingContactList: getContactQuery.isError,
    hasNextPageContact: getContactQuery.hasNextPage,
    fetchNextPageFunction,
    isFetchingNextPage: getContactQuery.isFetchingNextPage,
    searchContactText,
    setSearchContactText,
    searchFloorText,
    setSearchFloorText,
    handleSelectAssignee,
    ...floorQuery,
    handleFilterFloor,
    applyFilter,
    expandFloor,
    setExpandFloor,
  };
};

export default useFilterQAModal;
