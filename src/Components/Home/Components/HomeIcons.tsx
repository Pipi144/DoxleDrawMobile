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
import {ISVGResponsiveColorCustom} from '../../../Models/utilityType';
import {View} from 'react-native';

// limitations under the License.
export const StoreySelectIcon = ({
  staticColor,
  containerStyle,
  fillColor,
  ...props
}: ISVGResponsiveColorCustom & {
  fillColor?: string;
}) => (
  <View
    style={{
      width: 19,
      ...containerStyle,
      display: 'flex',
      aspectRatio: 1,
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 19 19"
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? '#353E50'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.25 1H5.75A1.75 1.75 0 0 0 4 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0 0 18 13.25V2.75A1.75 1.75 0 0 0 16.25 1Z"
      />
      <Path
        fill={fillColor ?? '#fff'}
        stroke={staticColor ?? '#353E50'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.25 4H2.75A1.75 1.75 0 0 0 1 5.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0 0 15 16.25V5.75A1.75 1.75 0 0 0 13.25 4Z"
      />
    </Svg>
  </View>
);
