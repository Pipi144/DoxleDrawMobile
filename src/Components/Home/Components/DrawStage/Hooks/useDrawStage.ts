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

import {useShallow} from 'zustand/shallow';
import {useBackgroundStore} from '../../../Stores/BackgroundStore';
import useRetrieveAllLayerData from './useRetrieveAllLayerData';
import useGetStageSize from './useGetStageSize';
import {useKonvaStore} from '../../../Stores/useKonvaStore';
import {useEffect, useRef} from 'react';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

const useDrawStage = () => {
  const {isRetrieveLayerData, walls, openingItems} = useRetrieveAllLayerData();
  const {selectedBg} = useBackgroundStore(
    useShallow(state => ({selectedBg: state.selectedBg})),
  );
  const {stageState} = useKonvaStore(
    useShallow(state => ({stageState: state.stageState})),
  );
  const {isCalculatingSize} = useGetStageSize({
    walls,
    background: selectedBg,
    enableCalculating: !isRetrieveLayerData,
    openings: openingItems,
  });
  const zoomRef = useRef<ReactNativeZoomableView>(null);
  const resetZoom = () => {
    zoomRef.current?.zoomTo(1);
  };

  return {
    isRetrieveLayerData,
    walls,
    selectedBg,
    stageState,
    isCalculatingSize,
    openingItems,
    zoomRef,
    resetZoom,
  };
};

export default useDrawStage;
