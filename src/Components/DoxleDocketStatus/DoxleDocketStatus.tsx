import {StyleSheet, ViewStyle} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Animated, {
  BounceIn,
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  size?: number;
  statusColor?: string;
  animated?: boolean;
  extraStyle?: Omit<
    ViewStyle,
    'width' | 'height' | 'borderRadius' | 'borderColor' | 'borderWidth'
  >;
  variants?: 'circle' | 'dot' | 'diamond';
}

const DoxleDocketStatus = ({
  size = 14,
  statusColor = 'gray',
  animated = false,
  extraStyle,
  variants = 'circle',
}: Props) => {
  const borderWidthRatio = 2.5 / 14;
  const animatedDiamondValue = useRef<SharedValue<number>>(
    useSharedValue(1),
  ).current;
  useEffect(() => {
    if (variants === 'diamond') {
      if (animated)
        animatedDiamondValue.value = withRepeat(
          withSequence(
            withTiming(1, {duration: 300}),
            withTiming(0, {duration: 300}),
            withTiming(1, {duration: 300}),
            withTiming(0, {duration: 300}),
            withTiming(1, {duration: 300}),
            withTiming(1, {duration: 900}),
          ),
          -1,
        );
      else animatedDiamondValue.value = 1;
    }
  }, [animated, variants]);

  const diamondAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedDiamondValue.value,
      transform: [
        {
          rotateZ: '45deg',
        },
      ],
    };
  });
  if (variants === 'circle')
    return (
      <Animated.View
        layout={animated ? LinearTransition.springify().damping(16) : undefined}
        entering={animated ? BounceIn : undefined}
        style={{
          ...extraStyle,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColor,
        }}
      />
    );
  else if (variants === 'dot')
    return (
      <Animated.View
        layout={animated ? LinearTransition.springify().damping(16) : undefined}
        entering={animated ? BounceIn : undefined}
        style={{
          ...extraStyle,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColor,
        }}
      />
    );
  else
    return (
      <Animated.View
        layout={
          animated
            ? LinearTransition.springify().damping(16).mass(0.4)
            : undefined
        }
        entering={animated ? BounceIn : undefined}
        style={[
          {
            ...extraStyle,
            width: size,
            height: size,
            borderRadius: size / 5,
            borderWidth: 2,
            borderColor: statusColor,
          },
          diamondAnimatedStyle,
        ]}
      />
    );
};

export default DoxleDocketStatus;

const styles = StyleSheet.create({});
