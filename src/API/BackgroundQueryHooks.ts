import {useShallow} from 'zustand/react/shallow';
import {useMutation, UseMutationResult, useQuery} from '@tanstack/react-query';
import {AxiosResponse, isAxiosError} from 'axios';
import {useMemo} from 'react';
import {
  IBackground,
  parseServerBackgrounds,
  ServerBackground,
} from '../Models/DrawModels/Backgrounds';
import {AxiosBackendErrorReturn} from '../Models/axiosReturn';
import {DrawAPI} from './settings';
import {useBackgroundStore} from '../Components/Home/Stores/BackgroundStore';

type TRetrieveBackgroundsFilter = {
  storeyId?: string;
  projectId?: string;
};

const getBackgroundListQKey = ({
  storeyId,
  projectId,
}: TRetrieveBackgroundsFilter) => {
  const qKey = ['background-list'];
  if (storeyId) qKey.push(`storeyId:${storeyId}`);
  else if (projectId) qKey.push(`projectId:${projectId}`);
  return qKey;
};

interface IRetrieveBackgroundsQueryProps extends TRetrieveBackgroundsFilter {
  enabled?: boolean;
  onSuccessCb?: (backgrounds: IBackground[]) => void;
}
export const useRetrieveBackgrounds = ({
  enabled = true,
  ...props
}: IRetrieveBackgroundsQueryProps) => {
  const {setItems, selectedBg, setSelectedBg} = useBackgroundStore(
    useShallow(state => ({
      setItems: state.setBackgrounds,
      selectedBg: state.selectedBg,
      setSelectedBg: state.setCurrentBackground,
    })),
  );
  const params: {
    storey_id?: string;
    project_id?: string;
    predictions?: 'true';
  } = props.storeyId
    ? {storey_id: props.storeyId}
    : {project_id: props.projectId};
  params.predictions = 'true';

  const query = useQuery<AxiosResponse<ServerBackground[], any>>({
    queryKey: getBackgroundListQKey(props),
    queryFn: async () => {
      try {
        const response = await DrawAPI.get<ServerBackground[], any>(
          `/background/`,
          {params},
        );
        if (response) {
          if (response.data.length > 0) {
            const parseRes = parseServerBackgrounds(response.data);
            setItems(parseRes);
          }

          if (!selectedBg) setSelectedBg(response.data[0].imageId);
        }

        return response;
      } catch (error) {
        console.log('error in background query', error);
      }
    },
    enabled: Boolean(props.storeyId || props.projectId) && enabled,
    retry: 1,
    refetchInterval: 15 * 60 * 1000,
    staleTime: 0 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: true,

    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });
  const items = useMemo(() => {
    if (query.isSuccess && query.data.data)
      return parseServerBackgrounds(query.data.data);
    else return [];
  }, [query.isSuccess, query.data]);

  return {
    items,
    query,
  };
};
// type UseMutateBackgroundsProps = {
//   storeyId?: string;
//   projectId?: string;
//   onAddSuccessCb?: (background: IBackground) => void;
//   onPatchSuccessCb?: (background: IBackground) => void;
//   onDeleteSuccessCb?: () => void;
//   onErrorCb?: (error: unknown) => void;
// };
// type UseMutateBackground = {
//   addBackgroundQuery: UseMutationResult<
//     AxiosResponse<ServerBackground, AxiosBackendErrorReturn>,
//     unknown,
//     NewBackground
//   >;
//   addBackground: (newBackground: NewBackground) => void;
//   patchBackgroundQuery: UseMutationResult<
//     AxiosResponse<ServerBackground, AxiosBackendErrorReturn>,
//     unknown,
//     PatchBackground
//   >;
//   patchBackground: (patchBackground: PatchBackground) => void;
//   deleteBackgroundQuery: UseMutationResult<AxiosResponse, unknown, IBackground>;
//   deleteBackground: (item: IBackground) => void;
// };
// export const useMutateBackground = (
//   props: UseMutateBackgroundsProps
// ): UseMutateBackground => {
//   const showNotification = useDoxleNotificationStore(
//     useShallow((state) => state.showNotification)
//   );
//   const { addItem, updateItem, deleteItem } = useBackgroundStore(
//     useShallow((state) => ({
//       addItem: state.addBackground,
//       updateItem: state.updateBackground,
//       deleteItem: state.deleteBackground,
//     }))
//   );
//   const addBackgroundQuery = useMutation<
//     AxiosResponse<ServerBackground, AxiosBackendErrorReturn>,
//     unknown,
//     NewBackground
//   >(
//     ['add-background'],
//     (newBackground: NewBackground) => {
//       const newBackgroundFormData = new FormData();
//       for (const [key, value] of Object.entries(newBackground)) {
//         newBackgroundFormData.append(key, value);
//       }
//       return DrawAPI.post(`/background/`, newBackgroundFormData);
//     },
//     {
//       retry: 1,
//       onSuccess: (
//         result: AxiosResponse<ServerBackground, AxiosBackendErrorReturn>
//       ) => {
//         const item = parseServerBackground(result.data);
//         if (result.data) addItem(item);
//         if (props.onAddSuccessCb && result.data?.imageId)
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

//   const patchBackgroundQuery = useMutation<
//     AxiosResponse<ServerBackground, AxiosBackendErrorReturn>,
//     unknown,
//     PatchBackground
//   >(
//     ['patch-background'],
//     (patchBackground: PatchBackground) =>
//       DrawAPI.patch(`/background/${patchBackground.imageId}/`, patchBackground),
//     {
//       retry: 1,
//       onSuccess: (
//         result: AxiosResponse<ServerBackground, AxiosBackendErrorReturn>
//       ) => {
//         const item = parseServerBackground(result.data);
//         if (result.data) updateItem(item);
//         if (props.onPatchSuccessCb && result.data?.imageId)
//           props.onPatchSuccessCb(item);
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

//   const deleteBackgroundQuery = useMutation<
//     AxiosResponse,
//     unknown,
//     IBackground
//   >(
//     ['delete-background'],
//     (item: IBackground) => DrawAPI.delete(`/background/${item.imageId}/`),
//     {
//       retry: 1,
//       onSuccess: (result: AxiosResponse, item: IBackground) => {
//         if (result.data) deleteItem(item);
//         if (props.onDeleteSuccessCb && result.data?.backgroundId)
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
//     addBackgroundQuery,
//     addBackground: addBackgroundQuery.mutate,
//     patchBackgroundQuery,
//     patchBackground: patchBackgroundQuery.mutate,
//     deleteBackgroundQuery,
//     deleteBackground: deleteBackgroundQuery.mutate,
//   };
// };
