import {useShallow} from 'zustand/react/shallow';
import {useMutation, UseMutationResult, useQuery} from '@tanstack/react-query';
import {AxiosResponse, isAxiosError} from 'axios';
import {useMemo} from 'react';
import {useOpeningsStore} from '../Components/Home/Stores/OpeningsStore';
import {
  parseServerOpenings,
  ServerOpening,
} from '../Models/DrawModels/Openings';
import {DrawAPI} from './settings';
import {AxiosBackendErrorReturn} from '../Models/axiosReturn';

type TRetrieveOpeningsFilter = {
  storeyId?: string;
  projectId?: string;
};

const getOpeningListQKey = ({storeyId, projectId}: TRetrieveOpeningsFilter) => {
  const qKey = ['opening-list'];
  if (storeyId) qKey.push(`storeyId:${storeyId}`);
  else if (projectId) qKey.push(`projectId:${projectId}`);
  return qKey;
};
interface IRetrieveOpeningsQueryProps extends TRetrieveOpeningsFilter {
  enabled?: boolean;
}
export const useRetrieveOpeningItems = ({
  enabled = true,
  ...props
}: IRetrieveOpeningsQueryProps) => {
  const {setItems} = useOpeningsStore(
    useShallow(state => ({
      setItems: state.setOpeningItems,
    })),
  );
  const params = props.storeyId
    ? {storey_id: props.storeyId}
    : {project_id: props.projectId};
  const query = useQuery<
    AxiosResponse<ServerOpening[], AxiosBackendErrorReturn>
  >({
    queryKey: getOpeningListQKey(props),
    queryFn: async () => {
      try {
        const resp = await DrawAPI.get<ServerOpening[]>(`/opening/`, {params});
        if (resp) {
          setItems(parseServerOpenings(resp.data));

          return resp;
        } else throw new Error('No data received');
      } catch (error) {
        console.log('error useRetrieveOpeningItems', error);
        throw error; // Make sure to throw error for React Query to handle
      }
    },
    enabled: Boolean(enabled && (props.storeyId || props.projectId)),
    retry: 1,
    refetchInterval: 30 * 60 * 1000,
    staleTime: 0 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,

    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });
  const items = useMemo(() => {
    if (query.isSuccess && query.data.data)
      return parseServerOpenings(query.data.data);
    else return [];
  }, [query.isSuccess, query.data]);

  return {
    items,
    query,
  };
};
// type UseMutateOpeningItemsProps = {
//   storeyId?: string;
//   projectId?: string;
//   onAddSuccessCb?: (opening: OpeningItem) => void;
//   onPatchSuccessCb?: (opening: OpeningItem) => void;
//   onDeleteSuccessCb?: () => void;
//   onErrorCb?: (error: unknown) => void;
// };

// export const useMutateOpeningItem = (props: UseMutateOpeningItemsProps) => {
//   const showNotification = useDoxleNotificationStore(
//     useShallow((state) => state.showNotification)
//   );

//   const addOpeningItemQuery = useMutation<
//     AxiosResponse<ServerOpening, AxiosBackendErrorReturn>,
//     unknown,
//     NewOpening
//   >(
//     getOpeningMutationKey('add'),
//     (newOpening: NewOpening) => DrawAPI.post(`/opening/`, newOpening),
//     {
//       retry: 1,
//       onSuccess: (
//         result: AxiosResponse<ServerOpening, AxiosBackendErrorReturn>
//       ) => {
//         const item = parseServerOpening(result.data);
//         if (props.onAddSuccessCb && result.data?.openingId)
//           props.onAddSuccessCb(item);
//       },
//       onError: (error: unknown) => {
//         if (props.onErrorCb) props.onErrorCb(error);
//         if (showNotification)
//           if (isAxiosError<AxiosBackendErrorReturn>(error)) {
//             showNotification(
//               `${error?.response?.status ?? 'ERROR'}: ${
//                 error.response?.data.detail ?? 'UNKNOWN ERROR'
//               }`,
//               'error',
//               String(
//                 error?.response?.data?.detail ?? 'Fail to get docket list'
//               ).substring(0, 300)
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list'
//             );
//           }
//       },
//     }
//   );

//   const patchOpeningQuery = useMutation<
//     AxiosResponse<ServerOpening, AxiosBackendErrorReturn>,
//     unknown,
//     PatchOpening
//   >(
//     getOpeningMutationKey('update'),
//     (patchOpening: PatchOpening) =>
//       DrawAPI.patch<ServerOpening>(
//         `/opening/${patchOpening.openingId}/`,
//         patchOpening
//       ),
//     {
//       retry: 1,
//       onSuccess: (
//         result: AxiosResponse<ServerOpening, AxiosBackendErrorReturn>,
//         variables
//       ) => {
//         const item = parseServerOpening(result.data);

//         if (props.onPatchSuccessCb && result.data?.openingId)
//           props.onPatchSuccessCb({ ...item, version: variables.version });
//       },
//       onError: (error: unknown) => {
//         if (props.onErrorCb) props.onErrorCb(error);
//         if (showNotification)
//           if (isAxiosError<AxiosBackendErrorReturn>(error)) {
//             showNotification(
//               `${error?.response?.status ?? 'ERROR'}: ${
//                 error.response?.data.detail ?? 'UNKNOWN ERROR'
//               }`,
//               'error',
//               String(
//                 error?.response?.data?.detail ?? 'Fail to get docket list'
//               ).substring(0, 300)
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list'
//             );
//           }
//       },
//     }
//   );

//   const deleteOpeningQuery = useMutation<AxiosResponse, unknown, OpeningItem>(
//     getOpeningMutationKey('delete'),
//     (item: OpeningItem) => DrawAPI.delete(`/opening/${item.openingId}/`),
//     {
//       retry: 1,
//       onSuccess: (result: AxiosResponse, item: OpeningItem) => {
//         if (props.onDeleteSuccessCb && result.data?.openingId)
//           props.onDeleteSuccessCb();
//       },
//       onError: (error: unknown) => {
//         if (props.onErrorCb) props.onErrorCb(error);
//         if (showNotification)
//           if (isAxiosError<AxiosBackendErrorReturn>(error)) {
//             showNotification(
//               `${error?.response?.status ?? 'ERROR'}: ${
//                 error.response?.data.detail ?? 'UNKNOWN ERROR'
//               }`,
//               'error',
//               String(
//                 error?.response?.data?.detail ?? 'Fail to get docket list'
//               ).substring(0, 300)
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list'
//             );
//           }
//       },
//     }
//   );

//   return {
//     addOpeningItemQuery,
//     addOpeningItem: addOpeningItemQuery.mutate,
//     patchOpeningQuery,
//     patchOpeningItem: patchOpeningQuery.mutate,
//     deleteOpeningQuery,
//     deleteOpeningItem: deleteOpeningQuery.mutate,
//   };
// };
export const getOpeningMutationKey = (
  action: 'add' | 'update' | 'add-multi' | 'delete',
) => [`${action}-opening`];
