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
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {IWall} from '../../../../../Models/DrawModels/Walls';
import {IBackground} from '../../../../../Models/DrawModels/Backgrounds';

type Props = {
  walls: IWall[];
  background?: IBackground;
};

const useGetStageSize = (props: Props) => {
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);
  const [viewBox, setViewBox] = useState('-1000 -1000 1000 1000');
  const {walls, background} = props;
  const calculatingStageSize = useCallback(() => {
    setIsCalculatingSize(true);
    let xMin: number | undefined = undefined;
    let yMin: number | undefined = undefined;
    let xMax: number | undefined = undefined;
    let yMax: number | undefined = undefined;
    // for (let i = 0; i < walls.length; i++) {
    //   const wall = walls[i];
    //   let minXWallPoints = 0;
    //   let minYWallPoints = 0;
    //   let maxXWallPoints = 0;
    //   let maxYWallPoints = 0;
    //   for (let j = 0; j < wall.wallPoints.length; i++) {
    //     minXWallPoints = Math.min(minXWallPoints, wall.wallPoints[j].x);
    //     minYWallPoints = Math.min(minYWallPoints, wall.wallPoints[j].y);
    //     maxXWallPoints = Math.max(maxXWallPoints, wall.wallPoints[j].x);
    //     maxYWallPoints = Math.max(maxYWallPoints, wall.wallPoints[j].y);
    //   }

    //   xMin = Math.min(xMin, minXWallPoints);
    //   yMin = Math.min(yMin, minYWallPoints);
    //   xMax = Math.max(xMax, maxXWallPoints);
    //   yMax = Math.max(yMax, maxYWallPoints);
    // }
    if (background) {
      let minXBg = Math.min(
        background.xPosition,
        background.xPosition + background.width,
      );
      let minYBg = Math.min(
        background.yPosition,
        background.yPosition + background.height,
      );
      let maxXBg = Math.max(
        background.xPosition,
        background.xPosition + background.width,
      );
      let maxYBg = Math.max(
        background.yPosition,
        background.yPosition + background.height,
      );
      xMin = xMin ? Math.min(xMin, minXBg) : minXBg;
      yMin = yMin ? Math.min(yMin, minYBg) : minYBg;
      xMax = xMax ? Math.max(xMax, maxXBg) : maxXBg;
      yMax = yMax ? Math.max(yMax, maxYBg) : maxYBg;
    }
    if (
      xMin === undefined ||
      yMin === undefined ||
      xMax === undefined ||
      yMax === undefined
    ) {
      setViewBox('-1000 -1000 1000 1000');
      setIsCalculatingSize(false);
      return;
    }
    setViewBox(
      `${Math.floor(xMin) - 50} ${Math.floor(yMin) - 50} ${
        Math.ceil(xMax - xMin) + 50
      } ${Math.ceil(yMax - yMin) + 50}`,
    );
    setIsCalculatingSize(false);
  }, [walls, background]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      calculatingStageSize();
    }, 300);
    return () => clearTimeout(timeout);
  }, [calculatingStageSize]);
  useEffect(() => {
    console.log('viewBox', viewBox);
  }, [viewBox]);

  return {
    viewBox,
    isCalculatingSize,
  };
};

export default useGetStageSize;
