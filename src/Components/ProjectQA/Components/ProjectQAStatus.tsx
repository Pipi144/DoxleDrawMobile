import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDOXLETheme} from '../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  StyledQAListItemStatusContainer,
  StyledQAListItemStatusText,
} from './StyledComponentProjectQA';
import {useOrientation} from '../../../../../../Providers/OrientationContext';

type Props = {
  type: 'working' | 'unattended' | 'completed';
  selected: boolean;
  statusCount: number;
  displayText?: boolean;
  marginRight?: number;
};

const WORKING_STATUS_COLOR = '#FF9900';
//  'rgba(255, 186, 53,0.4)';
const COMPLETE_STATUS_COLOR = '#209D34';
// 'rgba(18, 183, 24, 0.8)';
const UNATTENDED_STATUS_COLOR = '#FF9900';
// 'rgba(255, 186, 53,0.8)';
const ProjectQAStatus = ({
  type,
  selected,
  statusCount,
  displayText,
  marginRight = 0,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
  return (
    <StyledQAListItemStatusContainer
      $marginRight={marginRight}
      $bgColor={
        type === 'working'
          ? WORKING_STATUS_COLOR
          : type === 'completed'
          ? COMPLETE_STATUS_COLOR
          : UNATTENDED_STATUS_COLOR
      }>
      <StyledQAListItemStatusText
        $fontSize={deviceType === 'Smartphone' ? 16 : 18}
        $textColor={
          type === 'unattended'
            ? THEME_COLOR.primaryFontColor
            : THEME_COLOR.primaryReverseFontColor
        }>
        {displayText && type + ' '}
        {displayText ? `(${statusCount})` : statusCount}
      </StyledQAListItemStatusText>
    </StyledQAListItemStatusContainer>
  );
};

export default ProjectQAStatus;

const styles = StyleSheet.create({});
