import {StyleSheet} from 'react-native';
import {QA} from '../../../../../../Models/qa';
import {
  getQAItemListMutationKey,
  UpdateDefectItemParams,
} from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {shallow} from 'zustand/shallow';
import {useIsMutating} from '@tanstack/react-query';

type Props = {
  qaItem: QA;
  handleAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;
};
interface QADetailEditAssignee {
  handleShowAddAssigneeModal: () => void;

  isUpdatingAssignee: boolean;
}
const useQADetailEditAssignee = ({}: Props): QADetailEditAssignee => {
  const {setShowEditAssigneeQAModal} = useProjectQAStore(
    state => ({
      setShowEditAssigneeQAModal: state.setShowEditAssigneeQAModal,
    }),
    shallow,
  );
  const handleShowAddAssigneeModal = () => {
    setShowEditAssigneeQAModal(true);
  };

  const isUpdatingAssignee =
    useIsMutating({
      mutationKey: getQAItemListMutationKey('update'),
      predicate: query =>
        Boolean(
          (query.state.variables as UpdateDefectItemParams).assignee !==
            undefined,
        ),
    }) > 0;

  return {
    handleShowAddAssigneeModal,

    isUpdatingAssignee,
  };
};

export default useQADetailEditAssignee;

const styles = StyleSheet.create({});
