import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {
  StyledPopoverSearchTextInput,
  StyledQADetailEditRoomFloorContainer,
  StyledQADetailLabelText,
  StyledQARoomFloorDisplayer,
  StyledQARoomFloorDisplayerText,
  StyledQAEditPopoverListItem,
  StyledQAEditPopoverListItemText,
  StyledRoomListPopoverWrapper,
  StyledSearchPopoverWrapper,
} from './StyledComponentQADetail';
import {LinearTransition} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native-paper';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import useQADetailEditRoom from './Hooks/useQADetailEditRoom';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import {DoxleEmptyListBanner} from '../../../DesignPattern/DoxleIcons';
import {IProjectRoom} from '../../../../Models/location';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import Popover from 'react-native-popover-view';

type Props = {};

const QADetailEditRoom = (props: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {deviceType, deviceSize} = useOrientation();
  const {
    isErrorFetchingRoomList,
    edittedQA,
    isUpdatingRoom,
    roomList,
    searchRoomInput,
    setSearchRoomInput,
    isFetchingNextPageRoom,
    isFetchingRoomList,
    refetchRoomList,
    fetchNextPageRoom,
    handleUpdateQARoom,
    openRoomPopover,
    setOpenRoomPopover,
  } = useQADetailEditRoom();

  //*render list
  const lisEmptyComponent = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        headTitleText={
          isErrorFetchingRoomList ? 'Failed to get room list' : 'No room found'
        }
        subTitleText={isErrorFetchingRoomList ? '' : ''}
        headTitleStyle={{
          fontSize: deviceType === 'Smartphone' ? 18 : 20,
        }}
        illustrationComponent={
          isErrorFetchingRoomList ? (
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
    [THEME_COLOR, isErrorFetchingRoomList],
  );

  const renderItem: ListRenderItem<IProjectRoom> = useCallback(
    ({item, index}) => (
      <RoomListItem room={item} handleUpdateQARoom={handleUpdateQARoom} />
    ),
    [handleUpdateQARoom],
  );

  const keyExtractor = useCallback((item: IProjectRoom) => item.roomId, []);
  const listWrapperHeight = useMemo(
    () => (roomList.length > 20 ? 0.4 * deviceSize.deviceHeight : undefined),
    [roomList, deviceSize],
  );

  return (
    <StyledQADetailEditRoomFloorContainer
      layout={LinearTransition.springify().damping(16).mass(0.4)}>
      <StyledQADetailLabelText>Room</StyledQADetailLabelText>
      <Popover
        isVisible={openRoomPopover}
        onRequestClose={() => setOpenRoomPopover(false)}
        popoverStyle={{
          backgroundColor: 'transparent',
        }}
        animationConfig={{
          duration: 200,
          delay: 0,
        }}
        from={
          <StyledQARoomFloorDisplayer
            onPress={() => {
              setOpenRoomPopover(prev => !prev);
            }}
            layout={LinearTransition.springify().damping(16)}
            hitSlop={14}>
            <StyledQARoomFloorDisplayerText $null={Boolean(!edittedQA.room)}>
              {edittedQA.room ? edittedQA.roomName : 'Select room'}
            </StyledQARoomFloorDisplayerText>

            {isUpdatingRoom ? (
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
              value={searchRoomInput}
              onChangeText={setSearchRoomInput}
              placeholder="Search room..."
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

            {isFetchingRoomList && (
              <ActivityIndicator
                color={THEME_COLOR.primaryFontColor}
                size={deviceType === 'Smartphone' ? 12 : 14}
              />
            )}
          </StyledSearchPopoverWrapper>

          <FlatList<IProjectRoom>
            data={roomList}
            style={{flex: 1, width: '100%'}}
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={lisEmptyComponent}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            automaticallyAdjustsScrollIndicatorInsets
            automaticallyAdjustContentInsets
            keyboardDismissMode="on-drag"
            onEndReached={fetchNextPageRoom}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  refetchRoomList();
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

          {(isFetchingRoomList || isFetchingNextPageRoom) && (
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

export default QADetailEditRoom;

const styles = StyleSheet.create({});

const RoomListItem = ({
  room,
  handleUpdateQARoom,
}: {
  room: IProjectRoom;
  handleUpdateQARoom: (room: IProjectRoom) => void;
}) => {
  return (
    <StyledQAEditPopoverListItem onPress={() => handleUpdateQARoom(room)}>
      <StyledQAEditPopoverListItemText $type="main">
        {room.name}
      </StyledQAEditPopoverListItemText>

      <StyledQAEditPopoverListItemText $type="sub">
        {room.floorName}
      </StyledQAEditPopoverListItemText>
    </StyledQAEditPopoverListItem>
  );
};
