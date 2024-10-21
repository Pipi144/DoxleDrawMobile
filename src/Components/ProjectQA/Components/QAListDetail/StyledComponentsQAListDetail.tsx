import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';
import {Pressable, Animated as RNAnimated} from 'react-native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import {IProjectFloor} from '../../../../Models/location';
export const StyledQAListDetailPageContainer = styled(Animated.View)<{
  $insetBottom: number;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: ${p => p.$insetBottom + 4}px;
  padding-left: 8px;
  padding-right: 8px;

  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
`;

export const StyledQAItemSwipeView = styled(RNAnimated.View)<{
  $viewWidth: number;
}>`
  height: 100%;
  width: ${p => p.$viewWidth}px;

  z-index: 1;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  right: ${p => (p.$viewWidth > 90 ? 90 : p.$viewWidth)}px;
  max-width: 90px;
  min-width: 80px;
`;

export const StyledQAItemDeleteIconContainer = styled(RNAnimated.View)<{}>``;
export const StyledQAItemLeftSwipeView = styled(RNAnimated.View)<{
  $viewWidth: number;
}>`
  height: 100%;
  width: ${p => p.$viewWidth}px;

  z-index: 1;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  left: ${p => (p.$viewWidth > 90 ? -90 : -p.$viewWidth)}px;
  max-width: 90px;
  min-width: 80px;
  margin-right: 4px;
`;
export const StyledQAItemWrapper = styled.Pressable<{
  $numOfCol: number;
}>`
  display: flex;
  flex-direction: row;

  ${p =>
    p.$numOfCol <= 1
      ? `
  
   width: 100%;
   padding: 10px 0px
  `
      : `
      width: ${100 / p.$numOfCol}%;
    padding: 10px; 
  `}
`;
export const StyledQAItemContainer = styled(Animated.View)<{
  $numOfCol: number;
}>`
  height: 100%;

  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  border-radius: 4px 12px 12px 4px;
  overflow: hidden;
`;
export const StyledQAItemContentSection = styled.View`
  flex: 1;
  align-self: stretch;
  display: flex;
  padding: 14px 7px 10px 7px;
`;

export const StyledQAItemHeadTitleText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: none;
  width: 100%;
`;

export const StyledQAItemAuthorNameText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: uppercase;
  width: 52%;
`;
export const StyledQAItemFloorText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: capitalize;
`;
export const StyledQAItemCreatedDateText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: none;
  width: 45%;
`;
export const StyledQAItemEmptyImagePlaceHolder = styled.View<{}>`
  width: 100%;
  height: 100%;
  border-radius: 9px;
  border-width: 1px;
  border-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.doxleColor,
      alpha: '0.4',
    })};
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StyledQAItemEmptyImageText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.doxleColor,
      alpha: '0.4',
    })};
  text-transform: capitalize;
  margin-top: 4px;
`;
export const StyledQAItemImageSectionContainer = styled.View<{
  $isPortraitMode: boolean;
  $viewMode: 'list' | 'grid';
}>`
  ${p =>
    p.$viewMode === 'list'
      ? `
    height: ${
      p.theme.deviceType === 'Smartphone' ? 144 : p.$isPortraitMode ? 160 : 250
    }px;
  width: ${p.$isPortraitMode ? 28 : 33}%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  position: relative;
  overflow: hidden;
    `
      : `
     width: 100%;
     height: 50%;
     overflow: hidden;
    `}
`;

export const StyledQAItemListContainer = styled(Animated.View)`
  flex: 1;
  width: 100%;
  position: relative;
`;
export const StyledQALatestCommentText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.sourceCodeRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  margin-top: 4px;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
  text-transform: none;
  width: 100%;
`;
export const StyledAssigneeListWrapper = styled(Animated.View)<{
  $height?: number;
  $width?: number;
}>`
  height: ${p => (p.$height ? `${p.$height}px` : 'fit-content')};
  width: ${p => (p.$width ? `${p.$width}px` : '280px')};
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  position: relative;
  overflow: hidden;
  border-width: 1px;
  border-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;

export const StyledFilterQASearchInput = styled.TextInput<{}>`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 400;
  flex: 1;
  margin-left: 8px;
`;

export const StyledAssigneeItemContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{$selected: boolean}>`
  padding: 10px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const StyledAssigneeNameText = styled.Text<{
  $selected: boolean;
}>`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: ${p => (p.$selected ? 600 : 300)};
  text-transform: capitalize;
`;
export const StyledFilterQASearchWrapper = styled.View<{}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  position: relative;
  margin-top: 14px;
  margin-bottom: 8px;
`;
export const StyledQAFilterModeBtn = styled(
  Animated.createAnimatedComponent(Pressable),
)<{$hasBorderBtm: boolean}>`
  padding: 12px 0px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${p => (p.$hasBorderBtm ? 1 : 0)}px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;
export const StyledQAFilterModeBtnText = styled.Text`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  text-transform: capitalize;
  margin-left: 8px;
`;
export const StyledFloorFilterItem = styled.Pressable`
  padding: 10px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StyledFilterFloorList = styled(
  Animated.FlatList<'none' | 'not-none' | IProjectFloor>,
)`
  flex: 1;
  width: 100%;
`;

export const StyledFloorFilterItemText = styled.Text<{
  $selected: boolean;
}>`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: ${p => (p.$selected ? 600 : 300)};
  text-transform: capitalize;
`;

export const StyledFloorListSectionText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 600;
  text-transform: none;
  margin-top: 14px;
  margin-bottom: 8px;
  text-decoration: underline;
`;
export const StyledQAFilterTagWrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const StyledFilterGraphicDisplay = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const StyledFilterGraphicTextInfo = styled.Text`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-left: 4px;
`;
export const StyledFilterQAModal = styled(Animated.View)`
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
     height: 80%;
    `
      : `
    max-width: 700px;
    width: 100%;
    `}
`;
export const StyledFilterQATitleText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 500;
`;
export const StyledFilterQATopSection = styled.View`
  display: flex;
  flex-direction: row;

  align-items: center;
  width: 100%;
  padding: 10px 20px;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
`;
export const StyledFilterQAFieldWrapper = styled(Animated.View)`
  width: 100%;
  display: flex;
  padding: 10px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
  position: relative;
  overflow: hidden;
`;
export const StyledFilterQALabelText = styled.Text<{
  $bold?: boolean;
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.staticMenuColor.staticWhiteFontColor,
      alpha: p.$bold ? '1' : '0.6',
    })};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
`;

export const StyledQAGridItemWrapper = styled(Animated.View)<{
  $numOfCol: number;
}>`
  display: flex;

  ${p =>
    p.$numOfCol <= 1
      ? `
   width: 100%;
    padding: 10%;
  `
      : `
      width: ${100 / p.$numOfCol}%;
      padding: ${10 / p.$numOfCol}%;
  `}

  aspect-ratio: 0.9;
`;

export const StyledQAGridItem = styled.Pressable`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  border-radius: 12px;
`;
export const StyledQAGridItemInfoSection = styled.View`
  flex: 1;
  width: 100%;
  display: flex;
  padding: 10px 20px;
`;
