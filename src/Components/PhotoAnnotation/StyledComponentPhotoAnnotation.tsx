import {ImageBackground, Platform, Pressable, TextInput} from 'react-native';
import styled from 'styled-components/native';

import Animated from 'react-native-reanimated';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import {Button, IconButton} from 'react-native-paper';
import {IAxisPos} from '../../Models/MarkupTypes';
import {TRgbaFormat} from '../../Utilities/FunctionUtilities';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const StyledPhotoAnnotationContainer = styled.View<{}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
  padding: 0;
  position: relative;

  justify-content: center;
  align-items: center;
`;

export const StyledBottomMenuPhotoContainer = styled(Animated.View)`
  width: 100%;
  height: 60px;
  position: relative;
`;
export const StyledClearButton = styled.Pressable`
  position: absolute;
  width: 70px;
  height: 40px;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
`;

export const StyledUndoBtn = styled(AnimatedPressable)`
  position: absolute;
  left: 45%;
  right: 45%;
  top: 0;
  height: 40px;

  justify-content: center;
  align-items: center;
  border-radius: 25px;
`;

export const StyledMainMenuToolBoxSection = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
export const StyledToolWithColorPickerContainer = styled.View`
  height: 100%;
  width: ${(2 / 3) * 100}%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const StyledColorPickerContainer = styled.View`
  height: ${(2 / 3) * 100}%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const StyledHalfWidthColorPickerContainer = styled.View`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const StyledToolWithoutColorPickerContainer = styled.View`
  height: 100%;
  width: ${(1 / 3) * 100}%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const StyledToolRowFlexContainer = styled.View`
  height: ${(1 / 3) * 100}%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const StyledToolContainerWithRatioSize = styled.View<{
  widthRatio: number;
  heightRatio: number;
}>`
  height: ${p => p.heightRatio}%;
  width: ${p => p.widthRatio}%;

  justify-content: center;
  align-items: center;
`;
export const StyledCurrentToolContainer = styled(Animated.View)`
  justify-content: center;
  align-items: center;
`;
export const StyledZoomableStage = styled(ReactNativeZoomableView)`
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const StyledTopMenuPhotoAnnotationContainer = styled(Animated.View)`
  width: 100%;
  position: absolute;
  align-items: flex-start;
  top: 14px;
  padding-horizontal: 14px;
  padding-top: 10px;
  z-index: 2;
`;

const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);

export const StyledCloseButton = styled(AnimatedPressable)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};

  z-index: 4;
  border: 1px solid ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;
export const StyledAnnotationHandlerContainer = styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
  z-index: 10;
`;
export const StyledRectangleMarkup = styled(Animated.View)<{
  borderWidthInPixel: `${number}px`;
  borderStyle?: 'solid' | 'dashed';
  borderColor: string;
  widthInPixel: `${number}px`;
  heightInPixel: `${number}px`;
  startPoint: IAxisPos;
}>`
  border-width: ${p => p.borderWidthInPixel};
  border-style: ${p => (p.borderStyle ? p.borderStyle : 'solid')};
  border-color: ${p => p.borderColor};
  width: ${p => p.widthInPixel};
  height: ${p => p.heightInPixel};
  position: absolute;
  top: ${p => p.startPoint.y}px;
  left: ${p => p.startPoint.x}px;
`;

export const StyledCircleMarkup = styled(Animated.View)<{
  borderWidthInPixel: `${number}px`;
  borderStyle?: 'solid' | 'dashed';
  borderColor: string;
  width: number;
  height: number;
  startPoint: IAxisPos;
}>`
  border-width: ${p => p.borderWidthInPixel};
  border-style: ${p => (p.borderStyle ? p.borderStyle : 'solid')};
  border-color: ${p => p.borderColor};
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  position: absolute;
  top: ${p => p.startPoint.y}px;
  left: ${p => p.startPoint.x}px;
  border-radius: ${p => p.height / 2}px;
`;

export const StyledBottomSaveMenuContainer = styled(Animated.View)<{
  insetBottom: number;
}>`
  height: 180px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-bottom: ${p => p.insetBottom}px;
  box-shadow: 4px 4px 10px grey;
  width: 100%;
  background-color: white;
  z-index: 4;
  display: flex;
  flex-direction: column;
`;

export const StyledMenuBackdrop = styled.Pressable<{backdropColor: string}>`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  background-color: ${p => p.backdropColor};
`;
export const StyledSaveAlertButton = styled(Button)<{
  haveBorder: boolean;
}>`
  width: 100%;
  height: ${(1 / 3) * 100}%;
  justify-content: center;
  align-items: center;
  border-bottom-width: ${p => (p.haveBorder ? 1 : 0)}px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
  border-bottom-style: solid;
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 22px !important;
  line-height: 25px;
  margin: 0 !important;
  padding: 0 !important;
`;

export const StyledAnnotationTextInput = styled(
  Animated.createAnimatedComponent(TextInput),
)<{
  $x: number;
  $y: number;
  $bgColor: string;

  $width: number;
  $fontSize: number;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.$fontSize}px;

  color: white;
  min-height: ${p => p.$fontSize}px;
  min-width: ${p => p.$width}px;
  background-color: ${p => p.$bgColor};
  padding: 8px;
  position: absolute;
  top: ${p => p.$y}px;
  left: ${p => p.$x}px;
  z-index: 20;
  border-radius: 10px;
`;

export const StyledCurrentColorButton = styled.Pressable<{
  $currentColor: string;
}>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.$currentColor};
`;
export const StyledClearAnnotationButton = styled.Pressable`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;
export const StyledUndoAnnotationButton = styled.Pressable`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;
export const StyledExpandedToolBoxMenuContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  margin-top: 14px;
  flex-direction: column;
`;
export const StyledToolMenuTitleText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: white;
  margin-bottom: 14px;
`;

export const StyledExpandedToolMenuDisplayer = styled(Animated.View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
export const StyledExpandedColorMenuDisplayer = styled(Animated.View)`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
`;
export const StyledSaveMarkupButton = styled(AnimatedPressable)<{
  $insetTop: number;
}>`
  height: 40px;
  width: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  border: 1px solid ${p => p.theme.THEME_COLOR.primaryDividerColor};
  border-radius: 8px;
  position: absolute;
  top: ${p => p.$insetTop + 4}px;
  right: 14px;
  z-index: 4;
`;
export const StyledSaveMarkupBtnText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  line-height: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;
export const StyledImageBackground = styled(
  Animated.createAnimatedComponent(ImageBackground),
)`
  width: 100%;
  height: 100%;
`;

export const StyledAnnotateTopMenu = styled.View`
  position: absolute;
  top: ${p => p.theme.deviceSize.insetTop + 8}px;
  left: 0;
  right: 0;
  padding: 0px 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;
export const StyledAnnotateColorPickerWrapper = styled(Animated.View)<{}>`
  position: absolute;

  right: 8px;
  z-index: 10;
  top: 60px;
`;
export const StyledMarkupTextHandler = styled(Animated.ScrollView)`
  z-index: 9;
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${p => p.theme.staticMenuColor.staticBackdrop};
`;

export const StyledMarkupTextInput = styled(TextInput)<{
  $bgColor?: TRgbaFormat;
}>`
  min-height: ${p => p.theme.doxleFontSize.pageTitleFontSize + 4}px;
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize + 5}px;
  max-width: ${p => p.theme.deviceSize.deviceWidth * 0.8}px;
  min-width: 80px;
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  background-color: ${p => p.$bgColor ?? 'transparent'};
  padding: 14px;
  border-radius: 14px;
`;
