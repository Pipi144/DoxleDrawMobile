import {StyleSheet} from 'react-native';
import React from 'react';
import FTIcon from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';

import {
  StyledAddFileFolderModeContainer,
  StyledAddMenuBtnText,
} from './StyledAddFileAndFolder';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {ZoomIn} from 'react-native-reanimated';
import {editRgbaAlpha} from '../../../../../../../Utilities/FunctionUtilities';
import useFileMenuFolderMode from '../../Hooks/useFileMenuFolderMode';
type Props = {};

const FileMenuFolderMode = ({}: Props) => {
  const {staticMenuColor} = useDOXLETheme();
  const {
    handlePressAddPhotoLibrary,
    handlePressAddDocument,

    handlePressVideoLibraryMenu,
    toggleView,
    isGridView,
  } = useFileMenuFolderMode({});

  return (
    <StyledAddFileFolderModeContainer>
      <DoxleAnimatedButton
        onPress={toggleView}
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}>
        {isGridView ? (
          <IonIcon
            name="list"
            color={staticMenuColor.staticWhiteFontColor}
            size={25}
            style={{
              marginRight: 15,
            }}
          />
        ) : (
          <IonIcon
            name="grid-outline"
            color={staticMenuColor.staticWhiteFontColor}
            size={25}
            style={{
              marginRight: 15,
            }}
          />
        )}
        <StyledAddMenuBtnText>
          {isGridView ? 'list view' : 'grid view'}
        </StyledAddMenuBtnText>
      </DoxleAnimatedButton>
      <DoxleAnimatedButton
        onPress={handlePressAddDocument}
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}>
        <IonIcons
          name="document-text-outline"
          color={staticMenuColor.staticWhiteFontColor}
          size={25}
          style={{
            marginRight: 15,
          }}
        />
        <StyledAddMenuBtnText>document</StyledAddMenuBtnText>
      </DoxleAnimatedButton>
      <DoxleAnimatedButton
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}
        onPress={handlePressAddPhotoLibrary}>
        <FTIcon
          name="image"
          color={editRgbaAlpha({
            rgbaColor: staticMenuColor.staticWhiteFontColor,
            alpha: '0.95',
          })}
          size={25}
          style={{
            marginRight: 15,
          }}
        />
        <StyledAddMenuBtnText>image</StyledAddMenuBtnText>
      </DoxleAnimatedButton>
      <DoxleAnimatedButton
        style={[
          styles.menuBtn,
          {
            borderBottomWidth: 0,
          },
        ]}
        onPress={handlePressVideoLibraryMenu}>
        <IonIcons
          name="videocam-outline"
          color={staticMenuColor.staticWhiteFontColor}
          size={25}
          style={{
            marginRight: 15,
          }}
        />
        <StyledAddMenuBtnText>video</StyledAddMenuBtnText>
      </DoxleAnimatedButton>
    </StyledAddFileFolderModeContainer>
  );
};

export default FileMenuFolderMode;

const styles = StyleSheet.create({
  menuBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 30,
    height: 50,
  },
});
