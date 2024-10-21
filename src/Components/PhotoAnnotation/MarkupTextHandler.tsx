import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledMarkupTextHandler,
  StyledMarkupTextInput,
} from './StyledComponentPhotoAnnotation';
import {FadeIn, FadeOut} from 'react-native-reanimated';
import useMarkupTextHandler from './Hooks/useMarkupTextHandler';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';

const MarkupTextHandler = () => {
  const {staticMenuColor} = useDOXLETheme();
  const {
    shouldShowTextHandler,
    inputRef,
    inputSize,
    setInputSize,
    onBlurTextInput,
    inputText,
    setInputText,
    inputBgColor,
  } = useMarkupTextHandler();
  if (shouldShowTextHandler)
    return (
      <StyledMarkupTextHandler
        entering={FadeIn}
        exiting={FadeOut}
        scrollEnabled={false}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <StyledMarkupTextInput
          $bgColor={inputBgColor}
          ref={inputRef}
          value={inputText}
          multiline
          onChangeText={setInputText}
          autoFocus
          placeholder="Add Text..."
          placeholderTextColor={editRgbaAlpha({
            rgbaColor: staticMenuColor.staticWhiteFontColor,
            alpha: '0.2',
          })}
          onContentSizeChange={e =>
            setInputSize({
              width: e.nativeEvent.contentSize.width,
              height: e.nativeEvent.contentSize.height,
            })
          }
          onBlur={onBlurTextInput}
        />
      </StyledMarkupTextHandler>
    );
  return <></>;
};

export default MarkupTextHandler;

const styles = StyleSheet.create({});
