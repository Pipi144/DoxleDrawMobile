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
import useQAListDetailPopupMenu from './Hooks/useQAListDetailPopupMenu';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {QAList} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {DoxlePDFIcon} from '../../../DesignPattern/DoxleIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import OctIcon from 'react-native-vector-icons/Octicons';
type Props = {
  qaList: QAList;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

const QAListDetailPopupMenu = ({qaList, setShowFilter}: Props) => {
  const {staticMenuColor, THEME_COLOR} = useDOXLETheme();
  const {
    handlePressPdfMenu,
    handleAddQaItemQuery,
    setOpenPopupMenu,
    qaListViewMode,
    toggleViewMode,
  } = useQAListDetailPopupMenu({
    qaList,
  });
  return (
    <StyledQAPopupMenuWrapper>
      <DoxleAnimatedButton
        onPress={toggleViewMode}
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}>
        {qaListViewMode === 'grid' ? (
          <IonIcon
            name="list"
            color={staticMenuColor.staticWhiteFontColor}
            size={25}
            style={{
              marginRight: 15,
            }}
          />
        ) : (
          <IonIcon
            name="grid-outline"
            color={staticMenuColor.staticWhiteFontColor}
            size={25}
            style={{
              marginRight: 15,
            }}
          />
        )}
        <StyledQAPopupMenuText>
          {qaListViewMode === 'grid' ? 'list view' : 'grid view'}
        </StyledQAPopupMenuText>
      </DoxleAnimatedButton>
      <DoxleAnimatedButton
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}
        onPress={handleAddQaItemQuery}>
        <AntIcon
          name="plus"
          size={25}
          color={staticMenuColor.staticWhiteFontColor}
          style={{
            marginRight: 15,
          }}
        />
        <StyledQAPopupMenuText>Add Item</StyledQAPopupMenuText>
      </DoxleAnimatedButton>
      <DoxleAnimatedButton
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}
        onPress={() => {
          setOpenPopupMenu(false);
          setShowFilter(true);
        }}>
        <OctIcon
          name="filter"
          size={25}
          color={staticMenuColor.staticWhiteFontColor}
          style={{
            marginRight: 15,
          }}
        />
        <StyledQAPopupMenuText>Filter Items</StyledQAPopupMenuText>
      </DoxleAnimatedButton>
      <DoxleAnimatedButton
        onPress={handlePressPdfMenu}
        style={[
          styles.menuBtn,
          {
            borderBottomColor: staticMenuColor.staticDivider,
          },
        ]}>
        <DoxlePDFIcon containerStyle={{width: 25, marginRight: 15}} />
        <StyledQAPopupMenuText>Export PDF</StyledQAPopupMenuText>
      </DoxleAnimatedButton>
    </StyledQAPopupMenuWrapper>
  );
};

export default QAListDetailPopupMenu;

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
