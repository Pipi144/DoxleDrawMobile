import {create} from 'zustand';
import {IStorey} from '../../../Models/DrawModels/storey';
import {immer} from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const ALL_KONVA_LAYERS = [
  'Background',
  'Drainage',
  'Flooring',
  'Walls',
  'Openings',
  'Door',
  'Window',
  'PlumbingFixtures',
  'Electrical',
  'Dimensions',
  'MarkUps',
] as const;
export type TKonvaLayers = (typeof ALL_KONVA_LAYERS)[number];
const LAYERS_STORAGE_KEY = 'displayedLayers';
export type DisplayedLayers = Array<TKonvaLayers>;
export const generateObjName = (
  objId: string | number,
  layer: TKonvaLayers,
) => {
  if (layer === 'Walls') return `wall#${objId}`;
  else if (layer === 'Openings') return `opening#${objId}`;
  else if (layer === 'PlumbingFixtures') return `plumbing#${objId}`;
  else if (layer === 'Electrical') return `electrical#${objId}`;
  else if (layer === 'Dimensions') return `dimension#${objId}`;
  else if (layer === 'MarkUps') return `markup#${objId}`;
  else if (layer === 'Flooring') return `floor#${objId}`;
  else return `other#${objId}`;
};
export interface IStageSize {
  minX: number;
  minY: number;
  width: number;
  height: number;
}
export interface Sheet {
  sheetId?: string;
  index: number; // integer for ordering of sheets within drawing set
  title: string; // EG "S001" || "SITE PLAN" || "WD004 - GROUND FLOOR PLAN"
  height: number; // Integer (pixels)
  width: number; // Integer (pixels)
  scale: string; // floating point number - ratio pixels/mm
  url: string;
  imageUrl: string;
  thumbUrl: string;
  pdfUrl: string;
  drawingSet: string;
  project?: string; // Project Id that the project belongs to - required in the backend but may not be sent with get requests
}

export interface IAngleSnapMode {
  angleStep: number;
  angleSnapOn: boolean;
}
export interface IEditKonvaComponentAnchor {
  top: number;
  left: number;
}
interface KonvaStore {
  stageState: IStageSize;
  setStageState: (stageState: IStageSize) => void;
  currentLayer: TKonvaLayers | null;
  setCurrentLayer: (currentLayer: TKonvaLayers | null) => void;
  toggleCurrentLayer: (layer: TKonvaLayers) => void;
  displayedLayers: DisplayedLayers;
  getInitialStorageLayers: () => Promise<void>;
  addLayer: (layer: TKonvaLayers) => void;
  hideLayer: (layer: TKonvaLayers) => void;
  toggleShownLayer: (layer: TKonvaLayers) => void;
  setDisplayedLayers: (displayedLayers: DisplayedLayers) => void;
  toggleShowAllLayers: () => void;
  currentStorey: IStorey | undefined;
  setCurrentStorey: (storey: IStorey) => void;
}

export const useKonvaStore = create(
  immer<KonvaStore>((set, get) => ({
    currentLayer: 'Walls',
    setCurrentLayer: (currentLayer: TKonvaLayers | null) =>
      set(state => {
        state.currentLayer = currentLayer;
      }),
    toggleCurrentLayer: (layer: TKonvaLayers) =>
      set(state => {
        if (state.currentLayer === layer) state.currentLayer = null;
        else {
          if (!state.displayedLayers.includes(layer))
            state.displayedLayers.push(layer);
          state.currentLayer = layer;
        }
      }),
    displayedLayers: ['Background', 'Walls'],
    getInitialStorageLayers: async () => {
      try {
        const layers = await AsyncStorage.getItem(LAYERS_STORAGE_KEY);
        if (layers)
          set(state => {
            state.displayedLayers = JSON.parse(layers);
          });
      } catch (error) {
        console.log('Error getting layers from storage', error);
      }
    },
    addLayer: (layer: TKonvaLayers) =>
      set(state => {
        if (!state.displayedLayers.includes(layer))
          state.displayedLayers.push(layer);
        AsyncStorage.setItem(
          'displayedLayers',
          JSON.stringify(get().displayedLayers),
        );
      }),
    hideLayer: (layer: TKonvaLayers) => {
      set(state => {
        if (state.currentLayer === layer) state.currentLayer = null;
        state.displayedLayers.filter(existingLayer => layer !== existingLayer);
        AsyncStorage.setItem(
          'displayedLayers',
          JSON.stringify(get().displayedLayers),
        );
      });
    },
    toggleShownLayer: (layer: TKonvaLayers) =>
      set(state => {
        if (state.displayedLayers.includes(layer))
          state.displayedLayers = state.displayedLayers.filter(
            existingLayer => layer !== existingLayer,
          );
        else state.displayedLayers.push(layer);
        AsyncStorage.setItem(
          'displayedLayers',
          JSON.stringify(get().displayedLayers),
        );
      }),
    setDisplayedLayers: (displayedLayers: DisplayedLayers) =>
      set(state => {
        state.displayedLayers = displayedLayers;
      }),
    toggleShowAllLayers: () =>
      set(state => {
        if (state.displayedLayers.length > 0) state.displayedLayers = [];
        else state.displayedLayers.push(...ALL_KONVA_LAYERS);
        AsyncStorage.setItem(
          'displayedLayers',
          JSON.stringify(get().displayedLayers),
        );
      }),
    stageState: {
      minX: -1000,
      minY: -1000,
      width: 1000,
      height: 1000,
    },
    setStageState: (stageState: IStageSize) =>
      set(state => {
        state.stageState = stageState;
      }),

    currentStorey: undefined,
    setCurrentStorey: (storey: IStorey) =>
      set(state => {
        state.currentStorey = storey;
      }),
  })),
);
