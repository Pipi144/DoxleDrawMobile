import {StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {StyledAnnotationTextInput} from './StyledComponentPhotoAnnotation';

import {GestureDetector} from 'react-native-gesture-handler';
import useDraggedTextInput from './Hooks/useDraggedTextInput';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {ILabel} from '../../Models/MarkupTypes';

type Props = {
  item: ILabel;
  itemIndex: number;
  type: 'added' | 'old';
};

const DraggedTextInput: React.FC<Props> = memo(
  ({item, itemIndex, type}: Props) => {
    const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
    const {
      panHandler,
      animatedStyle,
      onFocusInput,
      onBlurInput,

      setInputSize,
      handleTextChange,
      inputRef,
    } = useDraggedTextInput({item, itemIndex, type});

    return (
      <GestureDetector gesture={panHandler}>
        <StyledAnnotationTextInput
          ref={inputRef}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          $width={item.width}
          $fontSize={doxleFontSize.headTitleTextSize + 5}
          $bgColor={item.color}
          $x={item.x}
          $y={item.y}
          value={item.text}
          multiline
          style={[animatedStyle]}
          onContentSizeChange={e =>
            setInputSize({
              width: e.nativeEvent.contentSize.width,
              height: e.nativeEvent.contentSize.height,
            })
          }
          onChangeText={handleTextChange}
        />
      </GestureDetector>
    );
  },
);

export default DraggedTextInput;

const styles = StyleSheet.create({});
