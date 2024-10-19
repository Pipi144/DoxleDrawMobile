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
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = SvgProps & {
  containerStyle?: ViewStyle;
  percentage: number;
};

const BudgetProgress = ({containerStyle, percentage, ...props}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  return (
    <View
      style={{
        width: 18,
        marginRight: 4,
        ...containerStyle,
        position: 'relative',
        aspectRatio: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
      <Animated.View
        style={{
          ...styles.progressBar,
          top: `${(6 / 20) * 100}%`,
          height: `${(7 / 20) * 100}%`,
          width: `${percentage * 0.97}%`,
        }}
      />
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 18 18"
        fill="none"
        {...props}>
        <Path
          fill={THEME_COLOR.primaryFontColor}
          d="M11.627 3.977V0h1.238v3.977l-.619.619-.62-.62Zm-.371 1.59H5.93l-.62-.62.62-.619h5.325l.619.62-.62.619ZM4.32 3.977V0h1.24v3.977l-.62.619-.619-.62Zm8.904.351H17.2v1.239h-3.976l-.62-.62.62-.619Zm-.359 8.908V17.2h-1.238v-3.963l.619-.619.62.62Zm-8.902-.357H0v-1.238h3.963l.619.619-.62.619ZM5.559 5.94v5.325l-.62.619-.619-.62V5.94l.62-.62.619.62ZM0 4.328h3.963l.619.62-.62.619H0V4.328Zm13.224 7.312H17.2v1.239h-3.976l-.62-.62.62-.618Zm-1.597-.375V5.94l.619-.62.62.62v5.325l-.62.619-.62-.62Zm-5.697.375h5.326l.619.62-.62.619H5.932l-.62-.62.62-.618Zm-.371 1.596V17.2H4.32v-3.963l.62-.619.619.62Z"
        />
      </Svg>
    </View>
  );
};

export default BudgetProgress;

const styles = StyleSheet.create({
  progressBar: {
    position: 'absolute',
    zIndex: 5,
    left: 0,
    backgroundColor: '#FF8C05',
  },
});
