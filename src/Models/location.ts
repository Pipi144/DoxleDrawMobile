export interface IProjectFloor {
  floorId: string;
  name: string;
  level: number;
  project: string;
  company: string;
}

export interface IProjectRoom {
  roomId: string;
  name: string;
  floorName: string;
  floor: string;
  project: string;
  company: string;
}

export interface IFilterGetRoomListQuery {
  project?: string; // ProjectId
  search?: string; // Search string
  floor?: string; // FloorId
  floor__level?: number; // Floor Level
}
export interface IFilterGetFloorListQuery {
  project?: string; // ProjectId
  search?: string; // Search string
}
