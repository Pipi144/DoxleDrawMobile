import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import styled from 'styled-components/native';

export const StyledDoxleEmptyPlaceholderContainer = styled(Animated.View)``;

export const StyledEmptyPlaceholderHeaderText = styled.Text``;

export const StyledEmptyPlaceholderSubTitleText = styled.Text``;

export const StylePlaceholderAddButton = styled(
  Animated.createAnimatedComponent(TouchableOpacity),
)``;

export const StyledPlaceholderAddBtnText = styled.Text``;
