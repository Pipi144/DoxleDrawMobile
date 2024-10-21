import {TRgbaFormat} from '../Utilities/FunctionUtilities';

export type TAnnotationTools =
  | 'Arrow'
  | 'Rectangle'
  | 'Text'
  | 'Circle'
  | 'StraightLine'
  | 'Pointer'
  | 'Pencil';

export type TAnnotationColors =
  | 'rgba(33, 107, 255, 1)'
  | 'rgba(255, 124, 4, 1)'
  | 'rgba(255, 34, 34, 1)'
  | 'rgba(39, 191, 54, 1)'
  | 'rgba(90, 54, 190, 1)'
  | 'rgba(255, 186, 53, 1)';

export interface ICircle<T extends TAnnotationTools = 'Circle'> {
  x: number;
  y: number;

  r: number;
  color: TRgbaFormat;
  type: T;
}
export interface IPath<T extends TAnnotationTools = 'Pencil'> {
  pathPoints: string[];
  color: TRgbaFormat;
  type: T;
}
export interface IStraightLine<T extends TAnnotationTools = 'StraightLine'> {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: TRgbaFormat;
  type: T;
}

export interface ILabel<T extends TAnnotationTools = 'Text'> {
  x: number;
  y: number;
  text: string;

  color: TRgbaFormat;
  type: T;
  width: number;
  height: number;
}
export interface IAxisPos {
  x: number;
  y: number;
}
export interface IRectangle<T extends TAnnotationTools = 'Rectangle'> {
  x: number;
  y: number;
  w: number;
  h: number;
  color: TRgbaFormat;
  type: T;
}
export interface IArrow<T extends TAnnotationTools = 'Arrow'> {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: TRgbaFormat;
  type: T;
}
export interface IPhotoAnnotationBgImageProp {
  width: number;
  height: number;
  imageUri: string;
  imageId: string;
}
