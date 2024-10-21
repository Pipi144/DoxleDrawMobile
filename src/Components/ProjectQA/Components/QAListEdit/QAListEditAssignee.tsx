import {StyleSheet} from 'react-native';
import React from 'react';

import {
  StyledQAListAssigneeDisplayer,
  StyledQAListAssigneeText,
  StyledQAListEditAssigneeContainer,
  StyledQAListEditLabelText,
} from './StyledComponentQAListEdit';

import {LinearTransition} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native-paper';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import EditAssigneeModal from '../EditAssigneeModal/EditAssigneeModal';
import useQAListEditAssignee from './Hooks/useQAListEditAssignee';
import {QAList} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {
  edittedQAList: QAList;
  handleQAListAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;
};

const QAListEditAssignee = ({
  edittedQAList,
  handleQAListAssigneeChange,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {
    showAddAssigneeModal,
    handleShowAddAssigneeModal,
    handleCloseAddAssigneeModal,
    handleUpdateAssignee,
    isUpdatingAssignee,
  } = useQAListEditAssignee({edittedQAList, handleQAListAssigneeChange});
  return (
    <StyledQAListEditAssigneeContainer>
      <StyledQAListEditLabelText>Ball In Court</StyledQAListEditLabelText>

      <StyledQAListAssigneeDisplayer
        onPress={handleShowAddAssigneeModal}
        layout={LinearTransition.springify().damping(14)}
        hitSlop={14}>
        <StyledQAListAssigneeText $null={Boolean(!edittedQAList.assignee)}>
          {edittedQAList.assignee ? edittedQAList.assigneeName : 'Assign User'}
        </StyledQAListAssigneeText>

        {isUpdatingAssignee ? (
          <ActivityIndicator
            size={doxleFontSize.subContentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        ) : (
          <FontIcon
            name="arrow-circle-down"
            size={doxleFontSize.subContentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        )}
      </StyledQAListAssigneeDisplayer>

      <EditAssigneeModal
        showModal={showAddAssigneeModal}
        handleCloseModal={handleCloseAddAssigneeModal}
        qaItem={edittedQAList}
        handleUpdateAssignee={handleUpdateAssignee}
      />
    </StyledQAListEditAssigneeContainer>
  );
};

export default QAListEditAssignee;

const styles = StyleSheet.create({});
