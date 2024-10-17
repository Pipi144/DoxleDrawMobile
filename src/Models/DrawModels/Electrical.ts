import {DecimalString} from '../axiosReturn.ts';
import {KonvaDecimalString, KonvaNumerical} from './KonvaComponentStandards.ts';
export const ELECTRICAL_TOOLS = [
  'SingleGPO',
  'DoubleGPO',
  'WPDoubleGPO',
  'Downlight',
  'WallLight',
  'FloodLight',
  'SensorFloodLight',
  'PendantLight',
  'EntrySensor',
  'DataPoint',
  'TVPoint',
  'DoubleDataPoint',
  'DoubleTVPoint',
] as const;
export const electricalTools: Array<undefined | string> = [...ELECTRICAL_TOOLS];
export type ElectricalTool = (typeof ELECTRICAL_TOOLS)[number];
export const DEFAULT_ELECTRICAL_HEIGHT: Record<ElectricalTool, number> = {
  SingleGPO: 350,
  DoubleGPO: 350,
  WPDoubleGPO: 1150,
  Downlight: 2700,
  WallLight: 2400,
  FloodLight: 2550,
  SensorFloodLight: 2550,
  PendantLight: 2700,
  EntrySensor: 2700,
  DataPoint: 350,
  TVPoint: 350,
  DoubleDataPoint: 350,
  DoubleTVPoint: 350,
} as const;
interface BaseElectricalItem {
  electricalId: string;
  type: ElectricalTool;
  xFlipped: boolean;
  yFlipped: boolean;
  wallId: string | null;
  storeyId: string;
  projectId: string;
  isDeleted: boolean;
  version: number;
  //! handle frontend throttling update behavior
  overwrite?: boolean;
}

export interface ElectricalItem extends BaseElectricalItem, KonvaNumerical {}

export interface ServerElectricalItem
  extends BaseElectricalItem,
    KonvaDecimalString {}

export interface NewElectricalItem {
  electricalId?: string;
  type: ElectricalTool;
  xWidth: DecimalString | number;
  yDepth: DecimalString | number;
  zHeight: DecimalString | number;
  xPosition: DecimalString | number;
  yPosition: DecimalString | number;
  rotation: DecimalString | number;
  xFlipped?: boolean;
  yFlipped?: boolean;
  wallId?: string | null;
  storeyId: string;
  projectId?: string;
}

export interface PatchElectricalItem {
  electricalId: string;
  type?: ElectricalTool;
  xWidth?: DecimalString | number;
  yDepth?: DecimalString | number;
  zHeight?: DecimalString | number;
  xPosition?: DecimalString | number;
  yPosition?: DecimalString | number;
  rotation?: DecimalString | number;
  xFlipped?: boolean;
  yFlipped?: boolean;
  wallId?: string | null;
  storeyId?: string;
  projectId?: string;
  version: number;
}

export const parseServerElectricalItem = (
  elItem: ServerElectricalItem,
): ElectricalItem => ({
  ...elItem,
  xWidth: Number(elItem.xWidth),
  yDepth: Number(elItem.yDepth),
  zHeight: Number(elItem.zHeight),
  xPosition: Number(elItem.xPosition),
  yPosition: Number(elItem.yPosition),
  rotation: Number(elItem.rotation),
  version: Number(elItem.version ?? 0),
});

export const parseServerElectricalItems = (
  elItems: ServerElectricalItem[],
): ElectricalItem[] => elItems.map(elItem => parseServerElectricalItem(elItem));

// export const newElectricalTemplate = (
//   currentTool: ElectricalTool
// ): ElectricalItem => ({
//   electricalId: uuid(),
//   xWidth: 100,
//   yDepth: 100,
//   zHeight: DEFAULT_ELECTRICAL_HEIGHT[currentTool],
//   type: currentTool,
//   xPosition: 0,
//   yPosition: 0,
//   rotation: 0,
//   xFlipped: false,
//   yFlipped: false,
//   wallId: null,
//   storeyId: localStorage.getItem('storeyId') ?? '',
//   projectId: localStorage.getItem('projectId') ?? '',
//   isDeleted: false,
//   version: 0,
// });
