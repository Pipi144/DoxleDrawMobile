import {KeyboardAvoidingView, Pressable, TextInput} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {NavbarPosition} from '../../../GeneralStore/useNavigationMenuStore';
import {
  IDoxleFont,
  IDOXLEThemeColor,
  TDoxleFontMode,
  TDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  editRgbaAlpha,
  getFontSizeScale,
  TRgbaFormat,
} from '../../../Utilities/FunctionUtilities';
import {
  BARLOW_FONT,
  DEFAULT_FONT,
  INTER_FONT,
  MONO_FONT,
  SERIF_FONT,
} from '../../../Providers/DoxleThemeProvider/FontColorConstant';

export const StyledDoxleBottomNavContainer = styled(KeyboardAvoidingView)<{
  $themeColor: IDOXLEThemeColor;

  $height: number;
  $currentTheme: TDOXLETheme;
  $position: NavbarPosition;
}>`
  width: 100%;

  display: flex;

  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};

  overflow: hidden;
  position: absolute;
  left: 0;
  z-index: 10;
  ${p =>
    p.$position === 'top'
      ? `
    top:0px;
    `
      : `
    bottom:0px;
    `}
`;
export const StyledSearchWrapper = styled(Animated.View)<{
  $themeColor: IDOXLEThemeColor;
  $theme: TDOXLETheme;
  $fullWidth?: boolean;
}>`
  width: ${p => (p.$fullWidth ? '90%' : `${getFontSizeScale(250)}px`)};
  height: ${getFontSizeScale(30)}px;
  min-height: 33px;
  max-height: 38px;
  max-width: 580px;
  padding: 0px 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 21px;
  background-color: ${p =>
    p.$theme !== 'dark' ? 'rgba(249,249,249,1)' : '#121218'};
  overflow: hidden;
`;
export const StyledSearchWrapperText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.$themeColor.primaryFontColor as TRgbaFormat,
      alpha: '0.4',
    })};

  font-family: ${p => p.$doxleFont.titleFont};
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
`;
export const StyledDoxleBottomSubMenuItem = styled(
  Animated.createAnimatedComponent(Pressable),
)<{$themeColor: IDOXLEThemeColor}>`
  padding: 2px 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 4px;
`;

export const StyledDoxleBottomSubMenuItemText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  color: ${p => p.$themeColor.primaryFontColor};

  font-family: ${p => p.$doxleFont.titleFont};
  font-size: ${p => p.$fontSize}px;
  font-style: normal;
  font-weight: 500;
  text-transform: capitalize;
  margin-left: 4px;
`;

export const StyledSearchDoxleInput = styled(TextInput)<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  color: ${p => p.$themeColor.primaryFontColor};

  font-family: ${p => p.$doxleFont.titleFont};
  font-size: ${p => p.$fontSize}px;
  font-style: normal;
  font-weight: 500;
  flex: 1;
  padding: 0px;
  margin-left: 4px;
`;

export const StyledPopoverMenuItemText = styled.Text<{
  $marginLeft?: number;
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor as TRgbaFormat,
      alpha: '0.7',
    })};

  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-left: ${p => p.$marginLeft ?? 5}px;
`;

export const StyledNavPopperMenuContainer = styled(Animated.View)<{
  $themeColor: IDOXLEThemeColor;
}>`
  padding: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${p => p.$themeColor.primaryContainerColor};
`;

export const StyledMenuSectionWrapper = styled(Animated.View)<{
  $themeColor: IDOXLEThemeColor;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.$themeColor.primaryDividerColor};
`;

export const StyledLastLoginText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.$themeColor.primaryFontColor as TRgbaFormat,
      alpha: '0.6',
    })};

  font-family: ${p => p.$doxleFont.interRegular};
  font-size: 10px;
  font-style: normal;
  font-weight: 400;

  letter-spacing: ${getFontSizeScale(-0.22)}px;
  margin-top: 8px;
`;

export const StyledOurStoryMenu = styled(Animated.View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const StyledSubmenuTitleWrapper = styled.View<{
  $themeColor: IDOXLEThemeColor;
}>`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.$themeColor.primaryDividerColor};
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0px;
`;
export const StyledSubmenuTitleText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.$themeColor.primaryFontColor as TRgbaFormat,
      alpha: '0.7',
    })};

  font-family: ${p => p.$doxleFont.titleFont};
  font-size: ${p => p.$fontSize}px;
  font-style: normal;
  font-weight: 500;

  letter-spacing: -0.32px;
  margin-left: 4px;
`;

export const StyledOurStoryContentText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.$themeColor.primaryFontColor as TRgbaFormat,
      alpha: '0.7',
    })};

  font-family: ${p => p.$doxleFont.secondaryTitleFont};
  font-size: ${p => p.$fontSize}px;
  font-style: normal;
  font-weight: 400;

  letter-spacing: -0.28px;
  width: 100%;
`;

export const StyledChangeFontMenu = styled(Animated.View)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledSelectFontStyleDisplay = styled.View<{
  $themeColor: IDOXLEThemeColor;
}>`
  border: 1px solid ${p => p.$themeColor.primaryDividerColor};
  padding: 14px;
  border-radius: ${getFontSizeScale(3)}px;
  margin-bottom: 8px;
`;

export const StyledFontStyleNameText = styled.Text<{
  $selected?: boolean;
}>`
  color: ${p =>
    p.$selected
      ? p.theme.THEME_COLOR.doxleColor
      : p.theme.THEME_COLOR.primaryFontColor};

  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;

  letter-spacing: -0.28px;
`;

export const StyledFontStyleTextDisplay = styled.Text<{
  $type: TDoxleFontMode;
}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};

  font-family: ${p =>
    p.$type === 'default'
      ? DEFAULT_FONT.primaryFont
      : p.$type === 'serif'
      ? SERIF_FONT.primaryFont
      : p.$type === 'mono'
      ? MONO_FONT.primaryFont
      : INTER_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;

  letter-spacing: -0.48px;
`;

export const StyledNavProjectSection = styled(Animated.View)`
  width: 100%;
  display: flex;
`;
export const StyledProjectAddressText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  font-family: ${p => p.$doxleFont.titleFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.$fontSize}px;

  color: ${p => p.$themeColor.primaryFontColor};
`;

export const StyledMainNavSection = styled(Animated.View)<{
  $themeColor: IDOXLEThemeColor;
  $height: number;
  $position: NavbarPosition;
}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  justify-content: center;
  height: ${p => p.$height}px;

  position: relative;
  padding: 0px 60px;
  ${p =>
    p.$position === 'top'
      ? `
  border-bottom-width: 1px;
  border-bottom-color: ${p.$themeColor.primaryDividerColor};
  `
      : `
  border-top-width: 1px;
  border-top-color: ${p.$themeColor.primaryDividerColor};
  `}
`;

export const StyledDoxleNavButton = styled(Pressable)``;

export const StyledRightNavBtnWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledShareBtnText = styled.Text<{
  $themeColor: IDOXLEThemeColor;
  $doxleFont: IDoxleFont;
  $fontSize: number;
}>`
  font-family: ${p => p.$doxleFont.titleFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.$fontSize}px;

  color: ${p => p.$themeColor.primaryFontColor};
`;

export const StyledSideMenuModal = styled(Animated.View)<{
  $themeColor: IDOXLEThemeColor;
  $paddingBottom: number;
  $paddingTop: number;
  $width: number;
}>`
  height: 100%;
  width: ${p => p.$width}px;
  background-color: ${p => p.$themeColor.primaryContainerColor};
  padding-top: ${p => p.$paddingTop}px;
  padding-bottom: ${p => p.$paddingBottom}px;
  overflow: hidden;

  box-shadow: 0.4px 8px 8px
    ${p =>
      editRgbaAlpha({
        rgbaColor: p.$themeColor.primaryBoxShadowColor as TRgbaFormat,
        alpha: '0.2',
      })};
  display: flex;
`;

export const StyledSideMenuContainer = styled.View<{
  $themeColor: IDOXLEThemeColor;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.$themeColor.primaryDividerColor};
`;
