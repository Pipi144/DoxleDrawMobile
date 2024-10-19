import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  StyledQAListDueDateDisplay,
  StyledQAListDueDateText,
  StyledQAListEditDueDateContainer,
  StyledQAListEditLabelText,
} from './StyledComponentQAListEdit';
import {Layout, LinearTransition} from 'react-native-reanimated';

import {ActivityIndicator} from 'react-native-paper';

import {DatePickerModal} from 'react-native-paper-dates';
import {TDateISODate} from '../../../../../../../Models/dateFormat';
import {QAList} from '../../../../../../../Models/qa';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import useQAListEditDueDate from '../../Hooks/useQAListEditDueDate';
import {DatePickerButtonIcon} from '../../../../../../../RootAppIcons';
import {formatDate} from '../../../../../../../Utilities/FunctionUtilities';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';

type Props = {
  handleQAListDueDateChange: (newDate: TDateISODate | null) => void;
  edittedQAList: QAList;
};

const QAListEditDueDate = ({
  handleQAListDueDateChange,
  edittedQAList,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    handleShowDatePicker,
    handleCloseDatePicker,
    showDatePicker,
    handleUpdateDueDate,
    isUpdatingDueDate,
  } = useQAListEditDueDate({handleQAListDueDateChange, edittedQAList});
  return (
    <StyledQAListEditDueDateContainer
      layout={LinearTransition.springify().damping(16)}>
      <StyledQAListEditLabelText>Due Date</StyledQAListEditLabelText>

      <StyledQAListDueDateDisplay
        layout={LinearTransition.springify().damping(16)}
        onPress={handleShowDatePicker}>
        <StyledQAListDueDateText $null={Boolean(!edittedQAList.dueDate)}>
          {edittedQAList.dueDate
            ? formatDate(
                edittedQAList.dueDate as string,
                'monthAcronym dd, yyyy',
              )
            : 'Select due date'}
        </StyledQAListDueDateText>

        {isUpdatingDueDate ? (
          <ActivityIndicator
            size={doxleFontSize.subContentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        ) : (
          <DatePickerButtonIcon {...THEME_COLOR} />
        )}
      </StyledQAListDueDateDisplay>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={showDatePicker}
        onDismiss={handleCloseDatePicker}
        date={
          edittedQAList.dueDate
            ? new Date(edittedQAList.dueDate as string)
            : new Date()
        }
        disableStatusBar={false}
        onConfirm={event => {
          if (event.date) {
            handleUpdateDueDate(event.date);
          }
        }}
      />
    </StyledQAListEditDueDateContainer>
  );
};

export default QAListEditDueDate;

const styles = StyleSheet.create({});
