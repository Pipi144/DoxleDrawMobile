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
import React from 'react';
import {
  StyledDimensionModeBtn,
  StyledDimensionText,
  StyledFloorMenu,
  StyledStoreyNameText,
  StyledStoreySelectBtn,
} from './StyledComponents';
import useFloorMenu from './Hooks/useFloorMenu';
import {DoxleIcon} from '../../../DesignPattern/DoxleIcons';
import {LinearTransition} from 'react-native-reanimated';
import {StoreySelectIcon} from '../HomeIcons';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {};

const FloorMenu = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {storeyList, isFetchingStoreys, isFetchingError} = useFloorMenu();
  return (
    <StyledFloorMenu
      layout={LinearTransition.springify()
        .damping(15)
        .mass(0.5)
        .stiffness(120)}>
      <DoxleIcon
        containerStyle={{
          marginVertical: 12,
        }}
      />

      <StyledStoreyNameText>Ground Floor</StyledStoreyNameText>

      <StyledStoreySelectBtn>
        <StoreySelectIcon
          staticColor={THEME_COLOR.primaryFontColor}
          fillColor={THEME_COLOR.primaryContainerColor}
        />
      </StyledStoreySelectBtn>
      <StyledDimensionModeBtn>
        <StyledDimensionText>2D</StyledDimensionText>
      </StyledDimensionModeBtn>
    </StyledFloorMenu>
  );
};

export default FloorMenu;

const styles = StyleSheet.create({});
