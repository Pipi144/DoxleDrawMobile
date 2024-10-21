import {StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {produce} from 'immer';
import {QA, QAList} from '../../../../../Models/qa';
import {Contact} from '../../../../../Models/contacts';

type Props = {
  qaItem?: QA | QAList;
  handleUpdateAssignee: (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => void;
  handleCloseModal: () => void;
  showModal: boolean;
};

export interface QASelectedAssignee {
  assigneeId: string;
  assigneeName: string;
}
const useEditAssigneeModal = ({
  qaItem,
  handleUpdateAssignee,
  handleCloseModal,
  showModal,
}: Props) => {
  const [selectedAssignee, setSelectedAssignee] = useState<
    QASelectedAssignee | undefined
  >(
    qaItem?.assignee
      ? {assigneeId: qaItem.assignee, assigneeName: qaItem.assigneeName}
      : undefined,
  );

  const [searchAssigneeText, setSearchAssigneeText] = useState<string>('');
  const [showAddAssigneeForm, setShowAddAssigneeForm] =
    useState<boolean>(false);
  const handleSearchAssigneeTextChange = (value: string) => {
    setSearchAssigneeText(value);
  };
  const handleToggleAssigneeForm = () => {
    setShowAddAssigneeForm(prev => !prev);
  };
  const handleCloseAddContactForm = () => {
    setShowAddAssigneeForm(false);
  };
  const handleSelectAssignee = (item: Contact) => {
    setSelectedAssignee({
      assigneeId: item.contactId,
      assigneeName: `${item.firstName} ${item.lastName}`,
    });
  };
  const handleRemoveAssignee = () => {
    setSelectedAssignee(undefined);
  };

  const isAssigneeChanged = Boolean(
    (selectedAssignee &&
      qaItem?.assignee &&
      selectedAssignee.assigneeId !== qaItem.assignee) ||
      (!selectedAssignee && qaItem?.assignee !== null) ||
      (selectedAssignee && qaItem?.assignee === null),
  );

  const handlePressSaveBtn = () => {
    handleCloseModal();
    handleUpdateAssignee(selectedAssignee);
  };
  const handlePressCloseBtn = () => {
    if (showAddAssigneeForm) setShowAddAssigneeForm(false);
    else {
      handleCloseModal();
      setSelectedAssignee(
        qaItem?.assignee
          ? {assigneeId: qaItem.assignee, assigneeName: qaItem.assigneeName}
          : undefined,
      );
    }
  };

  useEffect(() => {
    if (showModal) {
      setSelectedAssignee(
        produce(draft => {
          if (qaItem && qaItem?.assignee) {
            draft = {
              assigneeId: qaItem.assignee,
              assigneeName: qaItem.assigneeName,
            };
          } else draft = undefined;
        }),
      );
    }
  }, [showModal, qaItem]);

  return {
    searchAssigneeText,
    showAddAssigneeForm,
    handleSearchAssigneeTextChange,
    handleToggleAssigneeForm,
    handleCloseAddContactForm,

    handleSelectAssignee,
    selectedAssignee,
    handleRemoveAssignee,
    isAssigneeChanged,
    handlePressSaveBtn,
    handlePressCloseBtn,
  };
};

export default useEditAssigneeModal;

const styles = StyleSheet.create({});
