import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  StyledBottomSaveMenuContainer,
  StyledMenuBackdrop,
  StyledSaveAlertButton,
} from './StyledComponentPhotoAnnotation';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  IOrientation,
  useOrientation,
} from '../../../Providers/OrientationContext';

type Props = {
  setonSave: React.Dispatch<React.SetStateAction<boolean>>;
  handleTakeImg: () => Promise<void>;
  handleClosePhotoAnnotationModal: () => void;
};

const BottomSaveMenu = ({
  setonSave,
  handleTakeImg,
  handleClosePhotoAnnotationModal,
}: Props) => {
  //***************** THEME PROVIDER ************ */
  const {THEME_COLOR, DOXLE_FONT} =
    useDOXLETheme() as IDOXLEThemeProviderContext;
  //**************END OF THEME PROVIDER ************* */

  //******************* ORIENTATION PROVIDER ************ */
  const {deviceSize} = useOrientation() as IOrientation;
  //***********END OF ORIENTATION PROVIDER********* */

  const handleCloseMenu = () => {
    setonSave(false);
  };
  const handlePressSaveBtn = async () => {
    handleCloseMenu();
    handleTakeImg();
  };

  const handleDiscardChange = () => {
    setonSave(false);
    handleClosePhotoAnnotationModal();
  };
  return (
    <>
      <StyledMenuBackdrop
        backdropColor="rgba(255,255,255,0.8)"
        onPress={handleCloseMenu}
      />
      <StyledBottomSaveMenuContainer
        insetBottom={deviceSize.insetBottom}
        entering={SlideInDown.springify().stiffness(100).damping(12).mass(0.44)}
        exiting={SlideOutDown.springify().stiffness(100).damping(12)}>
        <StyledSaveAlertButton
          haveBorder={true}
          textColor="#24a0ed"
          themeColor={THEME_COLOR}
          doxleFont={DOXLE_FONT}
          onPress={handlePressSaveBtn}>
          Save
        </StyledSaveAlertButton>

        <StyledSaveAlertButton
          haveBorder={true}
          textColor="red"
          themeColor={THEME_COLOR}
          doxleFont={DOXLE_FONT}
          onPress={handleDiscardChange}>
          Discard Changes
        </StyledSaveAlertButton>

        <StyledSaveAlertButton
          textColor="#24a0ed"
          themeColor={THEME_COLOR}
          doxleFont={DOXLE_FONT}
          haveBorder={false}
          onPress={handleCloseMenu}>
          Cancel
        </StyledSaveAlertButton>
      </StyledBottomSaveMenuContainer>
    </>
  );
};

export default BottomSaveMenu;

const styles = StyleSheet.create({});
