import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {FileEmptyBanner} from '../../ProjectFileIcon';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

import useEmptyFileScreen from '../../Hooks/useEmptyFileScreen';
import {
  StyledAddButtonText,
  StyledAddFileModalBtn,
  StyledAddFileModalBtnText,
  StyledAddFileModalContainer,
  StyledEmptyFileScreenContainer,
  StyledEmptyFileText,
} from './StyledComponentEmptyFileScreen';
import DoxleAnimatedButton from '../../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';
import Modal from 'react-native-modal/dist/modal';
import {useProjectFileStore} from '../../Store/useProjectFileStore';
import {shallow} from 'zustand/shallow';
import FTIcon from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import ProcessingScreen from '../../../../../../../Utilities/AnimationScreens/ProcessingAnimation/ProcessingScreen';
import {AddIconBtn, DoxleFolderIcon} from '../../../../../../../RootAppIcons';
import {useShallow} from 'zustand/react/shallow';
import LoadingDoxleIconWithText from '../../../../../../../Utilities/AnimationScreens/LoadingDoxleIconWithText/LoadingDoxleIconWithText';

type Props = {};

const EmptyFileScreen = (props: Props) => {
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const {deviceSize, deviceType} = useOrientation();

  const {
    // showAddModal,
    // setShowAddModal,
    // handlePressAddFolder,
    // handlePressAddPhotoLibrary,
    // handlePressAddDocument,
    isAddingFile,
    // handlePressVideoLibraryMenu,
  } = useEmptyFileScreen({});
  const {currentFolder} = useProjectFileStore(
    useShallow(state => ({
      currentFolder: state.currentFolder,
    })),
  );
  return (
    <StyledEmptyFileScreenContainer>
      {isAddingFile && (
        <LoadingDoxleIconWithText containerStyle={styles.loaderStyle} />
      )}

      <FileEmptyBanner
        themeColor={THEME_COLOR}
        containerStyle={{
          maxWidth: 500,
          maxHeight: 500,
        }}
      />
      <StyledEmptyFileText>Empty, No files</StyledEmptyFileText>
      {/* <DoxleAnimatedButton
        backgroundColor={THEME_COLOR.primaryFontColor}
        style={styles.addBtn}
        onPress={() => setShowAddModal(true)}>
        <AddIconBtn themeColor={THEME_COLOR} deviceType={deviceType} />
        <StyledAddButtonText>Add Files</StyledAddButtonText>
      </DoxleAnimatedButton> */}
      {/* 
      <Modal
        isVisible={showAddModal}
        hasBackdrop={true}
        backdropColor={THEME_COLOR.primaryReverseBackdropColor}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onBackdropPress={() => setShowAddModal(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        style={styles.modalStyle}>
        <StyledAddFileModalContainer
          $themeColor={THEME_COLOR}
          $insetBottom={Platform.OS === 'ios' ? deviceSize.insetBottom : 8}>
          {!currentFolder && (
            <StyledAddFileModalBtn onPress={handlePressAddFolder}>
              <View style={styles.iconWrapper}>
                <DoxleFolderIcon
                  containerStyle={{
                    width: doxleFontSize.pageTitleFontSize,
                  }}
                />
              </View>
              <StyledAddFileModalBtnText>Add Folder</StyledAddFileModalBtnText>
            </StyledAddFileModalBtn>
          )}
          <StyledAddFileModalBtn onPress={handlePressAddDocument}>
            <View style={styles.iconWrapper}>
              <IonIcons
                name="document-text-outline"
                color={THEME_COLOR.primaryFontColor}
                size={doxleFontSize.pageTitleFontSize}
              />
            </View>
            <StyledAddFileModalBtnText>Documents</StyledAddFileModalBtnText>
          </StyledAddFileModalBtn>

          <StyledAddFileModalBtn onPress={handlePressAddPhotoLibrary}>
            <View style={styles.iconWrapper}>
              <FTIcon
                name="image"
                size={doxleFontSize.pageTitleFontSize}
                color={THEME_COLOR.primaryFontColor}
              />
            </View>
            <StyledAddFileModalBtnText>Photo</StyledAddFileModalBtnText>
          </StyledAddFileModalBtn>

          <StyledAddFileModalBtn
            $hasBorderBottom={false}
            onPress={handlePressVideoLibraryMenu}>
            <View style={styles.iconWrapper}>
              <IonIcons
                name="videocam-outline"
                color={THEME_COLOR.primaryFontColor}
                size={doxleFontSize.pageTitleFontSize}
              />
            </View>
            <StyledAddFileModalBtnText>Video</StyledAddFileModalBtnText>
          </StyledAddFileModalBtn>
        </StyledAddFileModalContainer>
      </Modal> */}
    </StyledEmptyFileScreenContainer>
  );
};

export default EmptyFileScreen;

const styles = StyleSheet.create({
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 14,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
    height: '100%',
    width: '100%',
  },
  loaderStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingBottom: 100,
  },
  iconWrapper: {
    width: getFontSizeScale(50),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
