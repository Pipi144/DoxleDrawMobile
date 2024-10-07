import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';
import {
  IDoxleFont,
  IDOXLEThemeColor,
} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';
export const StyledAddFileAndFolderContainer = styled.View<{
  $themeColor: IDOXLEThemeColor;
}>`
  background-color: ${p => p.$themeColor.primaryContainerColor};
  display: flex;
`;

export const StyledAddMenuRootModeContainer = styled(Animated.View)`
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-radius: 12px;
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 200 : 240)}px;
`;

export const StyledAddMenuBtnText = styled.Text<{
  $fontColor?: string;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p => p.$fontColor ?? p.theme.staticMenuColor.staticWhiteFontColor};
`;

export const StyledExpandAddMenu = styled(Animated.View)`
  display: flex;
`;
export const StyledNavBackBtnText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
}>`
  font-family: ${p => p.$doxleFont.interRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${getFontSizeScale(13)}px;
  color: ${p => p.$themeColor.primaryFontColor};
`;

export const StyledAddFileFolderModeContainer = styled(Animated.View)<{}>`
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-radius: 12px;
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 200 : 240)}px;
`;
export const StyledAddBtnText = styled.Text<{
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  color: #fff;

  font-family: ${p => p.$doxleFont.titleFont};
  font-size: ${p => p.$fontSize}px;
  font-style: normal;
  font-weight: 500;
`;
