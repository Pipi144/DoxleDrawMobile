import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const StyledRefetchingTopLoaderContainer = styled(Animated.View)<{
  heightInPixel: `${number}px`;
}>`
  width: 100%;
  height: ${p => p.heightInPixel};
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;
export const StyledAnimatedStatusItem = styled(Animated.View)`
  width: 30px;
  height: 4px;
  margin: 0px 2px;
`;

export const StyledAnimatedStatusSection = styled.View`
  display: flex;
  flex-direction: row;
`;
