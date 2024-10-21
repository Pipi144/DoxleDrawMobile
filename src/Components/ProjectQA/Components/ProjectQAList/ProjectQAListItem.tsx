import {Alert, Animated, Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useRef} from 'react';
import {QAList} from '../../../../Models/qa';
import {getFontSizeScale} from '../../../../Utilities/FunctionUtilities';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import useProjectQAListItem from './Hooks/useProjectQAListItem';
import {useVibration} from '../../../../Providers/VibrationProvider';
import {Swipeable} from 'react-native-gesture-handler';
import {
  StyledCompleteCross,
  StyledQAListItemContainer,
  StyledQAListItemCountText,
  StyledQAListItemDeleteIconContainer,
  StyledQAListItemSwipeView,
  StyledQAListItemTitleText,
  StyledQAListItemTopSection,
} from './StyledComponentsProjectQAList';
import {ScaleDecorator} from 'react-native-draggable-flatlist';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  LightSpeedInLeft,
  LightSpeedOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import {QAListDeleteSwipeIcon} from '../QAIcons';
type Props = {
  qaListItem: QAList;
  drag: () => void;
  isActiveDragged: boolean;
  setEditedQAList: React.Dispatch<React.SetStateAction<QAList | undefined>>;
};

const DELETE_SWIPE_WIDTH = getFontSizeScale(50);
const ProjectQAListItem: React.FC<Props> = ({
  qaListItem,
  isActiveDragged,
  setEditedQAList,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();

  const {
    handlePressQAListItemRow,
    handleDeleteQaList,
    handleUpdateCompleteQAList,
    enableAnimation,
  } = useProjectQAListItem({qaListItem});
  const {shortVibrateTrigger} = useVibration();
  const swipeRef = useRef<Swipeable>(null);
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
        <StyledQAListItemSwipeView
          $viewWidth={DELETE_SWIPE_WIDTH}
          style={{
            transform: [{translateX}],
          }}>
          <StyledQAListItemDeleteIconContainer
            style={{
              transform: [{scale: scaleIcon}],
            }}>
            <QAListDeleteSwipeIcon
              containerStyle={{
                width: deviceType === 'Smartphone' ? 24 : 30,
              }}
              staticColor={THEME_COLOR.errorColor}
            />
          </StyledQAListItemDeleteIconContainer>
        </StyledQAListItemSwipeView>
      );
    },
    [deviceType, THEME_COLOR],
  );
  // const renderLeftActions = useCallback(
  //   (
  //     _progress: Animated.AnimatedInterpolation<number>,
  //     dragX: Animated.AnimatedInterpolation<number>,
  //   ) => {
  //     const translateX = dragX.interpolate({
  //       inputRange: [
  //         0,
  //         DELETE_SWIPE_WIDTH * 0.3,
  //         DELETE_SWIPE_WIDTH * 0.6,
  //         DELETE_SWIPE_WIDTH,
  //       ],
  //       outputRange: [
  //         0,
  //         DELETE_SWIPE_WIDTH * 0.3,
  //         DELETE_SWIPE_WIDTH * 0.6,
  //         DELETE_SWIPE_WIDTH,
  //       ],
  //       extrapolate: 'clamp',
  //     });

  //     const scaleIcon = dragX.interpolate({
  //       inputRange: [
  //         0,
  //         DELETE_SWIPE_WIDTH * 0.3,
  //         DELETE_SWIPE_WIDTH * 0.6,
  //         DELETE_SWIPE_WIDTH * 0.8,
  //         DELETE_SWIPE_WIDTH,
  //       ],
  //       outputRange: [0, 0.2, 0.4, 0.8, 1],
  //       extrapolate: 'clamp',
  //       extrapolateLeft: 'clamp',
  //       extrapolateRight: 'clamp',
  //     });
  //     return (
  //       <StyledQAListItemLeftSwipeView
  //         $viewWidth={DELETE_SWIPE_WIDTH}
  //         $themeColor={THEME_COLOR}
  //         $completed={qaListItem.completed}
  //         style={{
  //           transform: [{translateX}],
  //         }}>
  //         <StyledQAListItemDeleteIconContainer
  //           style={{
  //             transform: [{scale: scaleIcon}],
  //           }}>
  //           {!qaListItem.completed ? (
  //             <FTIcon
  //               name="check"
  //               size={deviceType === 'Smartphone' ? 24 : 30}
  //               color="white"
  //             />
  //           ) : (
  //             <AntIcons
  //               name="close"
  //               color="white"
  //               size={deviceType === 'Smartphone' ? 24 : 30}
  //             />
  //           )}
  //         </StyledQAListItemDeleteIconContainer>
  //       </StyledQAListItemLeftSwipeView>
  //     );
  //   },
  //   [qaListItem.completed, deviceType],
  // );
  const handleCloseSwipe = () => {
    if (swipeRef.current) swipeRef.current.close();
  };
  const onSwipeOpen = (direction: 'left' | 'right') => {
    shortVibrateTrigger();
    if (direction === 'right')
      Alert.alert(
        'Confirm Delete!',
        `QA List ***${qaListItem.defectListTitle}*** and all data belong to it will be deleted permanently, do you want to proceed?`,
        [
          {
            text: 'Delete',
            onPress: () => {
              handleCloseSwipe();
              handleDeleteQaList();
            },
          },
          {text: 'Cancel', style: 'destructive', onPress: handleCloseSwipe},
        ],
      );
    // else {
    //   handleUpdateCompleteQAList();
    //   setTimeout(() => {
    //     handleCloseSwipe();
    //   }, 200);
    // }
  };

  return (
    <ScaleDecorator activeScale={1.04}>
      <StyledQAListItemContainer
        disabled={isActiveDragged}

        //   sharedTransitionStyle={qaListRowSharedTransition}
        //   sharedTransitionTag={`qaListRow#${qaListItem.defectListId}`}
      >
        <Swipeable
          ref={swipeRef}
          friction={1.75}
          rightThreshold={DELETE_SWIPE_WIDTH * 0.75}
          renderRightActions={renderRightActions}
          // renderLeftActions={renderLeftActions}
          shouldCancelWhenOutside
          onSwipeableWillOpen={onSwipeOpen}
          containerStyle={[
            {
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              overflow: 'hidden',
            },
            isActiveDragged && {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              elevation: 3,
            },
          ]}
          childrenContainerStyle={{
            position: 'relative',
            overflow: 'hidden',

            display: 'flex',

            alignItems: 'center',
            width: '100%',
          }}>
          <StyledQAListItemTopSection>
            <BouncyCheckbox
              hitSlop={30}
              isChecked={qaListItem.completed}
              style={{
                width: deviceType === 'Smartphone' ? 32 : 37,
                marginRight: 12,
              }}
              innerIconStyle={{
                padding: 0,
                margin: 0,
                borderWidth: 0,
              }}
              fillColor={'#00B112'}
              unFillColor={THEME_COLOR.primaryFontColor}
              iconStyle={{
                width: deviceType === 'Smartphone' ? 30 : 35,
                height: deviceType === 'Smartphone' ? 30 : 35,
                borderRadius: deviceType === 'Smartphone' ? 10 : 35 / 3,
              }}
              iconComponent={
                qaListItem.completed ? (
                  <FeatherIcon
                    name="check"
                    size={doxleFontSize.headTitleTextSize + 5}
                    color={'white'}
                  />
                ) : null
              }
              onPress={check => {
                handleUpdateCompleteQAList(check);
              }}
            />
            <Pressable
              style={styles.titleQaListWrapper}
              onPress={handlePressQAListItemRow}
              onLongPress={() => setEditedQAList(qaListItem)}
              delayLongPress={200}
              unstable_pressDelay={50}>
              <StyledQAListItemTitleText
                style={{flex: 1}}
                $completed={qaListItem.completed}
                layout={LinearTransition.springify().damping(16)}
                numberOfLines={1}
                ellipsizeMode="tail">
                {qaListItem.defectListTitle}
              </StyledQAListItemTitleText>
              <StyledQAListItemCountText>
                {qaListItem.completedCount}/
                {qaListItem.completedCount +
                  qaListItem.unattendedCount +
                  qaListItem.workingCount}
              </StyledQAListItemCountText>
            </Pressable>
            {qaListItem.completed && (
              <StyledCompleteCross
                entering={enableAnimation ? LightSpeedInLeft : undefined}
                exiting={enableAnimation ? LightSpeedOutRight : undefined}
              />
            )}
          </StyledQAListItemTopSection>
        </Swipeable>
        {/* {true && <QAListItemExpandMenu qaListItem={qaListItem} />} */}
      </StyledQAListItemContainer>
    </ScaleDecorator>
  );
};

export default memo(ProjectQAListItem);

const styles = StyleSheet.create({
  expandIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    margin: 2,
    position: 'relative',
  },

  titleQaListWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  completeCross: {
    position: 'absolute',
    right: 0,
    height: 1,

    top: '50%',
    transform: [{translateY: -0.5}],
    zIndex: 100,
  },
});
