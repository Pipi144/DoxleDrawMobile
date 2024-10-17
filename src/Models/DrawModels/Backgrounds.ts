import {DecimalString} from '../axiosReturn.ts';
import {XY} from './XY.ts';

export interface IPrediction {
  predictionClass: string;
  points: XY[];
}

export interface IBackground {
  imageId: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  scaleX: number;
  scaleY: number;
  rotation: number;
  transparency: number;
  xPosition: number;
  yPosition: number;
  storeyId: string;
  projectId?: string;
  width: number;
  height: number;
  predictions?: IPrediction[];
}

export interface ServerBackground {
  imageId: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  scaleX: DecimalString;
  scaleY: DecimalString;
  rotation: DecimalString;
  transparency: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
  storeyId: string;
  projectId: string;
  width: number;
  height: number;
  predictions?: IPrediction[];
}

export interface NewBackground {
  imageId?: string;
  image: File;
  scaleX?: DecimalString;
  scaleY?: DecimalString;
  rotation?: DecimalString;
  transparency?: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
  storeyId: string;
  projectId?: string;
}
export interface PatchBackground {
  imageId: string;
  scale?: DecimalString | number;
  scaleX?: DecimalString | number;
  scaleY?: DecimalString | number;
  rotation?: DecimalString | number;
  transparency?: DecimalString | number;
  xPosition?: DecimalString | number;
  yPosition?: DecimalString | number;
}
export const parseServerBackground = (bg: ServerBackground): IBackground => {
  return {
    imageId: bg.imageId,
    imageUrl: bg.imageUrl,
    thumbnailUrl: bg.thumbnailUrl,
    scaleX: Number(bg.scaleX),
    scaleY: Number(bg.scaleY),
    rotation: Number(bg.rotation),
    transparency: Number(bg.transparency),
    xPosition: Number(bg.xPosition),
    yPosition: Number(bg.yPosition),
    storeyId: bg.storeyId,
    projectId: bg.projectId,
    width: bg.width,
    height: bg.height,
    predictions: bg.predictions ?? [],
  };
};
export const parseServerBackgrounds = (
  bgs: ServerBackground[],
): IBackground[] => {
  return bgs.map(bg => parseServerBackground(bg));
};
