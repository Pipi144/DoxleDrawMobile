import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledQADetailDueDateDisplay,
  StyledQADetailDueDateText,
  StyledQADetailEditDueDateContainer,
  StyledQADetailLabelText,
} from './StyledComponentQADetail';

import {LinearTransition} from 'react-native-reanimated';
import {DatePickerModal} from 'react-native-paper-dates';
import useQADetailEditDueDate from './Hooks/useQADetailEditDueDate';

import {ActivityIndicator} from 'react-native-paper';
import dayjs from 'dayjs';
import {QA} from '../../../../Models/qa';
import {TDateISODate} from '../../../../Models/dateFormat';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {QADatePickerIcon} from '../QAIcons';

type Props = {
  qaItem: QA;
  handleDueDateChange: (newDate: TDateISODate | null) => void;
};

const QADetailEditDueDate = ({qaItem, handleDueDateChange}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    handleShowDatePicker,
    handleCloseDatePicker,
    showDatePicker,
    handleUpdateDueDate,
    isUpdatingDueDate,
  } = useQADetailEditDueDate({qaItem, handleDueDateChange});
  return (
    <StyledQADetailEditDueDateContainer
      layout={LinearTransition.springify().damping(16)}>
      <StyledQADetailLabelText>Due Date</StyledQADetailLabelText>

      <StyledQADetailDueDateDisplay
        layout={LinearTransition.springify().damping(16)}
        onPress={handleShowDatePicker}>
        <StyledQADetailDueDateText $null={Boolean(!qaItem.dueDate)}>
          {qaItem.dueDate
            ? dayjs(qaItem.dueDate).format('MMM DD, YYYY')
            : 'Select due date'}
        </StyledQADetailDueDateText>

        {isUpdatingDueDate ? (
          <ActivityIndicator
            size={doxleFontSize.contentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        ) : (
          <QADatePickerIcon {...THEME_COLOR} />
        )}
      </StyledQADetailDueDateDisplay>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={showDatePicker}
        onDismiss={handleCloseDatePicker}
        date={qaItem.dueDate ? new Date(qaItem.dueDate as string) : new Date()}
        onConfirm={event => {
          if (event.date) {
            handleUpdateDueDate(event.date);
          }
        }}
      />
    </StyledQADetailEditDueDateContainer>
  );
};

export default QADetailEditDueDate;

const styles = StyleSheet.create({});
