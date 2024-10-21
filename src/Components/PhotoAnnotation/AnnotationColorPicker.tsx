import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TAnnotationColors} from '../../../Models/MarkupTypes';
import {usePhotoAnnotationContext} from './PhotoAnnotation';

type Props = {
  color: TAnnotationColors;
  handleCloseToolMenu: () => void;
};

const AnnotationColorPicker = ({color, handleCloseToolMenu}: Props) => {
  const {currentColorForTool, setCurrentColorForTool} =
    usePhotoAnnotationContext();
  const handlePressColor = () => {
    setCurrentColorForTool(color);
    handleCloseToolMenu();
  };
  return (
    <Pressable onPress={handlePressColor}>
      <View
        style={{
          width: 50,
          height: 50,
          borderColor: 'white',
          borderRadius: 25,
          borderWidth: currentColorForTool === color ? 1 : 0,
          backgroundColor: color,
        }}
      />
    </Pressable>
  );
};

export default AnnotationColorPicker;

const styles = StyleSheet.create({});
