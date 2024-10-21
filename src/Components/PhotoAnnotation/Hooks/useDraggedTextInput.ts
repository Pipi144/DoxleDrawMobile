import {StyleSheet, TextInput} from 'react-native';
import {useEffect, useRef, useState} from 'react';

import {Gesture} from 'react-native-gesture-handler';
import {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {usePhotoAnnotationContext} from '../PhotoAnnotation';
import {produce} from 'immer';
import {ILabel} from '../../../Models/MarkupTypes';
import {useOrientation} from '../../../Providers/OrientationContext';

type Props = {item: ILabel; itemIndex: number; type: 'added' | 'old'};

const useDraggedTextInput = ({item, itemIndex, type}: Props) => {
  const [inputSize, setInputSize] = useState({width: item.width, height: 0});
  const {setAddedMarkup, backgroundImage, zoomRef, scaledHeight, setOldMarkup} =
    usePhotoAnnotationContext();
  const {deviceSize} = useOrientation();
  const positionX = useRef<SharedValue<number>>(useSharedValue(0)).current;
  const positionY = useRef<SharedValue<number>>(useSharedValue(0)).current;
  const scaleItem = useRef<SharedValue<number>>(useSharedValue(1)).current;
  const inputRef = useRef<TextInput>(null);
  const handleTextChange = (text: string) => {
    if (type === 'added')
      setAddedMarkup(
        produce(draft => {
          const item = draft[itemIndex];
          if (item.type === 'Text') item.text = text;
        }),
      );
    else {
      setOldMarkup(
        produce(draft => {
          if (draft) {
            const item = draft[itemIndex];
            if (item.type === 'Text') item.text = text;
          }
        }),
      );
    }
  };
  const panHandler = Gesture.Pan()
    .onUpdate(e => {
      positionX.value = e.translationX;
      positionY.value = e.translationY;
    })
    .onEnd(e => {
      if (type === 'added')
        runOnJS(setAddedMarkup)(
          produce(draft => {
            const item = draft[itemIndex];
            if (item.type === 'Text') {
              item.x += positionX.value;
              item.y += positionY.value;
            }
          }),
        );
      else
        runOnJS(setOldMarkup)(
          produce(draft => {
            if (draft) {
              const item = draft[itemIndex];
              if (item.type === 'Text') {
                item.x += positionX.value;
                item.y += positionY.value;
              }
            }
          }),
        );
      positionX.value = 0;
      positionY.value = 0;
    })
    .runOnJS(true)
    .minVelocity(0.1);
  const zoomObj = zoomRef.current?._getZoomableViewEventObject();

  const onFocusInput = () => {
    zoomRef.current?._zoomToLocation(item.x * 1.2, item.y * 1.2, 1.2);
  };
  const onBlurInput = () => {
    const scaleWidth = deviceSize.deviceWidth / backgroundImage.width;
    const scaleHeight = deviceSize.deviceHeight / backgroundImage.height;
    const minScale = Math.min(scaleWidth, scaleHeight);

    zoomRef.current?._zoomToLocation(0, 0, 1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: positionX.value},
      {translateY: positionY.value},
      {scale: scaleItem.value},
    ],
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (type === 'added')
        setAddedMarkup(
          produce(draft => {
            const item = draft[itemIndex];
            if (item.type === 'Text') {
              item.width = inputSize.width;
              item.height = inputSize.height;
            }
          }),
        );
      else {
        setOldMarkup(
          produce(draft => {
            if (draft) {
              const item = draft[itemIndex];
              if (item.type === 'Text') {
                item.width = inputSize.width;
                item.height = inputSize.height;
              }
            }
          }),
        );
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [inputSize, type]);
  return {
    panHandler,
    animatedStyle,
    onFocusInput,
    onBlurInput,
    inputSize,
    setInputSize,
    handleTextChange,
    inputRef,
  };
};

export default useDraggedTextInput;

const styles = StyleSheet.create({});
