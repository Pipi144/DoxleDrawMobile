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
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

// limitations under the License.
export const StyledBudgetContainer = styled.ImageBackground`
  width: 100%;
  height: 100%;

  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
  position: relative;
  display: flex;
  overflow: hidden;
`;
export const StyledBudgetItem = styled(Animated.View)`
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  margin-bottom: 10px;
  border-radius: 2px;
  border-width: 1px;
  border-color: ${p => p.theme.THEME_COLOR.rowBorderColor};
  border-style: solid;
  display: flex;
`;
export const StyledBudgetDataSection = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: center;
  padding: 10px;
  border-bottom-width: 1.5px;
  border-bottom-color: ${p => p.theme.THEME_COLOR.rowBorderColor};
  border-bottom-style: solid;
`;
export const StyledBudgetDataText = styled.Text<{
  $textColor?: string;
  $width?: number;
}>`
  ${p => p.$width && `width:${p.$width}px;`}

  color: ${p => p.$textColor ?? p.theme.THEME_COLOR.primaryFontColor};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-style: normal;
  font-weight: 600;
  text-transform: lowercase;
  line-height: normal;
  margin-right: 10px;

  min-width: 100px;
`;
export const StyledCommentDueDateSection = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
`;
export const StyledBudgetCommentText = styled.Text`
  flex: 1;

  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
  font-family: SourceCodePro-Regular;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 400;
  text-transform: lowercase;
  line-height: normal;
  margin-right: 10px;
  letter-spacing: -0.5px;
`;
export const StyledDueDateText = styled.Text`
  flex: 1;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  font-family: SourceCodePro-Regular;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-style: normal;
  font-weight: 450;
  text-transform: none;
  line-height: normal;
  letter-spacing: -0.5px;
`;
