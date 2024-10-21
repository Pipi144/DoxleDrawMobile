import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledAssigneeDisplayer,
  StyledQADetailAssigneeText,
  StyledQADetailEditAssigneeContainer,
  StyledQADetailLabelText,
} from './StyledComponentQADetail';
import {LinearTransition} from 'react-native-reanimated';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import useQADetailEditAssignee from './Hooks/useQADetailEditAssignee';
import {ActivityIndicator} from 'react-native-paper';
import {QA} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
type Props = {
  qaItem: QA;
  handleAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;
};

const QADetailEditAssignee = ({qaItem, handleAssigneeChange}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {
    handleShowAddAssigneeModal,

    isUpdatingAssignee,
  } = useQADetailEditAssignee({qaItem, handleAssigneeChange});
  return (
    <StyledQADetailEditAssigneeContainer
      layout={LinearTransition.springify().damping(16)}>
      <StyledQADetailLabelText>Assigned To</StyledQADetailLabelText>

      <StyledAssigneeDisplayer
        onPress={handleShowAddAssigneeModal}
        layout={LinearTransition.springify().damping(16)}
        hitSlop={14}>
        <StyledQADetailAssigneeText $null={Boolean(!qaItem.assignee)}>
          {qaItem.assignee ? qaItem.assigneeName : 'Assign User'}
        </StyledQADetailAssigneeText>

        {isUpdatingAssignee ? (
          <ActivityIndicator
            size={doxleFontSize.contentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        ) : (
          <FontIcon
            name="arrow-circle-down"
            size={doxleFontSize.contentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        )}
      </StyledAssigneeDisplayer>
    </StyledQADetailEditAssigneeContainer>
  );
};

export default QADetailEditAssignee;

const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
});
