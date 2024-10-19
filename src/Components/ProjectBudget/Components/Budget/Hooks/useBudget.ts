import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useBudgetStore} from '../../../Store/useBudgetStore';
import {useShallow} from 'zustand/shallow';
import {IFullDocketDetailQueryFilterProp} from '../../../../../Models/docket';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import useGetBudgetList from './useGetBudgetList';
import {useFocusEffect} from '@react-navigation/native';
import useSetDocketQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetDocketQueryData';

type Props = {};

const useBudget = (props: Props) => {
  const [searchInput, setSearchInput] = useState<string>('');

  const {selectedProject} = useCompany();

  const {setFilterBudgetList} = useBudgetStore(
    useShallow(state => ({
      setFilterBudgetList: state.setFilterBudgetList,
    })),
  );
  const {removeDocketQueryDataWithSearch} = useSetDocketQueryData({});
  const onSearch = (val: string) => {
    setSearchInput(val);
  };
  const filterDocketBudgetList: IFullDocketDetailQueryFilterProp = useMemo(
    () => ({
      project: selectedProject,
      view: 'budget',
      searchText: searchInput,
      order_by: ['stage_model__index', '-is_sticky'],
      page_size: 100,
    }),
    [selectedProject, searchInput],
  );
  useEffect(() => {
    setFilterBudgetList(filterDocketBudgetList);
  }, [filterDocketBudgetList]);
  useEffect(() => {
    if (!searchInput) removeDocketQueryDataWithSearch();
  }, [searchInput]);

  const {
    docketBudgetList,

    isFetchingBudgetList,
    handleFetchNextPageBudget,
    isFetchingNextPageBudget,
    refetchBudgetList,
    isRefetchingBudgetList,
  } = useGetBudgetList({});

  const refetchBudgetData = () => {
    refetchBudgetList();
  };

  const scrollXAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const scrollYAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const touchAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const horizontalScrollViewAnimatedStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(
      scrollXAnimatedValue.value,
      [0, -100],
      [1, 1.4],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      transform: [
        {
          scaleX,
        },
      ],
    };
  }, [scrollXAnimatedValue.value]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchInput('');
      };
    }, []),
  );
  return {
    docketBudgetList,

    isFetchingBudgetData: false, // isFetchingBudgetList,
    refetchBudgetData,
    isRefetchingBudgetData: isRefetchingBudgetList,
    handleFetchNextPageBudget,
    isFetchingNextPageBudget,
    scrollXAnimatedValue,
    touchAnimatedValue,
    horizontalScrollViewAnimatedStyle,
    onSearch,
  };
};

export default useBudget;
