import {roundingNum} from '../../Utilities/FunctionUtilities';
import {DecimalString} from '../axiosReturn';
import {IServerXY, TRectanglePoints, XY} from './XY';

export type LengthUnit = 'mm' | 'm' | 'lm' | "'" | 'ft' | '"' | 'in';
export type AreaUnit = 'm2' | 'sqft' | 'Sq';
export type TWallLockAxes = 'XY' | 'X' | 'Y' | '45';
interface WallMaterialLayer {
  material: string;
  thickness: number;
  color2d: string;
  color3d?: string;
  pattern: null | '/' | '//' | '\\' | '\\\\' | '|' | '||' | '.';
  patternColor: null | string;
}
export interface WallType {
  name: string;
  wallTypeId: string;
  thickness: number;
  layers: WallMaterialLayer[];
  internalMultiplier: 0 | 1 | 2;
  externalMultiplier: 0 | 1 | 2;
}

interface BaseWall {
  wallId: string;
  wallTypeId: string;
  // wallType: WallType;
  lengthUnit: 'mm'; //|'m'|'lm'|"'"|'ft'|'"'|'in'
  areaUnit: 'm2'; //'sqft'
  xFlipped: boolean;
  yFlipped: boolean;
  startWallConnectionId: string | null;
  endWallConnectionId: string | null;
  startWallConnectionType: 'Corner' | 'T' | null;
  endWallConnectionType: 'Corner' | 'T' | null;
  framingType: 'Timber' | 'Steel' | null;
  index: number;
  storeyId: string;
  projectId: string;
  initialClick?: XY;
  isDeleted: boolean;
  version: number; // for syncing
  //!===>HANDLING FRONTEND PROPS ONLY
  //! overwritten by server
  overwrite?: boolean;

  //! handle drawing of the wall
  isDrawing?: boolean;
}

export type TChildWallConnection = {
  connectionId: string;
  parentId: string;
  childId: string;
  connectedPoint: [XY, XY]; // the part where the child wall is connected to the parent wall

  childConnectionEdge: 0 | 1; // the head position of child
  parentEdge: 0 | 1; // 0 inner, 1 outer edge of parent
};
export interface IWall extends BaseWall {
  thickness: number;
  length: number;
  height: number;
  xPosition: number;
  yPosition: number;
  zPosition: number;
  endY: number;
  endX: number;
  rotation: number;
  internalLength: number;
  externalLength: number;
  internalArea: number;
  externalArea: number;
  wallPoints: TRectanglePoints; // bottom-left, bottom-right, top-right, top-left
  tConnections: TChildWallConnection[];
}

export interface INewWall {
  wallId?: string;
  length: DecimalString | number;
  height: DecimalString | number;
  xPosition: DecimalString | number;
  yPosition: DecimalString | number;
  zPosition: DecimalString | number;
  endX?: DecimalString | number;
  endY?: DecimalString | number;
  rotation: DecimalString | number;
  xFlipped?: boolean;
  yFlipped?: boolean;
  isLoadBearing?: boolean;
  rValue?: DecimalString | number;
  startWallConnectionId: string | null;
  endWallConnectionId: string | null;
  startWallConnectionType: 'Corner' | 'T' | null;
  endWallConnectionType: 'Corner' | 'T' | null;
  wallTypeId: string;
  storeyId: string;
  wallPoints: TRectanglePoints;
  tConnections?: TChildWallConnection[];
  isDeleted?: boolean;
  version: number;
}

export interface PatchWall {
  wallId: string;
  length?: DecimalString | number;
  height?: DecimalString | number;
  xPosition?: DecimalString | number;
  yPosition?: DecimalString | number;
  zPosition?: DecimalString | number;
  endX?: DecimalString | number;
  endY?: DecimalString | number;
  rotation?: DecimalString | number;
  xFlipped?: boolean;
  yFlipped?: boolean;
  isLoadBearing?: boolean;
  rValue?: DecimalString | number;
  wallTypeId?: string;
  startWallConnectionId?: string | null;
  endWallConnectionId?: string | null;
  startWallConnectionType?: 'Corner' | 'T' | null;
  endWallConnectionType?: 'Corner' | 'T' | null;
  tConnections?: TChildWallConnection[];
  wallPoints?: TRectanglePoints;
}

export interface ServerWall extends BaseWall {
  thickness: DecimalString;
  length: DecimalString;
  height: DecimalString;
  xPosition: DecimalString;
  yPosition: DecimalString;
  zPosition: DecimalString;
  endY: DecimalString;
  endX: DecimalString;
  rotation: DecimalString;
  internalLength: DecimalString;
  externalLength: DecimalString;
  internalArea: DecimalString;
  externalArea: DecimalString;
  wallPoints: [IServerXY, IServerXY, IServerXY, IServerXY];
  tConnections: TChildWallConnection[];
}

export const parseServerWall = (wall: ServerWall): IWall => ({
  ...wall,
  thickness: Number(wall.thickness),
  length: Number(wall.length),
  height: Number(wall.height),
  xPosition: Number(wall.xPosition),
  yPosition: Number(wall.yPosition),
  zPosition: Number(wall.zPosition),
  endY: Number(wall.endY),
  endX: Number(wall.endX),
  rotation: Number(wall.rotation),
  internalLength: Number(wall.internalLength),
  externalLength: Number(wall.externalLength),
  internalArea: Number(wall.internalArea),
  externalArea: Number(wall.externalArea),
  wallPoints: wall.wallPoints.map(point => ({
    x: Number(point.x),
    y: Number(point.y),
  })) as TRectanglePoints,
  tConnections: wall.tConnections.map(cnt => ({
    ...cnt,
    connectedPoint: cnt.connectedPoint.map(p => ({
      x: Number(p.x),
      y: Number(p.y),
    })),
  })) as TChildWallConnection[],
  overwrite: true,
  version: wall.version ?? 0,
});

export const parseServerWalls = (walls: ServerWall[]): IWall[] => {
  const convertedWalls: IWall[] = [];
  walls.forEach(wall => {
    if (wall.wallPoints.length > 0) convertedWalls.push(parseServerWall(wall));
  });
  return convertedWalls;
};

export interface IWallGuideline {
  wallId: string;
  wallYFlipped: boolean;
  wallThickness: number;
  distanceToWall: number;
  objRefPoint: XY; //reference point of the object where the distance to the wall edge is measured
  startPerPoint: XY;
  endPerPoint: XY;
  distanceToStartWallPoint: number; //distance from the start perpendiculer point to the start wall point
  distanceToEndWallPoint: number; //distance from the end perpendiculer point to the end wall point
  wallStartPoint: XY;
  wallEndPoint: XY;
  wallEdgeNumber: 0 | 1; // 0 inner, 1 outer
  objectRotation: number;
  centerDistance: number; // the distance when the object is in the center of the wall
  isCurserOnWall: boolean;
}

// export const newWallTemplate = ({
//   mousePos,
//   wallType,
//   currentHeight = 0,
//   startConnection,
//   length = 0,
//   rotation = 0,
// }: {
//   mousePos: XY;
//   wallType: WallType;
//   currentHeight: number;
//   startConnection?: string; // always start connection from the start
//   length?: number;
//   rotation?: number;
// }): IWall => ({
//   wallId: uuid(),
//   wallTypeId: wallType.wallTypeId,
//   thickness: wallType.thickness,
//   length,
//   height: currentHeight,
//   xPosition: roundingNum(mousePos.x),
//   yPosition: roundingNum(mousePos.y),
//   lengthUnit: 'mm',
//   areaUnit: 'm2',
//   rotation,
//   startWallConnectionId: startConnection ?? null,
//   startWallConnectionType: startConnection ? 'Corner' : null,
//   endWallConnectionType: null,
//   endWallConnectionId: null,
//   storeyId: localStorage.getItem('storeyId') ?? '',
//   projectId: localStorage.getItem('projectId') ?? '',
//   wallPoints: getObjRoundingRectPoints(
//     0,
//     0,
//     length,
//     wallType.thickness,
//     rotation
//   ),
//   tConnections: [],
//   xFlipped: false,
//   yFlipped: false,
//   internalArea: 0,
//   internalLength: 0,
//   externalArea: 0,
//   externalLength: 0,
//   index: 0,
//   zPosition: 0,
//   endX: 0,
//   endY: 0,
//   framingType: 'Steel',
//   isDeleted: false,
//   version: 0,
// });

// export const newTJoinTemplate = (
//   joinPoints: [XY, XY], // point should be relative to stage
//   parentWall: IWall,
//   childWall: IWall,
//   childConnectedPos: 'start' | 'end',
//   parentEdge: 0 | 1
// ): TChildWallConnection => ({
//   connectionId: uuid(),
//   parentId: parentWall.wallId,
//   childId: childWall.wallId,
//   childConnectionEdge: childConnectedPos === 'start' ? 0 : 1,
//   connectedPoint: joinPoints.map((p) => ({
//     x: roundingNum(p.x),
//     y: roundingNum(p.y),
//   })) as [XY, XY],
//   parentEdge,
// });

// export const formatRoundingWall = (wall: IWall) => {
//   const newWall = { ...wall };
//   newWall.xPosition = roundingNum(newWall.xPosition);
//   newWall.yPosition = roundingNum(newWall.yPosition);
//   newWall.wallPoints = newWall.wallPoints.map((point) => ({
//     x: roundingNum(point.x),
//     y: roundingNum(point.y),
//   })) as TRectanglePoints;
//   newWall.rotation = calculateTiltAngle(wall.wallPoints[1], wall.wallPoints[0]);
//   newWall.length = distanceBetweenTwoPoints(
//     wall.wallPoints[0].x,
//     wall.wallPoints[0].y,
//     wall.wallPoints[1].x,
//     wall.wallPoints[1].y
//   );

//   newWall.tConnections = newWall.tConnections.map((cnt) => ({
//     ...cnt,
//     connectedPoint: cnt.connectedPoint.map((p) => ({
//       x: roundingNum(p.x),
//       y: roundingNum(p.y),
//     })),
//   })) as TChildWallConnection[];
//   return newWall;
// };
