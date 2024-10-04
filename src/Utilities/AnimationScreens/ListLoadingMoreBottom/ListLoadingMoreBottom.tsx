import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';

type Props = {
  size?: number;
  textMessage?: string;
  textFontSize?: number;
  containerStyle?: ViewStyle;
};

const ListLoadingMoreBottom = ({
  size,
  textMessage,
  textFontSize,
  containerStyle,
}: Props) => {
  //***************** THEME PROVIDER ************ */
  const {THEME_COLOR, DOXLE_FONT} =
    useDOXLETheme() as IDOXLEThemeProviderContext;
  //*************END OF THEME PROVIDER ************ */
  const lottieAnimation = require('../../LottieJSONFiles/loadingMore.json');

  return (
    <Animated.View
      style={containerStyle ? containerStyle : styles.rootContainer}
      layout={Layout.springify().damping(14)}
      entering={FadeInDown}
      exiting={FadeOutDown}>
      <LottieView
        autoPlay
        style={{
          width: size ? size : 100,
          height: size ? size : 100,
          backgroundColor: 'transparent',
        }}
        source={lottieAnimation}
        resizeMode="contain"
      />
      {textMessage ? (
        <View style={{marginTop: 8}}>
          <Text
            style={{
              ...styles.textInfoStyle,
              color: THEME_COLOR.doxleColor,
              fontFamily: DOXLE_FONT.secondaryFont,
              fontSize: textFontSize ? textFontSize : 18,
            }}>
            {textMessage}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default ListLoadingMoreBottom;

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
  textInfoStyle: {
    lineHeight: 20,
    textAlign: 'center',
  },
});
