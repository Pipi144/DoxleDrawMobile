import AsyncStorage from '@react-native-async-storage/async-storage';

import {immer} from 'zustand/middleware/immer';
import {IDOXLEThemeProviderContext} from '../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {create} from 'zustand';

export const lastPrevSessionRetrieveKey = 'lastDoxlePrevSession';

export interface IDoxlePrevSession {
  lastCompanyId?: string;
  lastProjectId?: string;
  lastThemeContext?: Partial<
    Omit<
      IDOXLEThemeProviderContext,
      | 'setDOXLETheme'
      | 'THEME_COLOR'
      | 'DOXLE_FONT'
      | 'setCurrentFontMode'
      | 'setTileBgMode'
    >
  >;
}
interface IPrevSessionStore {
  prevSession: IDoxlePrevSession | undefined;
  setPrevSession: (session: Partial<IDoxlePrevSession>) => void;
  initializePrevSession: () => Promise<void>;
}

export const usePrevSessionStore = create(
  immer<IPrevSessionStore>((set, get) => ({
    prevSession: undefined,
    setPrevSession: (session: Partial<IDoxlePrevSession>) => {
      set(state => {
        if (state.prevSession) {
          if (session.lastThemeContext) {
            state.prevSession.lastThemeContext = {
              ...state.prevSession.lastThemeContext,
              ...session.lastThemeContext,
            };
          } else Object.assign(state.prevSession, session);
        } else state.prevSession = session;
      });

      AsyncStorage.setItem(
        lastPrevSessionRetrieveKey,
        JSON.stringify(get().prevSession),
      );
    },
    initializePrevSession: async () => {
      const prevSessionString = await AsyncStorage.getItem(
        lastPrevSessionRetrieveKey,
      );

      set(state => {
        if (prevSessionString)
          state.prevSession = JSON.parse(prevSessionString);
      });
    },
  })),
);
