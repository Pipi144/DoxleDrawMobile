import {Pressable} from 'react-native';
import {IconButton} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const StyledDoxleIconButton = styled(
  Animated.createAnimatedComponent(IconButton),
)``;
export const StyledDoxleAnimatedButton = styled(
  Animated.createAnimatedComponent(Pressable),
)``;
