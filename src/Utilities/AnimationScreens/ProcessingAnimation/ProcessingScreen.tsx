import {StyleSheet, Text, TextStyle, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Animated, {
  FadeIn,
  FadeOut,
  SharedValue,
  StyleProps,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {getFontSizeScale} from '../../FunctionUtilities';

type Props = {
  processingType:
    | 'delete'
    | 'update'
    | 'add'
    | 'pdf'
    | 'invoice'
    | 'email'
    | 'qr';
  processingText?: string;
  containerStyle?: StyleProps;
  animationSize?: number;
  loadingTextStyle?: TextStyle;
};

const ProcessingScreen = ({
  processingType,
  processingText,
  containerStyle,
  animationSize,
  loadingTextStyle,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const lottieType =
    processingType === 'update'
      ? require('../../LottieJSONFiles/updating.json')
      : processingType === 'delete'
      ? require('../../LottieJSONFiles/delete.json')
      : processingType === 'pdf'
      ? require('../../LottieJSONFiles/pdfLoading.json')
      : processingType === 'invoice'
      ? require('../../LottieJSONFiles/invoiceProcess.json')
      : processingType === 'email'
      ? require('../../LottieJSONFiles/sendMail.json')
      : processingType === 'qr'
      ? require('../../LottieJSONFiles/qrScan.json')
      : require('../../LottieJSONFiles/add.json');
  const textAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(textAnimatedValue.value, [0, 1], [0, 1]);
    return {
      opacity,
    };
  });
  useEffect(() => {
    textAnimatedValue.value = withRepeat(
      withTiming(1, {duration: 500}),
      -1,
      true,
    );
  }, []);
  return (
    <Animated.View
      style={containerStyle ?? styles.rootContainer}
      entering={FadeIn}
      exiting={FadeOut}>
      <LottieView
        autoPlay
        style={{
          width: animationSize ?? 100,
          height: animationSize ?? 100,
          backgroundColor: 'transparent',
        }}
        source={lottieType}
        resizeMode="contain"
      />
      {processingText ? (
        <View style={{marginTop: 8}}>
          <Animated.Text
            style={[
              {
                color:
                  processingType === 'delete' ? 'red' : THEME_COLOR.doxleColor,
                fontFamily: DOXLE_FONT.lexendRegular,
                fontSize: doxleFontSize.subContentTextSize,

                textAlign: 'center',
              },
              loadingTextStyle,
              textStyle,
            ]}>
            {processingText}
          </Animated.Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default ProcessingScreen;

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,

    display: 'flex',
    flexDirection: 'column',
  },
});
