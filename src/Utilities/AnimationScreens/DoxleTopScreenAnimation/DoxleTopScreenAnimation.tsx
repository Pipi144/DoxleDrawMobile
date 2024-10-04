//!THIS COMPONENT SHOULD BE ABSOLUTE WITH THE WHOLE SCREEN PARENT, ie, THE PARENT SHOULD OCUPY THE WHOLE SCREEN
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  IDOXLEThemeColor,
  IDOXLEThemeProviderContext,
  IDoxleFont,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  IOrientation,
  useOrientation,
} from '../../../Providers/OrientationContext';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {XSDoxleIcon} from '../../../RootAppIcons';

type Props = {
  textMessage?: string;
};

const DoxleTopScreenAnimation = ({textMessage}: Props) => {
  //***************** THEME PROVIDER *************** */
  const {THEME_COLOR, DOXLE_FONT} =
    useDOXLETheme() as IDOXLEThemeProviderContext;
  //*********END OF THEME PROVIDER****************** */

  //******************* ORIENTATION PROVIDER ************ */
  const {deviceSize} = useOrientation() as IOrientation;
  //***********END OF ORIENTATION PROVIDER********* */
  const styleProps = {
    insetTop: deviceSize.insetTop,
    themeColor: THEME_COLOR,
    doxleFont: DOXLE_FONT,
  };

  //################## HANDLE ANIMATION #################
  const textAnimatedValue = useSharedValue(0);
  const iconAnimatedValue = useSharedValue(0);
  const rotateIconAnimatedValue = useSharedValue(0);
  const textAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      textAnimatedValue.value,
      [0, 0.5, 1],
      [0, -5, 0],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    const rotateZ = interpolate(
      textAnimatedValue.value,
      [0, 0.4, 0.8, 0.9, 1],
      [0, 0, -10, 10, 0],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    return {
      transform: [{translateY}, {rotateZ: `${rotateZ}deg`}],
    };
  });
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      iconAnimatedValue.value,
      [0, 0.5, 1],
      [1, 1.2, 1],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    const rotateY = interpolate(
      rotateIconAnimatedValue.value,
      [0, 1],
      [0, 180],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    return {
      transform: [{scale}],
    };
  });
  useEffect(() => {
    textAnimatedValue.value = withRepeat(withTiming(1, {duration: 1000}), -1);
    iconAnimatedValue.value = withRepeat(
      withTiming(1, {duration: 2000}),
      -1,
      true,
    );
  }, []);

  //############ END OF HANDLE ANIMATION ################
  return (
    <Animated.View style={styles(styleProps).rootContainer}>
      <Animated.View
        style={[styles(styleProps).iconContainer, iconAnimatedStyle]}>
        <XSDoxleIcon />
      </Animated.View>

      <Animated.View>
        <Animated.Text
          style={[styles(styleProps).textMessageStyle, textAnimatedStyle]}>
          {textMessage ? textMessage : 'Loading...'}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

export default DoxleTopScreenAnimation;
interface StyleProp {
  insetTop: number;
  themeColor: IDOXLEThemeColor;
  doxleFont: IDoxleFont;
}
const styles = (props: StyleProp) =>
  StyleSheet.create({
    rootContainer: {
      minWidth: 140,
      minHeight: 30,
      position: 'absolute',
      top: props.insetTop + 4,
      right: 4,
      zIndex: 100,

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },

    iconContainer: {marginBottom: 8},
    textMessageStyle: {
      fontFamily: props.doxleFont.primaryFont,
      fontSize: 12,
      fontWeight: '500',
      fontStyle: 'normal',
      color: props.themeColor.doxleColor,
    },
  });
