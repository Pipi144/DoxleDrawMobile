import {createContext, useContext, useRef} from 'react';

import {SharedValue, useSharedValue} from 'react-native-reanimated';

// ------------------------------------------------------------
export interface ISyncScrollViewProps {
  activeScrollView: SharedValue<number>;
  activeFlatlist: SharedValue<number>;
  activeSectionList: SharedValue<number>;
  offsetFlatlistPercent: SharedValue<number>;
  offsetPercent: SharedValue<number>;
  offsetSectionlistPercent: SharedValue<number>;
}

const SyncedScrollViewContext = createContext({});
const SyncScrollViewProvider = (children: any) => {
  const activeScrollView = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const offsetPercent = useRef<SharedValue<number>>(useSharedValue(0)).current;
  const activeFlatlist = useRef<SharedValue<number>>(useSharedValue(0)).current;
  const activeSectionList = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const offsetFlatlistPercent = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const offsetSectionlistPercent = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const syncScrollViewsValue: ISyncScrollViewProps = {
    activeScrollView,
    offsetPercent,
    activeFlatlist,
    offsetFlatlistPercent,
    activeSectionList,
    offsetSectionlistPercent,
  };
  return (
    <SyncedScrollViewContext.Provider
      value={syncScrollViewsValue}
      {...children}
    />
  );
};

const useSyncScrollView = () =>
  useContext(SyncedScrollViewContext) as ISyncScrollViewProps;
export {SyncScrollViewProvider, useSyncScrollView};
