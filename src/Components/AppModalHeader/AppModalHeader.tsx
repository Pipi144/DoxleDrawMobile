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
import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {StyledAppModalHeader, StyledAppRouteText} from './StyledComponents';
import {SettingIcon} from './Icons';
import AntIcon from 'react-native-vector-icons/AntDesign';

import useAppModalHeader from './Hooks/useAppModalHeader';

import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../Providers/OrientationContext';
import DoxleAnimatedButton from '../DesignPattern/DoxleButton/DoxleAnimatedButton';
import Popover from 'react-native-popover-view';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';

const AnimatedAntIcon = Animated.createAnimatedComponent(AntIcon);
const AppModalHeader = (props: NativeStackHeaderProps) => {
  const {staticMenuColor} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    handlePressClose,
    openPopupMenu,
    setOpenPopupMenu,
    customisedPopupMenu,
    overidenRouteName,
    backBtn,
  } = useAppModalHeader();

  return (
    <StyledAppModalHeader>
      <DoxleAnimatedButton onPress={handlePressClose} hitSlop={20}>
        {!backBtn && (
          <AnimatedAntIcon
            name="close"
            color={staticMenuColor.staticWhiteFontColor}
            size={deviceType === 'Smartphone' ? 25 : 30}
            entering={ZoomIn.springify().damping(16).stiffness(120)}
            exiting={ZoomOut.springify().damping(16).stiffness(120)}
          />
        )}

        {backBtn &&
          (backBtn.icon ? (
            backBtn.icon
          ) : (
            <AnimatedAntIcon
              name="left"
              color={staticMenuColor.staticWhiteFontColor}
              size={25}
              entering={ZoomIn.springify().damping(16).stiffness(120)}
              exiting={ZoomOut.springify().damping(16).stiffness(120)}
            />
          ))}
      </DoxleAnimatedButton>
      <StyledAppRouteText numberOfLines={1} ellipsizeMode="tail">
        {overidenRouteName ??
          (props.route.name === 'BudgetRoute'
            ? 'Budgets'
            : props.route.name === 'FileRoute'
            ? 'Files'
            : props.route.name === 'ActionRoute'
            ? 'Actions'
            : '')}
      </StyledAppRouteText>

      <Popover
        isVisible={openPopupMenu}
        onRequestClose={() => setOpenPopupMenu(false)}
        from={
          <DoxleAnimatedButton
            hitSlop={30}
            {...props}
            onPress={() => setOpenPopupMenu(true)}
            disabled={customisedPopupMenu === null}
            disabledColor="rgba(0,0,0,0)">
            <SettingIcon
              staticColor={editRgbaAlpha({
                rgbaColor: staticMenuColor.staticWhiteFontColor,
                alpha:
                  customisedPopupMenu === null
                    ? '0'
                    : openPopupMenu
                    ? '0.5'
                    : '1',
              })}
              containerStyle={{
                width: deviceType === 'Smartphone' ? 25 : 30,
              }}
            />
          </DoxleAnimatedButton>
        }>
        {customisedPopupMenu}
      </Popover>
    </StyledAppModalHeader>
  );
};

export default AppModalHeader;

const styles = StyleSheet.create({});
