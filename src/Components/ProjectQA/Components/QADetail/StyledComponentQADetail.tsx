import styled from 'styled-components/native';

import Animated from 'react-native-reanimated';
import {Image, KeyboardAvoidingView, Pressable, TextInput} from 'react-native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

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
export const StyledQAImageItemMenu = styled.View`
  position: absolute;
  bottom: 14px;
  right: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 3;
`;
export const StyledQAImageHolder = styled(Image)`
  width: 100%;
  height: 100%;

  z-index: 0;
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
export const StyledQADetailPageContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 12px;
  padding-bottom: 5px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  position: relative;
`;
export const StyledQADetailEditInfoSection = styled(Animated.View)`
  width: 100%;
  padding: 0px 14px;
`;
export const StyledQADetailLabelText = styled.Text<{}>`
  color: rgba(72, 72, 134, 0.4);
  font-family: ${p => p.theme.DOXLE_FONT.secondaryFont};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 14px;
  margin-bottom: 4px;
`;

export const StyledQADetailEditDescriptionContainer = styled.View`
  width: 100%;

  display: flex;
  margin-bottom: 30px;
`;
export const StyledQADescriptionTextInput = styled(TextInput)<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  border-radius: 14px;
  width: 100%;
  min-height: 20px;
  padding: 8px 14px;
`;
export const StyledQADetailEditDueDateContainer = styled(Animated.View)`
  display: flex;
  width: 47.5%;
  margin-bottom: 30px;
`;
export const StyledQADetailDueDateDisplay = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  padding: 8px 14px;
  align-self: flex-start;
`;

export const StyledQADetailDueDateText = styled.Text<{
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
  margin-right: 8px;
`;
export const StyledQADetailEditAssigneeContainer = styled(Animated.View)`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
`;
export const StyledAssigneeDisplayer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  padding: 8px 14px;
  align-self: flex-start;
`;
export const StyledQADetailAssigneeText = styled.Text<{
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
  margin-right: 8px;
`;
export const StyledErrorDescriptionText = styled(Animated.Text)<{}>`
  color: ${p => p.theme.THEME_COLOR.errorColor};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-left: 14px;
  margin-top: 4px;
`;

export const StyledDescriptionInputWrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledSelectedAssigneeDisplayer = styled(Animated.View)<{}>`
  padding: 7px 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 21px;
  border: 1px solid ${p => p.theme.THEME_COLOR.rowBorderColor};
  align-self: flex-start;
  margin-top: 14px;
`;
export const StyledSelectedAssigneeNameText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  text-transform: capitalize;
`;

export const StyledQaDetailEditComment = styled(Animated.View)`
  width: 100%;
  display: flex;
`;
export const StyledCommentInputSectionContainer = styled(Animated.View)<{}>`
  border-radius: 18px;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};

  padding: 14px;
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;
export const StyledCommentTextInput = styled(TextInput)<{
  $fontSize: number;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.$fontSize}px;
  padding: 0px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  flex: 1;
  min-height: 85px;
  max-height: 160px;
`;

export const StyledQACommentItemContainer = styled(
  Animated.createAnimatedComponent(Pressable),
)`
  margin: 8px 0px;
  width: 100%;
  display: flex;
`;
export const StyledQACommentTimestampText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.errorToggleTextSize}px;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.doxleColor,
      alpha: '0.7',
    })};
  margin-left: 14px;
`;
export const StyledQACommentTextWrapper = styled.View<{
  $isOfficial?: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 18px;

  background-color: ${p =>
    p.$isOfficial
      ? editRgbaAlpha({
          rgbaColor: p.theme.THEME_COLOR.doxleColor,
          alpha: '0.4',
        })
      : 'transparent'};

  padding: 8px 14px;
  ${p =>
    !p.$isOfficial &&
    `
  border-width:1px;
  border-color:${p.theme.THEME_COLOR.primaryDividerColor};
  border-style:solid;
  `}
`;
export const StyledQACommentText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  flex: 1;
`;
export const StyledQADetailHeader = styled.View`
  width: 100%;
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
`;

export const StyledQACommentGeneralDetailSection = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  padding: 0px 14px;
`;
export const StyledQACommentAuthorText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};

  text-transform: capitalize;
`;
export const StyledQADetailEditStatusContainer = styled(Animated.View)`
  display: flex;
  width: 47.5%;
  margin-bottom: 30px;
`;

export const StyledQADetailStatusDisplay = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 14px;
  align-self: flex-start;
`;

export const StyledQAStatusText = styled(Animated.Text)<{
  $color: string;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p => p.$color};
  margin-bottom: 4px;
  text-transform: capitalize;
  margin-left: 8px;
`;

export const StyledQALandscapeViewWrapper = styled(
  Animated.createAnimatedComponent(KeyboardAvoidingView),
)`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const StyledQACommentColumn = styled(Animated.View)`
  width: 50%;
  height: 100%;
  display: flex;
`;

export const StyledRetryUploadVideoContainer = styled.View`
  width: 100%;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  background-color: ${p => p.theme.staticMenuColor.staticHover};
  display: flex;
  padding: 12px;
  padding-bottom: ${p =>
    p.theme.deviceType === 'Smartphone' ? p.theme.deviceSize.insetBottom : 0}px;
`;
export const StyledRetryVideoTitleText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  font-style: normal;
  font-weight: 600;

  text-align: center;
  flex: 1;
`;
export const StyledCloseRetryVideoBtn = styled.Pressable`
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 30 : 35)}px;
  height: ${p => (p.theme.deviceType === 'Smartphone' ? 30 : 35)}px;
  border-radius: ${p => (p.theme.deviceType === 'Smartphone' ? 15 : 17.5)}px;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  position: absolute;
  right: 0px;
`;
export const StyledRetryVideoActionBtn = styled.Pressable<{
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
export const StyledRetryVideoActionBtnText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 400;
  flex: 1;
`;
export const StyledQADetailEditRoomFloorContainer = styled(Animated.View)`
  width: 47.5%;
  display: flex;
  margin-bottom: 30px;
`;
export const StyledQARoomFloorDisplayer = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  background-color: ${p => p.theme.THEME_COLOR.textInputBgColor};
  padding: 8px 14px;
  align-self: flex-start;
`;

export const StyledQARoomFloorDisplayerText = styled.Text<{
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
  margin-right: 8px;
`;

export const StyledQAEditPopoverListItem = styled.Pressable`
  width: 100%;
  padding: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;
export const StyledRoomListPopoverWrapper = styled(Animated.View)<{
  $height?: number;
}>`
  height: ${p => (p.$height ? `${p.$height}px` : '300px')};
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 300 : 350)}px;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  position: relative;
  overflow: hidden;
  border-width: 1px;
  border-color: ${p => p.theme.THEME_COLOR.rowBorderColor};
`;
export const StyledPopoverSearchTextInput = styled.TextInput`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 400;
  padding: 0px;
  flex: 1;
`;
export const StyledSearchPopoverWrapper = styled.View`
  width: 100%;
  padding: 8px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;
export const StyledQAEditPopoverListItemText = styled.Text<{
  $type: 'sub' | 'main';
}>`
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: p.$type === 'main' ? '1' : '0.4',
    })};
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 500;
  margin-right: 8px;
  text-transform: capitalize;
  margin-top: ${p => (p.$type === 'sub' ? 4 : 0)}px;
`;
