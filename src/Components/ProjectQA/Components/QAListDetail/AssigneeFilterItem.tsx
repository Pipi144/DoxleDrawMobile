import {StyleSheet} from 'react-native';
import React from 'react';
import {Contact} from '../../../../../../../Models/contacts';
import {useProjectQAStore} from '../../Store/useProjectQAStore';
import {
  StyledAssigneeItemContainer,
  StyledAssigneeNameText,
} from './StyledComponentsQAListDetail';
import {useShallow} from 'zustand/react/shallow';

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
