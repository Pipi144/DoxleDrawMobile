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
// limitations under the License.
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Line} from 'react-native-svg';

type Props = {};

const Debug = (props: Props) => {
  return (
    <>
      <Line x={0} y={0} x1={0} y1={-50} stroke={'blue'} strokeWidth={10} />
      <Line x={0} y={0} x1={50} y1={0} stroke={'red'} strokeWidth={10} />
    </>
  );
};

export default Debug;
