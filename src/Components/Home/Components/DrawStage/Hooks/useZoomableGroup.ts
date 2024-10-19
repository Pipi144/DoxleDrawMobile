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

import {Gesture} from 'react-native-gesture-handler';
import {
  clamp,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {IStageSize} from '../../../Stores/useKonvaStore';
import {GProps, ImageProps} from 'react-native-svg';
type Props = {
  stageState: IStageSize;
};
const useZoomableGroup = ({stageState}: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const zoomLevel = useSharedValue(1);
  const startScale = useSharedValue(0);
  // Focal point of the pinch gesture
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translateX.value;
      prevTranslationY.value = translateY.value;
    })
    .onUpdate(event => {
      translateX.value = prevTranslationX.value + event.translationX;
      translateY.value = prevTranslationY.value + event.translationY;
    })
    .minPointers(1)
    .maxPointers(1)
    .minDistance(1);

  const zoomGesture = Gesture.Pinch()
    .onStart(event => {
      startScale.value = zoomLevel.value;
      prevTranslationX.value = translateX.value;
      prevTranslationY.value = translateY.value;
    })
    .onUpdate(event => {
      console.log('event', event);
      const scale = startScale.value * event.scale;
      zoomLevel.value = clamp(
        scale,
        0.1,
        Math.min(stageState.width / 100, stageState.height / 100),
      );
      // Calculate focal point (where the fingers pinch)
      const adjustedFocalX = event.focalX - translateX.value;
      const adjustedFocalY = event.focalY - translateY.value;
      translateX.value -= adjustedFocalX * (scale - zoomLevel.value);
      translateY.value -= adjustedFocalY * (scale - zoomLevel.value);
    });

  const composeGesture = Gesture.Race(panGesture, zoomGesture);
  const animatedProps = useAnimatedProps<GProps>(() => ({
    scale: zoomLevel.value,
    translateX: translateX.value,
    translateY: translateY.value,
  }));
  const imgBgAnimatedProps = useAnimatedProps<ImageProps>(() => ({
    scale: zoomLevel.value,
    translateX: translateX.value,
    translateY: translateY.value,
  }));
  return {
    composeGesture,
    translateX,
    translateY,
    zoomLevel,
    animatedProps,
    imgBgAnimatedProps,
  };
};

export default useZoomableGroup;
