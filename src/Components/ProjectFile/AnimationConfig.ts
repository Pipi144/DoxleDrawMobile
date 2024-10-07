import {SharedTransition, withTiming} from 'react-native-reanimated';
const SPRING_CONFIG = {
  mass: 0.4,
  stiffness: 100,
  damping: 8,
};
export const imageSharedTransition = SharedTransition.custom(values => {
  'worklet';
  return {
    height: withTiming(values.targetHeight, {duration: 200}),
    width: withTiming(values.targetWidth, {duration: 200}),
    originX: withTiming(values.targetOriginX, {duration: 200}),
    originY: withTiming(values.targetOriginY, {duration: 200}),
  };
});
