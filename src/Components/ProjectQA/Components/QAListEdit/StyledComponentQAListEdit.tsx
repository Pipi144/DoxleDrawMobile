import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

import {Pressable} from 'react-native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

export const StyledQAListEditPage = styled(Animated.ScrollView)<{}>`
  flex: 1;

  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  display: flex;
  padding: 0 16px;
  padding-top: 14px;
`;
export const StyledQAListEditTitleContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
`;
export const StyledQAListEditLabelText = styled.Text<{}>`
  color: rgba(72, 72, 134, 0.4);
  font-family: ${p => p.theme.DOXLE_FONT.secondaryFont};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 14px;
  margin-bottom: 4px;
`;
export const StyledTitleInputWrapper = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const StyledErrorTitleText = styled(Animated.Text)<{}>`
  color: ${p => p.theme.THEME_COLOR.errorColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  margin-left: 14px;
  margin-top: 4px;
`;
export const StyledQAListTitleTextInput = styled.TextInput<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  border-radius: 4px;
  width: 100%;
  min-height: 20px;
  padding: 7px 14px;
`;
export const StyledQAListEditDueDateContainer = styled(Animated.View)`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
`;
export const StyledQAListDueDateDisplay = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  padding: 7px 14px;
  align-self: flex-start;
`;
export const StyledQAListDueDateText = styled.Text<{
  $null: boolean;
}>`
  color: ${p =>
    p.$null
      ? editRgbaAlpha({
          rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
          alpha: '0.4',
        })
      : p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-right: 8px;
`;
export const StyledQAListEditAssigneeContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
`;
export const StyledQAListAssigneeDisplayer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  padding: 7px 14px;
  align-self: flex-start;
`;

export const StyledQAListAssigneeText = styled.Text<{
  $null: boolean;
}>`
  color: ${p =>
    p.$null
      ? editRgbaAlpha({
          rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
          alpha: '0.4',
        })
      : p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-right: 8px;
`;
