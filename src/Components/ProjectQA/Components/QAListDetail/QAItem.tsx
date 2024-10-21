import {Alert, Animated, StyleSheet, View} from 'react-native';
import React, {useCallback, useRef} from 'react';

import {FadeInLeft} from 'react-native-reanimated';
import QAItemImageSection from './QAItemImageSection';

import {Swipeable} from 'react-native-gesture-handler';

import FTIcon from 'react-native-vector-icons/Feather';
import FontisIcon from 'react-native-vector-icons/Fontisto';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {ActivityIndicator} from 'react-native-paper';
import useQAItem from './Hooks/useQAItem';
import {
  StyledQAItemAuthorNameText,
  StyledQAItemContainer,
  StyledQAItemContentSection,
  StyledQAItemCreatedDateText,
  StyledQAItemDeleteIconContainer,
  StyledQAItemFloorText,
  StyledQAItemHeadTitleText,
  StyledQAItemLeftSwipeView,
  StyledQAItemSwipeView,
  StyledQAItemWrapper,
  StyledQALatestCommentText,
} from './StyledComponentsQAListDetail';

import dayjs from 'dayjs';

import AssigneeDisplayer from './CommonComponents/AssigneeDisplayer';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {QA, QAWithFirstImg} from '../../../../Models/qa';
import {getFontSizeScale} from '../../../../Utilities/FunctionUtilities';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {useVibration} from '../../../../Providers/VibrationProvider';
import {QADeleteIcon} from '../QAIcons';
var advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);
type Props = {
  qaItem: QAWithFirstImg;
  numOfCol: number;
  setSelectedQAForAssignee: React.Dispatch<
    React.SetStateAction<QA | undefined>
  >;
};
const DELETE_SWIPE_WIDTH = getFontSizeScale(80);
const QAItem: React.FC<Props> = ({
  qaItem,
  numOfCol,
  setSelectedQAForAssignee,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {shortVibrateTrigger} = useVibration();
  const {
    handlePressItem,

    handleDeleteQAItem,
    isDeletingQA,
    handleUpdateStatusQA,
  } = useQAItem({qaItem});

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
        <StyledQAItemSwipeView
          $viewWidth={DELETE_SWIPE_WIDTH}
          style={{
            transform: [{translateX}],
          }}>
          <StyledQAItemDeleteIconContainer
            style={{
              transform: [{scale: scaleIcon}],
            }}>
            <QADeleteIcon
              themeColor={THEME_COLOR}
              containerStyle={{width: deviceType === 'Smartphone' ? 30 : 40}}
              iconColor={THEME_COLOR.errorColor}
            />
          </StyledQAItemDeleteIconContainer>
        </StyledQAItemSwipeView>
      );
    },
    [qaItem.status, THEME_COLOR, deviceType],
  );

  const renderLeftActions = useCallback(
    (
      _progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>,
    ) => {
      const translateX = dragX.interpolate({
        inputRange: [
          0,
          DELETE_SWIPE_WIDTH * 0.3,
          DELETE_SWIPE_WIDTH * 0.6,
          DELETE_SWIPE_WIDTH,
        ],
        outputRange: [
          0,
          DELETE_SWIPE_WIDTH * 0.3,
          DELETE_SWIPE_WIDTH * 0.6,
          DELETE_SWIPE_WIDTH,
        ],
        extrapolate: 'clamp',
      });

      const scaleIcon = dragX.interpolate({
        inputRange: [
          0,
          DELETE_SWIPE_WIDTH * 0.3,
          DELETE_SWIPE_WIDTH * 0.6,
          DELETE_SWIPE_WIDTH * 0.8,
          DELETE_SWIPE_WIDTH,
        ],
        outputRange: [0, 0.2, 0.4, 0.8, 1],
        extrapolate: 'clamp',
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <StyledQAItemLeftSwipeView
          $viewWidth={DELETE_SWIPE_WIDTH}
          style={{
            transform: [{translateX}],
            backgroundColor:
              qaItem.status !== 'Completed'
                ? 'rgba(18, 183, 24, 0.8)'
                : 'rgba(255, 6, 6,1)',
          }}>
          <StyledQAItemDeleteIconContainer
            style={{
              transform: [{scale: scaleIcon}],
            }}>
            {qaItem.status !== 'Completed' ? (
              <FTIcon name="check" size={30} color="white" />
            ) : (
              <AntIcons name="close" color="white" size={30} />
            )}
          </StyledQAItemDeleteIconContainer>
        </StyledQAItemLeftSwipeView>
      );
    },
    [qaItem.status],
  );
  const handleCloseSwipe = () => {
    if (swipeRef.current) swipeRef.current.close();
  };
  const onSwipeOpen = (direction: 'left' | 'right') => {
    shortVibrateTrigger();
    if (direction === 'right')
      Alert.alert(
        'Confirm Delete!',
        `QA ***${qaItem.description}*** and all data belong to it will be deleted permanently, do you want to proceed?`,
        [
          {
            text: 'Delete',
            onPress: () => {
              handleCloseSwipe();
              handleDeleteQAItem();
            },
          },
          {text: 'Cancel', style: 'destructive', onPress: handleCloseSwipe},
        ],
      );
    else {
      handleUpdateStatusQA();
      setTimeout(() => {
        handleCloseSwipe();
      }, 200);
    }
  };

  return (
    <StyledQAItemWrapper
      $numOfCol={numOfCol}
      onPress={handlePressItem}
      disabled={isDeletingQA}
      style={{
        opacity: isDeletingQA ? 0.5 : 1,
      }}>
      <StyledQAItemContainer $numOfCol={numOfCol}>
        <Swipeable
          ref={swipeRef}
          friction={2}
          rightThreshold={DELETE_SWIPE_WIDTH * 0.75}
          leftThreshold={DELETE_SWIPE_WIDTH * 0.75}
          renderRightActions={renderRightActions}
          renderLeftActions={renderLeftActions}
          shouldCancelWhenOutside
          onSwipeableWillOpen={onSwipeOpen}
          containerStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          childrenContainerStyle={{
            position: 'relative',
            overflow: 'hidden',

            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          {qaItem.firstImage ? (
            <QAItemImageSection qaDetail={qaItem} viewMode="list" />
          ) : (
            <BouncyCheckbox
              hitSlop={30}
              isChecked={qaItem.status === 'Completed'}
              style={{
                width: deviceType === 'Smartphone' ? 25 : 30,
                marginRight: 12,
                marginLeft: 8,
              }}
              innerIconStyle={{
                padding: 0,
                margin: 0,
                borderWidth: 0,
              }}
              fillColor={'#00B112'}
              unFillColor={THEME_COLOR.primaryFontColor}
              iconStyle={{
                width: deviceType === 'Smartphone' ? 24 : 27,
                height: deviceType === 'Smartphone' ? 24 : 27,
                borderRadius: deviceType === 'Smartphone' ? 8 : 9,
              }}
              iconComponent={
                qaItem.status === 'Completed' ? (
                  <FTIcon
                    name="check"
                    size={doxleFontSize.headTitleTextSize}
                    color={'white'}
                  />
                ) : null
              }
              onPress={event => {}}
            />
          )}

          <StyledQAItemContentSection>
            <View
              style={{
                marginBottom: 10,
              }}>
              <StyledQAItemHeadTitleText numberOfLines={2} ellipsizeMode="tail">
                {qaItem.index}. {qaItem.description}
              </StyledQAItemHeadTitleText>
              {qaItem.lastComment && (
                <StyledQALatestCommentText
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {qaItem.lastComment && `${qaItem.lastComment.commentText}`}
                </StyledQALatestCommentText>
              )}
            </View>
            <AssigneeDisplayer
              onPress={() => setSelectedQAForAssignee(qaItem)}
              assigneeName={qaItem.assignee ? qaItem.assigneeName : undefined}
            />

            {/* <View style={styles.subTitleContainer}>
              <StyledQAItemAuthorNameText>
                <FTIcon
                  name="user"
                  color={THEME_COLOR.primaryFontColor}
                  size={deviceType === 'Smartphone' ? 16 : 22}
                />{' '}
                {qaItem.assignee ? qaItem.assigneeName : 'No Assignee'}
              </StyledQAItemAuthorNameText>

              <StyledQAItemCreatedDateText>
                <MaterialIcon
                  name="timer-outline"
                  color={THEME_COLOR.primaryFontColor}
                  size={deviceType === 'Smartphone' ? 16 : 22}
                />{' '}
                {dayjs(qaItem.createdOn).format('MMM Do, YYYY')}
              </StyledQAItemCreatedDateText>
            </View> */}
            {/* {qaItem.floor && (
              <StyledQAItemFloorText>
                <StyledQAItemFloorText style={{fontWeight: 500}}>
                  <MaterialIcon
                    name="home-floor-1"
                    color={THEME_COLOR.primaryFontColor}
                    size={deviceType === 'Smartphone' ? 16 : 22}
                  />{' '}
                </StyledQAItemFloorText>
                {qaItem.floorName}
              </StyledQAItemFloorText>
            )} */}
          </StyledQAItemContentSection>

          {isDeletingQA && (
            <ActivityIndicator
              size={deviceType === 'Smartphone' ? 24 : 27}
              color="red"
              style={{marginRight: 4}}
            />
          )}
        </Swipeable>
      </StyledQAItemContainer>
    </StyledQAItemWrapper>
  );
};

export default React.memo(QAItem);

const styles = StyleSheet.create({
  subTitleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});
