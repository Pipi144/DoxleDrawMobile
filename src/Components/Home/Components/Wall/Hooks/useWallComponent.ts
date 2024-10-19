import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {XY} from '../../../../../Models/DrawModels/XY';
import {IWall} from '../../../../../Models/DrawModels/Walls';
import {useKonvaStore} from '../../../Stores/useKonvaStore';
import {useShallow} from 'zustand/shallow';
import {useWallsStore} from '../../../Stores/WallsStore';

export interface FillGradient {
  fillLinearGradientStartPoint: XY;
  fillLinearGradientEndPoint: XY;
  fillLinearGradientColorStops: (number | string)[];
}
type Props = {
  wall: IWall;
};

const useWallComponent = ({wall}: Props) => {
  const {currentLayer, stageState} = useKonvaStore(
    useShallow(state => ({
      currentLayer: state.currentLayer,
      stageState: state.stageState,
    })),
  );
  const {walls} = useWallsStore(
    useShallow(state => ({
      walls: state.walls,
    })),
  );
  const wallPoints = useMemo(() => {
    let points = '';
    let length = wall.wallPoints.length;
    for (let i = 0; i < length; i++) {
      points += `${wall.wallPoints[i].x + wall.xPosition},${
        wall.wallPoints[i].y + wall.yPosition
      } `;
    }
    return points;
  }, [wall.wallPoints]);
  return {wallPoints};
};

export default useWallComponent;
