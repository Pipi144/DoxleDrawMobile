import {StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  FadeInRight,
  FadeInUp,
  FadeOutRight,
  FadeOutUp,
} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native-paper';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {NotifierRoot} from 'react-native-notifier';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../Providers/OrientationContext';
import useAddProjectSection from './Hooks/useAddProjectSection';
import {
  StyledAddProjectBtnText,
  StyledAddProjectSection,
  StyledAddProjectTextInput,
} from './StyledComponents';
import DoxleAnimatedButton from '../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';
type Props = {
  listRef: React.RefObject<Animated.FlatList<any>>;
  projectListModalNotifier: React.RefObject<NotifierRoot>;
  closeModal: () => void;
};

const AnimatedAntIcon = Animated.createAnimatedComponent(AntIcon);
const AddProjectSection = ({
  listRef,
  projectListModalNotifier,
  closeModal,
}: // setShowProjectList,
Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();

  const {
    newProjectAddressText,
    handleNewProjectAddressTextChange,
    isAddingProject,
    handleAddProject,
    showAddInput,
    setShowAddInput,
    iconAddAnimatedStyle,
  } = useAddProjectSection({
    listRef,
    projectListModalNotifier,
    closeModal,
  });
  return (
    <StyledAddProjectSection>
      <DoxleAnimatedButton
        onPress={() => setShowAddInput(prev => !prev)}
        style={[
          styles.addBtn,
          {
            borderWidth: 1,
            borderColor: THEME_COLOR.primaryDividerColor,
          },
        ]}
        hitSlop={14}>
        <AnimatedAntIcon
          color={THEME_COLOR.doxleColor}
          size={deviceType === 'Smartphone' ? 20 : 22}
          name="plus"
          style={[iconAddAnimatedStyle]}
        />

        <StyledAddProjectBtnText>
          {!showAddInput ? 'Add Project' : 'Cancel'}
        </StyledAddProjectBtnText>
      </DoxleAnimatedButton>

      {showAddInput && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={[
            styles.inputWrapper,
            {
              borderBottomColor: THEME_COLOR.primaryDividerColor,
            },
          ]}>
          <StyledAddProjectTextInput
            placeholder="New project address..."
            value={newProjectAddressText}
            onChangeText={handleNewProjectAddressTextChange}
            placeholderTextColor={editRgbaAlpha({
              rgbaColor: THEME_COLOR.primaryFontColor,
              alpha: '0.4',
            })}
            onSubmitEditing={handleAddProject}
            autoFocus
            selectTextOnFocus
          />

          {newProjectAddressText && (
            <DoxleAnimatedButton
              hitSlop={14}
              entering={FadeInRight}
              exiting={FadeOutRight}
              onPress={handleAddProject}>
              {!isAddingProject ? (
                <AnimatedAntIcon
                  color={THEME_COLOR.doxleColor}
                  size={20}
                  name={'plus'}
                />
              ) : (
                <ActivityIndicator
                  color={THEME_COLOR.primaryFontColor}
                  size={20}
                  style={{marginRight: 4}}
                />
              )}
            </DoxleAnimatedButton>
          )}
        </Animated.View>
      )}
    </StyledAddProjectSection>
  );
};

export default AddProjectSection;

const styles = StyleSheet.create({
  addBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingBottom: 4,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
});
