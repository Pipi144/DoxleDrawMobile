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

import Svg, {Circle, Path} from 'react-native-svg';
import {View} from 'react-native';
import {ISVGResponsiveCustom} from '../../Models/utilityType';

// limitations under the License.
export const FileMenuIcon = ({
  containerStyle,
  ...props
}: Omit<ISVGResponsiveCustom, 'themeColor'>) => (
  <View
    style={{
      width: 60,
      ...containerStyle,
      aspectRatio: 60 / 51,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 60 51"
      fill="none"
      {...props}>
      <Path
        fill="#A9C8F2"
        d="M21 0a3 3 0 0 1 1.825.618l.3.26L26.825 9h24.176a9 9 0 0 1 8.985 8.472L60 18v24a9 9 0 0 1-8.472 8.985L51 51H9.002a9 9 0 0 1-8.985-8.472L.001 42V9c0-2.296-.075-5.83 1.5-7.5C3.074-.17 6.18.15 8.472.015L9.001 0h12Z"
      />
    </Svg>
  </View>
);

export const DrawMenuIcon = ({
  containerStyle,
  ...props
}: Omit<ISVGResponsiveCustom, 'themeColor'>) => (
  <View
    style={{
      width: 60,
      ...containerStyle,
      aspectRatio: 59 / 55,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 59 55"
      fill="none"
      {...props}>
      <Path
        fill="#00A652"
        stroke="#353E50"
        d="M25.254 20.766h33.237v33.237H25.254z"
      />
      <Circle
        cx={19.415}
        cy={19.415}
        r={18.415}
        fill="#FFCA0F"
        stroke="#353E50"
      />
    </Svg>
  </View>
);

export const BudgetMenuIcon = ({
  containerStyle,
  themeColor,
  ...props
}: ISVGResponsiveCustom) => (
  <View
    style={{
      width: 60,
      ...containerStyle,
      aspectRatio: 46 / 41,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 46 41"
      fill="none"
      {...props}>
      <Path
        stroke={themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M1 9.578h17.161m-8.583 8.583V1M30.42 2.227l14.709 14.709m-14.709 0 14.709-14.71M2.226 36.547h14.709m13.485-3.68h14.71m-14.71 7.352h14.71"
      />
    </Svg>
  </View>
);
