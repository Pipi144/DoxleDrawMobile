import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {TQATabStack} from '../../../Routes/QARouteType';
import {QAList} from '../../../../../Models/qa';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import useSetQAListQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetQAListQueryData';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

type Props = {qaListItem: QAList};

const useProjectQAListItem = ({qaListItem}: Props) => {
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const {company} = useCompany();
  const {accessToken} = useAuth();

  const {handleDeleteQAList, handleEditQAList} = useSetQAListQueryData({});

  const updateQAListQuery = QAQueryAPI.useUpdateQAListQuery({
    company,
    accessToken,
  });

  const handleUpdateCompleteQAList = (value: boolean) => {
    updateQAListQuery.mutate({
      qaList: qaListItem,
      updateParams: {
        completed: value,
      },
    });

    setTimeout(() => {
      handleEditQAList({...qaListItem, completed: !qaListItem.completed});
    }, 300);
  };
  const deleteQaListQuery = QAQueryAPI.useDeleteQAListQuery({
    company,
    accessToken,
    // showNotification,
  });
  const handleDeleteQaList = () => {
    handleDeleteQAList(qaListItem);
    deleteQaListQuery.mutate(qaListItem.defectListId);
  };
  const handlePressQAListItemRow = () => {
    navigation.navigate('QAListDetails', {qaListItem});
  };

  return {
    handlePressQAListItemRow,
    handleDeleteQaList,
    handleUpdateCompleteQAList,
  };
};

export default useProjectQAListItem;

const styles = StyleSheet.create({});
