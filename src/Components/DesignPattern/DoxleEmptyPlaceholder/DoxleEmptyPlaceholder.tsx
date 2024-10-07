import {
  GestureResponderEvent,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {
  StylePlaceholderAddButton,
  StyledEmptyPlaceholderHeaderText,
  StyledEmptyPlaceholderSubTitleText,
  StyledPlaceholderAddBtnText,
} from './StyledComponentDoxleEmptyPlaceholder';
import Animated, {Layout} from 'react-native-reanimated';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {getFontSizeScale} from '../../../Utilities/FunctionUtilities';
interface PlaceholderAddBtn {
  btnText: string;
  btnTextStyle?: TextStyle;
  btnFunction:
    | ((((event: GestureResponderEvent) => void) | undefined) & (() => void))
    | undefined;
  btnContainerStyle?: ViewStyle;
  buttonIcon?: React.ReactNode;
}
type Props = {
  wrapperStyle?: ViewStyle;
  headTitleStyle?: TextStyle;
  headTitleText?: string;
  subTitleText?: string;
  subTitleStyle?: TextStyle;
  addButton?: PlaceholderAddBtn;
  illustrationComponent?: React.ReactNode;
};

const DoxleEmptyPlaceholder = ({
  wrapperStyle,
  headTitleStyle,
  headTitleText,
  subTitleText,
  subTitleStyle,
  addButton,
  illustrationComponent,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  return (
    <Animated.View
      style={{
        width: wrapperStyle?.width ?? '100%',
        height: wrapperStyle?.height ?? '100%',
        justifyContent: wrapperStyle?.justifyContent ?? 'center',
        alignItems: wrapperStyle?.alignItems ?? 'center',
        ...wrapperStyle,
      }}>
      {illustrationComponent && illustrationComponent}

      <StyledEmptyPlaceholderHeaderText
        style={{
          fontFamily: headTitleStyle?.fontFamily ?? DOXLE_FONT.primaryFont,
          fontSize: headTitleStyle?.fontSize ?? getFontSizeScale(30),
          color: headTitleStyle?.color ?? THEME_COLOR.primaryFontColor,
          fontWeight: headTitleStyle?.fontWeight ?? '600',
          textAlign: headTitleStyle?.textAlign ?? 'center',
          marginBottom: headTitleStyle?.marginBottom ?? 8,
          ...headTitleStyle,
        }}>
        {headTitleText ?? 'No Item'}
      </StyledEmptyPlaceholderHeaderText>

      <StyledEmptyPlaceholderSubTitleText
        style={{
          fontFamily: subTitleStyle?.fontFamily ?? DOXLE_FONT.primaryFont,
          fontSize: subTitleStyle?.fontSize ?? getFontSizeScale(18),
          color: subTitleStyle?.color ?? THEME_COLOR.primaryFontColor,
          fontWeight: subTitleStyle?.fontWeight ?? '400',
          textAlign: subTitleStyle?.textAlign ?? 'center',
          ...subTitleStyle,
        }}>
        {subTitleText ?? 'Add More Item'}
      </StyledEmptyPlaceholderSubTitleText>
      {addButton && (
        <StylePlaceholderAddButton
          style={{
            paddingVertical: addButton.btnContainerStyle?.paddingVertical ?? 4,
            paddingHorizontal:
              addButton.btnContainerStyle?.paddingHorizontal ?? 8,
            marginTop: addButton.btnContainerStyle?.marginTop ?? 8,
            borderRadius: addButton.btnContainerStyle?.borderRadius ?? 4,
            backgroundColor:
              addButton.btnContainerStyle?.backgroundColor ??
              THEME_COLOR.doxleColor,
            display: 'flex',
            flexDirection: 'row',
            ...addButton.btnContainerStyle,
          }}
          hitSlop={20}
          layout={Layout.springify().damping(16)}
          onPress={addButton.btnFunction}>
          {addButton.buttonIcon}
          <StyledPlaceholderAddBtnText
            style={{
              color: addButton.btnTextStyle?.color ?? 'white',
              fontWeight: addButton.btnTextStyle?.fontWeight ?? '500',
              fontFamily:
                addButton.btnTextStyle?.fontFamily ?? DOXLE_FONT.titleFont,
              ...addButton.btnTextStyle,
            }}>
            {addButton.btnText}
          </StyledPlaceholderAddBtnText>
        </StylePlaceholderAddButton>
      )}
    </Animated.View>
  );
};

export default DoxleEmptyPlaceholder;

const styles = StyleSheet.create({});
