import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledCommentInputSectionContainer,
  StyledCommentTextInput,
} from './StyledComponentQADetail';
import {FadeIn, FadeOut, LinearTransition} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import {ActivityIndicator} from 'react-native-paper';
import useCommentInputSection from './Hooks/useCommentInputSection';
import {useQADetailContext} from './QADetail';
import {QA} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

type Props = {qaItem: QA; layoutQACommentSectionYPos: number};

const CommentInputSection = ({qaItem, layoutQACommentSectionYPos}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {
    newCommentText,
    handleNewCommentTextChange,
    handleAddCmt,
    isAddingComment,
    onLayoutChange,
    layoutInputSectionYPos,
    isInputFocused,
    setIsInputFocused,
  } = useCommentInputSection({qaItem});

  const {listRef} = useQADetailContext();
  return (
    <StyledCommentInputSectionContainer
      layout={LinearTransition.springify().damping(16).mass(1).stiffness(120)}
      onLayout={onLayoutChange}>
      <StyledCommentTextInput
        $fontSize={doxleFontSize.contentTextSize + (isInputFocused ? 4 : 0)}
        placeholder="Add comment..."
        placeholderTextColor={editRgbaAlpha({
          rgbaColor: THEME_COLOR.primaryFontColor,
          alpha: '0.2',
        })}
        multiline
        blurOnSubmit
        value={newCommentText}
        onChangeText={handleNewCommentTextChange}
        onBlur={() => setIsInputFocused(false)}
        onFocus={() => {
          setIsInputFocused(true);
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollToOffset({
                animated: true,
                offset:
                  layoutQACommentSectionYPos + layoutInputSectionYPos - 10,
              });
            }
          }, 400);
        }}
        onKeyPress={event => {
          if (event.nativeEvent.key === 'Enter') handleAddCmt();
        }}
      />

      <DoxleAnimatedButton
        key={`sendBtn`}
        onPress={handleAddCmt}
        style={[
          styles.sendBtn,
          {
            width: doxleFontSize.pageTitleFontSize,
            height: doxleFontSize.pageTitleFontSize,
            borderRadius: doxleFontSize.pageTitleFontSize / 2,
          },
        ]}
        hitSlop={14}
        backgroundColor={THEME_COLOR.doxleColor}
        entering={FadeIn}
        exiting={FadeOut}
        disabled={Boolean(!newCommentText)}>
        {isAddingComment ? (
          <ActivityIndicator
            size={doxleFontSize.subContentTextSize}
            color="white"
          />
        ) : (
          <Icon
            name="arrowup"
            size={doxleFontSize.headTitleTextSize}
            color="white"
          />
        )}
      </DoxleAnimatedButton>
    </StyledCommentInputSectionContainer>
  );
};

export default CommentInputSection;

const styles = StyleSheet.create({
  sendBtn: {
    marginLeft: 8,

    justifyContent: 'center',
    alignItems: 'center',
  },
  outsidePress: {
    width: '100%',
    display: 'flex',
  },
});
