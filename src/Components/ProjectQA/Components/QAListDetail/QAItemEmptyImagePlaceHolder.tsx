import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledQAItemEmptyImagePlaceHolder,
  StyledQAItemEmptyImageText,
} from './StyledComponentsQAListDetail';
import {QAImageEmptyIcon} from '../QAIcons';

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
