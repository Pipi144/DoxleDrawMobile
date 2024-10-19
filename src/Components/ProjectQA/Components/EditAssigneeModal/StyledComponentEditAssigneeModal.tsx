import styled from 'styled-components/native';

import Animated from 'react-native-reanimated';

import {Pressable} from 'react-native';
import {
  IDoxleFont,
  IDOXLEThemeColor,
} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  editRgbaAlpha,
  getFontSizeScale,
  TRgbaFormat,
} from '../../../../../../../Utilities/FunctionUtilities';
import {TextInput} from 'react-native';

export const StyledEditAssigneeModalContainer = styled.View<{
  $insetTop: number;
  $insetBottom: number;
}>`
  flex: 1;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  padding: ${p => p.$insetTop}px 14px ${p => p.$insetBottom}px 14px;
  position: relative;
  align-items: center;
`;
export const StyledSaveDocketBtnText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  z-index: 1;
  line-height: normal;
`;
export const StyledEditAssigneeHeadTitleText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 700;
  font-size: ${p => (p.theme.deviceType === 'Smartphone' ? 45 : 50)}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: none;
  margin: 40px 0px 28px 0px;
`;
export const StyledAssigneeSearchSectionContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const StyledAddAssigneeButtonText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: capitalize;
  margin-left: 4px;
`;
export const StyledSearchAssigneeTextInputWrapper = styled(Animated.View)<{
  $height: number;
}>`
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  height: ${p => p.$height}px;
  border-radius: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;

  flex: 1;
  padding: 0px 8px;
  min-width: 180px;

  overflow: hidden;
`;
export const StyledAssigneeNameTextInput = styled(TextInput)<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  padding: 0px;
  font-style: normal;
  font-weight: 400;

  flex: 1;
  height: 100%;
`;

export const StyledAssigneeSearchClearInputButton = styled(
  Animated.createAnimatedComponent(Pressable),
)`
  margin-right: 4px;
`;
export const StyledAssigneeSearchClearInputButtonText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  line-height: 14px;
  color: ${p => p.theme.THEME_COLOR.doxleColor};
  text-transform: capitalize;
`;

export const StyledAsigneeListItemContainer = styled.Pressable<{}>`
  width: 100%;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
  display: flex;
  justify-content: center;
  padding: 8px;
`;
export const StyledAssigneeNameListItemText = styled.Text<{
  $isSelected: boolean;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p =>
    p.$isSelected
      ? p.theme.THEME_COLOR.doxleColor
      : p.theme.THEME_COLOR.primaryFontColor};
  text-transform: capitalize;
  width: 100%;
`;
export const StyledAssigneeListContainer = styled(Animated.View)<{
  $themeColor: IDOXLEThemeColor;
}>`
  min-width: 250px;
  width: 100%;

  flex: 1;
  display: flex;
  background-color: ${p => p.$themeColor.primaryContainerColor};
  margin-top: 14px;
  border-radius: 9px;
  overflow: hidden;

  position: relative;
`;
export const StyledAddNewContactForm = styled(Animated.View)<{}>`
  width: 100%;
  height: 100%;
  z-index: 5;
  display: flex;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  padding: 14px;
  position: absolute;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 10;
`;
export const StyledAddNewContactHeaderText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  line-height: 24px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: none;
  padding-top: 2px;
`;
export const StyledNewContactFormFieldContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;
export const StyledAddNewContactTextInput = styled(TextInput)`
  width: 100%;
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  padding: 0px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: none;
  border-bottom-width: 1px;
  border-bottom-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor as TRgbaFormat,
      alpha: '0.4',
    })};
  padding-bottom: 4px;
`;

export const StyledErrorToggleAddNewContactText = styled(Animated.Text)`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.errorToggleTextSize}px;
  color: ${p => p.theme.THEME_COLOR.errorColor};
  text-transform: none;

  margin-top: 4px;
`;
export const StyledAddContactFormBtnText = styled.Text`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  text-transform: capitalize;
`;
