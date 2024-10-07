import {styled} from 'styled-components/native';
import {View} from 'native-base';
import Animated from 'react-native-reanimated';

export const StyledDoxleCustomTabBar = styled(Animated.View)`
  background-color: ${({theme}) => theme.staticMenuColor.staticBg};
  height: ${p => p.theme.deviceSize.insetBottom + 60}px;

  width: 100%;
`;
export const StyledTabItem = styled.TouchableOpacity<{isSelected: boolean}>`
  width: ${p =>
    p.theme.deviceType === 'Smartphone'
      ? 0.25 * p.theme.deviceSize.deviceWidth
      : (100 / 6 / 100) * p.theme.deviceSize.deviceWidth}px;
  height: 100%;

  justify-content: center;
  align-items: center;
  padding: 10px;

  background-color: transparent;
  transition: background-color 0.8s ease;
  ${props =>
    props.isSelected &&
    `
    transition: all 0.8s ease;
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 5px;
    elevation: 5;
    border-radius: 2px; 
  `}
`;
export const StyledTabItemText = styled.Text<{$isSelected: boolean}>`
  color: ${p =>
    p.$isSelected ? p.theme.staticMenuColor.staticWhiteFontColor : '#9EA6D7'};
  font-size: 12px;
  font-weight: 400;
  margin-top: 5px;
`;
