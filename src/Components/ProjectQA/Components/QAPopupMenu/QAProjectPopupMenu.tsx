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
  StyledQAPopupMenuText,
  StyledQAPopupMenuWrapper,
} from './StyledComponents';
import {AddQAListIcon} from './Icons';
import useQAProjectPopupMenu from './Hooks/useQAProjectPopupMenu';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

const QAProjectPopupMenu = () => {
  const {staticMenuColor} = useDOXLETheme();
  const {handlePressAddQAList} = useQAProjectPopupMenu();
  return (
    <StyledQAPopupMenuWrapper>
      <DoxleAnimatedButton
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}
        onPress={handlePressAddQAList}>
        <AddQAListIcon
          staticColor={staticMenuColor.staticWhiteFontColor}
          staticStrokeColor={staticMenuColor.staticBlackFontColor}
          containerStyle={{
            width: 25,
            marginRight: 15,
          }}
        />
        <StyledQAPopupMenuText>Add List</StyledQAPopupMenuText>
      </DoxleAnimatedButton>
    </StyledQAPopupMenuWrapper>
  );
};

export default QAProjectPopupMenu;

const styles = StyleSheet.create({
  menuBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 30,
    height: 50,
  },
});
