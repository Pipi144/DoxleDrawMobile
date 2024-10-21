import {StyleSheet} from 'react-native';
import React from 'react';

import {
  StyledAssigneeItemContainer,
  StyledAssigneeNameText,
} from './StyledComponentsQAListDetail';
import {Contact} from '../../../../Models/contacts';

type Props = {
  contactItem: Contact;
  handleSelectAssignee: (item: Contact) => void;
  currentSelectedId?: string;
};

const AssigneeFilterItem: React.FC<Props> = ({
  contactItem,
  handleSelectAssignee,
  currentSelectedId,
}: Props) => {
  return (
    <StyledAssigneeItemContainer
      $selected={Boolean(currentSelectedId === contactItem.contactId)}
      onPress={() => {
        handleSelectAssignee(contactItem);
      }}>
      <StyledAssigneeNameText
        $selected={Boolean(currentSelectedId === contactItem.contactId)}>
        {contactItem.firstName} {contactItem.lastName}
      </StyledAssigneeNameText>
    </StyledAssigneeItemContainer>
  );
};

export default React.memo(AssigneeFilterItem);

const styles = StyleSheet.create({});
