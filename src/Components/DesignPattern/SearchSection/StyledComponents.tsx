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

import {Pressable, TextInput} from 'react-native';
import styled from 'styled-components/native';

// limitations under the License.
export const StyledSearchSection = styled(Pressable)`
  padding: 8px 60px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: ${p => p.theme.THEME_COLOR.rowBorderColor};
  background-color: ${p =>
    p.theme.theme === 'light'
      ? '#f9fafb'
      : p.theme.THEME_COLOR.primaryContainerColor};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: center;
`;
export const StyledSearchInput = styled(TextInput)`
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 150 : 200)}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};

  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 500;
`;
