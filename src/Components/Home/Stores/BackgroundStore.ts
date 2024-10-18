import {create} from 'zustand';
import {IBackground} from '../../../Models/DrawModels/Backgrounds';
import {XY} from '../../../Models/DrawModels/XY';

interface BackgroundStore {
  backgrounds: IBackground[];
  setBackgrounds: (bgs: IBackground[]) => void;
  updateBackground: (bg: IBackground) => void;
  addBackground: (bg: IBackground) => void;
  deleteBackground: (bg: IBackground) => void;
  backgroundUrl: string | undefined;
  selectedBg: IBackground | undefined;
  setBackgroundUrl: (bg: string | undefined) => void;
  setCurrentBackground: (imageId: string) => void;
  editMode: boolean;
  setEditMode: (bool: boolean) => void;
  scaleMode: false | 'draw' | 'value';
  setScaleMode: (mode: false | 'draw' | 'value') => void;
  scaleValue: string;
  setScaleValue: (sv: string) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  offset: XY;
  setOffset: (offset: XY) => void;
  scaleLine: number[];
  setScaleLine: (sl: number[]) => void;
  scale: number;
  setScale: (s: number) => void;
  invertedMode: boolean;
  setInvertedMode: (bool: boolean) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
  backgrounds: [],
  setBackgrounds: (backgrounds: IBackground[]) => set({backgrounds}),
  updateBackground: (bg: IBackground) => {
    const selected = get().selectedBg?.imageId === bg.imageId;
    if (selected)
      set({
        selectedBg: bg,
        backgrounds: get().backgrounds.map(item =>
          item.imageId !== bg.imageId ? item : bg,
        ),
      });
    else
      set({
        backgrounds: get().backgrounds.map(item =>
          item.imageId !== bg.imageId ? item : bg,
        ),
      });
  },
  addBackground: (bg: IBackground) =>
    set({
      backgrounds: [...get().backgrounds, bg],
    }),
  deleteBackground: (bg: IBackground) =>
    set({
      backgrounds: get().backgrounds.filter(
        item => item.imageId !== bg.imageId,
      ),
    }),
  selectedBg: undefined,
  setCurrentBackground: (imageId: string | undefined) => {
    if (imageId === undefined) {
      set({selectedBg: undefined});
      return;
    }
    const selectedBg = get().backgrounds.find(bg => bg.imageId === imageId);
    set({selectedBg});
  },
  backgroundUrl: undefined,
  setBackgroundUrl: (backgroundUrl: string | undefined) => set({backgroundUrl}),
  editMode: false,
  setEditMode: (editMode: boolean) => set({editMode, scaleMode: false}),
  scaleMode: false,
  setScaleMode: (scaleMode: false | 'draw' | 'value') =>
    set({scaleMode, editMode: false}),
  scaleValue: '1',
  setScaleValue: (scaleValue: string) => set({scaleValue}),
  opacity: 1,
  setOpacity: (opacity: number) => set({opacity}),
  offset: {x: 0, y: 0},
  setOffset: (offset: XY) => set({offset}),
  scaleLine: [],
  setScaleLine: (scaleLine: number[]) => set({scaleLine}),
  scale: 1,
  setScale: (scale: number) => set({scale}),
  invertedMode: false,
  setInvertedMode: (invertedMode: boolean) => set({invertedMode}),
}));
