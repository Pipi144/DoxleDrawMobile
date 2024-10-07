import styled from 'styled-components/native';

import Animated from 'react-native-reanimated';

export const StyledTextContainer = styled.View<{
  $width: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 28px;
  align-items: center;
  background-color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  border-radius: 8px;
  max-width: ${p => p.$width};
`;
export const StyledTitleText = styled(Animated.Text)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryContainerColor};

  margin-left: 12px;
  text-transform: capitalize;
`;
