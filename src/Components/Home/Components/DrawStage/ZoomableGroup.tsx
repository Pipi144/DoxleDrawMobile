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

import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import Animated from 'react-native-reanimated';
import Svg, {G, Image} from 'react-native-svg';
import useZoomableGroup from './Hooks/useZoomableGroup';
import {GestureDetector} from 'react-native-gesture-handler';
import {IStageSize} from '../../Stores/useKonvaStore';

type Props = PropsWithChildren & {
  stageState: IStageSize;
};
const SVGGroup = Animated.createAnimatedComponent(G);
const SVGImage = Animated.createAnimatedComponent(Image);
const ZoomableGroup = ({children, stageState, ...props}: Props) => {
  const {
    composeGesture,

    animatedProps,
    imgBgAnimatedProps,
  } = useZoomableGroup({
    stageState,
  });
  return (
    <GestureDetector gesture={composeGesture}>
      <Svg
        width={'100%'}
        height={'100%'}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${stageState.minX} ${stageState.minY} ${stageState.width} ${stageState.height}`}>
        <SVGImage
          href={require('../../../../assets/images/gridbg.png')}
          width={stageState.width}
          height={stageState.height}
          x={stageState.minX}
          y={stageState.minY}
          animatedProps={imgBgAnimatedProps}
        />
        <SVGGroup
          stroke={'black'}
          strokeWidth={10}
          animatedProps={animatedProps}>
          {children}
        </SVGGroup>
      </Svg>
    </GestureDetector>
  );
};

export default ZoomableGroup;

const styles = StyleSheet.create({});
