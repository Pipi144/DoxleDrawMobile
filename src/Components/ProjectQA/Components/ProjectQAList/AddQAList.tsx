import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  StyledAddQAListContainer,
  StyleNewQAListTitleTextInput,
} from './StyledComponentsProjectQAList';
import useAddQAList from './Hooks/useAddQAList';
import {ActivityIndicator} from 'react-native-paper';
import {
  FadeInRight,
  FadeInUp,
  FadeOutRight,
  FadeOutUp,
} from 'react-native-reanimated';

import AntIcon from 'react-native-vector-icons/AntDesign';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

type Props = {};

const AddQAList = ({}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {
    handleAddQAList,
    isAddingQAList,
    newQAListTitle,
    handleNewQAListTitleTextChange,
    handleBlurInput,
  } = useAddQAList();
  return (
    <StyledAddQAListContainer entering={FadeInUp} exiting={FadeOutUp}>
      <StyleNewQAListTitleTextInput
        autoFocus
        placeholder="New QA List Title..."
        placeholderTextColor={editRgbaAlpha({
          rgbaColor: THEME_COLOR.primaryFontColor,
          alpha: '0.4',
        })}
        blurOnSubmit
        value={newQAListTitle}
        onChangeText={handleNewQAListTitleTextChange}
        onSubmitEditing={handleAddQAList}
        onBlur={handleBlurInput}
      />

      {isAddingQAList ? (
        <ActivityIndicator
          color={THEME_COLOR.primaryFontColor}
          size={doxleFontSize.contentTextSize}
          style={{marginLeft: 4}}
        />
      ) : (
        newQAListTitle && (
          <DoxleAnimatedButton
            hitSlop={14}
            entering={FadeInRight}
            exiting={FadeOutRight}
            onPress={handleAddQAList}>
            <AntIcon
              name="plus"
              size={doxleFontSize.headTitleTextSize}
              color={THEME_COLOR.primaryFontColor}
            />
          </DoxleAnimatedButton>
        )
      )}
    </StyledAddQAListContainer>
  );
};

export default AddQAList;

const styles = StyleSheet.create({
  addBtn: {
    paddingHorizontal: 4,
  },
});
