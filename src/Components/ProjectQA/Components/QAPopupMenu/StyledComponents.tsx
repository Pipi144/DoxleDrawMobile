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
export const StyledQAPopupMenuWrapper = styled.View`
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-radius: 12px;
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 200 : 240)}px;
`;
export const StyledQAPopupMenuText = styled.Text<{
  $fontColor?: string;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  color: ${p => p.$fontColor ?? p.theme.staticMenuColor.staticWhiteFontColor};
`;
