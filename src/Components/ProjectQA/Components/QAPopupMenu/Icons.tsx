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

import Svg, {Circle, ClipPath, Defs, G, Path} from 'react-native-svg';
import {ISVGResponsiveColorCustom} from '../../../../../../../Models/utilityType';
import {View} from 'react-native';

// limitations under the License.
export const AddQAListIcon = ({
  staticColor,
  containerStyle,
  staticStrokeColor,
  ...props
}: ISVGResponsiveColorCustom & {
  staticStrokeColor?: string;
}) => (
  <View
    style={{
      width: 24,
      ...containerStyle,
      aspectRatio: 19 / 23,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 19 23"
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? '#000'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"
      />
      <Path
        stroke={staticColor ?? '#000'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h.01M5 15h.01M8 14l1 1 3-3M5 3a2 2 0 0 1 2-2h2a2 2 0 0 1 0 4H7a2 2 0 0 1-2-2Z"
      />
      <Circle cx={15} cy={19} r={4} fill={staticColor ?? '#000'} />
      <G clipPath="url(#a)">
        <Path
          fill={staticStrokeColor ?? '#fff'}
          d="M14.938 16.625a.188.188 0 0 1 .187.188v1.937h1.938a.188.188 0 0 1 0 .375h-1.938v1.938a.188.188 0 0 1-.375 0v-1.938h-1.938a.188.188 0 0 1 0-.375h1.938v-1.938a.188.188 0 0 1 .188-.187Z"
        />
      </G>
      <Path stroke={staticColor ?? '#000'} d="M12.5 16.5h5v5h-5z" />
      <Defs>
        <ClipPath id="a">
          <Path fill={staticStrokeColor ?? '#fff'} d="M12 16h6v6h-6z" />
        </ClipPath>
      </Defs>
    </Svg>
  </View>
);
