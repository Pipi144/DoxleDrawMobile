import Animated from 'react-native-reanimated';
import {FasterImageView, clearCache} from '@candlefinance/faster-image';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {Image, Pressable} from 'react-native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
export const StyledProjectFileDisplayerContainer = styled(
  GestureHandlerRootView,
)`
  width: 100%;
  height: 100%;

  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
  display: flex;
  position: relative;
`;

export const StyledProjectFileListItemContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  width: 100%;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  border-radius: 2px;
  margin-bottom: 10px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const StyledFileIconWrapper = styled.View<{$width: number}>`
  justify-content: center;
  align-items: center;
  width: ${p => p.$width}px;
  aspect-ratio: 1;
  position: relative;
  margin-right: 14px;
`;
export const StyledFilePressEffect = styled(Animated.View)<{}>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  background-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.rowHoverColor,
      alpha: '0.4',
    })};
`;
export const StyledListFileNameText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  letter-spacing: -0.26px;
  max-width: 100%;
`;

export const StyledProjectFileListViewContainer = styled(Animated.View)`
  flex: 1;
  width: 100%;
  padding: 0px 14px;
  display: flex;
  position: relative;
  padding-bottom: ${p => p.theme.deviceSize.insetBottom}px;
`;
export const StyledSkeletonGridWrapper = styled.View<{$numOfCol: number}>`
  width: ${p => 100 / p.$numOfCol}%;
  aspect-ratio: 1;
  display: flex;
  padding: 10px;
`;

export const StyledGridListItemWrapper = styled(Animated.View)<{
  $numOfCol: number;
}>`
  width: ${p => 100 / p.$numOfCol}%;
  aspect-ratio: 1;
  padding: 8px;
  display: flex;
`;
export const StyledGridContentWrapper = styled(Pressable)<{}>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  padding: 8px;
`;
export const StyledGridFileInfoText = styled.Text<{}>`
  margin-top: 2px;

  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  letter-spacing: 0.24px;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
`;
export const StyledGridFileNameText = styled.Text<{}>`
  margin-top: 4px;

  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  letter-spacing: -0.24px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;

export const StyledProjectFileGridView = styled(Animated.View)`
  width: 100%;
  flex: 1;

  position: relative;
  display: flex;
  padding: 0px 12px;
  padding-bottom: ${p => p.theme.deviceSize.insetBottom}px;
`;
export const StyledProjectFileInsideFolderContainer = styled(Animated.View)<{
  $paddingTop: number;
}>`
  flex: 1;
  width: 100%;
  display: flex;
  padding-top: ${p => p.$paddingTop}px;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
  position: relative;
`;

export const StyledFolderFileListViewContainer = styled(Animated.View)`
  width: 100%;
  flex: 1;
  display: flex;
  position: relative;
  padding: 0px 12px;
  padding-bottom: ${p => p.theme.deviceSize.insetBottom}px;
`;

export const StyledFolderFilesGridViewContainer = styled(Animated.View)`
  flex: 1;
  width: 100%;
  display: flex;
  padding: 0px 12px;
  padding-bottom: ${p => p.theme.deviceSize.insetBottom}px;
`;

export const StyledFileImageWrapper = styled(FasterImageView)<{$width: number}>`
  width: ${p => p.$width}px;
  aspect-ratio: 1;
  overflow: hidden;
`;

export const StyledPendingImageWrapper = styled(Image)<{$width: number}>`
  width: ${p => p.$width}px;
  aspect-ratio: 1;
  overflow: hidden;
`;
export const StyledListFileInfoText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
  letter-spacing: -0.26px;
  max-width: 100%;
`;
