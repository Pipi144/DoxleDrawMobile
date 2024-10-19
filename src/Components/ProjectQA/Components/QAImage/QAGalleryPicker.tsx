import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Modal from 'react-native-modal/dist/modal';
import {
  StyledCloseMediaBtn,
  StyledGalleryPickerContainer,
  StyledMediaPickerBtn,
  StyledMediaPickerBtnText,
  StyledMediaPickerTitleText,
} from './StyledComponentQAImage';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
type Props = {
  show: boolean;
  onClose: () => void;
  handlePressGalleryVideoBtn: () => Promise<void>;
  handlePressGalleryPhotoBtn: () => Promise<void>;
};

const QAGalleryPicker = ({
  show,
  onClose,
  handlePressGalleryVideoBtn,
  handlePressGalleryPhotoBtn,
}: Props) => {
  const {deviceType} = useOrientation();
  const {staticMenuColor, doxleFontSize} = useDOXLETheme();
  return (
    <Modal
      isVisible={show}
      hasBackdrop={true}
      backdropColor={staticMenuColor.staticBackdrop}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackdropPress={onClose}
      animationIn="bounceInUp"
      animationOut="bounceOutDown"
      animationInTiming={200}
      animationOutTiming={100}
      style={{
        justifyContent: deviceType === 'Smartphone' ? 'flex-end' : 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
      }}>
      <StyledGalleryPickerContainer>
        <View style={styles.titleWrapper}>
          <StyledMediaPickerTitleText>
            Select Gallery
          </StyledMediaPickerTitleText>

          <StyledCloseMediaBtn hitSlop={14} onPress={onClose}>
            <MateIcon
              name="close"
              color={staticMenuColor.staticWhiteFontColor}
              size={doxleFontSize.headTitleTextSize}
            />
          </StyledCloseMediaBtn>
        </View>
        <StyledMediaPickerBtn
          onPress={handlePressGalleryPhotoBtn}
          $hasBorderBottom={true}>
          <MateIcon
            name="photo-library"
            color={staticMenuColor.staticWhiteFontColor}
            size={doxleFontSize.headTitleTextSize + 4}
          />
          <StyledMediaPickerBtnText>Photo</StyledMediaPickerBtnText>
        </StyledMediaPickerBtn>
        <StyledMediaPickerBtn onPress={handlePressGalleryVideoBtn}>
          <MateIcon
            name="videocam"
            color={staticMenuColor.staticWhiteFontColor}
            size={doxleFontSize.headTitleTextSize + 4}
          />
          <StyledMediaPickerBtnText>Video</StyledMediaPickerBtnText>
        </StyledMediaPickerBtn>
      </StyledGalleryPickerContainer>
    </Modal>
  );
};

export default QAGalleryPicker;

const styles = StyleSheet.create({
  titleWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeBtn: {},
});
