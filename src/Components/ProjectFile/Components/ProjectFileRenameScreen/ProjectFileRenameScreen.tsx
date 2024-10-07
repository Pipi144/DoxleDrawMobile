import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {useProjectFileStore} from '../../Store/useProjectFileStore';
import useProjectFileRenameScreen from '../../Hooks/useProjectFileRenameScreen';
import {
  StyledProjectFileRenameScreenContainer,
  StyledFileRenameButtonText,
  StyledFileRenameInput,
  StyledFileRenameText,
} from './StyledComponentProjectFileRenameScreen';

import {ActivityIndicator} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useShallow} from 'zustand/react/shallow';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
type Props = {navigation: any};

const ProjectFileRenameScreen = (props: Props) => {
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const {deviceSize, deviceType} = useOrientation();
  const {currentFile} = useProjectFileStore(
    useShallow(state => ({
      currentFile: state.currentFile,
    })),
  );

  const {
    handleTextInputChange,
    fileRename,
    updateButtonPressed,
    isUpdatingFile,
  } = useProjectFileRenameScreen();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <StyledProjectFileRenameScreenContainer
        $insetTop={0}
        contentContainerStyle={styles.contentViewStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}>
        <View style={styles.titleWrapper}>
          <FeatherIcon
            color={THEME_COLOR.primaryFontColor}
            size={doxleFontSize.pageTitleFontSize}
            name="edit-2"
          />
          <StyledFileRenameText>
            Rename {currentFile ? 'File' : 'Folder'}
          </StyledFileRenameText>
        </View>

        <StyledFileRenameInput
          value={fileRename}
          onChangeText={handleTextInputChange}
          selectTextOnFocus={true}
          selectionColor={editRgbaAlpha({
            rgbaColor: THEME_COLOR.doxleColor,
            alpha: '0.8',
          })}
          autoFocus
        />
        <DoxleAnimatedButton
          style={[
            styles.addBtn,
            {
              width: deviceType === 'Smartphone' ? 140 : 160,
              height: doxleFontSize.pageTitleFontSize + 5,

              borderRadius: deviceType === 'Smartphone' ? 5 : 7,
            },
          ]}
          disabled={Boolean(!fileRename)}
          backgroundColor={THEME_COLOR.primaryFontColor}
          onPress={updateButtonPressed}>
          <StyledFileRenameButtonText>Update</StyledFileRenameButtonText>

          {isUpdatingFile && (
            <ActivityIndicator
              color={THEME_COLOR.primaryFontColor}
              size={deviceType === 'Smartphone' ? 18 : 21}
              style={{marginLeft: 8}}
            />
          )}
        </DoxleAnimatedButton>
      </StyledProjectFileRenameScreenContainer>
    </TouchableWithoutFeedback>
  );
};

export default ProjectFileRenameScreen;

const styles = StyleSheet.create({
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    right: 10,
    top: 10,
    position: 'absolute',
    zIndex: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    marginTop: 20,

    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  contentViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
});
