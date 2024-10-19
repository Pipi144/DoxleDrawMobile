import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  StyledQADetailEditStatusContainer,
  StyledQADetailLabelText,
  StyledQADetailStatusDisplay,
  StyledQAStatusText,
} from './StyledComponentQADetail';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {QA} from '../../../../../../../Models/qa';
import {Switch} from 'react-native-switch';
import useQADetailEditStatus from '../../Hooks/useQADetailEditStatus';

type Props = {qaItem: QA};

const QADetailEditStatus = ({qaItem}: Props) => {
  const {DOXLE_FONT, theme} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {statusToggleValue, handleToggleStatus} = useQADetailEditStatus({
    qaItem,
  });
  return (
    <StyledQADetailEditStatusContainer>
      <StyledQADetailLabelText>Status</StyledQADetailLabelText>

      <StyledQADetailStatusDisplay>
        <Switch
          circleSize={deviceType === 'Smartphone' ? 20 : 23}
          renderActiveText={false}
          renderInActiveText={false}
          changeValueImmediately={true}
          innerCircleStyle={{justifyContent: 'center'}}
          switchLeftPx={1.25}
          switchRightPx={1.25}
          switchWidthMultiplier={3}
          onValueChange={handleToggleStatus}
          value={statusToggleValue}
          barHeight={deviceType === 'Smartphone' ? 26 : 30}
          circleBorderWidth={0}
        />

        <StyledQAStatusText $color={statusToggleValue ? '#209D34' : '#FF9900'}>
          {statusToggleValue ? 'Completed' : 'Working'}
        </StyledQAStatusText>
      </StyledQADetailStatusDisplay>
    </StyledQADetailEditStatusContainer>
  );
};

export default QADetailEditStatus;
