import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  RootLoadingDoxleIconWithText,
  StyledAnimatedChar,
  StyledAnimatedDiamondView,
  StyledAnimatedIconContainer,
  StyledMessageContainer,
} from './StyledComponentsLoadingDoxleIconWithText';
import {DOXLEDogIcon} from './LoadingIcons';
import {interpolatePath} from 'd3-interpolate-path';
import LottieView from 'lottie-react-native';
import {ISVGResponsiveCustom} from '../../../Models/utilityType';

import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

import Svg, {Path, PathProps} from 'react-native-svg';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {TRgbaFormat, editRgbaAlpha} from '../../FunctionUtilities';
import {useInterval} from '../../../CustomHooks/useInterval';
import {produce} from 'immer';

type Props = {
  message?: string;
  size?: number;
  containerStyle?: ViewStyle;
};

const LoadingDoxleIconWithText = ({
  message,
  size = 180,
  containerStyle,
}: Props) => {
  const [shouldStart, setshouldStart] = useState(false);
  const [orderAnimated, setOrderAnimated] = useState<number[]>([]);
  const [currentAnimatedIdx, setCurrentAnimatedIdx] = useState(0);

  const lottieType = require('../../LottieJSONFiles/doxleDog.json');
  const {THEME_COLOR} = useDOXLETheme();
  useInterval(() => {
    if (shouldStart) setCurrentAnimatedIdx(prev => prev + 1);
  }, 1000);
  useEffect(() => {
    if (shouldStart)
      setOrderAnimated(
        produce(draft => {
          if (currentAnimatedIdx < 4) draft.push(currentAnimatedIdx);
          else {
            draft = [];
            setCurrentAnimatedIdx(0);
          }
          return draft;
        }),
      );
  }, [currentAnimatedIdx, shouldStart]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setshouldStart(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <RootLoadingDoxleIconWithText style={containerStyle}>
      <LottieView
        autoPlay
        style={{
          width: size ? size : 144,
          height: size ? size : 144,
          backgroundColor: 'transparent',
          marginTop: size ? -size / 10 : -18,
        }}
        source={lottieType}
        resizeMode="contain"
      />

      <StyledAnimatedDiamondView style={{marginTop: size ? -size / 10 : -18}}>
        {[1, 2, 3, 4].map((_, index) => (
          <AnimatedDiamond
            themeColor={THEME_COLOR}
            isAnimated={orderAnimated.includes(index)}
            key={index}
            containerStyle={{
              marginHorizontal: 2,
              width: 20,
            }}
          />
        ))}
      </StyledAnimatedDiamondView>
    </RootLoadingDoxleIconWithText>
  );
};

export default LoadingDoxleIconWithText;
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedDiamond = ({
  themeColor,
  containerStyle,
  isAnimated,
  ...props
}: ISVGResponsiveCustom & {
  isAnimated: boolean;
}) => {
  const animatedValue = useRef<SharedValue<number>>(useSharedValue(0)).current;
  const startFill = editRgbaAlpha({
    rgbaColor: themeColor.primaryFontColor as TRgbaFormat,
    alpha: '0',
  });
  const animatedProps = useAnimatedProps<PathProps>(() => {
    return {
      fill: interpolateColor(
        animatedValue.value,
        [0, 1],
        [startFill, themeColor.primaryFontColor],
      ),
      strokeOpacity: interpolate(animatedValue.value, [0, 1], [0.5, 1]),
    };
  });
  useEffect(() => {
    if (isAnimated) {
      animatedValue.value = withTiming(1, {duration: 1000});
    } else {
      animatedValue.value = withTiming(0, {duration: 50});
    }
  }, [isAnimated]);

  return (
    <View
      style={{
        width: 16,
        ...containerStyle,
        aspectRatio: 11 / 12,
        display: 'flex',
      }}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 11 12"
        fill="none"
        {...props}>
        <AnimatedPath
          stroke={themeColor.primaryFontColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          animatedProps={animatedProps}
          d="m4.748 10.674-3.455-3.84c-.39-.435-.39-1.235 0-1.667l3.455-3.84a.917.917 0 0 1 .331-.24 1.058 1.058 0 0 1 .842 0 .9.9 0 0 1 .33.24l3.456 3.84c.39.434.39 1.234 0 1.666l-3.456 3.84a.917.917 0 0 1-.33.24 1.058 1.058 0 0 1-.842 0 .917.917 0 0 1-.33-.24Z"
        />
      </Svg>
    </View>
  );
};
