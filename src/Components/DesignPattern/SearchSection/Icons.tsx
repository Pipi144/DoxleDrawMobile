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

import {View} from 'react-native';
import {ISVGResponsiveCustom} from '../../../Models/utilityType';
import Svg, {Path} from 'react-native-svg';

// limitations under the License.
export const SearchIcon = ({
  containerStyle,
  ...props
}: Omit<ISVGResponsiveCustom, 'themeColor'>) => (
  <View
    style={{
      width: 25,
      ...containerStyle,
      aspectRatio: 25 / 24,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 25 24"
      fill="none"
      {...props}>
      <Path
        fill="#9CA3AF"
        d="M10.75 3C6.755 3 3.5 6.255 3.5 10.25s3.255 7.25 7.25 7.25c1.728 0 3.317-.61 4.565-1.625l4.905 4.905a.75.75 0 1 0 1.06-1.06l-4.905-4.905A7.213 7.213 0 0 0 18 10.25C18 6.255 14.745 3 10.75 3Zm0 1.5a5.739 5.739 0 0 1 5.75 5.75 5.727 5.727 0 0 1-1.604 3.985.746.746 0 0 0-.16.16A5.727 5.727 0 0 1 10.75 16 5.739 5.739 0 0 1 5 10.25a5.739 5.739 0 0 1 5.75-5.75Z"
      />
    </Svg>
  </View>
);
