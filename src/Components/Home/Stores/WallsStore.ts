import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  AreaUnit,
  IWall,
  LengthUnit,
  WallType,
} from '../../../Models/DrawModels/Walls';

interface WallsStore {
  walls: IWall[];

  wallTypes: WallType[];
  setWallTypes: (types: WallType[]) => void;
  setWalls: (walls: IWall[]) => void;
  resetStore: () => void;
}

export const useWallsStore = create(
  immer<WallsStore>((set, get) => ({
    walls: [],
    wallTypes: [],
    setWallTypes: (wallTypes: WallType[]) =>
      set(state => {
        state.wallTypes = wallTypes;
      }),
    setWalls: (walls: IWall[]) => {
      set(state => {
        state.walls = walls;
      });
    },
    resetStore: () =>
      set(state => {
        state.walls = [];
      }),
  })),
);
