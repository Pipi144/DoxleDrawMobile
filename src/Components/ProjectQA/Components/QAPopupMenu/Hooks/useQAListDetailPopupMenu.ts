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
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useShallow} from 'zustand/react/shallow';
import {useCompany} from '../../../../../../../../Providers/CompanyProvider';
import {
  NEW_QA_ITEM_TEMPLATE,
  QA,
  QAList,
} from '../../../../../../../../Models/qa';
import {useAppModalHeaderStore} from '../../../../../../../../GeneralStore/useAppModalHeaderStore';
import {useCacheQAContext} from '../../../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {useAuth} from '../../../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../../../Providers/NotificationProvider';
import useSetQAListDetailQueryData from '../../../../../../../../CustomHooks/SetQueryDataHooks/useSetQAListDetailQueryData';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TQATabStack} from '../../../Routes/QARouteType';
import QAQueryAPI from '../../../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';

type Props = {qaList: QAList};

const useQAListDetailPopupMenu = ({qaList}: Props) => {
  const {company} = useCompany();
  const {accessToken, user} = useAuth();
  const {showNotification} = useNotification();
  const {setOpenPopupMenu} = useAppModalHeaderStore(
    useShallow(state => ({
      setOpenPopupMenu: state.setOpenPopupMenu,
    })),
  );
  const {setQAListViewMode, qaListViewMode, filterGetQAItems} =
    useProjectQAStore(
      useShallow(state => ({
        setQAListViewMode: state.setQAListViewMode,
        qaListViewMode: state.qaListViewMode,
        filterGetQAItems: state.filterGetQAItems,
      })),
    );
  const {
    handleUpdateQAListDetailQueryData,
    qaListDetailQueryData,
    refetchQAListDetailQueryData,
  } = useSetQAListDetailQueryData({qaListId: qaList.defectListId});
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();
  const onAddSuccess = (newQA?: QA) => {
    //update the count of qa list item
    if (qaListDetailQueryData) {
      handleUpdateQAListDetailQueryData({
        unattendedCount: qaListDetailQueryData.unattendedCount + 1,
      });
    } else refetchQAListDetailQueryData();
    if (newQA) {
      setTimeout(() => {
        navigation.navigate('QAItemDetails', {
          qaItem: newQA,
        });
      }, 350);
    }
  };
  //add qa item query
  const addQaItemQuery = QAQueryAPI.useAddQAItemQuery({
    showNotification,
    company,
    accessToken,
    onSuccessCB: onAddSuccess,
  });

  const handleAddQaItemQuery = () => {
    const newQa = NEW_QA_ITEM_TEMPLATE({
      defectList: qaList.defectListId,
      project: qaList.project,
      company: company?.companyId || '',
      createdBy: user?.userId,
    });
    addQaItemQuery.mutate(newQa);
    setOpenPopupMenu(false);
  };

  const handlePressPdfMenu = () => {
    setOpenPopupMenu(false);
    setTimeout(() => {
      navigation.navigate('QAExportPDF', {
        qaListItem: qaList,
        selectedAssignee: filterGetQAItems.assignee,
        selectedStatus: filterGetQAItems.status,
      });
    }, 100);
  };

  const toggleViewMode = () => {
    setOpenPopupMenu(false);
    setTimeout(() => {
      setQAListViewMode(qaListViewMode === 'list' ? 'grid' : 'list');
    }, 100);
  };
  return {
    handlePressPdfMenu,
    handleAddQaItemQuery,
    setOpenPopupMenu,

    qaListViewMode,
    toggleViewMode,
  };
};

export default useQAListDetailPopupMenu;
