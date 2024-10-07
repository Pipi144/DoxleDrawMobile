import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

import {TextInput} from 'react-native';
import {
  editRgbaAlpha,
  getFontSizeScale,
} from '../../Utilities/FunctionUtilities';

export const RootLoginScreen = styled(Animated.View)<{}>`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  position: relative;
  flex-direction: ${p => (p.theme.isPortraitMode ? 'column' : 'row')};
`;

export const StyledLoginTitleText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.pageTitleFontSize}px;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 14px;
`;

export const StyledLoginTextInput = styled(TextInput)<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  width: 100%;
`;

export const StyledErrorMessageContainer = styled.View`
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StyledMagicLinkText = styled.Text`
  font-family: 'IBMPlexMono-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  color: #626276;
  margin-top: 8px;
`;
export const StyledLoadingMaskScreen = styled.View<{}>`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 12;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryContainerColor,
      alpha: '0.9',
    })};
  top: 0;
  left: 0;
`;
export const StyledGreetingLoginScreenContainer = styled(Animated.View)<{}>`
  flex: 1;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  display: flex;
  flex-direction: column;
  padding: 14px 28px;
  justify-content: center;
  align-items: center;
  position: relative;
`;
export const StyledGreetingImageContainer = styled(Animated.View)`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: ${getFontSizeScale(10)}px 0px;
  display: flex;
`;
export const StyledGreetingImage = styled.Image`
  width: 100% !important;
  aspect-ratio: ${378 / 307};

  // min-width: 239px;
  // min-height: 294.27px;
`;
export const StyledTextHeaderWrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0px 20px;
  max-width: 700px;
`;
export const StyledHeaderText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-style: normal;
  font-weight: 700;
  font-size: ${p => p.theme.doxleFontSize.pageTitleFontSize + 10}px;

  margin-top: 4px;
`;
export const StyledSubtitleTextContainer = styled(Animated.View)`
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  margin-top: 8px;
  padding: 0px 20px;
  max-width: 700px;
`;
export const StyledSubtitleText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.sourceCodeRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;
export const StyledButtonContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  align-items: center;
`;
export const StyledUploadDrawingText = styled.Text<{}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.7',
    })};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 700;
`;
export const StyledLoginBtnText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryReverseFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 700;
`;
export const StyledLoginForm = styled(Animated.View)<{
  $isPortraitMode: boolean;
}>`
  width: ${p => (p.$isPortraitMode ? '65%' : '30%')};
  display: flex;
  max-width: 400px;
  align-items: center;
`;

export const StyledLoginFieldWrapper = styled(Animated.View)<{}>`
  display: flex;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
  padding: 12px 24px;
  width: 100%;
  border-radius: 3px;
  margin: 1px 0px;
`;
export const StyledAnimatedErrorText = styled(Animated.Text)<{}>`
  color: red;
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 400;
  margin-top: 4px;
`;
export const StyledSubmitBtnText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryReverseFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
`;
