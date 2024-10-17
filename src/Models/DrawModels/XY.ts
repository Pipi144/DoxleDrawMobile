import {DecimalString} from '../axiosReturn';

export interface XY {
  x: number;
  y: number;
}
export interface IServerXY {
  x: DecimalString;
  y: DecimalString;
}
export type TRelativePos = 'overlap' | 'close' | 'out';
export interface ILineEquation {
  a: number | null; //slope
  b: number; // intercept
  range: [number, number];
}

export type TRectanglePoints = [XY, XY, XY, XY]; //points order: bottom left, bottom right, top right, top left

export interface IRectangleCoordinate {
  rectPoints: TRectanglePoints; // bottom-left, bottom-right, top-right, top-left, bottom-left is the anchor point with x=0,y=0, the rest are relative to the anchor point
  posRelToParent: XY; // coordinate of the anchor point relative to its parent
}

export interface IObjectTransformStatic {
  width: number;
  height: number;
  rotate: number;
  x: number;
  y: number;
  yFlipped: boolean;
  xFlipped: boolean;
}
