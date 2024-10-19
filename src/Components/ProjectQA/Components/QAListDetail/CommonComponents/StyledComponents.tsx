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

import {Pressable} from 'react-native';
import Animated from 'react-native-reanimated';
import {styled} from 'styled-components/native';

// limitationss under the License.
export const StyledAssigneeDisplayer = styled(
  Animated.createAnimatedComponent(Pressable),
)`
  background-color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  border-radius: 80px;
  padding: 8px 12px;
  align-self: flex-end;
  margin-top: auto;
`;
export const StyledAssigneeNameText = styled.Text`
  font-family: ${p => p.theme.DOXLE_FONT.sourceCodeRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  text-transform: lowercase;
`;

export const StyledQAFilterTag = styled(Animated.View)`
  border: 1px solid ${p => p.theme.THEME_COLOR.rowBorderColor};
  padding: 5px 10px;
  border-radius: 15px;

  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 4px 0px;
  margin-right: 8px;
  align-self: center;
`;
export const StyledQAFilterTagText = styled.Text<{}>`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 500;
  text-transform: none;
`;
