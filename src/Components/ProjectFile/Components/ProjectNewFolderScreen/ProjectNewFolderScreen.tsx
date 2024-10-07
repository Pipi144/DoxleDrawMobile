import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

import {ActivityIndicator} from 'react-native-paper';

import useProjectNewFolderScreen from '../../Hooks/useProjectNewFolderScreen';
import {
  StyledAddFolderButtonText,
  StyledAddFolderTitleText,
  StyledAddNewFolderTitleWrapper,
  StyledProjectNewFolderScreenContainer,
  StyledNewFolderTitleInput,
} from './StyledComponentProjectNewFolderScreen';
import {FolderItemIcon} from '../../ProjectFileIcon';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
type Props = {
  navigation: any;
};

const ProjectNewFolderScreen: React.FC<Props> = ({navigation}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {
    newFolderName,
    handleNewFolderNameChange,
    addFolderPressed,
    isAddingFolder,
  } = useProjectNewFolderScreen();
  const {deviceType} = useOrientation();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <StyledProjectNewFolderScreenContainer
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
        $insetTop={0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}>
        <StyledAddNewFolderTitleWrapper>
          <FolderItemIcon
            containerStyle={{
              width: doxleFontSize.pageTitleFontSize + 10,
            }}
          />
          <StyledAddFolderTitleText>New Folder</StyledAddFolderTitleText>
        </StyledAddNewFolderTitleWrapper>

        <StyledNewFolderTitleInput
          value={newFolderName}
          onChangeText={handleNewFolderNameChange}
          autoFocus
          selectTextOnFocus
          selectionColor={editRgbaAlpha({
            rgbaColor: THEME_COLOR.doxleColor,
            alpha: '0.8',
          })}
          placeholder="New folder name..."
          placeholderTextColor={editRgbaAlpha({
            rgbaColor: THEME_COLOR.primaryFontColor,
            alpha: '0.4',
          })}
        />
        <DoxleAnimatedButton
          style={[
            styles(THEME_COLOR).addBtn,
            {
              width: deviceType === 'Smartphone' ? 140 : 160,
              height: doxleFontSize.pageTitleFontSize + 5,

              borderRadius: deviceType === 'Smartphone' ? 4 : 7,
            },
          ]}
          disabled={Boolean(!newFolderName || isAddingFolder)}
          backgroundColor={THEME_COLOR.primaryFontColor}
          onPress={addFolderPressed}>
          <StyledAddFolderButtonText>Create</StyledAddFolderButtonText>

          {isAddingFolder && (
            <ActivityIndicator
              color={THEME_COLOR.primaryFontColor}
              size={deviceType === 'Smartphone' ? 18 : 21}
              style={{marginLeft: 8}}
            />
          )}
        </DoxleAnimatedButton>
      </StyledProjectNewFolderScreenContainer>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(ProjectNewFolderScreen);
const styles = (themeColor: IDOXLEThemeColor) =>
  StyleSheet.create({
    closeBtn: {
      right: 10,

      position: 'absolute',
      zIndex: 10,

      backgroundColor: themeColor.primaryContainerColor,
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
  });
