import {StyleSheet, View} from 'react-native';
import React from 'react';

import {
  StyledQAListEditLabelText,
  StyledQAListEditTitleContainer,
  StyledQAListTitleTextInput,
  StyledTitleInputWrapper,
} from './StyledComponentQAListEdit';

import Animated, {Layout, LinearTransition} from 'react-native-reanimated';
import useQAListEditTitle from './Hooks/useQAListEditTitle';
import {QAList} from '../../../../Models/qa';

type Props = {
  handleQAListTitleChange: (value: string) => void;
  edittedQAList: QAList;
};

const QAListEditTitle = ({handleQAListTitleChange, edittedQAList}: Props) => {
  const {
    newTitleText,
    handleNewTitleTextChange,
    handleUpdateTitle,
    isUpdatingTitle,
  } = useQAListEditTitle({handleQAListTitleChange, edittedQAList});

  return (
    <StyledQAListEditTitleContainer>
      <StyledQAListEditLabelText>Title</StyledQAListEditLabelText>

      <StyledTitleInputWrapper>
        <View style={styles.inputSection}>
          <Animated.View
            style={{width: '100%'}}
            layout={LinearTransition.springify().damping(16)}>
            <StyledQAListTitleTextInput
              multiline={true}
              value={newTitleText}
              onChangeText={handleNewTitleTextChange}
              blurOnSubmit
              onBlur={() => {
                handleUpdateTitle();
              }}
              selectTextOnFocus
            />
          </Animated.View>
        </View>
      </StyledTitleInputWrapper>
    </StyledQAListEditTitleContainer>
  );
};

export default QAListEditTitle;

const styles = StyleSheet.create({
  inputSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  sendBtn: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
