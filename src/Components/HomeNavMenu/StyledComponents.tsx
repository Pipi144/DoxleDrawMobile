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
import {styled} from 'styled-components/native';

// limitations under the License.
export const StyledNavigationMenu = styled(Animated.View)`
  position: absolute;
  bottom: ${p => p.theme.deviceSize.insetBottom + 8}px;
  align-self: center;

  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${p => p.theme.THEME_COLOR.rowBorderColor};
  border-style: solid;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  z-index: 10;
`;

export const StyledMenuBtn = styled.Pressable`
  width: ${p => (p.theme.deviceType === 'Smartphone' ? 60 : 70)}px;
  aspect-ratio: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
`;
