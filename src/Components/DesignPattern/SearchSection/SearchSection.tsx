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
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useRef, useState} from 'react';
import {StyledSearchInput, StyledSearchSection} from './StyledComponents';
import {SearchIcon} from './Icons';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {editRgbaAlpha} from '../../../Utilities/FunctionUtilities';
import useThrottlingSearch from '../../../CustomHooks/useThrottlingSearch';
import {TextInput} from 'react-native-gesture-handler';
import OutsidePressHandler from 'react-native-outside-press';

type Props = {
  placeholder?: string;
  onSearch?: (text: string) => void;
  containerStyle?: ViewStyle;
};

const SearchSection = ({placeholder, onSearch, containerStyle}: Props) => {
  const [searchVal, setSearchVal] = useState('');
  const {THEME_COLOR, theme} = useDOXLETheme();
  const {searchThrottleValue} = useThrottlingSearch({
    controlledValue: searchVal,
    delayTime: 200,
    onThrottleChange: onSearch,
  });
  const inputRef = useRef<TextInput>(null);
  return (
    <StyledSearchSection
      style={containerStyle}
      onPress={() => {
        inputRef.current?.focus();
      }}>
      <OutsidePressHandler
        onOutsidePress={() => inputRef.current?.blur()}
        disabled={false}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <SearchIcon
          containerStyle={{
            marginRight: 8,
            pointerEvents: 'none',
          }}
        />

        <StyledSearchInput
          placeholder={placeholder ?? 'Search'}
          placeholderTextColor={
            theme === 'light'
              ? '#9CA3AF'
              : editRgbaAlpha({
                  rgbaColor: THEME_COLOR.primaryFontColor,
                  alpha: '0.3',
                })
          }
          value={searchVal}
          onChangeText={setSearchVal}
          ref={inputRef}
        />
      </OutsidePressHandler>
    </StyledSearchSection>
  );
};

export default SearchSection;

const styles = StyleSheet.create({});
