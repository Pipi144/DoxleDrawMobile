import {DecimalString} from '../axiosReturn.ts';
import {XY} from './XY.ts';

export const FLOORING_TYPES = [
  'Footing',
  'Slab',
  'Bearers&Joists',
  'Trusses',
] as const;
export const flooringTypes: string[] = [...FLOORING_TYPES];
export type FlooringType = (typeof FLOORING_TYPES)[number];
export const COVERING_TYPES = [
  'Timber',
  'Tile',
  'Carpet',
  'PolishedConcrete',
] as const;
export const coveringTypes: string[] = [...COVERING_TYPES];
export type CoveringType = (typeof COVERING_TYPES)[number];

export interface BaseFlooringItem {
  floorId: string;
  xFlipped: boolean;
  yFlipped: boolean;
  xWidth: number;
  yDepth: number;
  zHeight: number;
  xPosition: number;
  yPosition: number;
  rotation: number;
  points: number[];
  area: number;
  substrateId: null | string;
  storeyId: string;
  projectId?: string | null;
  isDeleted: boolean;
  version: number;
  // handle throttle update
  overwrite?: boolean;
}

interface FlooringSubstrateItem extends BaseFlooringItem {
  type: FlooringType;
  substrateId: null;
}
interface FlooringCoveringItem extends BaseFlooringItem {
  type: CoveringType;
  substrateId: string;
}

export type FlooringItem = FlooringSubstrateItem | FlooringCoveringItem;

interface BaseServerFlooringItem
  extends Omit<
    BaseFlooringItem,
    | 'xWidth'
    | 'yDepth'
    | 'zHeight'
    | 'xPosition'
    | 'yPosition'
    | 'rotation'
    | 'points'
    | 'area'
  > {
  xWidth: DecimalString;
  yDepth: DecimalString;
  zHeight: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
  rotation: DecimalString;
  points: [DecimalString, DecimalString][];
  area: DecimalString;
}
interface ServerFlooringSubstrateItem extends BaseServerFlooringItem {
  type: FlooringType;
  substrateId: null;
}
interface ServerFlooringCoveringItem extends BaseServerFlooringItem {
  type: CoveringType;
  substrateId: string;
}

export type ServerFlooringItem =
  | ServerFlooringSubstrateItem
  | ServerFlooringCoveringItem;

export interface NewFloor {
  floorId?: string;
  type: FlooringType | CoveringType;
  xFlipped?: boolean;
  yFlipped?: boolean;
  xWidth: DecimalString;
  yDepth: DecimalString;
  zHeight: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
  rotation?: DecimalString;
  points: DecimalString[];
  area?: DecimalString;
  substrateId: string | null;
}
export interface PatchFloor {
  floorId: string;
  type?: FlooringType | CoveringType;
  xFlipped?: boolean;
  yFlipped?: boolean;
  xWidth?: DecimalString | number;
  yDepth?: DecimalString | number;
  zHeight?: DecimalString | number;
  xPosition?: DecimalString | number;
  yPosition?: DecimalString | number;
  rotation?: DecimalString | number;
  points?: DecimalString[];
  area?: DecimalString;
  substrateId?: string | null;
  version: number;
}

export const parseServerPoints = (
  points: [DecimalString, DecimalString][],
): number[] => points.flatMap(point => [Number(point[0]), Number(point[1])]);

export const parseServerFlooringItem = (
  FlItem: ServerFlooringItem,
): FlooringItem => ({
  ...FlItem,
  xWidth: Number(FlItem.xWidth),
  yDepth: Number(FlItem.yDepth),
  zHeight: Number(FlItem.zHeight),
  xPosition: Number(FlItem.xPosition),
  yPosition: Number(FlItem.yPosition),
  rotation: Number(FlItem.rotation),
  points: parseServerPoints(FlItem.points),
  area: Number(FlItem.area),
  version: FlItem.version ?? 0,
});

export const parseServerFlooringItems = (
  FlItems: ServerFlooringItem[],
): FlooringItem[] => FlItems.map(FlItem => parseServerFlooringItem(FlItem));

// export const newFlooringItemTemplate = <
//   T extends FlooringType | CoveringType,
// >(props: {
//   zHeight?: number;
//   type: T;
//   position: XY;
//   substrateId: T extends FlooringType ? null : string;
//   storeyId: string;
//   projectId?: string;
// }): FlooringItem => {
//   if (FLOORING_TYPES.includes(props.type as FlooringType)) {
//     return {
//       floorId: uuid(),
//       xWidth: 0,
//       yDepth: 0,
//       zHeight: props.zHeight ?? 100,
//       type: props.type,
//       xPosition: props.position.x,
//       yPosition: props.position.y,
//       points: [0, 0, 0, 0],
//       rotation: 0,
//       xFlipped: false,
//       yFlipped: false,
//       area: 0,
//       substrateId: null, // FlooringType should have a null substrateId
//       storeyId: props.storeyId,
//       projectId: props.projectId ?? null,
//       isDeleted: false,
//       version: 0,
//     } as FlooringSubstrateItem;
//   } else if (COVERING_TYPES.includes(props.type as CoveringType)) {
//     return {
//       floorId: uuid(),
//       xWidth: 0,
//       yDepth: 0,
//       zHeight: props.zHeight ?? 100,
//       type: props.type,
//       xPosition: props.position.x,
//       yPosition: props.position.y,
//       points: [0, 0, 0, 0],
//       rotation: 0,
//       xFlipped: false,
//       yFlipped: false,
//       area: 0,
//       substrateId: props.substrateId, // CoveringType should have a string substrateId
//       storeyId: props.storeyId,
//       projectId: props.projectId ?? null,
//       isDeleted: false,
//       version: 0,
//     } as FlooringCoveringItem;
//   } else {
//     throw new Error('Invalid flooring type');
//   }
// };
