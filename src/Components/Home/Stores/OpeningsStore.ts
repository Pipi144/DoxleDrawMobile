import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {OpeningItem} from '../../../Models/DrawModels/Openings';

interface OpeningsStore {
  openingItems: OpeningItem[];

  setOpeningItems: (openingItems: OpeningItem[]) => void;

  resetStore: () => void;
}

export const useOpeningsStore = create(
  immer<OpeningsStore>((set, get) => ({
    openingItems: [],

    setOpeningItems: (openingItems: OpeningItem[]) =>
      set(state => {
        state.openingItems = openingItems;
      }),

    resetStore: () => {
      set(state => {
        state.openingItems = [];
      });
    },
  })),
);
