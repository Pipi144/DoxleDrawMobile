import {DecimalString} from '../axiosReturn';

export interface KonvaNumerical {
  xWidth: number;
  yDepth: number;
  rotation: number;
  zHeight: number;
  xPosition: number;
  yPosition: number;
}

export interface KonvaDecimalString {
  xWidth: DecimalString;
  yDepth: DecimalString;
  rotation: DecimalString;
  zHeight: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
}
