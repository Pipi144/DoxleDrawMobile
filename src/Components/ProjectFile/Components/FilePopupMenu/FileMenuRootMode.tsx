import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledAddMenuBtnText,
  StyledAddMenuRootModeContainer,
} from './StyledAddFileAndFolder';

import FTIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {LinearTransition} from 'react-native-reanimated';

import useFileMenuRootMode from '../../Hooks/useFileMenuRootMode';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {AddFolderIcon} from '../../ProjectFileIcon';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

type Props = {};
const FileMenuRootMode = ({}: Props) => {
  const {staticMenuColor} = useDOXLETheme();
  const {
    handlePressAddFolder,
    handlePressAddPhotoLibrary,
    handlePressAddDocument,
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
          <StyledAddMenuBtnText>Photos and Videos</StyledAddMenuBtnText>
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
