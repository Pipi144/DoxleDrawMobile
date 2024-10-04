import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import LottieView from 'lottie-react-native';
import {useInterval} from '../../../CustomHooks/useInterval';
import Animated from 'react-native-reanimated';
type Props = {
  fetchingType: 'image' | 'list' | 'comment';
  messageText?: string;
  backdrop?: boolean;
  containerStyle?: ViewStyle;
  msgTextStyle?: TextStyle;
  size?: number;
};

const FetchingScreen = ({
  fetchingType,
  messageText,
  backdrop,
  containerStyle,
  msgTextStyle,
  size,
}: Props) => {
  const [quoteAutoNumber, setQuoteAutoNumber] = useState(0);
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const lottieType =
    fetchingType === 'image'
      ? require('../../LottieJSONFiles/imageFetch.json')
      : fetchingType === 'comment'
      ? require('../../LottieJSONFiles/commentList.json')
      : require('../../LottieJSONFiles/doxleDog.json');

  useInterval(() => {
    const initialIndex = Math.floor(Math.random() * autoQuote.length);
    setQuoteAutoNumber(initialIndex);
  }, 2000);
  const currentQuote = autoQuote[quoteAutoNumber];

  return (
    <View style={[styles.rootContainer, containerStyle]}>
      <LottieView
        autoPlay
        style={{
          width: size ? size : 144,
          height: size ? size : 144,
          backgroundColor: 'transparent',
        }}
        source={lottieType}
        resizeMode="contain"
      />

      <View style={{marginTop: 8, maxWidth: '80%'}}>
        <Text
          style={{
            color: THEME_COLOR.doxleColor,
            fontFamily: DOXLE_FONT.primaryFont,
            textAlign: 'center',
            fontSize: doxleFontSize.headTitleTextSize,
            ...msgTextStyle,
          }}>
          {messageText ?? currentQuote}
        </Text>
      </View>
    </View>
  );
};

export default FetchingScreen;

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
});

const autoQuote = [
  'Sniffing out all the pixels and herding them into place… Woof!',
  'Chasing the loading bar like a good boy… Almost caught it!',
  'Fetching data sticks like a pro… Just a few more to go!',
  'Mixing up some digital treats for you. Sit! Stay! Almost ready!',
  'Running in digital circles to load your app faster. Tail-wagging soon!',
  "Woof! Please don't tap the screen. It tickles my nose!",
  'Getting all my digital bones buried in the right places… Hang on!',
  'Knitting the code together with my paws. It’s paw-some!',
  'Sniffing out 0s, barking at 1s… I’m on it!',
  'Taking a quick doggy dig break, but I’ll fetch your app in no time!',
];
