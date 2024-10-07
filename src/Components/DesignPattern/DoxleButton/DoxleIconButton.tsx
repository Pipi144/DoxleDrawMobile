import {StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {IconButtonProps} from 'react-native-paper';
import {StyledDoxleIconButton} from './StyledComponentDoxleButton';
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = IconButtonProps & {};

const DoxleIconButton = (props: Props) => {
  const valuePress = useRef<SharedValue<number>>(useSharedValue(0)).current;
  const handlePressIn = () => {
    valuePress.value = withSpring(1, {damping: 14, mass: 0.2});
  };
  const handlePressOut = () => {
    valuePress.value = withSpring(0, {damping: 14, mass: 0.2});
  };
  const btnAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(valuePress.value, [0, 1], [1, 1.2], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });
    return {
      transform: [{scale}],
    };
  }, [valuePress]);
  return (
    <StyledDoxleIconButton
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
      style={[props.style, btnAnimatedStyle]}
    />
  );
};

export default DoxleIconButton;

const styles = StyleSheet.create({});
