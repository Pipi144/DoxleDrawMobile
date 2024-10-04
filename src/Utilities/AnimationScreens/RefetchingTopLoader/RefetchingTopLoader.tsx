import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  StyledAnimatedStatusItem,
  StyledAnimatedStatusSection,
  StyledRefetchingTopLoaderContainer,
} from './StyledComponentRefetchingTopLoader';
import {
  Extrapolation,
  FadeIn,
  FadeOut,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import LottieView from 'lottie-react-native';
type Props = {
  height: number;
};

const RefetchingTopLoader = ({height}: Props) => {
  const jumpAnimationTime = 5000;
  const initialAnimationTime = 1500;
  const colorAnimationTime = 3000;
  const lottieType = require('../../LottieJSONFiles/dogWalkingWithoutUnderline.json');
  //################ HANDLE ANIMATION ###############
  const colorAnimatedValue = useSharedValue(0);
  const initialAnimatedValue = useSharedValue(0);

  useEffect(() => {
    initialAnimatedValue.value = withRepeat(
      withDelay(
        300,
        withTiming(100, {duration: initialAnimationTime}, finished => {
          if (finished)
            colorAnimatedValue.value = withTiming(90, {
              duration: colorAnimationTime,
            });
        }),
      ),
      -1,
      true,
    );
  }, []);

  //############ END OF HANDLE ANIMATION ############
  return (
    <StyledRefetchingTopLoaderContainer
      heightInPixel={`${height}px`}
      entering={FadeIn.springify()}
      exiting={FadeOut.springify()}>
      <LottieView
        autoPlay
        style={{
          width: 80,
          height: 60,
          backgroundColor: 'transparent',
        }}
        source={lottieType}
        resizeMode="contain"
      />
      <StyledAnimatedStatusSection>
        <AnimatedStatusItem
          type="unattended"
          initialAnimatedValue={initialAnimatedValue}
          colorAnimatedValue={colorAnimatedValue}
        />
        <AnimatedStatusItem
          type="working"
          initialAnimatedValue={initialAnimatedValue}
          colorAnimatedValue={colorAnimatedValue}
        />
        <AnimatedStatusItem
          type="completed"
          initialAnimatedValue={initialAnimatedValue}
          colorAnimatedValue={colorAnimatedValue}
        />
      </StyledAnimatedStatusSection>
    </StyledRefetchingTopLoaderContainer>
  );
};

export default RefetchingTopLoader;

const styles = StyleSheet.create({});

const AnimatedStatusItem = (props: {
  type: 'unattended' | 'working' | 'completed';
  initialAnimatedValue: SharedValue<number>;
  colorAnimatedValue: SharedValue<number>;
}) => {
  //***************** THEME PROVIDER ************ */
  const {THEME_COLOR, DOXLE_FONT} =
    useDOXLETheme() as IDOXLEThemeProviderContext;
  //**************END OF THEME PROVIDER ************* */
  const {type, initialAnimatedValue, colorAnimatedValue} = props;
  const initialColor =
    type === 'working'
      ? ' rgb(255, 186, 53)'
      : type === 'completed'
      ? 'rgba(18, 183, 24, 0.8)'
      : 'rgb(255, 6, 6)';
  const initialAnimatedStyle = useAnimatedStyle(() => {
    const translateX =
      type === 'unattended'
        ? interpolate(initialAnimatedValue.value, [0, 100], [-10, 0], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          })
        : type === 'completed'
        ? interpolate(initialAnimatedValue.value, [0, 100], [10, 0], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          })
        : 0;
    const opacity = interpolate(initialAnimatedValue.value, [0, 100], [0, 1], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });
    const translateY =
      type === 'working'
        ? interpolate(initialAnimatedValue.value, [0, 100], [10, 0], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          })
        : 0;
    return {
      opacity,
      transform: [{translateX}, {translateY}],
    };
  });
  const inputRange =
    type === 'working' ? [30, 60] : type === 'unattended' ? [0, 30] : [60, 90];
  const bgAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorAnimatedValue.value,
      inputRange,
      [initialColor, THEME_COLOR.doxleColor],
      'RGB',
    );
    const borderRadius = interpolate(
      initialAnimatedValue.value,
      inputRange,
      [0, 4],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      backgroundColor,
      borderRadius,
    };
  });
  return (
    <StyledAnimatedStatusItem
      style={[
        initialAnimatedStyle,
        bgAnimatedStyle,
      ]}></StyledAnimatedStatusItem>
  );
};
