import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {editRgbaAlpha} from '../../FunctionUtilities';

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
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.8',
    })};
  text-transform: none;
`;
export const StyledAnimatedDiamondView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
