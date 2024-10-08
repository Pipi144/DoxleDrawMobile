import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';

export const StyledAddMenuRootModeContainer = styled(Animated.View)`
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-radius: 12px;
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 200 : 240)}px;
`;

export const StyledAddMenuBtnText = styled.Text<{
  $fontColor?: string;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p => p.$fontColor ?? p.theme.staticMenuColor.staticWhiteFontColor};
`;

export const StyledAddFileFolderModeContainer = styled(Animated.View)<{}>`
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-radius: 12px;
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 200 : 240)}px;
`;
