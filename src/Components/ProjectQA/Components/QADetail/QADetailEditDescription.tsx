import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledDescriptionInputWrapper,
  StyledErrorDescriptionText,
  StyledQADescriptionTextInput,
  StyledQADetailEditDescriptionContainer,
  StyledQADetailLabelText,
} from './StyledComponentQADetail';

import {FadeInLeft, FadeOutLeft} from 'react-native-reanimated';

import {QA} from '../../../../../../../Models/qa';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import useQADetailEditDescription from '../../Hooks/useQADetailEditDescription';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';

type Props = {
  qaItem: QA;
  handleQADescriptionChange: (value: string) => void;
};

const QADetailEditDescription = ({
  qaItem,
  handleQADescriptionChange,
}: Props) => {
  const {
    newDescriptionText,
    handleNewDescriptionTextChange,
    handleUpdateDescription,
    isUpdatingDescription,
  } = useQADetailEditDescription({
    qaItem,
    handleQADescriptionChange,
  });

  return (
    <StyledQADetailEditDescriptionContainer>
      <StyledQADetailLabelText>Title</StyledQADetailLabelText>

      <StyledDescriptionInputWrapper>
        <StyledQADescriptionTextInput
          multiline
          value={newDescriptionText}
          onChangeText={handleNewDescriptionTextChange}
          onBlur={() => {
            handleUpdateDescription();
          }}
          blurOnSubmit={true}
          selectTextOnFocus
        />
      </StyledDescriptionInputWrapper>
      {!newDescriptionText && (
        <StyledErrorDescriptionText entering={FadeInLeft} exiting={FadeOutLeft}>
          Please fill in title!
        </StyledErrorDescriptionText>
      )}
    </StyledQADetailEditDescriptionContainer>
  );
};

export default QADetailEditDescription;

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
  outsidePress: {
    width: '100%',
    display: 'flex',
  },
});
