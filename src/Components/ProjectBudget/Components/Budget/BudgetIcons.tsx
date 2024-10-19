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
import Svg, {Path} from 'react-native-svg';
import {ISVGResponsiveCustom} from '../../../../Models/utilityType';

export const OrderIcon = ({
  containerStyle,
  staticColor,
  themeColor,
  ...props
}: ISVGResponsiveCustom & {
  staticColor?: string;
}) => (
  <View
    style={{
      width: 14,
      ...containerStyle,
      aspectRatio: 14 / 15,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 14 15"
      fill="none"
      {...props}>
      <Path
        fill={staticColor ?? themeColor.primaryFontColor}
        fillRule="evenodd"
        d="M11.556 1.154a1.244 1.244 0 0 0-.848.336 1.15 1.15 0 0 0-.363.82v6.343H12.6c.053 0 .104-.02.141-.056a.189.189 0 0 0 .059-.136V2.31a1.152 1.152 0 0 0-.364-.82 1.244 1.244 0 0 0-.86-.336h-.02ZM9.145 3.557V2.301a2.26 2.26 0 0 1 .33-1.147H2.43a1.244 1.244 0 0 0-.86.337c-.23.216-.36.51-.365.82v1.246h3.97c.33 0 .6.258.6.577a.589.589 0 0 1-.6.577h-3.97v1.922h1.228c.331 0 .6.259.6.577a.589.589 0 0 1-.6.577H1.206v5.861a.555.555 0 0 1-.005.076.104.104 0 0 0 .032.09.109.109 0 0 0 .023.018l.78-.447a2.49 2.49 0 0 1 2.435-.02l.101.056a1.254 1.254 0 0 0 1.206 0 2.494 2.494 0 0 1 2.625.141l.395.278a.994.994 0 0 0 .2-.034.293.293 0 0 0 .125-.062.046.046 0 0 0 .01-.017.22.22 0 0 0 .012-.079V7.787h-3.97a.589.589 0 0 1-.6-.577.59.59 0 0 1 .6-.577h3.97V4.711H7.917a.589.589 0 0 1-.6-.577c0-.319.269-.577.6-.577h1.228Zm1.2 6.249v3.842c0 .35-.121.649-.336.875a1.477 1.477 0 0 1-.66.386 2.284 2.284 0 0 1-.77.085l-.018-.001h-.009l-.001-.001s.027.002.01 0H8.55a.615.615 0 0 1-.302-.11l-.554-.389a1.253 1.253 0 0 0-1.32-.071 2.49 2.49 0 0 1-2.397 0l-.103-.056a1.252 1.252 0 0 0-1.224.01l-.937.537a.616.616 0 0 1-.228.076 1.36 1.36 0 0 1-.594-.056 1.32 1.32 0 0 1-.507-.303 1.255 1.255 0 0 1-.315-.487 1.23 1.23 0 0 1-.063-.527v-6.4a.565.565 0 0 1 0-.012V2.301A2.284 2.284 0 0 1 .728.669 2.47 2.47 0 0 1 2.435 0h.002-.003 9.139a2.47 2.47 0 0 1 1.705.669c.455.43.715 1.018.722 1.632V8.46c0 .357-.148.7-.41.952a1.428 1.428 0 0 1-.99.394h-2.255Z"
        clipRule="evenodd"
      />
    </Svg>
  </View>
);
export const BudgetIcon = ({
  containerStyle,
  staticColor,
  themeColor,
  ...props
}: ISVGResponsiveCustom & {
  staticColor?: string;
}) => (
  <View
    style={{
      width: 18,
      ...containerStyle,
      aspectRatio: 1,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={1}
        strokeWidth={1.4}
        d="M3.751 11.25h6M3.75 4.5c0-2.218.333-2.25 5.25-2.25 4.903 0 5.25 0 5.25 2.25V15a.716.716 0 0 1-.722.75.75.75 0 0 1-.488-.18l-.718-.616a1.5 1.5 0 0 0-1.748-.148l-.801.481a1.5 1.5 0 0 1-1.544 0l-.801-.48a1.5 1.5 0 0 0-1.748.147l-.719.615a.75.75 0 0 1-.772.125.716.716 0 0 1-.438-.694V4.5Zm9.001 6.75h1.5"
      />
    </Svg>
  </View>
);
