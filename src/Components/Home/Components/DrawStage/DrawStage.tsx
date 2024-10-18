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
import React from 'react';
import {StyledDrawStage} from './StyledComponents';
import useDrawStage from './Hooks/useDrawStage';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import Svg, {Circle} from 'react-native-svg';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Background from '../Background/Background';
import FetchingScreen from '../../../../Utilities/AnimationScreens/FetchingScreen/FetchingScreen';

type Props = {};

const DrawStage = (props: Props) => {
  const {theme} = useDOXLETheme();
  const {isRetrieveLayerData, walls, selectedBg, viewBox, isCalculatingSize} =
    useDrawStage();
  return (
    <StyledDrawStage
      source={require('../../../../assets/images/gridbg.png')}
      resizeMode="cover">
      {!isCalculatingSize && (
        <ReactNativeZoomableView
          maxZoom={30}
          minZoom={0.01}
          bindToBorders={false}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
          }}>
          <Svg
            width={'100%'}
            height={'100%'}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}>
            {selectedBg && <Background bgItem={selectedBg} />}
          </Svg>
        </ReactNativeZoomableView>
      )}
      {/* {isCalculatingSize && (
        <FetchingScreen
          fetchingType="list"
          messageText="Processing data..."
          containerStyle={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            display: 'flex',
          }}
        />
      )} */}
    </StyledDrawStage>
  );
};

export default DrawStage;
