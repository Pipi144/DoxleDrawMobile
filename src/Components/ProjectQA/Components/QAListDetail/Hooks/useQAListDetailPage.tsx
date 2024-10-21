import {StyleSheet} from 'react-native';
import {useCallback, useMemo, useState} from 'react';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import QAListDetailPopupMenu from '../../QAPopupMenu/QAListDetailPopupMenu';

import {QASelectedAssignee} from '../../EditAssigneeModal/Hooks/useEditAssigneeModal';
import {QA, QAList} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useShallow} from 'zustand/shallow';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {qaListItem: QAList};

const useQAListDetailPage = ({qaListItem}: Props) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedQAForAssignee, setSelectedQAForAssignee] = useState<
    QA | undefined
  >(undefined);
  const [searchInput, setSearchInput] = useState('');
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {setQAImageList, filterGetQAItems, setFilterGetQAItems} =
    useProjectQAStore(
      useShallow(state => ({
        setQAImageList: state.setQAImageList,
        filterGetQAItems: state.filterGetQAItems,
        setFilterGetQAItems: state.setFilterGetQAItems,
      })),
    );
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );

  const {handleCachingQAList, handleCollectExpiredQAFolder} =
    useCacheQAContext();
  const getQAListDetail = QAQueryAPI.useRetrieveQAListDetailQuery({
    company,
    accessToken,
    defectListId: qaListItem.defectListId,
    assignee: filterGetQAItems?.assignee?.contactId,
  });

  const qaItemDetail = useMemo(
    () => (getQAListDetail.isSuccess ? getQAListDetail.data.data : qaListItem),
    [getQAListDetail.data],
  );
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,
  });

  const handleUpdateAssignee = (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => {
    if (selectedQAForAssignee) {
      if (selectedAssignee)
        updateQAQuery.mutate({
          assignee: selectedAssignee.assigneeId,
          assigneeName: selectedAssignee.assigneeName,
          defectId: selectedQAForAssignee.defectId,
        });
      else
        updateQAQuery.mutate({
          assignee: null,
          assigneeName: '',
          defectId: selectedQAForAssignee.defectId,
        });
    }
  };
  const completedCount = qaItemDetail.completedCount ?? 0;
  const unattendedCount = qaItemDetail.unattendedCount ?? 0;
  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(
        <QAListDetailPopupMenu
          qaList={qaListItem}
          setShowFilter={setShowFilter}
        />,
      );
      return () => {};
    }, [qaListItem]),
  );
  const navigation = useNavigation();
  const handleNavBack = () => {
    navigation.goBack();
    setBackBtn(null);
  };
  useFocusEffect(
    useCallback(() => {
      handleCachingQAList(qaListItem);
      handleCollectExpiredQAFolder(qaListItem);
      setQAImageList([]);

      setOveridenRouteName(qaListItem.defectListTitle);
      setBackBtn({
        onPress: handleNavBack,
      });
    }, [qaListItem]),
  );
  return {
    filterGetQAItems,
    completedCount,
    unattendedCount,
    showFilter,
    setShowFilter,
    setFilterGetQAItems,
    handleUpdateAssignee,
    showAssigneeModal: selectedQAForAssignee !== undefined,
    closeAssigneeModal: () => setSelectedQAForAssignee(undefined),
    selectedQAForAssignee,
    setSelectedQAForAssignee,
    setSearchInput,
  };
};

export default useQAListDetailPage;

const styles = StyleSheet.create({});
