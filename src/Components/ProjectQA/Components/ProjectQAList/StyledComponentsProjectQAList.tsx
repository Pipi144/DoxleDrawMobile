import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';
import {Pressable, Animated as RNAnimated, TextInput} from 'react-native';
import {
  editRgbaAlpha,
  TRgbaFormat,
} from '../../../../Utilities/FunctionUtilities';
export const StyledProjectQAListContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;

  position: relative;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
  padding: 0px 12px ${p => p.theme.deviceSize.insetBottom + 8}px 12px;
`;
export const StyledQAListItemSwipeView = styled(RNAnimated.View)<{
  $viewWidth: number;
}>`
  height: 100%;
  width: ${p => p.$viewWidth}px;

  z-index: 1;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  right: ${p => (p.$viewWidth > 50 ? 50 : p.$viewWidth)}px;
  max-width: 50px;
  min-width: 40px;
`;
export const StyledQAListItemDeleteIconContainer = styled(
  RNAnimated.View,
)<{}>``;
export const StyledQAListItemLeftSwipeView = styled(RNAnimated.View)<{
  $viewWidth: number;
  $completed: boolean;
}>`
  height: 90%;
  width: ${p => p.$viewWidth}px;

  z-index: 1;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  left: ${p => (p.$viewWidth > 50 ? -50 : -p.$viewWidth)}px;
  background-color: ${p =>
    p.$completed ? 'rgba(255, 6, 6,1)' : 'rgba(18, 183, 24, 0.8)'};
  margin-right: 4px;
  max-width: 50px;
  min-width: 40px;
`;
export const StyledQAListItemContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  z-index: 0;

  border-radius: 12px;
  padding: 14px 0px;
`;

export const StyledQAListItemTopSection = styled.View<{}>`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 0px 8px;
  position: relative;
`;

export const StyledQAListCompletedMark = styled(Animated.View)`
  padding: 2px;
  background-color: rgba(18, 183, 24, 0.8);
  border-radius: 8px;
  margin-right: 4px;
`;

export const StyledQAListItemTitleText = styled(Animated.Text)<{
  $completed?: boolean;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: p.$completed ? '0.4' : '1',
    })};
  flex-shrink: 1;
  letter-spacing: -0.024px;
  text-align: left;
`;
export const StyledQAListItemCountText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
  letter-spacing: -0.024px;
  text-align: left;
`;

export const StyledQAListItemBodySection = styled.View`
  width: 100%;

  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledQAListItemContentRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  width: 100%;
`;

export const StyleNewQAListTitleTextInput = styled(TextInput)<{}>`
  flex: 1;

  padding: 7px 0px;
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: capitalize;
`;
export const StyledAddQAListContainer = styled(Animated.View)<{}>`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  overflow: hidden;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;

export const StyledQAListItemExpandMenuContainer = styled(Animated.View)<{}>`
  width: 100%;

  display: flex;
`;

export const StyledQAListItemExpandMenuBtnText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor as TRgbaFormat,
      alpha: '0.6',
    })};
  text-transform: capitalize;
`;

export const StyledExpandQAListMenuBtn = styled(
  Animated.createAnimatedComponent(Pressable),
)`
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  padding-left: 0px;
  margin: 2px;
`;

export const StyledCompleteCross = styled(Animated.View)`
  position: absolute;
  right: 0;
  height: 1px;
  top: 50%;
  transform: translateY(-0.5px);
  z-index: 100;
  background-color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.6',
    })};
  left: ${p => (p.theme.deviceType === 'Smartphone' ? 40 : 45)}px;
`;
export const StyledQAListMenuModal = styled(Animated.View)`
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
  min-height: 250px;

  ${p =>
    p.theme.deviceType === 'Smartphone'
      ? `
    bottom:0px;
     width: 100%;

    `
      : `
    max-width: 700px;
    width: 100%;
    `}
`;

export const StyledQAListMenuTopSection = styled.View`
  display: flex;
  flex-direction: row;

  align-items: center;
  width: 100%;
  padding: 10px 20px;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
`;
export const StyledQAListMenuTitleText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 500;
`;
export const StyledQAListMenuBtn = styled.Pressable<{}>`
  width: 100%;
  padding: 15px 20px;
  display: flex;
  flex-direction: row;

  align-items: center;
`;
export const StyledQAListMenuBtnText = styled.Text<{}>`
  margin-left: 30px;
  font-family: ${p => p.theme.DOXLE_FONT.sourceCodeRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  line-height: normal;
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
`;
