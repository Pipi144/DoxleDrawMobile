import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {
  StyledAnnotateColorPickerWrapper,
  StyledAnnotateTopMenu,
  StyledCloseButton,
  StyledSaveMarkupBtnText,
} from './StyledComponentPhotoAnnotation';
import {usePhotoAnnotationContext} from './PhotoAnnotation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import useAnnotateTopMenu from './Hooks/useAnnotateTopMenu';
import {
  FadeIn,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutRight,
  FadeOutUp,
  StretchInY,
  StretchOutY,
} from 'react-native-reanimated';
import MateComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorPicker, {HueSlider} from 'reanimated-color-picker';

import OctIcon from 'react-native-vector-icons/Octicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {TRgbaFormat} from '../../Utilities/FunctionUtilities';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../DesignPattern/DoxleButton/DoxleAnimatedButton';
type Props = {};

const AnnotateTopMenu = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const annotateStyle = useMemo(() => styles(THEME_COLOR), [THEME_COLOR]);
  const {setCurrentColorForTool, tool, currentColorForTool} =
    usePhotoAnnotationContext();
  const {
    shouldShowUndo,
    handleUndo,
    shouldShowColorPicker,
    handlePressPencil,
    shouldShowPencilTool,
    shouldShowCircleTool,
    shouldShowRectangleTool,
    handlePressCircle,
    handlePressRectangle,
    handleCloseBtn,
    shouldShowTextTool,
    handlePressTextTool,
  } = useAnnotateTopMenu();

  return (
    <StyledAnnotateTopMenu>
      <DoxleAnimatedButton
        onPress={handleCloseBtn}
        style={[
          annotateStyle.closeBtn,
          tool !== 'Pointer' && {
            minWidth: 50,
            paddingHorizontal: 14,
          },
        ]}
        backgroundColor={THEME_COLOR.primaryContainerColor}>
        {tool === 'Pointer' ? (
          <AntIcon
            name="close"
            color={THEME_COLOR.primaryFontColor}
            size={25}
          />
        ) : (
          <StyledSaveMarkupBtnText entering={FadeIn} exiting={FadeOut}>
            Done
          </StyledSaveMarkupBtnText>
        )}
      </DoxleAnimatedButton>

      <View style={annotateStyle.toolContainer}>
        {shouldShowUndo && (
          <DoxleAnimatedButton
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={annotateStyle.toolBtn}
            backgroundColor={THEME_COLOR.primaryContainerColor}
            onPress={handleUndo}>
            <MateComIcon
              name="undo-variant"
              color={THEME_COLOR.primaryFontColor}
              size={25}
            />
          </DoxleAnimatedButton>
        )}

        {shouldShowCircleTool && (
          <DoxleAnimatedButton
            entering={FadeInRight}
            exiting={FadeOutRight}
            style={annotateStyle.toolBtn}
            backgroundColor={
              tool === 'Circle'
                ? currentColorForTool
                : THEME_COLOR.primaryContainerColor
            }
            onPress={handlePressCircle}>
            <FeatherIcon
              name="circle"
              color={tool === 'Circle' ? 'white' : THEME_COLOR.primaryFontColor}
              size={20}
            />
          </DoxleAnimatedButton>
        )}
        {shouldShowRectangleTool && (
          <DoxleAnimatedButton
            entering={FadeInRight}
            exiting={FadeOutRight}
            style={annotateStyle.toolBtn}
            backgroundColor={
              tool === 'Rectangle'
                ? currentColorForTool
                : THEME_COLOR.primaryContainerColor
            }
            onPress={handlePressRectangle}>
            <MateComIcon
              name="rectangle-outline"
              color={
                tool === 'Rectangle' ? 'white' : THEME_COLOR.primaryFontColor
              }
              size={25}
            />
          </DoxleAnimatedButton>
        )}
        {shouldShowTextTool && (
          <DoxleAnimatedButton
            entering={FadeInRight}
            exiting={FadeOutRight}
            style={annotateStyle.toolBtn}
            backgroundColor={THEME_COLOR.primaryContainerColor}
            onPress={handlePressTextTool}>
            <MateComIcon
              name="format-text"
              color={THEME_COLOR.primaryFontColor}
              size={25}
            />
          </DoxleAnimatedButton>
        )}
        {shouldShowPencilTool && (
          <DoxleAnimatedButton
            entering={FadeInRight}
            exiting={FadeOutRight}
            style={annotateStyle.toolBtn}
            backgroundColor={
              tool === 'Pencil'
                ? currentColorForTool
                : THEME_COLOR.primaryContainerColor
            }
            onPress={handlePressPencil}>
            <OctIcon
              name="pencil"
              color={tool === 'Pencil' ? 'white' : THEME_COLOR.primaryFontColor}
              size={20}
            />
          </DoxleAnimatedButton>
        )}

        {shouldShowColorPicker && (
          <StyledAnnotateColorPickerWrapper
            entering={StretchInY.duration(200)}
            exiting={StretchOutY.duration(200)}>
            <ColorPicker
              style={{
                width: 30,

                display: 'flex',
                alignItems: 'center',
                height: 150,
              }}
              value={THEME_COLOR.doxleColor}
              onComplete={color =>
                setCurrentColorForTool(color.rgba as TRgbaFormat)
              }>
              <HueSlider
                vertical={true}
                boundedThumb={false}
                thumbSize={25}
                thumbColor={THEME_COLOR.primaryFontColor}
                style={{height: '100%', width: 14}}
                sliderThickness={10}
                thumbShape="ring"
              />
            </ColorPicker>
          </StyledAnnotateColorPickerWrapper>
        )}
      </View>
    </StyledAnnotateTopMenu>
  );
};

export default AnnotateTopMenu;

const styles = (themeColor: IDOXLEThemeColor) =>
  StyleSheet.create({
    toolContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      position: 'relative',
      justifyContent: 'flex-end',
    },
    toolBtn: {
      width: 40,
      minHeight: 40,
      backgroundColor: themeColor.primaryContainerColor,
      marginHorizontal: 4,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    closeBtn: {
      minWidth: 40,
      minHeight: 40,
      backgroundColor: themeColor.primaryContainerColor,
      marginHorizontal: 4,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
  });
