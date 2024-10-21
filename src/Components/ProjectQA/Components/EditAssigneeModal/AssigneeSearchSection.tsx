import {StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useRef} from 'react';

import Animated, {
  Extrapolation,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import Icon from 'react-native-vector-icons/AntDesign';

import {
  StyledAddAssigneeButtonText,
  StyledAssigneeNameTextInput,
  StyledAssigneeSearchClearInputButton,
  StyledAssigneeSearchClearInputButtonText,
  StyledAssigneeSearchSectionContainer,
  StyledSearchAssigneeTextInputWrapper,
} from './StyledComponentEditAssigneeModal';
import useAssigneeSearchSection from './Hooks/useAssigneeSearchSection';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

type Props = {
  handleSearchTextChange: (text: string) => void;
  showAddAssigneeForm: boolean;
  handleToggleAssigneeForm: () => void;
};

const AssigneeSearchSection = ({
  handleSearchTextChange,
  showAddAssigneeForm,
  handleToggleAssigneeForm,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    searchInput,
    handleSearchInputChange,
    handleClearInput,
    handleCloseSearchInput,
    showSearchAssigneeInput,

    handlePressAddAssigneeBtn,
    addAssigneeBtnIconAnimatedValue,
    handlePressSearchIconBtn,
  } = useAssigneeSearchSection({
    handleSearchTextChange,
    showAddAssigneeForm,
    handleToggleAssigneeForm,
  });

  const searchTextInputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (searchTextInputRef.current) searchTextInputRef.current.focus();
  }, [showSearchAssigneeInput]);

  //# animation
  const addBtnIconAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      addAssigneeBtnIconAnimatedValue.value,
      [0, 1],
      [0, 45],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    return {
      transform: [{rotateZ: `${rotateZ}deg`}],
    };
  });
  return (
    <StyledAssigneeSearchSectionContainer>
      {!showAddAssigneeForm && (
        <StyledSearchAssigneeTextInputWrapper
          $height={deviceType === 'Smartphone' ? 35 : 45}
          layout={LinearTransition.springify().damping(14)}>
          <StyledAssigneeNameTextInput
            ref={searchTextInputRef}
            onChangeText={handleSearchInputChange}
            value={searchInput}
            placeholder="Search Assignee..."
            placeholderTextColor={editRgbaAlpha({
              rgbaColor: THEME_COLOR.primaryFontColor,
              alpha: '0.4',
            })}
          />

          {searchInput && (
            <StyledAssigneeSearchClearInputButton
              hitSlop={14}
              onPress={handleClearInput}
              entering={FadeInDown}
              exiting={FadeOutDown}>
              <StyledAssigneeSearchClearInputButtonText>
                Clear
              </StyledAssigneeSearchClearInputButtonText>
            </StyledAssigneeSearchClearInputButton>
          )}

          {/* <DoxleIconButton
            icon={() => <Icon name="closecircle" size={14} />}
            size={14}
            style={{padding: 0, marginLeft: 4}}
            onPress={handleCloseSearchInput}
            hitSlop={20}
          /> */}
        </StyledSearchAssigneeTextInputWrapper>
      )}
      {!showAddAssigneeForm && (
        <DoxleAnimatedButton
          backgroundColor={THEME_COLOR.primaryContainerColor}
          style={[
            styles().searchAssigneeButton,
            {
              borderWidth: 1,
              borderColor: THEME_COLOR.primaryDividerColor,
            },
          ]}
          onPress={handlePressAddAssigneeBtn}
          hitSlop={20}>
          <Animated.View style={[addBtnIconAnimatedStyle]}>
            <Icon
              name="plus"
              color={THEME_COLOR.primaryFontColor}
              size={doxleFontSize.headTitleTextSize + 2}
            />
          </Animated.View>
        </DoxleAnimatedButton>
      )}
    </StyledAssigneeSearchSectionContainer>
  );
};

export default AssigneeSearchSection;

const styles = (themeColor?: IDOXLEThemeColor) =>
  StyleSheet.create({
    btnContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    addAssigneeBtn: {
      paddingVertical: 4,
      paddingHorizontal: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      marginLeft: 8,
    },
    searchAssigneeButton: {
      justifyContent: 'center',

      padding: 4,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 4,
      marginLeft: 8,
      shadowOffset: {width: 0, height: 0},
      shadowRadius: 2,
      shadowColor: themeColor
        ? themeColor.primaryBoxShadowColor
        : 'transparent',
      shadowOpacity: 1,
    },
  });
