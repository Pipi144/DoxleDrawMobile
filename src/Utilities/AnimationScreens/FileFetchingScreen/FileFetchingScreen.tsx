import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import LottieView from 'lottie-react-native';
type Props = {
  messageText?: string;
  messageTextSize?: number;
  backdrop?: boolean;
  animationViewSize?: {
    width: number;
    height: number;
  };
};

const FileFetchingScreen = ({
  messageText,
  backdrop,
  animationViewSize,
  messageTextSize,
}: Props) => {
  //***************** THEME PROVIDER ************ */
  const {THEME_COLOR, DOXLE_FONT} =
    useDOXLETheme() as IDOXLEThemeProviderContext;
  //**************END OF THEME PROVIDER ************* */

  const lottieType = require('../../LottieJSONFiles/fileFetching.json');

  return (
    <View
      style={[
        styles.rootContainer,
        backdrop && {backgroundColor: THEME_COLOR.primaryBackdropColor},
      ]}>
      <LottieView
        autoPlay
        style={{
          width: animationViewSize ? animationViewSize.width : 144,
          height: animationViewSize ? animationViewSize.height : 144,
          backgroundColor: 'transparent',
        }}
        source={lottieType}
        resizeMode="contain"
      />
      {messageText ? (
        <View style={{marginTop: 8}}>
          <Text
            style={{
              ...styles.textInfoStyle,
              color: THEME_COLOR.doxleColor,
              fontFamily: DOXLE_FONT.primaryFont,
              fontSize: messageTextSize || 18,
              lineHeight: messageTextSize ? messageTextSize + 4 : 18,
            }}>
            {messageText}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default FileFetchingScreen;

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,

    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textInfoStyle: {
    textAlign: 'center',
  },
});
