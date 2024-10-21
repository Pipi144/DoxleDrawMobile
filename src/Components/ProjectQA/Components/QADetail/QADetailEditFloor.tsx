import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {
  StyledPopoverSearchTextInput,
  StyledQADetailEditRoomFloorContainer,
  StyledQADetailLabelText,
  StyledQAEditPopoverListItem,
  StyledQAEditPopoverListItemText,
  StyledQARoomFloorDisplayer,
  StyledQARoomFloorDisplayerText,
  StyledRoomListPopoverWrapper,
  StyledSearchPopoverWrapper,
} from './StyledComponentQADetail';

import {LinearTransition} from 'react-native-reanimated';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

import {ActivityIndicator} from 'react-native-paper';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import useQADetailEditFloor from './Hooks/useQADetailEditFloor';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import {DoxleEmptyListBanner} from '../../../DesignPattern/DoxleIcons';
import {IProjectFloor} from '../../../../Models/location';
import Popover from 'react-native-popover-view';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';

type Props = {};

const QADetailEditFloor = (props: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType, deviceSize} = useOrientation();
  const {
    isErrorFetchingFloorList,
    edittedQA,
    isUpdatingFloor,
    floorList,
    searchFloorInput,
    setSearchFloorInput,
    isFetchingNextPageFloor,
    isFetchingFloorList,
    refetchFloorList,
    fetchNextPageFloor,
    handleUpdateQAFloor,
    openFloorPopover,
    setOpenFloorPopover,
  } = useQADetailEditFloor();

  //*render list
  const lisEmptyComponent = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        headTitleText={
          isErrorFetchingFloorList
            ? 'Failed to get floor list'
            : 'No floor found'
        }
        subTitleText={isErrorFetchingFloorList ? '' : ''}
        headTitleStyle={{
          fontSize: deviceType === 'Smartphone' ? 18 : 20,
        }}
        illustrationComponent={
          isErrorFetchingFloorList ? (
            <ErrorFetchingBanner
              themeColor={THEME_COLOR}
              containerStyle={{width: '50%', marginBottom: 8}}
            />
          ) : (
            <DoxleEmptyListBanner
              themeColor={THEME_COLOR}
              containerStyle={{width: '50%', marginBottom: 8}}
            />
          )
        }
      />
    ),
    [THEME_COLOR, isErrorFetchingFloorList],
  );

  const renderItem: ListRenderItem<IProjectFloor> = useCallback(
    ({item, index}) => (
      <FloorListItem floor={item} handleUpdateQAFloor={handleUpdateQAFloor} />
    ),
    [handleUpdateQAFloor],
  );

  const keyExtractor = useCallback((item: IProjectFloor) => item.floorId, []);
  const listWrapperHeight = useMemo(
    () => (floorList.length > 20 ? 0.4 * deviceSize.deviceHeight : undefined),
    [floorList, deviceSize],
  );

  return (
    <StyledQADetailEditRoomFloorContainer
      layout={LinearTransition.springify().damping(16).mass(0.4)}>
      <StyledQADetailLabelText>Floor</StyledQADetailLabelText>

      <Popover
        isVisible={openFloorPopover}
        onRequestClose={() => setOpenFloorPopover(false)}
        popoverStyle={{
          backgroundColor: 'transparent',
        }}
        animationConfig={{
          duration: 50,
        }}
        from={
          <StyledQARoomFloorDisplayer
            onPress={() => {
              setOpenFloorPopover(prev => !prev);
            }}
            layout={LinearTransition.springify().damping(16)}
            hitSlop={14}>
            <StyledQARoomFloorDisplayerText $null={Boolean(!edittedQA.floor)}>
              {edittedQA.floor ? edittedQA.floorName : 'Select floor'}
            </StyledQARoomFloorDisplayerText>

            {isUpdatingFloor ? (
              <ActivityIndicator
                size={doxleFontSize.contentTextSize}
                color={THEME_COLOR.primaryFontColor}
              />
            ) : (
              <FontIcon
                name="arrow-circle-down"
                size={doxleFontSize.contentTextSize}
                color={THEME_COLOR.primaryFontColor}
              />
            )}
          </StyledQARoomFloorDisplayer>
        }>
        <StyledRoomListPopoverWrapper $height={listWrapperHeight}>
          <StyledSearchPopoverWrapper>
            <StyledPopoverSearchTextInput
              value={searchFloorInput}
              onChangeText={setSearchFloorInput}
              placeholder="Search floor..."
              selectTextOnFocus={true}
              selectionColor={editRgbaAlpha({
                rgbaColor: THEME_COLOR.doxleColor,
                alpha: '0.4',
              })}
              placeholderTextColor={editRgbaAlpha({
                rgbaColor: THEME_COLOR.primaryFontColor,
                alpha: '0.4',
              })}
            />

            {isFetchingFloorList && (
              <ActivityIndicator
                color={THEME_COLOR.primaryFontColor}
                size={deviceType === 'Smartphone' ? 12 : 14}
              />
            )}
          </StyledSearchPopoverWrapper>

          <FlatList<IProjectFloor>
            data={floorList}
            style={{flex: 1, width: '100%'}}
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={lisEmptyComponent}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            automaticallyAdjustsScrollIndicatorInsets
            automaticallyAdjustContentInsets
            keyboardDismissMode="on-drag"
            onEndReached={fetchNextPageFloor}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  refetchFloorList();
                }}
                tintColor={
                  Platform.OS === 'ios'
                    ? THEME_COLOR.primaryFontColor
                    : undefined
                }
                refreshing={false}
                colors={
                  Platform.OS === 'android'
                    ? [THEME_COLOR.primaryFontColor]
                    : undefined
                }
                progressBackgroundColor={THEME_COLOR.primaryContainerColor}
              />
            }
          />

          {(isFetchingFloorList || isFetchingNextPageFloor) && (
            <ListLoadingMoreBottom
              containerStyle={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
                left: 0,
                height: 50,
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              size={40}
            />
          )}
        </StyledRoomListPopoverWrapper>
      </Popover>
    </StyledQADetailEditRoomFloorContainer>
  );
};

export default QADetailEditFloor;

const styles = StyleSheet.create({});

const FloorListItem = ({
  floor,
  handleUpdateQAFloor,
}: {
  floor: IProjectFloor;
  handleUpdateQAFloor: (room: IProjectFloor) => void;
}) => {
  return (
    <StyledQAEditPopoverListItem onPress={() => handleUpdateQAFloor(floor)}>
      <StyledQAEditPopoverListItemText $type="main">
        {floor.name}
      </StyledQAEditPopoverListItemText>

      <StyledQAEditPopoverListItemText $type="sub">
        Level {floor.level}
      </StyledQAEditPopoverListItemText>
    </StyledQAEditPopoverListItem>
  );
};
