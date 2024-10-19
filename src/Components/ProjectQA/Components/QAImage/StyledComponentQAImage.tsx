import {Image, Pressable} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';

export const StyledQAImageContainer = styled(Animated.View)`
  width: 100%;
  margin-top: 30px;
`;
export const StyledQAImageMenuSectionContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 14px;
  justify-content: center;
  align-items: center;
`;
export const StyledQAImageMenuBtnText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize + 2}px;
  font-style: normal;
  font-weight: 500;
  margin-left: 2px;
`;
export const StyledQAImageItemContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{
  $numOfCol: number;
}>`
  width: ${p => 100 / p.$numOfCol}%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 2px;
  position: relative;
`;

export const StyledQAImageHolder = styled(Image)`
  width: 100%;
  height: 100%;

  z-index: 0;
`;
export const StyledQAImageItemMenu = styled.View`
  position: absolute;
  bottom: 14px;
  right: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 3;
`;
export const StyledRectangeMarkupUnder = styled.View<{$strokeColor: string}>`
  width: ${getFontSizeScale(80)}px;
  height: ${getFontSizeScale(80)}px;
  z-index: 0;
  border: 4px solid ${p => p.$strokeColor};
`;

export const StyledRectangeMarkupUpper = styled.View<{
  $strokeColor: string;
  $round?: boolean;
}>`
  width: ${getFontSizeScale(80)}px;
  height: ${getFontSizeScale(80)}px;
  z-index: 1;
  border: 4px solid ${p => p.$strokeColor};
  margin-left: ${getFontSizeScale(40)}px;
  margin-top: ${getFontSizeScale(-40)}px;
  border-radius: ${p => (p.$round ? getFontSizeScale(40) : 0)}px;
`;
export const StyledQAVideoItemContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{
  $numOfCol: number;
}>`
  width: ${p => 100 / p.$numOfCol}%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 2px;
  position: relative;
`;
export const StyledQAPendingVideoContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{
  $numOfCol: number;
}>`
  width: ${p => 100 / p.$numOfCol}%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 2px;
  position: relative;
`;
export const StyledGalleryPickerContainer = styled.View`
  width: 100%;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  background-color: ${p => p.theme.staticMenuColor.staticHover};
  display: flex;
  padding: 12px;
  padding-bottom: ${p =>
    p.theme.deviceType === 'Smartphone' ? p.theme.deviceSize.insetBottom : 0}px;
`;

export const StyledMediaPickerBtn = styled.Pressable<{
  $hasBorderBottom?: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-bottom-width: ${p => (p.$hasBorderBottom ? 1 : 0)}px;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
  background-color: ${p => p.theme.staticMenuColor.staticBg};

  ${p =>
    p.$hasBorderBottom
      ? `
  border-top-left-radius:12px;
  border-top-right-radius:12px;
  `
      : `
  border-bottom-left-radius:12px;
  border-bottom-right-radius:12px;
  `}
`;
export const StyledMediaPickerBtnText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-left: 4px;
  min-width: 55px;
  text-align: center;
`;

export const StyledMediaPickerTitleText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize + 4}px;
  font-style: normal;
  font-weight: 600;

  text-align: center;
  flex: 1;
`;
export const StyledCloseMediaBtn = styled.Pressable`
  width: ${p => p.theme.doxleFontSize.pageTitleFontSize}px;
  height: ${p => p.theme.doxleFontSize.pageTitleFontSize}px;
  border-radius: ${p => p.theme.doxleFontSize.pageTitleFontSize / 2}px;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  position: absolute;
  right: 0px;
`;
