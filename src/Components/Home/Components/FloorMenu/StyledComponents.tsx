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

import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

// limitations under the License.
export const StyledFloorMenu = styled(Animated.View)`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 100;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  border-radius: 12px;
  padding-left: 12px;
  border: 1px solid ${p => p.theme.THEME_COLOR.rowBorderColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;
export const StyledStoreyNameText = styled.Text`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-weight: 500;
  margin: 0px 14px;
  line-height: normal;
`;
export const StyledStoreySelectBtn = styled.Pressable`
  align-self: stretch;
  border-left-width: 1px;
  border-color: ${p => p.theme.THEME_COLOR.rowBorderColor};
  padding: 0px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const StyledDimensionModeBtn = styled.Pressable`
  background-color: #a9c8f230;
  align-self: stretch;

  padding: 0px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const StyledDimensionText = styled.Text`
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-weight: 500;
  line-height: normal;
`;
