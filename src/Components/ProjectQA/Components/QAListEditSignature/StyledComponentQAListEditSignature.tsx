import styled from 'styled-components/native';

import Animated from 'react-native-reanimated';
import {
  IDoxleFont,
  IDOXLEThemeColor,
} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

export const StyledQAEditSignaturePageContainer = styled.View<{}>`
  flex: 1;
  position: relative;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const StyledDrawSignatureLabel = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: capitalize;
  margin-bottom: 8px;
`;
export const StyledSignatureScreenWrapper = styled(Animated.View)`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const StyledSignatureReviewImage = styled(Animated.Image)`
  width: 100%;
  height: 100%;
`;
export const StyledSignatureBtnSection = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 30px;
`;
export const StyledSignatureBtnText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
`;
export const StyledSignaturePreviewSection = styled.View<{
  $themeColor: IDOXLEThemeColor;
  $height: number;
}>`
  width: 100%;
  margin-bottom: 40px;
  margin-top: 10px;
  display: flex;
  height: 120px;
  background-color: ${p => p.$themeColor.primaryContainerColor};
  position: relative;
  border-width: 1px;
  border-color: ${p => p.$themeColor.primaryDividerColor};
`;
export const StyledSignaturePreviewText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.errorToggleTextSize}px;
  position: absolute;
  top: 0;
  right: 0;
  color: ${p => p.theme.THEME_COLOR.doxleColor};
  padding: 4px;
`;
