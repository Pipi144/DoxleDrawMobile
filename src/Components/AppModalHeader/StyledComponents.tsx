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

import styled from 'styled-components/native';

// limitations under the License.
export const StyledAppModalHeader = styled.View`
  padding: ${p => p.theme.deviceSize.insetTop + 8}px 12px 8px 12px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: ${p => p.theme.doxleFontSize.contentTextSize + 5}px;
  background-color: ${p => p.theme.staticMenuColor.staticHover};
  overflow: hidden;
`;

export const StyledAppRouteText = styled.Text`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize + 2}px;
  font-weight: 600;
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  margin: 0px 10px;
  flex-shrink: 1;
`;
