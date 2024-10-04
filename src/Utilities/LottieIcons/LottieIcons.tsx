import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
type Props = {
  size?: number;
  iconType: 'close' | 'add';
  containerStyle?: Omit<ViewStyle, 'width' | 'height'>;
};

const LottieIcons = ({size = 30, iconType, containerStyle}: Props) => {
  const lottieAnimation = require('../LottieJSONFiles/closeIconAnimation.json');
  return (
    <View
      style={
        containerStyle
          ? containerStyle
          : [styles.rootContainer, {width: size, height: size}]
      }>
      <LottieView
        autoPlay
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent',
        }}
        source={lottieAnimation}
        resizeMode="contain"
      />
    </View>
  );
};

export default LottieIcons;

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,

    display: 'flex',
    flexDirection: 'column',
  },
});
