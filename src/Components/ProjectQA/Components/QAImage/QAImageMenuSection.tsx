import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  StyledQAImageMenuBtnText,
  StyledQAImageMenuSectionContainer,
} from './StyledComponentQAImage';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {QA} from '../../../../../../../Models/qa';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import useQAImageMenuSection from '../../Hooks/useQAImageMenuSection';
import DoxleAnimatedButton from '../../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import QAGalleryPicker from './QAGalleryPicker';

type Props = {qaItem: QA; handleSetIsProcessingImage: (value: boolean) => void};

const QAImageMenuSection = ({qaItem, handleSetIsProcessingImage}: Props) => {
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    handlePressCameraBtn,
    handlePressGalleryPhotoBtn,
    showMediaModal,
    setShowMediaModal,
    handlePressGalleryVideoBtn,
  } = useQAImageMenuSection({
    qaItem,
    handleSetIsProcessingImage,
  });
  return (
    <StyledQAImageMenuSectionContainer>
      <DoxleAnimatedButton
        style={styles(THEME_COLOR).menuBtn}
        backgroundColor={THEME_COLOR.primaryContainerColor}
        hitSlop={14}
        onPress={handlePressCameraBtn}>
        <FeatherIcon
          name="camera"
          size={doxleFontSize.headTitleTextSize}
          color={THEME_COLOR.primaryFontColor}
        />
        <StyledQAImageMenuBtnText>Camera</StyledQAImageMenuBtnText>
      </DoxleAnimatedButton>

      <DoxleAnimatedButton
        onPress={() => setShowMediaModal(true)}
        style={styles(THEME_COLOR).menuBtn}
        backgroundColor={THEME_COLOR.primaryContainerColor}
        hitSlop={14}>
        <FeatherIcon
          name="image"
          size={doxleFontSize.headTitleTextSize}
          color={THEME_COLOR.primaryFontColor}
        />
        <StyledQAImageMenuBtnText>Gallery</StyledQAImageMenuBtnText>
      </DoxleAnimatedButton>

      <QAGalleryPicker
        show={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        handlePressGalleryPhotoBtn={handlePressGalleryPhotoBtn}
        handlePressGalleryVideoBtn={handlePressGalleryVideoBtn}
      />
    </StyledQAImageMenuSectionContainer>
  );
};

export default QAImageMenuSection;

const styles = (themeColor: IDOXLEThemeColor) =>
  StyleSheet.create({
    menuBtn: {
      paddingHorizontal: 12,
      paddingVertical: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 4,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: themeColor.primaryDividerColor,
    },
  });
