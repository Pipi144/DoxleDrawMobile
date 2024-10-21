import {StyleSheet} from 'react-native';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {shallow, useShallow} from 'zustand/shallow';
import {useIsMutating} from '@tanstack/react-query';
import {QA} from '../../../../../Models/qa';
import {
  getQAItemListMutationKey,
  UpdateDefectItemParams,
} from '../../../../../API/qaQueryAPI';

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
    useShallow(state => ({
      setShowEditAssigneeQAModal: state.setShowEditAssigneeQAModal,
    })),
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
