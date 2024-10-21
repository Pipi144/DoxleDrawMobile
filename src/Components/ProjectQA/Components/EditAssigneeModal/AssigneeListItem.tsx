import {StyleSheet} from 'react-native';
import React from 'react';

import {useEditAssigneeModalContext} from './EditAssigneeModal';
import {
  StyledAsigneeListItemContainer,
  StyledAssigneeNameListItemText,
} from './StyledComponentEditAssigneeModal';
import {Contact} from '../../../../Models/contacts';

type Props = {
  assigneeItem: Contact;
  itemIndex: number;
};

const AssigneeListItem = ({assigneeItem, itemIndex}: Props) => {
  const {selectedAssignee, handleSelectAssignee} =
    useEditAssigneeModalContext();
  const isSelected = Boolean(
    selectedAssignee && selectedAssignee.assigneeId === assigneeItem.contactId,
  );
  const handlePressListItem = () => {
    handleSelectAssignee(assigneeItem);
  };
  return (
    <StyledAsigneeListItemContainer onPress={handlePressListItem}>
      <StyledAssigneeNameListItemText $isSelected={isSelected}>
        {itemIndex + 1}. {assigneeItem.firstName} {assigneeItem.lastName}
      </StyledAssigneeNameListItemText>
    </StyledAsigneeListItemContainer>
  );
};
export default AssigneeListItem;

const styles = StyleSheet.create({});
