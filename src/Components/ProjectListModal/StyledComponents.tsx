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

import {Platform, Animated as RNAnimated, TextInput} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const StyledProjectItemSwipeView = styled(RNAnimated.View)<{
  $viewWidth: number;
}>`
  width: ${p => p.$viewWidth}px;

  height: 100%;
  z-index: 1;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  right: ${p => p.$viewWidth}px;

  display: flex;
`;
export const RootProjectListItem = styled.Pressable<{
  $height: number;
}>`
  width: 100%;
  padding: 0px 14px;
  height: ${p => p.$height}px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StyledProjectItemAddressText = styled(Animated.Text)<{
  $selected: boolean;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryFont};
  font-style: normal;
  font-weight: ${p => (p.$selected ? 500 : 400)};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: ${p =>
    p.$selected
      ? p.theme.THEME_COLOR.doxleColor
      : p.theme.THEME_COLOR.primaryFontColor};
  flex-shrink: 1;
`;
export const StyledEditProjectTextInput = styled(TextInput)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  padding: 0px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  flex: 1;
`;
export const StyledProjectSectionHeaderText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  padding: 12px 14px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  width: 100%;
  text-transform: capitalize;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
`;
export const RootProjectListBottomModal = styled.View<{}>`
  height: 100%;
  width: 100%;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  padding-top: ${p =>
    Platform.OS === 'ios' ? p.theme.deviceSize.insetTop : 8}px;
  padding-bottom: ${p =>
    Platform.OS === 'ios' ? p.theme.deviceSize.insetBottom : 8}px;
  display: flex;
  flex-direction: column;
`;
export const StyledProjectListTitleContainer = styled.View<{}>`
  width: 100%;
  height: ${p => (p.theme.deviceType === 'Smartphone' ? 44 : 46)}px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0px 14px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryDividerColor};
`;
export const StyledProjectListTitleText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  color: white;
  text-transform: uppercase;
`;
export const StyledAddProjectSection = styled.View`
  width: 100%;
  display: flex;

  padding: 14px;
`;
export const StyledAddProjectBtnText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p => p.theme.THEME_COLOR.doxleColor};
  margin-left: 4px;
`;
export const StyledAddProjectTextInput = styled(TextInput)<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.titleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  padding: 0px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};

  flex: 1;
`;
