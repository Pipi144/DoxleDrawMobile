// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

type Props = {
  containerStyle?: ViewStyle;
  size?: number;
};

const UploadingLoader = ({containerStyle, size = 30}: Props) => {
  const lottieAnimation = require('../../LottieJSONFiles/uploadFiles.json');
  return (
    <View
      style={[
        styles.rootContainer,
        {width: size, height: size},
        containerStyle,
      ]}>
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

export default UploadingLoader;

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,

    display: 'flex',
  },
});
