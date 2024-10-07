import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  StyledAddMenuBtnText,
  StyledAddMenuRootModeContainer,
} from './StyledAddFileAndFolder';

import FTIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {LinearTransition, ZoomIn} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

import {AddFileIcon, AddFolderIcon} from '../../ProjectFileIcon';
import {editRgbaAlpha} from '../../../../../../../Utilities/FunctionUtilities';
import useFileMenuRootMode from '../../Hooks/useFileMenuRootMode';

type Props = {};
const FileMenuRootMode = ({}: Props) => {
  const {staticMenuColor} = useDOXLETheme();
  const {
    setExpandFileMenu,
    handlePressAddFolder,
    handlePressAddPhotoLibrary,
    handlePressAddDocument,
    handlePressVideoLibraryMenu,
    isGridView,
    toggleView,
  } = useFileMenuRootMode({});

  return (
    <StyledAddMenuRootModeContainer
      layout={LinearTransition.springify().damping(16).stiffness(150)}>
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
        onPress={handlePressAddFolder}
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}>
        <AddFolderIcon
          containerStyle={{
            width: 25,
            marginRight: 15,
          }}
          staticColor={staticMenuColor.staticWhiteFontColor}
        />
        <StyledAddMenuBtnText>add folder</StyledAddMenuBtnText>
      </DoxleAnimatedButton>

      <>
        <DoxleAnimatedButton
          onPress={handlePressAddDocument}
          style={[
            styles.menuBtn,
            {
              borderBottomColor: staticMenuColor.staticDivider,
            },
          ]}>
          <IonIcon
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
          <StyledAddMenuBtnText>photos</StyledAddMenuBtnText>
        </DoxleAnimatedButton>
        <DoxleAnimatedButton
          style={[
            styles.menuBtn,
            {
              borderBottomWidth: 0,
            },
          ]}
          onPress={handlePressVideoLibraryMenu}>
          <IonIcon
            name="videocam-outline"
            color={staticMenuColor.staticWhiteFontColor}
            size={25}
            style={{
              marginRight: 15,
            }}
          />
          <StyledAddMenuBtnText>video</StyledAddMenuBtnText>
        </DoxleAnimatedButton>
      </>
    </StyledAddMenuRootModeContainer>
  );
};

export default FileMenuRootMode;

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
