import {useShallow} from 'zustand/react/shallow';

import {useMutation, useQuery} from '@tanstack/react-query';
import {AxiosResponse, isAxiosError} from 'axios';

import {useMemo} from 'react';
import {useWallsStore} from '../Components/Home/Stores/WallsStore';
import {DrawAPI} from './settings';
import {
  parseServerWalls,
  ServerWall,
  WallType,
} from '../Models/DrawModels/Walls';
import {AxiosBackendErrorReturn} from '../Models/axiosReturn';

type TRetrieveWallsFilter = {
  storeyId?: string;
  projectId?: string;
};

interface IRetrieveWallsQueryProps extends TRetrieveWallsFilter {
  enabled?: boolean;
}
export const useRetrieveWalls = ({
  enabled = true,
  ...props
}: IRetrieveWallsQueryProps) => {
  const setWalls = useWallsStore(useShallow(state => state.setWalls));
  // const { deleteWall } = useMutateWalls({});
  const params = props.storeyId
    ? {storey_id: props.storeyId}
    : {project_id: props.projectId};
  const query = useQuery<AxiosResponse<ServerWall[], any>>({
    queryKey: getWallListQKey(props),
    queryFn: async () => {
      try {
        const resp = await DrawAPI.get<ServerWall[]>(`/wall/`, {params});

        if (resp) setWalls(parseServerWalls(resp.data));
        return resp;
      } catch (error) {
        console.log('ERROR useRetrieveWalls:', error);
        throw error;
      }
    },
    enabled: Boolean(props.storeyId || props.projectId) && enabled,
    retry: 1,
    refetchInterval: 30 * 60 * 1000,
    staleTime: 0 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,

    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });
  const walls = useMemo(() => {
    if (query.isSuccess && query.data.data)
      return parseServerWalls(query.data.data);
    else return [];
  }, [query.isSuccess, query.data]);

  return {
    walls,
    query,
  };
};

export const useRetrieveWallTypes = ({enabled = true}: {enabled?: boolean}) => {
  const setWallTypes = useWallsStore(useShallow(state => state.setWallTypes));
  const query = useQuery<AxiosResponse<WallType[], AxiosBackendErrorReturn>>({
    queryKey: ['wall-types'],
    queryFn: async () => {
      const resp = await DrawAPI.get<WallType[]>(`/wall/types/`);

      if (resp) setWallTypes(resp.data);

      return resp;
    },
    enabled: enabled,
    retry: 1,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,

    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
  const wallTypes = useMemo(() => {
    if (query.isSuccess && query.data) return query.data;
    else return [];
  }, [query.isSuccess, query.data]);

  return {
    wallTypes,
    query,
  };
};
// type UseMutateWallsProps = {
//   storeyId?: string;
//   projectId?: string;
//   onAddSuccessCb?: (wall: IWall) => void;
//   onAddMultiSuccessCb?: (walls: IWall[]) => void;
//   onPatchSuccessCb?: (wall: IWall) => void;
//   onDeleteSuccessCb?: (deletedId?: string) => void;
//   onErrorCb?: (error: unknown) => void;
// };
// interface MultiWallPayload {
//   storeyId: string;
//   walls?: INewWall[];
//   removed?: string[];
// }
// export const useMutateWalls = (props: UseMutateWallsProps) => {
//   const showNotification = useDoxleNotificationStore(
//     useShallow(state => state.showNotification),
//   );
//   const {updateWall} = useWallsStore(
//     useShallow(state => ({
//       addWall: state.addWall,
//       updateWall: state.updateWall,
//     })),
//   );
//   const addWallQuery = useMutation<
//     AxiosResponse<ServerWall, AxiosBackendErrorReturn>,
//     unknown,
//     INewWall
//   >(
//     getWallMutationKey('add'),
//     (newWall: INewWall) => DrawAPI.post(`/wall/`, newWall),
//     {
//       retry: 1,
//       onSuccess: (
//         result: AxiosResponse<ServerWall, AxiosBackendErrorReturn>,
//       ) => {
//         // const wall = parseServerWall(result.data)
//         // if (result.data) addWall(wall);
//         // if (result.data) updateWall(wall);
//         if (props.onAddSuccessCb && result.data?.wallId) {
//           const wall = parseServerWall(result.data);
//           props.onAddSuccessCb(wall);
//         }
//       },
//       onError: (error: unknown) => {
//         // if (newWall.wallId) deleteWall(newWall.wallId);
//         if (props.onErrorCb) props.onErrorCb(error);
//         if (showNotification)
//           if (isAxiosError<AxiosBackendErrorReturn>(error)) {
//             showNotification(
//               `${error?.response?.status ?? 'ERROR'}: ${
//                 error.response?.data.detail ?? 'UNKNOWN ERROR'
//               }`,
//               'error',
//               String(
//                 error?.response?.data?.detail ?? 'Fail to get docket list',
//               ).substring(0, 300),
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list',
//             );
//           }
//       },
//     },
//   );

//   const addMultiWallQuery = useMutation<
//     AxiosResponse<ServerWall[], AxiosBackendErrorReturn>,
//     unknown,
//     MultiWallPayload
//   >(
//     getWallMutationKey('add-multi'),
//     (payload: MultiWallPayload) => {
//       return DrawAPI.post<ServerWall[]>(`/wall/multi/`, payload);
//     },
//     {
//       retry: 1,
//       onSuccess: (result, variable, context) => {
//         if (props.onAddMultiSuccessCb) {
//           const walls = result.data.map(wall => ({
//             ...parseServerWall(wall),
//             overwrite: true,
//             version:
//               variable.walls?.find(w => w.wallId === wall.wallId)?.version ?? 0, // this version is to implementing debounce update, always get it from payload
//           }));
//           props.onAddMultiSuccessCb(walls);
//         }
//       },
//       onError: (error: unknown) => {
//         // if (newWall.wallId) deleteWall(newWall.wallId);
//         if (props.onErrorCb) props.onErrorCb(error);
//         if (showNotification)
//           if (isAxiosError<AxiosBackendErrorReturn>(error)) {
//             showNotification(
//               `${error?.response?.status ?? 'ERROR'}: ${
//                 error.response?.data.detail ?? 'UNKNOWN ERROR'
//               }`,
//               'error',
//               String(
//                 error?.response?.data?.detail ?? 'Fail to get docket list',
//               ).substring(0, 300),
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list',
//             );
//           }
//       },
//     },
//   );
//   const patchWallQuery = useMutation<
//     AxiosResponse<ServerWall, AxiosBackendErrorReturn>,
//     unknown,
//     PatchWall
//   >(
//     getWallMutationKey('patch'),
//     (patchWall: PatchWall) =>
//       DrawAPI.patch(`/wall/${patchWall.wallId}/`, patchWall),
//     {
//       retry: 1,
//       onSuccess: (
//         result: AxiosResponse<ServerWall, AxiosBackendErrorReturn>,
//       ) => {
//         const wall = parseServerWall(result.data);
//         if (result.data) updateWall({...wall, overwrite: true});
//         if (props.onPatchSuccessCb && result.data?.wallId)
//           props.onPatchSuccessCb(wall);
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
//                 error?.response?.data?.detail ?? 'Fail to get docket list',
//               ).substring(0, 300),
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list',
//             );
//           }
//       },
//     },
//   );

//   const deleteWallQuery = useMutation(
//     getWallMutationKey('delete'),
//     (wallId: string) => DrawAPI.delete(`/wall/${wallId}/`),
//     {
//       retry: 1,
//       onSuccess: (res, variable, context) => {
//         if (props.onDeleteSuccessCb) props.onDeleteSuccessCb(variable);
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
//                 error?.response?.data?.detail ?? 'Fail to get docket list',
//               ).substring(0, 300),
//             );
//           } else {
//             showNotification(
//               'SOMETHING WRONG',
//               'error',
//               'Fail to get docket list',
//             );
//           }
//       },
//     },
//   );

//   return {
//     addWallQuery,
//     addWall: addWallQuery.mutate,
//     addMultiWallQuery,
//     addMultiWall: addMultiWallQuery.mutate,
//     patchWallQuery,
//     patchWall: patchWallQuery.mutate,
//     deleteWallQuery,
//     deleteWall: deleteWallQuery.mutate,
//   };
// };

//# HELPER FUNCTIONS
export const baseWallQKey = ['wall-list'];
const getWallListQKey = ({storeyId, projectId}: TRetrieveWallsFilter) => {
  const qKey = [...baseWallQKey];
  if (storeyId) qKey.push(`storeyId:${storeyId}`);
  else if (projectId) qKey.push(`projectId:${projectId}`);
  return qKey;
};

export const getWallMutationKey = (
  action: 'add' | 'patch' | 'delete' | 'add-multi',
) => [`${action}-wall`];
