import {roundingNum} from '../../Utilities/FunctionUtilities';
import {DecimalString} from '../axiosReturn';
import {KonvaDecimalString, KonvaNumerical} from './KonvaComponentStandards';

export const PLUMBING_TOOLS = [
  'Toilet',
  'Shower',
  // 'Basin',
  'Vanity',
  'Sink',
  'CookTop',
  'Bathtub',
] as const;
export const plumbingTypes: string[] = [...PLUMBING_TOOLS];
export type PlumbingTool = (typeof PLUMBING_TOOLS)[number];

export const DEFAULT_PLUMBING_SIZES: Record<
  PlumbingTool,
  {
    xWidth: number;
    yDepth: number;
  }
> = {
  Toilet: {xWidth: 480, yDepth: 680},
  Shower: {xWidth: 900, yDepth: 900},
  // Basin: { xWidth: 400, yDepth: 400 },
  Vanity: {xWidth: 900, yDepth: 500},
  Sink: {xWidth: 750, yDepth: 480},
  CookTop: {xWidth: 750, yDepth: 480},
  Bathtub: {xWidth: 1500, yDepth: 800},
} as const;

interface BasePlumbingItem {
  plumbingId: string;
  type: PlumbingTool;
  xFlipped: boolean;
  yFlipped: boolean;
  storeyId: string;
  projectId: string;
  wallId: string | null;
  isDeleted: boolean;
  isDouble: boolean;
  version: number;
  // handle frontend throttling update
  overwrite?: boolean;
}

export interface PlumbingItem extends BasePlumbingItem, KonvaNumerical {}

export interface ServerPlumbingItem
  extends BasePlumbingItem,
    KonvaDecimalString {}

export interface NewPlumbingItem {
  plumbingId?: string;
  type: PlumbingTool;
  xFlipped?: boolean;
  yFlipped?: boolean;
  storeyId: string;
  projectId?: string;
  xWidth: DecimalString | number;
  yDepth: DecimalString | number;
  rotation: DecimalString | number;
  zHeight: DecimalString | number;
  xPosition: DecimalString | number;
  yPosition: DecimalString | number;
  isDouble?: boolean;
}
export interface PatchPlumbingItem {
  plumbingId: string;
  type?: PlumbingTool;
  xFlipped?: boolean;
  yFlipped?: boolean;
  storeyId?: string;
  projectId?: string;
  xWidth?: DecimalString | number;
  yDepth?: DecimalString | number;
  rotation?: DecimalString | number;
  zHeight?: DecimalString | number;
  xPosition?: DecimalString | number;
  yPosition?: DecimalString | number;
  wallId?: string | null;
  isDouble?: boolean;
  version: number;
}

export const parseServerPlumbingItem = (
  plItem: ServerPlumbingItem,
): PlumbingItem => ({
  ...plItem,
  xWidth: Number(plItem.xWidth),
  yDepth: Number(plItem.yDepth),
  rotation: Number(plItem.rotation),
  zHeight: Number(plItem.zHeight),
  xPosition: Number(plItem.xPosition),
  yPosition: Number(plItem.yPosition),
  version: plItem.version ?? 0,
});

export const parseServerPlumbingItems = (
  plItems: ServerPlumbingItem[],
): PlumbingItem[] => plItems.map(plItem => parseServerPlumbingItem(plItem));

// export const newItemTemplate = (tool: PlumbingTool): PlumbingItem => ({
//   plumbingId: uuid(),
//   ...DEFAULT_PLUMBING_SIZES[tool],
//   zHeight: 0,
//   type: tool,
//   xPosition: 0,
//   yPosition: 0,
//   rotation: 0,
//   xFlipped: false,
//   yFlipped: false,
//   storeyId: localStorage.getItem('storeyId') ?? '',
//   projectId: localStorage.getItem('projectId') ?? '',
//   wallId: null,
//   isDeleted: false,
//   version: 0,
//   isDouble: false,
// });

export const formatRoundingPlumbing = (
  plumbing: PlumbingItem,
): PlumbingItem => {
  return {
    ...plumbing,
    xWidth: roundingNum(plumbing.xWidth),
    yDepth: roundingNum(plumbing.yDepth),
    xPosition: roundingNum(plumbing.xPosition),
    yPosition: roundingNum(plumbing.yPosition),
    rotation: roundingNum(plumbing.rotation),
  };
};
