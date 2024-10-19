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

import {useCallback, useEffect, useState} from 'react';
import {IWall} from '../../../../../Models/DrawModels/Walls';
import {IBackground} from '../../../../../Models/DrawModels/Backgrounds';
import {useKonvaStore} from '../../../Stores/useKonvaStore';
import {useShallow} from 'zustand/shallow';
import {OpeningItem} from '../../../../../Models/DrawModels/Openings';

type Props = {
  walls: IWall[];
  openings: OpeningItem[];
  background?: IBackground;
  enableCalculating: boolean;
};

const PADDING = 200;
const useGetStageSize = (props: Props) => {
  const [isCalculatingSize, setIsCalculatingSize] = useState(true);

  const {walls, background, enableCalculating, openings} = props;
  const setStageState = useKonvaStore(useShallow(state => state.setStageState));
  const calculatingStageSize = useCallback(() => {
    setIsCalculatingSize(true);
    let xMin: number | undefined;
    let yMin: number | undefined;
    let xMax: number | undefined;
    let yMax: number | undefined;
    //walls
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (!wall) continue;
      // Get min/max values for current wall's points
      let minXWallPoints: number = Infinity;
      let minYWallPoints: number = Infinity;
      let maxXWallPoints: number = -Infinity;
      let maxYWallPoints: number = -Infinity;

      for (let j = 0; j < wall.wallPoints.length; j++) {
        const {x, y} = wall.wallPoints[j];
        minXWallPoints = Math.min(minXWallPoints, x + wall.xPosition);
        minYWallPoints = Math.min(minYWallPoints, -(y + wall.yPosition));
        maxXWallPoints = Math.max(maxXWallPoints, x + wall.xPosition);
        maxYWallPoints = Math.max(maxYWallPoints, -(y + wall.yPosition));
      }

      xMin =
        xMin !== undefined ? Math.min(xMin, minXWallPoints) : minXWallPoints;
      yMin =
        yMin !== undefined ? Math.min(yMin, minYWallPoints) : minYWallPoints;
      xMax =
        xMax !== undefined ? Math.max(xMax, maxXWallPoints) : maxXWallPoints;
      yMax =
        yMax !== undefined ? Math.max(yMax, maxYWallPoints) : maxYWallPoints;
    }

    //openings
    // for (let i = 0; i < openings.length; i++) {
    //   const opening = openings[i];
    //   if (!opening) continue;
    //   let minXOpening = Math.min(
    //     opening.xPosition,
    //     opening.xPosition + opening.xWidth,
    //   );
    //   let minYOpening = Math.min(
    //     opening.yPosition,
    //     opening.yPosition + opening.yDepth,
    //   );
    //   let maxXOpening = Math.max(
    //     opening.xPosition,
    //     opening.xPosition + opening.xWidth,
    //   );
    //   let maxYOpening = Math.max(
    //     opening.yPosition,
    //     opening.yPosition + opening.yDepth,
    //   );
    //   xMin = xMin ? Math.min(xMin, minXOpening) : minXOpening;
    //   yMin = yMin ? Math.min(yMin, minYOpening) : minYOpening;
    //   xMax = xMax ? Math.max(xMax, maxXOpening) : maxXOpening;
    //   yMax = yMax ? Math.max(yMax, maxYOpening) : maxYOpening;
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
      return;
    } else
      setStageState({
        minX: Math.floor(xMin - xMax) * 10,
        minY: Math.floor(yMin - yMax) * 10,
        width: Math.ceil(xMax - xMin) * 20,
        height: Math.ceil(yMax - yMin) * 20,
      });
    setIsCalculatingSize(false);
  }, [walls, background]);

  useEffect(() => {
    if (enableCalculating) {
      const timeout = setTimeout(() => {
        calculatingStageSize();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [calculatingStageSize, enableCalculating]);

  return {
    isCalculatingSize,
  };
};

export default useGetStageSize;
