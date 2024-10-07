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
import {View, Text} from 'react-native';
import React from 'react';
import useUploadIndicator from './Hooks/useUploadIndicator';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {styled} from 'styled-components/native';
import UploadingLoader from '../../../../../../../Utilities/AnimationScreens/UploadingLoader/UploadingLoader';

type Props = {};
const StyledUploadIndicator = styled(Animated.View)`
  position: absolute;
  bottom: ${p => p.theme.deviceSize.insetBottom + 14}px;
  right: 14px;
  padding: 10px 20px;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-radius: 10px;
  elevation: 4;
  shadow-color: #0000050;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const StyledUploadText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  font-weight: 500;
`;

const UploadIndicator = (props: Props) => {
  const {isCurrentUploadingFiles, boxAnimatedStyles, composed} =
    useUploadIndicator();
  return isCurrentUploadingFiles ? (
    <GestureDetector gesture={composed}>
      <StyledUploadIndicator
        style={{
          ...boxAnimatedStyles,
        }}
        entering={ZoomIn.springify().damping(8).stiffness(90).mass(0.8)}
        exiting={ZoomOut.springify().damping(8).stiffness(150).mass(0.4)}>
        <StyledUploadText>Uploading files</StyledUploadText>

        <UploadingLoader
          size={50}
          containerStyle={{
            width: 40,
            height: 40,
            marginLeft: 10,
          }}
        />
      </StyledUploadIndicator>
    </GestureDetector>
  ) : (
    <></>
  );
};

export default UploadIndicator;
