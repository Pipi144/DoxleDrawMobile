import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Pressable, TextInput} from 'react-native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
export const StyledModalPdfAssignee = styled(Animated.View)`
  position: absolute;

  background-color: ${p => p.theme.staticMenuColor.staticBg};

  padding: 10px 0px;
  padding-bottom: ${p => p.theme.deviceSize.insetBottom}px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-color: ${p => p.theme.staticMenuColor.staticDivider};
  border-style: solid;
  border-bottom-width: 0px;
  min-height: 300px;

  ${p =>
    p.theme.deviceType === 'Smartphone'
      ? `
    bottom:0px;
     width: 100%;
     height: 70%;
    `
      : `
    max-width: 700px;
    width: 100%;
    height: 70%;
    max-height: 900px;
    `}
`;
export const StyledQAViewPDFPageContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  position: relative;

  padding: 14px 0px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const StyledPdfThumbnailListContainer = styled(
  Animated.FlatList<any>,
)<{}>`
  width: 100%;
  height: 100%;
  background-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.doxleColor,
      alpha: '0.8',
    })};
`;
export const StyledThumbnailItemContainer = styled.Pressable<{
  $isPortraitMode: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 4px;
  ${p =>
    p.$isPortraitMode
      ? `
    height:80%;
    aspect-ratio:0.7;
  `
      : `
  width:70%;
  aspect-ratio:0.7`}
`;
export const StyledImageThumnail = styled(Animated.Image)<{
  heightInPixel: `${number}px`;
  widthInPixel: `${number}px`;
}>`
  width: 100%;
  height: 100%;
  border-radius: 3px;
`;
export const StyledPdfWrapper = styled(Animated.View)`
  flex: 1;
  width: 100%;
  padding: 0px 14px;
  display: flex;
`;
export const StyledPdfTopSectionContainer = styled(Animated.View)`
  width: 100%;
  padding: 8px 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const StyledPdfPageSkeleton = styled(Animated.View)<{}>`
  flex: 1;
  display: flex;
  width: 95%;

  border-radius: 8px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  padding: 14px;
  overflow: hidden;
`;
export const StyledConstributorDisplay = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  padding: 4px 8px;
  align-self: flex-start;
  border: 1px solid ${p => p.theme.THEME_COLOR.rowBorderColor};
  overflow: hidden;
`;
export const StyledQAContributorText = styled.Text<{
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
`;

export const StyledContributorItemContainer = styled(Pressable)<{}>`
  width: 100%;
  height: 40px;
  display: flex;
  padding: 0px 8px;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
`;
export const StyledQAContributorItemText = styled.Text<{
  $selected: boolean;
}>`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: ${p => (p.$selected ? 600 : 300)};
  margin-right: 8px;
`;
export const StyledSelectAssigneePdfView = styled.View`
  width: 100%;
  height: 100%;
  display: flex;

  position: relative;

  overflow: hidden;
`;
export const StyledSearchAssigneeSection = styled.View`
  width: 100%;
  padding: 8px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const StyledSearchAssigneeTextInput = styled(TextInput)<{}>`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  width: 100%;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
`;
export const StyledUploadingPrompt = styled(Animated.View)<{}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackdropColor};
`;
export const StyledPromtBanner = styled(Animated.View)<{}>`
  width: 80%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  shadow-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.4;
  shadow-radius: 14px;
  border-radius: ${p => (p.theme.deviceType === 'Smartphone' ? 9 : 12)}px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  margin-bottom: ${p => (p.theme.deviceType === 'Smartphone' ? 100 : 120)}px;
`;
export const StyledTitlePrompt = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 600;
`;

export const StyledTitlePromptSection = styled.View<{}>`
  width: 100%;
  padding: 14px;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledPromptMessageSection = styled.View`
  width: 100%;
  padding: 14px;
  padding-bottom: 28px;
`;
export const StyledMessagePromptText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 400;
`;
export const StyledProgressCountText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 400;
`;
export const StyledPDFContentWrapper = styled(Animated.View)<{
  $isPortraitMode: boolean;
}>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  ${p =>
    p.$isPortraitMode
      ? `
  
  height:100%;
  
  `
      : `
 
  width:100%;
  `}
`;
