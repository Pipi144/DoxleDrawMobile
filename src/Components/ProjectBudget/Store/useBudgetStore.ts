import {produce} from 'immer';

import {create} from 'zustand';
import {IFullDocketDetailQueryFilterProp} from '../../../Models/docket';

interface IBudgetStore {
  filterBudgetList: IFullDocketDetailQueryFilterProp;
  setFilterBudgetList: (
    filter: Partial<IFullDocketDetailQueryFilterProp>,
  ) => void;
}

export const useBudgetStore = create<IBudgetStore>((set, get) => ({
  filterBudgetList: {},
  setFilterBudgetList: (filter: Partial<IFullDocketDetailQueryFilterProp>) =>
    set(state =>
      produce(state, draftState => {
        draftState.filterBudgetList = {...get().filterBudgetList, ...filter};

        return draftState;
      }),
    ),
}));
