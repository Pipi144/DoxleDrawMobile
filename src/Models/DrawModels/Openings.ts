import {DecimalString} from '../axiosReturn';
import {KonvaNumerical} from './KonvaComponentStandards';

export const WINDOW_TOOLS = [
  'Window',
  'Niche',
  'MultiLeafDoor',
  'SlidingDoor',
] as const;

export const DOOR_TOOLS = [
  'SwingingDoor',
  'CavitySlider',
  'RobeDoors',
  'BipartingDoor',
] as const;

export type WindowTool = (typeof WINDOW_TOOLS)[number];
export type DoorTool = (typeof DOOR_TOOLS)[number];
export const OPENING_TOOLS: Array<WindowTool | DoorTool> = [
  'Window',
  'SlidingDoor',
  'SwingingDoor',
  'CavitySlider',
  'Niche',
  'RobeDoors',
  'BipartingDoor',
  'MultiLeafDoor',
] as const;
export type OpeningTool = WindowTool | DoorTool;

interface BaseOpening {
  openingId: string;
  type: OpeningTool;
  xFlipped: boolean;
  yFlipped: boolean;
  wallId: string;
  storeyId: string;
  projectId: string;
  wallEdgeNumber?: 0 | 1;
  isDeleted: boolean;
  version: number;
  // handle throttling update
  overwrite?: boolean;
}
export interface OpeningItem extends BaseOpening, KonvaNumerical {
  sillHeight: number;
  headHeight: number;
  distanceOnWall: number;
  endY: number;
  endX: number;
  rotation: number;
  leafs: number;
}

export interface ServerOpening extends BaseOpening {
  xWidth: DecimalString;
  yDepth: DecimalString;
  zHeight: DecimalString;
  sillHeight: DecimalString;
  headHeight: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
  distanceOnWall: DecimalString;
  endY: DecimalString;
  endX: DecimalString;
  rotation: DecimalString;
  leafs: DecimalString;
}

export interface NewOpening {
  openingId?: string;
  type: OpeningTool;
  xFlipped?: boolean;
  yFlipped?: boolean;
  wallId: string;
  storeyId: string;
  projectId?: string;
  xWidth: DecimalString | number;
  yDepth: DecimalString | number;
  zHeight: DecimalString | number;
  sillHeight: DecimalString | number;
  headHeight: DecimalString | number;
  xPosition: DecimalString | number;
  yPosition: DecimalString | number;
  distanceOnWall: DecimalString | number;
  endY?: DecimalString | number;
  endX?: DecimalString | number;
  rotation?: DecimalString | number;
  leafs: DecimalString | number;
  wallEdgeNumber?: 0 | 1;
}
export interface PatchOpening {
  openingId: string;
  type?: OpeningTool;
  xFlipped?: boolean;
  yFlipped?: boolean;
  wallId?: string | null;
  storeyId?: string;
  projectId?: string;
  xWidth?: DecimalString | number;
  yDepth?: DecimalString | number;
  zHeight?: DecimalString | number;
  sillHeight?: DecimalString | number;
  headHeight?: DecimalString | number;
  xPosition?: DecimalString | number;
  yPosition?: DecimalString | number;
  distanceOnWall?: DecimalString | number;
  wallEdgeNumber?: 0 | 1;
  endY?: DecimalString | number;
  endX?: DecimalString | number;
  rotation?: DecimalString | number;
  leafs?: DecimalString | number;
  version: number;
}

export const parseServerOpening = (opening: ServerOpening): OpeningItem => ({
  ...opening,
  xWidth: Number(opening.xWidth),
  yDepth: Number(opening.yDepth),
  zHeight: Number(opening.zHeight),
  sillHeight: Number(opening.sillHeight),
  headHeight: Number(opening.headHeight),
  xPosition: Number(opening.xPosition),
  yPosition: Number(opening.yPosition),
  distanceOnWall: Number(opening.distanceOnWall),
  endY: Number(opening.endY),
  endX: Number(opening.endX),
  rotation: Number(opening.rotation),
  leafs: Number(opening.leafs),
  version: opening.version ?? 0,
});

export const parseServerOpenings = (openings: ServerOpening[]): OpeningItem[] =>
  openings.map(opening => parseServerOpening(opening));

// export const newOpeningComponent = (tool: OpeningTool): OpeningItem => ({
//   openingId: uuid(),
//   xWidth:
//     tool === 'Window'
//       ? 900
//       : tool === 'SlidingDoor'
//         ? 2400
//         : tool === 'SwingingDoor'
//           ? 820
//           : tool === 'CavitySlider'
//             ? 820
//             : tool === 'Niche'
//               ? 1200
//               : tool === 'RobeDoors'
//                 ? 1600
//                 : tool === 'BipartingDoor'
//                   ? 1640
//                   : 2400, // Multileaf
//   zHeight: tool === 'Niche' ? 350 : tool === 'Window' ? 1200 : 2400,
//   headHeight: tool === 'Niche' ? 1275 : 2400,
//   sillHeight: tool === 'Niche' ? 925 : tool === 'Window' ? 1200 : 0,
//   type: tool,
//   xPosition: 0,
//   yPosition: 0,
//   endY: 0,
//   endX: 0,
//   yDepth: 110,
//   rotation: 0,
//   xFlipped: false,
//   yFlipped: false,
//   distanceOnWall: 0,
//   wallId: '',
//   leafs:
//     tool === 'Window'
//       ? 1
//       : tool === 'SlidingDoor'
//         ? 2
//         : tool === 'SwingingDoor'
//           ? 1
//           : tool === 'CavitySlider'
//             ? 1
//             : tool === 'Niche'
//               ? 0
//               : tool === 'RobeDoors'
//                 ? 2
//                 : tool === 'BipartingDoor'
//                   ? 2
//                   : 4, // Multileaf,
//   storeyId: localStorage.getItem('storeyId') ?? '',
//   projectId: localStorage.getItem('projectId') ?? '',
//   isDeleted: false,
//   version: 0,
// });
