import {
  ColorValue,
  PressableProps,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useRef} from 'react';
import {StyledDoxleAnimatedButton} from './StyledComponentDoxleButton';
import Animated, {
  Extrapolation,
  Layout,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  AnimatedProps,
  LinearTransition,
} from 'react-native-reanimated';
import {TRgbaFormat, editRgbaAlpha} from '../../../Utilities/FunctionUtilities';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = AnimatedProps<PressableProps> &
  PressableProps & {
    backgroundColor?: string;
    disabledColor?: string;
    pressAnimationEffect?: Array<'scale' | 'opacity'>;
  };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DoxleAnimatedButton = React.forwardRef<View, Props>(
  (
    {
      onPressIn,
      onPressOut,
      backgroundColor,
      disabledColor,
      pressAnimationEffect = ['opacity', 'scale'],
      ...rest
    }: Props,
    ref,
  ) => {
    const {THEME_COLOR} = useDOXLETheme();
    const animatedPressValue = useRef<SharedValue<number>>(
      useSharedValue(0),
    ).current;
    const disableAnimatedValue = useRef<SharedValue<number>>(
      useSharedValue(0),
    ).current;

    useEffect(() => {
      if (rest.disabled)
        disableAnimatedValue.value = withSpring(1, {damping: 16});
      else disableAnimatedValue.value = withSpring(0, {damping: 16});
    }, [rest.disabled]);

    const initialColor = useMemo(
      () => backgroundColor ?? 'rgba(0,0,0,0)',
      [backgroundColor],
    );
    const targetColor = useMemo(
      () =>
        disabledColor ??
        editRgbaAlpha({
          rgbaColor: THEME_COLOR.primaryFontColor as TRgbaFormat,
          alpha: '0.2',
        }),
      [disabledColor, THEME_COLOR],
    );
    const pressInEffect = () => {
      animatedPressValue.value = withSpring(1, {
        damping: 16,
        stiffness: 200,
        mass: 0.4,
      });
    };
    const pressOutEffect = () => {
      animatedPressValue.value = withSpring(0, {
        damping: 16,
        stiffness: 200,
        mass: 0.4,
      });
    };

    const pressAnimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(animatedPressValue.value, [0, 1], [1, 0.95], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      const opacity = interpolate(animatedPressValue.value, [0, 1], [1, 0.8], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      const interpolateBackgroundColor = interpolateColor(
        disableAnimatedValue.value,
        [0, 1],
        [initialColor, targetColor],
      );
      return {
        transform: pressAnimationEffect.includes('scale')
          ? [{scale}]
          : undefined,
        opacity: pressAnimationEffect.includes('opacity') ? opacity : undefined,
        backgroundColor: interpolateBackgroundColor,
      };
    });

    return (
      <AnimatedPressable
        layout={LinearTransition.springify()
          .damping(20)

          .mass(0.4)
          .stiffness(200)}
        {...rest}
        ref={ref}
        style={[pressAnimatedStyle, rest.style]}
        onPressIn={props => {
          if (onPressIn) onPressIn(props);

          pressInEffect();
        }}
        onPressOut={props => {
          if (onPressOut) onPressOut(props);

          pressOutEffect();
        }}
      />
    );
  },
);

export default DoxleAnimatedButton;

const styles = StyleSheet.create({});
