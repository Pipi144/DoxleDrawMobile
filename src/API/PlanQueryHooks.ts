import {useInfiniteQuery} from '@tanstack/react-query';
import {IStorey} from '../Models/DrawModels/storey.ts';
import {AxiosInfiniteReturn} from '../Models/axiosReturn.ts';
import {DrawAPI} from './settings.ts';

export const useRetrieveStoreys = (projectId: string | undefined) => {
  const url = `/storey/?project_id=${projectId}`;
  return useInfiniteQuery({
    queryKey: getStoreyQueryKey(projectId),
    initialPageParam: url,
    queryFn: async ({pageParam}) => {
      try {
        const response = await DrawAPI.get<AxiosInfiniteReturn<IStorey>>(
          pageParam,
        );

        return response;
      } catch (error) {
        console.log('error', error);
        return;
      }
    },
    getNextPageParam: prev => {
      return prev?.data.next;
    },
    enabled: Boolean(projectId),
    retry: 1,
    refetchInterval: 60 * 60 * 1000,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
};

// interface IMutateStoreyProp {
//   onSuccessAdd?: (newStorey: IStorey) => void;
// }
// export const useMutateStoreys = ({onSuccessAdd}: IMutateStoreyProp) => {
//   const showNotification = useDoxleNotificationStore(
//     useShallow(state => state.showNotification),
//   );
//   const {handleAddStorey} = useSetStoreyQueryData({});
//   const add = useMutation({
//     mutationKey: getStoreyMutationKey('add'),

//     mutationFn: (newStorey: INewStorey) =>
//       DrawAPI.post<IStorey>('/storey/', newStorey),
//     onSuccess: (res, variable, context) => {
//       handleAddStorey(res.data);
//       if (onSuccessAdd) onSuccessAdd(res.data);
//       showNotification('Storey added', 'success', 'Storey added successfully');
//     },
//   });

//   return {
//     add: {...add, mutate: (newStorey: INewStorey) => add.mutate(newStorey)},
//   };
// };

export const getStoreyMutationKey = (action: 'add' | 'update' | 'delete') => [
  `${action}-storey`,
];

export const baseStoreyListQKey = ['storeyData'];
export const getStoreyQueryKey = (projectId: string | undefined) => [
  ...baseStoreyListQKey,
  projectId,
];
