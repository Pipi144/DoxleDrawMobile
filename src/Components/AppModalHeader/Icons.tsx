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

import Svg, {Path} from 'react-native-svg';
import {ISVGResponsiveCustom} from '../../../Models/utilityType';
import {View} from 'react-native';

// limitations under the License.
export const SettingIcon = ({
  containerStyle,
  staticColor,
  ...props
}: Omit<ISVGResponsiveCustom, 'themeColor'> & {
  staticColor?: string;
}) => (
  <View
    style={{
      width: 30,
      ...containerStyle,
      aspectRatio: 1,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 15 15"
      fill="none"
      {...props}>
      <Path
        fill={staticColor ?? '#fff'}
        fillRule="evenodd"
        d="M7.446 8.538a.77.77 0 1 1 0-1.538.77.77 0 0 1 0 1.538Zm-3.077 0a.77.77 0 1 1 0-1.538.77.77 0 0 1 0 1.538Zm6.231 0A.77.77 0 1 1 10.6 7a.77.77 0 0 1 0 1.538Z"
        clipRule="evenodd"
      />
      <Path
        fill={staticColor ?? '#fff'}
        fillRule="evenodd"
        d="M7.5 1.154a6.346 6.346 0 1 0 0 12.692 6.346 6.346 0 0 0 0-12.692ZM0 7.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z"
        clipRule="evenodd"
      />
    </Svg>
  </View>
);
