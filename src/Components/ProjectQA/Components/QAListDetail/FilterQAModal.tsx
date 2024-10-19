// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import Modal from 'react-native-modal/dist/modal';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {
  StyledFilterQAFieldWrapper,
  StyledFilterQALabelText,
  StyledFilterQAModal,
  StyledFilterQASearchInput,
  StyledFilterQASearchWrapper,
  StyledFilterQATitleText,
  StyledFilterQATopSection,
} from './StyledComponentsQAListDetail';

import Animated, {
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import FilterCheckbox from './CommonComponents/FilterCheckbox';
import useFilterQAModal from './Hooks/useFilterQAModal';
import {QAList} from '../../../../../../../Models/qa';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {editRgbaAlpha} from '../../../../../../../Utilities/FunctionUtilities';
import {Pressable} from 'react-native';
import DoxleEmptyPlaceholder from '../../../../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {Contact} from '../../../../../../../Models/contacts';
import AssigneeFilterItem from './AssigneeFilterItem';
import ListLoadingMoreBottom from '../../../../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';
import {FlatList} from 'react-native-gesture-handler';
import DoxleAnimatedButton from '../../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {IProjectFloor} from '../../../../../../../Models/location';
import FloorFilterItem from './FloorFilterItem';
type Props = {
  showModal: boolean;
  closeModal: () => void;
  qaList: QAList;
};

const AnimatedIcon = Animated.createAnimatedComponent(FeatherIcon);
const FilterQAModal = ({showModal, closeModal, qaList}: Props) => {
  const {DOXLE_FONT, staticMenuColor, doxleFontSize} = useDOXLETheme();
  const {deviceType, deviceSize} = useOrientation();
  const {
    editFilter,
    handleSelectStatus,
    expandAssignee,
    setExpandAssignee,
    ...rest
  } = useFilterQAModal({
    showModal,
    closeModal,
  });
  const layout = LinearTransition.springify()
    .damping(16)
    .mass(0.7)
    .stiffness(144);
  const lisContactEmptyComponent = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        headTitleText={
          rest.isErrorFetchingContactList
            ? 'Unable to find assignee'
            : 'Assignee Not Found'
        }
        subTitleText={
          rest.isErrorFetchingContactList ? 'We are sorry for this!' : ''
        }
        headTitleStyle={{
          fontSize: doxleFontSize.contentTextSize,
          color: staticMenuColor.staticWhiteFontColor,
        }}
        subTitleStyle={{
          fontSize: doxleFontSize.subContentTextSize,
          color: staticMenuColor.staticWhiteFontColor,
        }}
      />
    ),
    [rest.isErrorFetchingContactList, doxleFontSize],
  );
  const renderItem = useCallback(
    (props: {item: Contact; index: number}) => (
      <AssigneeFilterItem
        contactItem={props.item}
        handleSelectAssignee={rest.handleSelectAssignee}
        currentSelectedId={editFilter.assignee?.contactId}
      />
    ),
    [rest.handleSelectAssignee, editFilter.assignee],
  );

  const keyExtractor = useCallback(
    (item: Contact, index: number) => item.contactId,
    [],
  );

  const lisFloorListEmptyComponent = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        headTitleText={
          rest.isErrorFetchingFloorList
            ? 'Something wrong, unable to get floor list'
            : 'No floor found'
        }
        subTitleText={
          rest.isErrorFetchingFloorList ? 'We are sorry for this!' : ''
        }
        headTitleStyle={{
          fontSize: doxleFontSize.contentTextSize,
          color: staticMenuColor.staticWhiteFontColor,
        }}
        subTitleStyle={{
          fontSize: doxleFontSize.subContentTextSize,
          color: staticMenuColor.staticWhiteFontColor,
        }}
      />
    ),
    [rest.isErrorFetchingFloorList, doxleFontSize],
  );
  const renderFloorItem = useCallback(
    (props: {item: 'none' | 'not-none' | IProjectFloor; index: number}) => (
      <FloorFilterItem
        floor={props.item}
        handleFilterFloor={rest.handleFilterFloor}
        currentFloorId={
          editFilter.floor === 'none'
            ? 'none'
            : editFilter.floor === 'not-none'
            ? 'not-none'
            : editFilter.floor?.floorId
        }
      />
    ),
    [rest.handleFilterFloor, editFilter.floor],
  );
  const keyFloorExtractor = useCallback(
    (item: 'none' | 'not-none' | IProjectFloor, index: number) =>
      item === 'none' || item === 'not-none'
        ? `${item}#${index}`
        : item.floorId,
    [],
  );
  return (
    <Modal
      isVisible={showModal}
      hasBackdrop={true}
      backdropColor={staticMenuColor.staticBackdrop}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackdropPress={closeModal}
      animationIn="slideInUp"
      animationOut="fadeOutDownBig"
      deviceHeight={deviceSize.deviceHeight}
      deviceWidth={deviceSize.deviceWidth}
      animationInTiming={200}
      animationOutTiming={300}
      style={{
        position: 'relative',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
      }}>
      <StyledFilterQAModal layout={layout}>
        <StyledFilterQATopSection>
          <StyledFilterQATitleText>Filter</StyledFilterQATitleText>
        </StyledFilterQATopSection>

        <FlatList
          style={{width: '100%', flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
          }}
          nestedScrollEnabled
          data={[]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <></>}
          automaticallyAdjustsScrollIndicatorInsets
          automaticallyAdjustContentInsets
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <>
              <StyledFilterQAFieldWrapper>
                <StyledFilterQALabelText>Status</StyledFilterQALabelText>
                <FilterCheckbox
                  text="Working"
                  isChecked={editFilter.status === 'Unattended'}
                  onPress={() => handleSelectStatus('Unattended')}
                />
                <FilterCheckbox
                  text="Completed"
                  isChecked={editFilter.status === 'Completed'}
                  onPress={() => handleSelectStatus('Completed')}
                />
              </StyledFilterQAFieldWrapper>

              <StyledFilterQAFieldWrapper layout={layout}>
                <Pressable
                  style={styles.fieldLabelWrapper}
                  onPress={() => setExpandAssignee(prev => !prev)}>
                  <StyledFilterQALabelText $bold={Boolean(editFilter.assignee)}>
                    Assignee {editFilter.assignee && '*'}
                  </StyledFilterQALabelText>
                  {!expandAssignee && (
                    <AnimatedIcon
                      name={'chevron-down'}
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      color={editRgbaAlpha({
                        rgbaColor: staticMenuColor.staticWhiteFontColor,
                        alpha: '0.6',
                      })}
                      size={doxleFontSize.headTitleTextSize}
                      layout={layout}
                    />
                  )}
                  {expandAssignee && (
                    <AnimatedIcon
                      name={'minus'}
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      color={editRgbaAlpha({
                        rgbaColor: staticMenuColor.staticWhiteFontColor,
                        alpha: '0.6',
                      })}
                      size={doxleFontSize.headTitleTextSize}
                      layout={layout}
                    />
                  )}
                </Pressable>

                {expandAssignee && (
                  <>
                    <StyledFilterQASearchWrapper>
                      <AnimatedIcon
                        name="search"
                        color={editRgbaAlpha({
                          rgbaColor: staticMenuColor.staticWhiteFontColor,
                          alpha: '0.4',
                        })}
                        size={doxleFontSize.contentTextSize}
                      />
                      <StyledFilterQASearchInput
                        value={rest.searchContactText}
                        onChangeText={value => rest.setSearchContactText(value)}
                        placeholder="Search assignee..."
                        placeholderTextColor={editRgbaAlpha({
                          rgbaColor: staticMenuColor.staticWhiteFontColor,
                          alpha: '0.4',
                        })}
                        selectTextOnFocus={true}
                        selectionColor={editRgbaAlpha({
                          rgbaColor: staticMenuColor.staticDoxleColor,
                          alpha: '0.4',
                        })}
                      />
                      {rest.searchContactText && (
                        <AnimatedIcon
                          name="x"
                          color={editRgbaAlpha({
                            rgbaColor: staticMenuColor.staticWhiteFontColor,
                            alpha: '0.4',
                          })}
                          entering={ZoomIn.springify()
                            .damping(16)
                            .stiffness(120)}
                          exiting={ZoomOut.springify()
                            .damping(16)
                            .stiffness(120)}
                          size={doxleFontSize.headTitleTextSize}
                          onPress={() => rest.setSearchContactText('')}
                        />
                      )}
                    </StyledFilterQASearchWrapper>

                    <FlatList
                      style={{height: 200, width: '100%'}}
                      data={rest.contactList}
                      contentContainerStyle={{flexGrow: 1}}
                      ListEmptyComponent={lisContactEmptyComponent}
                      renderItem={renderItem}
                      keyExtractor={keyExtractor}
                      automaticallyAdjustsScrollIndicatorInsets
                      automaticallyAdjustContentInsets
                      keyboardDismissMode="on-drag"
                      onEndReached={rest.fetchNextPageFunction}
                      onEndReachedThreshold={0.8}
                    />

                    {rest.isFetchingNextPage && (
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
                  </>
                )}
              </StyledFilterQAFieldWrapper>

              <StyledFilterQAFieldWrapper layout={layout}>
                <Pressable
                  style={styles.fieldLabelWrapper}
                  onPress={() => rest.setExpandFloor(prev => !prev)}>
                  <StyledFilterQALabelText $bold={Boolean(editFilter.floor)}>
                    Floor {editFilter.floor && '*'}
                  </StyledFilterQALabelText>
                  {!rest.expandFloor && (
                    <AnimatedIcon
                      name={'chevron-down'}
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      color={editRgbaAlpha({
                        rgbaColor: staticMenuColor.staticWhiteFontColor,
                        alpha: '0.6',
                      })}
                      size={doxleFontSize.headTitleTextSize}
                      layout={layout}
                    />
                  )}
                  {rest.expandFloor && (
                    <AnimatedIcon
                      name={'minus'}
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      color={editRgbaAlpha({
                        rgbaColor: staticMenuColor.staticWhiteFontColor,
                        alpha: '0.6',
                      })}
                      size={doxleFontSize.headTitleTextSize}
                      layout={layout}
                    />
                  )}
                </Pressable>

                {rest.expandFloor && (
                  <>
                    <StyledFilterQASearchWrapper>
                      <AnimatedIcon
                        name="search"
                        color={editRgbaAlpha({
                          rgbaColor: staticMenuColor.staticWhiteFontColor,
                          alpha: '0.4',
                        })}
                        size={doxleFontSize.contentTextSize}
                      />
                      <StyledFilterQASearchInput
                        value={rest.searchFloorText}
                        onChangeText={value => rest.setSearchFloorText(value)}
                        placeholder="Search floor..."
                        placeholderTextColor={editRgbaAlpha({
                          rgbaColor: staticMenuColor.staticWhiteFontColor,
                          alpha: '0.4',
                        })}
                        selectTextOnFocus={true}
                        selectionColor={editRgbaAlpha({
                          rgbaColor: staticMenuColor.staticDoxleColor,
                          alpha: '0.4',
                        })}
                      />
                      {rest.searchFloorText && (
                        <AnimatedIcon
                          name="x"
                          color={editRgbaAlpha({
                            rgbaColor: staticMenuColor.staticWhiteFontColor,
                            alpha: '0.4',
                          })}
                          entering={ZoomIn.springify()
                            .damping(16)
                            .stiffness(120)}
                          exiting={ZoomOut.springify()
                            .damping(16)
                            .stiffness(120)}
                          size={doxleFontSize.headTitleTextSize}
                          onPress={() => rest.setSearchFloorText('')}
                        />
                      )}
                    </StyledFilterQASearchWrapper>

                    <FlatList
                      style={{height: 150, width: '100%'}}
                      data={['none', 'not-none', ...rest.floorList]}
                      contentContainerStyle={{flexGrow: 1}}
                      ListEmptyComponent={lisFloorListEmptyComponent}
                      renderItem={renderFloorItem}
                      keyExtractor={keyFloorExtractor}
                      automaticallyAdjustsScrollIndicatorInsets
                      automaticallyAdjustContentInsets
                      keyboardDismissMode="on-drag"
                      onEndReached={rest.fetchNextPageFloor}
                      onEndReachedThreshold={0.8}
                    />

                    {rest.isFetchingNextPageFloor && (
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
                  </>
                )}
              </StyledFilterQAFieldWrapper>
            </>
          }
        />
        <DoxleAnimatedButton
          backgroundColor={staticMenuColor.staticWhiteFontColor}
          onPress={rest.applyFilter}
          style={styles.applyBtn}>
          <Text
            style={{
              fontSize: doxleFontSize.headTitleTextSize,
              color: staticMenuColor.staticBg,
              fontFamily: DOXLE_FONT.lexendRegular,
              fontWeight: 500,
            }}>
            Apply
          </Text>
        </DoxleAnimatedButton>
      </StyledFilterQAModal>
    </Modal>
  );
};

export default FilterQAModal;

const styles = StyleSheet.create({
  fieldLabelWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandFieldWrapper: {
    height: 250,
    display: 'flex',
  },
  applyBtn: {
    width: '95%',
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
