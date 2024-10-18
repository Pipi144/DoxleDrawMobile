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
  enableCalculating: boolean;
};

const useGetStageSize = (props: Props) => {
  const [isCalculatingSize, setIsCalculatingSize] = useState(true);
  const [viewBox, setViewBox] = useState('-1000 -1000 1000 1000');
  const {walls, background, enableCalculating} = props;
  const calculatingStageSize = useCallback(() => {
    setIsCalculatingSize(true);
    let xMin: number | undefined;
    let yMin: number | undefined;
    let xMax: number | undefined;
    let yMax: number | undefined;
    // for (let i = 0; i < walls.length; i++) {
    //   const wall = walls[i];
    //   if (!wall) continue;

    //   // Get min/max values for current wall's points
    //   let minXWallPoints = Infinity;
    //   let minYWallPoints = Infinity;
    //   let maxXWallPoints = -Infinity;
    //   let maxYWallPoints = -Infinity;
    //   for (let j = 0; j < wall.wallPoints.length; i++) {
    //     const {x, y} = wall.wallPoints[j];
    //     minXWallPoints = Math.min(minXWallPoints, x);
    //     minYWallPoints = Math.min(minYWallPoints, y);
    //     maxXWallPoints = Math.max(maxXWallPoints, x);
    //     maxYWallPoints = Math.max(maxYWallPoints, y);
    //   }

    //   xMin =
    //     xMin !== undefined ? Math.min(xMin, minXWallPoints) : minXWallPoints;
    //   yMin =
    //     yMin !== undefined ? Math.min(yMin, minYWallPoints) : minYWallPoints;
    //   xMax =
    //     xMax !== undefined ? Math.max(xMax, maxXWallPoints) : maxXWallPoints;
    //   yMax =
    //     yMax !== undefined ? Math.max(yMax, maxYWallPoints) : maxYWallPoints;
    // }
    if (background) {
      let minXBg = Math.min(
        background.xPosition,
        background.xPosition + background.width * background.scaleX,
      );
      let minYBg = Math.min(
        background.yPosition,
        background.yPosition + background.height * background.scaleY,
      );
      let maxXBg = Math.max(
        background.xPosition,
        background.xPosition + background.width * background.scaleX,
      );
      let maxYBg = Math.max(
        background.yPosition,
        background.yPosition + background.height * background.scaleY,
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
    } else
      setViewBox(
        `${Math.floor(xMin) - 200} ${Math.floor(yMin) - 200} ${
          Math.ceil(xMax - xMin) + 400
        } ${Math.ceil(yMax - yMin) + 400}`,
      );
    setIsCalculatingSize(false);
  }, [walls, background]);

  useEffect(() => {
    console.log('Calculating stage size...', enableCalculating);
    if (enableCalculating) {
      const timeout = setTimeout(() => {
        calculatingStageSize();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [calculatingStageSize, enableCalculating]);
  useEffect(() => {
    console.log('viewBox', viewBox);
  }, [viewBox]);
  useEffect(() => {
    console.log('background', background);
  }, [background]);

  return {
    viewBox,
    isCalculatingSize,
  };
};

export default useGetStageSize;
