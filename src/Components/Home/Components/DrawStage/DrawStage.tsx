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
import React, {useEffect} from 'react';
import {StyledDrawStage, StyledImageBackground} from './StyledComponents';
import useDrawStage from './Hooks/useDrawStage';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import Svg, {Circle, Image} from 'react-native-svg';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Background from '../Background/Background';
import FetchingScreen from '../../../../Utilities/AnimationScreens/FetchingScreen/FetchingScreen';
import WallComponent from '../Wall/WallComponent';
import {ImageBackground} from 'react-native';
import OpeningComponent from '../Opening/OpeningComponent';
import Debug from '../Debug';
import ZoomableGroup from './ZoomableGroup';

type Props = {};

const DrawStage = (props: Props) => {
  const {theme} = useDOXLETheme();
  const {
    isRetrieveLayerData,
    walls,
    selectedBg,
    stageState,
    isCalculatingSize,
    openingItems,
    zoomRef,
    resetZoom,
  } = useDrawStage();
  useEffect(() => {
    console.log('stageState:', stageState);
  }, [stageState]);

  return (
    <StyledDrawStage
    //   source={require('../../../../assets/images/gridbg.png')}
    //   resizeMode="cover"
    >
      {!isCalculatingSize && (
        <ZoomableGroup stageState={stageState}>
          {selectedBg && <Background bgItem={selectedBg} />}
          {walls.map(w => (
            <WallComponent wall={w} key={w.wallId} />
          ))}
          {openingItems.map(opening => (
            <OpeningComponent item={opening} key={opening.openingId} />
          ))}
          <Circle
            cx={stageState.minX}
            cy={stageState.minY}
            r={100}
            fill={'red'}
          />
          <Debug />
        </ZoomableGroup>
      )}
      {isCalculatingSize && (
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
      )}
    </StyledDrawStage>
  );
};

export default DrawStage;
