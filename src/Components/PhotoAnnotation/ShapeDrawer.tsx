import React, {memo} from 'react';
import {Circle, Line, Polygon, Rect} from 'react-native-svg';
import {IAxisPos, TAnnotationTools} from '../../Models/MarkupTypes';
import {TRgbaFormat} from '../../Utilities/FunctionUtilities';

type Props = {
  shapeType: TAnnotationTools;
  startPos: IAxisPos;
  endPos?: IAxisPos;
  width?: number;
  height?: number;
  radius?: number;
  fillColor: TRgbaFormat;
  action: 'drawing' | 'display';
};

const ShapeDrawer: React.FC<Props> = memo(
  ({
    shapeType,
    startPos,
    endPos,
    fillColor,
    width,
    height,
    action,
    radius,
  }: Props) => {
    if (shapeType === 'Arrow' && endPos) {
      const arrowPoints = drawArrowHead({
        x0: startPos.x,
        y0: startPos.y,
        x1: endPos.x,
        y1: endPos.y,
        h: 18,
        w: 22,
      });

      return (
        <>
          <Line
            x1={startPos.x}
            y1={startPos.y}
            x2={endPos.x}
            y2={endPos.y}
            stroke={fillColor}
            strokeWidth="4"
            markerEnd="url(#arrow)"
            strokeDasharray={action === 'drawing' ? '14' : undefined}
          />
          <Polygon points={arrowPoints} fill={fillColor} strokeWidth="4" />
        </>
      );
    }

    if (shapeType === 'StraightLine' && endPos) {
      return (
        <Line
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          stroke={fillColor}
          strokeWidth="4"
          strokeDasharray={action === 'drawing' ? '14' : undefined}
        />
      );
    }

    if (shapeType === 'Rectangle' && width && height)
      return (
        <Rect
          x={`${startPos.x}`}
          y={`${startPos.y}`}
          width={`${
            action === 'drawing' && endPos ? endPos.x - startPos.x : width
          }`}
          height={`${
            action === 'drawing' && endPos ? endPos.y - startPos.y : height
          }`}
          stroke={fillColor}
          strokeWidth="4"
          fill={'transparent'}
          strokeDasharray={action === 'drawing' ? '14' : undefined}
        />
      );
    if (shapeType === 'Circle' && radius) {
      return (
        <Circle
          cx={`${startPos.x}`}
          cy={`${startPos.y}`}
          r={`${radius}`}
          stroke={fillColor}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={action === 'drawing' ? '14' : undefined}
        />
      );
    }
    return <></>;
  },
);

export default ShapeDrawer;

const drawArrowHead = (props: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  h: number;
  w: number;
}) => {
  let {x0, y0, x1, y1, h, w} = props;

  let L = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));

  if (L <= 0) return;

  //first base point coordinates
  let base_x0 = x1 + ((w / 2) * (y1 - y0)) / L;
  let base_y0 = y1 + ((w / 2) * (x0 - x1)) / L;

  //second base point coordinates
  let base_x1 = x1 - ((w / 2) * (y1 - y0)) / L;
  let base_y1 = y1 - ((w / 2) * (x0 - x1)) / L;

  let dx = 0;
  let dy = 0;
  let head_x = 0;
  let head_y = 0;

  if (x1 === x0) {
    dx = 0;
    dy = h;
    if (y1 < y0) {
      dy = -h;
    } else {
      dy = h;
    }
  } else {
    if (x1 < x0) {
      h = -h;
    }
    let slope = (y1 - y0) / (x1 - x0);
    dx = h / Math.sqrt(1 + Math.abs(slope ^ 2));
    dy = dx * slope;
  }

  //head_points
  head_x = x1 + dx;
  head_y = y1 + dy;

  return `${base_x0},${base_y0} ${base_x1},${base_y1} ${head_x},${head_y}`;
};
