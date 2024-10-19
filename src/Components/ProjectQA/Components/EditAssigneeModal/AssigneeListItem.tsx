import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {useEditAssigneeModalContext} from './EditAssigneeModal';
import {
  StyledAsigneeListItemContainer,
  StyledAssigneeNameListItemText,
} from './StyledComponentEditAssigneeModal';
import {Contact} from '../../../../../../../Models/contacts';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';

type Props = {
  assigneeItem: Contact;
  itemIndex: number;
};

const AssigneeListItem = ({assigneeItem, itemIndex}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
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
