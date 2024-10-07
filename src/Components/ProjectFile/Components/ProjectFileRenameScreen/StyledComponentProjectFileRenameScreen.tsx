import {KeyboardAvoidingView, TextInput} from 'react-native';
import {styled} from 'styled-components/native';
import {
  IDoxleFont,
  IDOXLEThemeColor,
} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

export const StyledProjectFileRenameScreenContainer = styled(
  KeyboardAvoidingView,
)<{
  $insetTop: number;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${p => p.$insetTop}px;
  position: relative;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
`;
export const StyledFileRenameText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.pageTitleFontSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  margin-left: 8px;
`;
export const StyledFileRenameInput = styled(TextInput)<{}>`
  margin-top: 20px;
  padding: 12px;

  width: 80%;
  max-width: 400px;
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
`;
export const StyledFileRenameButtonText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  text-align: center;
  align-self: center;
  color: ${p => p.theme.THEME_COLOR.primaryReverseFontColor};
`;
