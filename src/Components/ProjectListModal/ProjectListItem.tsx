import {Alert, Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useRef} from 'react';

import {Swipeable} from 'react-native-gesture-handler';

import SimpleIcons from 'react-native-vector-icons/SimpleLineIcons';

import {ActivityIndicator} from 'react-native-paper';
import {
  FadeInDown,
  FadeInLeft,
  FadeOutRight,
  Layout,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated';
import {NotifierRoot} from 'react-native-notifier';
import {useShallow} from 'zustand/react/shallow';
import {Project} from '../../Models/project';
import {
  editRgbaAlpha,
  getFontSizeScale,
} from '../../Utilities/FunctionUtilities';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../Providers/OrientationContext';
import {useCompany} from '../../Providers/CompanyProvider';
import {useVibration} from '../../Providers/VibrationProvider';
import useProjectListItem from './Hooks/useProjectListItem';
import {
  RootProjectListItem,
  StyledEditProjectTextInput,
  StyledProjectItemAddressText,
  StyledProjectItemSwipeView,
} from './StyledComponents';
type Props = {
  project: Project;
  handlePressProjectListItem: (project: Project) => void;
  projectListModalNotifier: React.RefObject<NotifierRoot>;
};
const DELETE_SWIPE_WIDTH = getFontSizeScale(70);
const ProjectListItem: React.FC<Props> = ({
  project,
  handlePressProjectListItem,
  projectListModalNotifier,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {selectedProject} = useCompany();
  const {shortVibrateTrigger} = useVibration();
  const {
    handleDeleteProject,
    isDeletingProject,
    isUpdatingProject,
    onEditProject,
    newAddressText,
    setnewAddressText,
    handleLongPressAddressText,
    handleEditAddress,
    setOnEditProject,
  } = useProjectListItem({
    project,
    projectListModalNotifier,
  });
  const swipeRef = useRef<Swipeable>(null);
  const handleCloseSwipe = () => {
    if (swipeRef.current) swipeRef.current.close();
  };
  const renderRightActions = useCallback(
    (
      _progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>,
    ) => {
      const translateX = dragX.interpolate({
        inputRange: [
          -DELETE_SWIPE_WIDTH,
          -DELETE_SWIPE_WIDTH * 0.6,
          -DELETE_SWIPE_WIDTH * 0.3,
          0,
        ],
        outputRange: [
          -DELETE_SWIPE_WIDTH,
          -DELETE_SWIPE_WIDTH * 0.6,
          -DELETE_SWIPE_WIDTH * 0.3,
          0,
        ],
        extrapolate: 'clamp',
      });

      const scaleIcon = dragX.interpolate({
        inputRange: [
          -DELETE_SWIPE_WIDTH,
          -DELETE_SWIPE_WIDTH * 0.6,
          -DELETE_SWIPE_WIDTH * 0.3,
          0,
        ],
        outputRange: [1, 0.8, 0.4, 0],
        extrapolate: 'clamp',
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <StyledProjectItemSwipeView
          $viewWidth={DELETE_SWIPE_WIDTH}
          style={{
            transform: [{translateX}],
          }}>
          <Animated.View
            style={{
              transform: [{scale: scaleIcon}],
              overflow: 'visible',
              height: '80%',
              backgroundColor: THEME_COLOR.errorColor,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
            }}>
            {!isDeletingProject ? (
              <SimpleIcons name="trash" color="white" size={20} />
            ) : (
              <ActivityIndicator color="white" size={20} />
            )}
          </Animated.View>
        </StyledProjectItemSwipeView>
      );
    },
    [isDeletingProject],
  );
  const onSwipeOpen = (direction: 'left' | 'right') => {
    shortVibrateTrigger();
    Alert.alert(
      'Confirm Delete!',
      `Deleting this project will delete all dockets associated with this project, are you sure?`,
      [
        {
          text: 'Delete',
          onPress: () => {
            handleDeleteProject();
          },
        },
        {text: 'Cancel', style: 'destructive', onPress: handleCloseSwipe},
      ],
    );
  };

  const handlePressRow = () => {
    handlePressProjectListItem(project);
  };
  return (
    <RootProjectListItem
      $height={deviceType === 'Smartphone' ? 50 : 60}
      onPress={handlePressRow}
      onLongPress={handleLongPressAddressText}
      delayLongPress={200}
      delayHoverIn={100}
      unstable_pressDelay={100}>
      <Swipeable
        ref={swipeRef}
        friction={1.75}
        rightThreshold={DELETE_SWIPE_WIDTH * 0.75}
        leftThreshold={DELETE_SWIPE_WIDTH * 0.75}
        renderRightActions={renderRightActions}
        shouldCancelWhenOutside
        onSwipeableWillOpen={onSwipeOpen}
        containerStyle={styles.swipeStyle}
        childrenContainerStyle={styles.swipeStyle}>
        {isUpdatingProject && (
          <ActivityIndicator
            style={{marginRight: 4}}
            color={THEME_COLOR.primaryFontColor}
            size={16}
          />
        )}
        {!onEditProject ? (
          <LayoutAnimationConfig skipEntering>
            <StyledProjectItemAddressText
              $selected={Boolean(
                selectedProject &&
                  selectedProject.projectId === project.projectId,
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
              entering={FadeInDown}
              layout={LinearTransition.springify().damping(16)}>
              {project.siteAddress}
            </StyledProjectItemAddressText>
          </LayoutAnimationConfig>
        ) : (
          <StyledEditProjectTextInput
            value={newAddressText}
            onChangeText={value => setnewAddressText(value)}
            autoFocus
            selectTextOnFocus
            selectionColor={editRgbaAlpha({
              rgbaColor: THEME_COLOR.doxleColor,
              alpha: '0.8',
            })}
            blurOnSubmit
            onSubmitEditing={handleEditAddress}
            onBlur={() => setOnEditProject(false)}
          />
        )}
      </Swipeable>
    </RootProjectListItem>
  );
};

export default React.memo(ProjectListItem);

const styles = StyleSheet.create({
  swipeStyle: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
