import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';
import {
  IDoxleFont,
  IDOXLEThemeColor,
} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';

export const StyledEmptyFileScreenContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
export const StyledAddButtonText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const StyledEmptyFileText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  margin: 8px 0px;
  text-transform: capitalize;
`;
export const StyledAddFileModalContainer = styled.View<{
  $themeColor: IDOXLEThemeColor;
  $insetBottom: number;
}>`
  display: flex;
  background-color: ${p => p.$themeColor.primaryContainerColor};
  border-top-left-radius: ${getFontSizeScale(4)}px;
  border-top-right-radius: ${getFontSizeScale(4)}px;
  padding-bottom: ${p => p.$insetBottom + 4}px;
`;

export const StyledAddFileModalBtn = styled.Pressable<{
  $hasBorderBottom?: boolean;
}>`
  width: 100%;
  padding: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: ${p => (p.$hasBorderBottom ?? true ? 1 : 0)}px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;
export const StyledAddFileModalBtnText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};

  flex-shrink: 1;
  min-width: ${getFontSizeScale(100)}px;
  text-align: left;
  margin-left: 4px;
`;
