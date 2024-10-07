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
import {StyledMenuBtn, StyledNavigationMenu} from './StyledComponents';
import {BudgetMenuIcon, DrawMenuIcon, FileMenuIcon} from './Icons';
import useHomeNavMenu from './Hooks/useHomeNavMenu';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {ChecklistTabIcon} from '../../AppRoutes/RouteIcons';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';

type Props = {};

const HomeNavMenu = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {navigation} = useHomeNavMenu();
  return (
    <StyledNavigationMenu>
      <StyledMenuBtn onPress={() => navigation.navigate('FileRoute')}>
        <FileMenuIcon
          containerStyle={{
            width: '60%',
          }}
        />
      </StyledMenuBtn>
      <StyledMenuBtn>
        <DrawMenuIcon
          containerStyle={{
            width: '60%',
          }}
        />
      </StyledMenuBtn>

      <StyledMenuBtn onPress={() => navigation.navigate('BudgetRoute')}>
        <BudgetMenuIcon
          containerStyle={{
            width: '50%',
            marginLeft: '10%',
          }}
          themeColor={THEME_COLOR}
        />
      </StyledMenuBtn>
      <StyledMenuBtn onPress={() => navigation.navigate('ActionRoute')}>
        <ChecklistTabIcon
          containerStyle={{
            width: '35%',
          }}
          themeColor={THEME_COLOR}
          staticColor={editRgbaAlpha({
            rgbaColor: THEME_COLOR.primaryFontColor,
            alpha: '0.7',
          })}
        />
      </StyledMenuBtn>
    </StyledNavigationMenu>
  );
};

export default HomeNavMenu;

const styles = StyleSheet.create({});
