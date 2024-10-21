import {StyleSheet, TextInput} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {usePhotoAnnotationContext} from '../PhotoAnnotation';
import {produce} from 'immer';
import {useOrientation} from '../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {ILabel} from '../../../Models/MarkupTypes';
import {areColorsSimilar} from '../../../Utilities/FunctionUtilities';

type Props = {};

const useMarkupTextHandler = () => {
  const [inputText, setInputText] = useState('');
  const [inputSize, setInputSize] = useState({width: 0, height: 0});
  const {
    tool,
    setTool,
    setAddedMarkup,
    currentColorForTool,
    setCurrentColorForTool,
    backgroundImage,
  } = usePhotoAnnotationContext();
  const {deviceSize} = useOrientation();
  const {THEME_COLOR} = useDOXLETheme();
  const shouldShowTextHandler = tool === 'Text';
  const inputRef = useRef<TextInput>(null);

  const onBlurTextInput = () => {
    setTool('Pointer');
  };

  const handleAddText = () => {
    if (inputText) {
      const addedText: ILabel = {
        x: (deviceSize.deviceWidth - inputSize.width) / 2,
        y: (backgroundImage.height - inputSize.height) / 2,
        text: inputText,
        color: currentColorForTool,
        type: 'Text',
        width: inputSize.width,
        height: inputSize.height,
      };
      console.log('ADDED TEXT:', addedText);
      setAddedMarkup(
        produce(draft => {
          draft.push(addedText);
          return draft;
        }),
      );
    }
    setInputText('');
    setCurrentColorForTool(THEME_COLOR.primaryContainerColor);
  };
  const inputBgColor = areColorsSimilar(
    currentColorForTool,
    THEME_COLOR.doxleColor,
  )
    ? undefined
    : currentColorForTool;

  useEffect(() => {
    if (tool === 'Pointer') {
      handleAddText();
    }
  }, [tool]);

  return {
    shouldShowTextHandler,
    inputRef,
    inputSize,
    setInputSize,
    onBlurTextInput,
    inputText,
    setInputText,
    currentColorForTool,
    inputBgColor,
  };
};

export default useMarkupTextHandler;

const styles = StyleSheet.create({});
