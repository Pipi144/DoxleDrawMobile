// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {View} from 'react-native';
import {useMemo, useRef, useState} from 'react';
import useGetQAItemList from './useGetQAItemList';

import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useShallow} from 'zustand/react/shallow';
import Animated from 'react-native-reanimated';
import {QA, QAList} from '../../../../../Models/qa';
import {useOrientation} from '../../../../../Providers/OrientationContext';
import useItemLayout from '../../../../../CustomHooks/useItemLayout';
import useEffectAfterMount from '../../../../../CustomHooks/useEffectAfterMount';

type Props = {
  qaListItem: QAList;
};

const useQAItemList = ({qaListItem}: Props) => {
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
    null,
  );

  const {qaListViewMode, filterGetQAItems} = useProjectQAStore(
    useShallow(state => ({
      qaListViewMode: state.qaListViewMode,
      filterGetQAItems: state.filterGetQAItems,
    })),
  );
  const queryGetQAItems = useGetQAItemList({
    filter: {...filterGetQAItems, defectListId: qaListItem.defectListId},
  });
  const {deviceType, isPortraitMode} = useOrientation();
  const numOfCol = useMemo(
    () => (deviceType === 'Smartphone' ? 1 : 2),
    [deviceType, isPortraitMode],
  );
  const [layoutWrapper, onLayoutWrapper] = useItemLayout();

  const listWrapperRef = useRef<View>(null);
  const listRef = useRef<Animated.FlatList<QA>>(null);

  // Ref for the viewabilityConfig to detect item visibility
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // The percentage of the item that needs to be visible to count it as "viewed"
  });

  // Callback to handle visible items change
  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: Array<{index: number | null}>}) => {
      if (viewableItems.length > 0) {
        // Get the index of the first fully visible item
        const firstVisibleItemIndex = viewableItems[0]?.index;
        setCurrentVisibleIndex(firstVisibleItemIndex ?? null);
      }
    },
  );
  useEffectAfterMount(() => {
    const timeout = setTimeout(() => {
      if (currentVisibleIndex)
        listRef.current?.scrollToIndex({
          index: currentVisibleIndex ?? 1,
          animated: true,
        });
    }, 50);
    return () => clearTimeout(timeout);
  }, [qaListViewMode, listRef.current]);

  return {
    ...queryGetQAItems,
    qaListViewMode,
    numOfCol,
    layoutWrapper,
    onLayoutWrapper,
    listWrapperRef,
    listRef,
    viewabilityConfig,
    onViewableItemsChanged,
  };
};

export default useQAItemList;
