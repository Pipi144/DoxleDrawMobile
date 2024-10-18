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
  const {currentLayer} = useKonvaStore(
    useShallow(state => ({
      currentLayer: state.currentLayer,
    })),
  );
  const {walls} = useWallsStore(
    useShallow(state => ({
      walls: state.walls,
    })),
  );
  const wallPoints = useMemo(
    () => wall.wallPoints.flatMap(p => [p.x, p.y]),
    [wall.wallPoints],
  );
  return {wallPoints};
};

export default useWallComponent;
