import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  DOXLE_MAIN_COLOR_MILD_OPACITY,
  NORMAL_CONTENT_FONT_FAMILY,
} from '../../constants';

export const RootLoadingDoxleIconWithText = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const StyledAnimatedIconContainer = styled(Animated.View)``;

export const StyledMessageContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
export const StyledAnimatedChar = styled(Animated.Text)`
  font-family: ${NORMAL_CONTENT_FONT_FAMILY};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: ${DOXLE_MAIN_COLOR_MILD_OPACITY};
  text-transform: none;
`;
export const StyledAnimatedDiamondView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
