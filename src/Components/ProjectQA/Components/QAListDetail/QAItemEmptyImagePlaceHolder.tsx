import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  StyledQAItemEmptyImagePlaceHolder,
  StyledQAItemEmptyImageText,
} from './StyledComponentsQAListDetail';
import {QAImageEmptyIcon} from '../../../../ProjectIcons';

type Props = {};

const QAItemEmptyImagePlaceHolder = (props: Props) => {
  return (
    <StyledQAItemEmptyImagePlaceHolder>
      <QAImageEmptyIcon />

      <StyledQAItemEmptyImageText>Add Image</StyledQAItemEmptyImageText>
    </StyledQAItemEmptyImagePlaceHolder>
  );
};

export default QAItemEmptyImagePlaceHolder;

const styles = StyleSheet.create({});
