import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';

export const StyledEmptyFileScreenContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
export const StyledAddButtonText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const StyledEmptyFileText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  margin: 8px 0px;
  text-transform: capitalize;
`;
