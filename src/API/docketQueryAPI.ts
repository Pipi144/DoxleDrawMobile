import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import axios, {AxiosResponse, isAxiosError} from 'axios';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {useTokenControl} from './authQueryAPI';
import {baseAddress} from './settings';
import {
  Docket,
  IFullDocketDetailQueryFilterProp,
  LightDocket,
} from '../Models/docket';
import {Company} from '../Models/company';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';

interface IRetrieveDocketDetail extends BaseAPIProps {
  docketPk: string;
  enable?: boolean;
}
const useRetrieveDocketDetail = ({
  docketPk,
  accessToken,
  company,
  enable,
}: IRetrieveDocketDetail) => {
  const {invalidateTokenData} = useTokenControl();
  const qKey = formDocketDetailQKey(docketPk);
  let docketURL = `${baseAddress}/dockets/` + docketPk + '/';

  const docketQuery = useQuery<AxiosResponse<Docket>>({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const resp = await axios.get<Docket>(docketURL, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
        });
        if (resp) return resp;
        else throw new Error('No Data');
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 403) {
          console.log('INVALIDATE TOKEN DATA in useRetrieveDocketDetail');
          invalidateTokenData();
        }
        throw error;
      }
    },
    enabled: Boolean(company && accessToken && (enable ?? true)),
    retry: 2,
    retryDelay: 3 * 1000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return docketQuery;
};

//!important=> used to overwrite cache data of react query

interface RetrieveFulDetailDocketList extends BaseAPIProps {
  filter: IFullDocketDetailQueryFilterProp;
  enable?: boolean;
}
const useRetrieveFullDetailDocketList = ({
  filter,
  accessToken,
  company,
  enable,
}: RetrieveFulDetailDocketList) => {
  const qKey = formDocketListQueryKey({filter, company});
  const {invalidateTokenData} = useTokenControl();
  let docketURL = `${baseAddress}/dockets/?page=1`;
  let filterParam = generateDocketAPIParams(filter);
  const {order_by} = filter;
  if (order_by) {
    if (Array.isArray(order_by)) {
      if (order_by.length > 0)
        for (let i = 0; i < order_by.length; i++) {
          docketURL += `&order_by=${order_by[i]}`;
        }
    } else docketURL += `&order_by=${order_by}`;
  }

  const docketQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: docketURL,

    queryFn: async ({pageParam, signal}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<LightDocket>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company!.companyId,
            },
            params: filterParam,
            signal,
          },
        );
        if (resp) return resp;
        else throw new Error('No Data');
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 403) {
          console.log(
            'INVALIDATE TOKEN DATA in useRetrieveFullDetailDocketList',
          );
          invalidateTokenData();
        }
        throw error;
      }
    },
    getNextPageParam: prev => prev.data.next,
    enabled: Boolean(company && accessToken && (enable || true)),

    retry: 3,
    retryDelay: 3 * 1000,
    refetchInterval: 1.5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
    gcTime: 6 * 60 * 1000,
    refetchOnMount: true,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  return docketQuery;
};

// const useRetrieveBasicCoreDocketList = ({
//   company,
//   accessToken,
//   showNotification,
// }: BaseAPIProps) => {
//   const {invalidateTokenData} = useTokenControl();
//   return useQuery(
//     ['core-dockets', company?.companyId],
//     () =>
//       axios.get(`${baseAddress}/dockets/core/`, {
//         headers: {
//           Authorization: 'Bearer ' + accessToken,
//           'User-Company': company!.companyId,
//         },
//       }),
//     {
//       enabled: Boolean(company),
//       retry: 2,
//       retryDelay: 3 * 1000,
//       staleTime: 30 * 60 * 1000,
//       cacheTime: 35 * 60 * 1000,
//       refetchInterval: 31 * 60 * 1000,
//       onError: error => {
//         if (isAxiosError(error) && error.response?.status === 403) {
//           console.log(
//             'INVALIDATE TOKEN DATA in useRetrieveBasicCoreDocketList',
//           );
//           invalidateTokenData();
//         }
//       },
//     },
//   );
// };
// export interface FilterRetrieveDocketStatusList {
//   isNoticeBoardStatus?: boolean;
//   isBudgetStatus?: boolean;
// }
// interface RetrieveDocketStatusList extends BaseAPIProps {
//   filter: FilterRetrieveDocketStatusList;
// }
// const useRetrieveDocketStatusList = ({
//   showNotification,
//   company,
//   accessToken,
//   filter,
//   onErrorCb,
// }: RetrieveDocketStatusList) => {
//   const {invalidateTokenData} = useTokenControl();
//   const qKey = formDocketStatusQKey(filter, company);
//   let docketURL = `${baseAddress}/dockets/status/`;
//   const {isNoticeBoardStatus, isBudgetStatus} = filter;
//   let getParams: any = {};
//   if (company) getParams.company = company.companyId;
//   if (isNoticeBoardStatus) getParams.is_noticeboard = 'true';
//   if (isBudgetStatus) getParams.is_budget = 'true';

//   const docketQuery = useQuery(
//     qKey,
//     () =>
//       axios.get<DocketStatus[]>(docketURL, {
//         headers: {
//           Authorization: 'Bearer ' + accessToken,
//           'User-Company': company!.companyId,
//         },
//         params: getParams,
//       }),
//     {
//       enabled: company !== undefined && accessToken !== undefined,
//       retry: 2,
//       retryDelay: 3 * 1000,
//       staleTime: 5 * 60 * 100,
//       refetchOnMount: true,
//       onError: error => {
//         // if (showNotification)
//         //   showNotification(
//         //     'SOMETHING WRONG',
//         //     'error',
//         //     'fail to get docket detail',
//         //   );
//         if (isAxiosError(error) && error.response?.status === 403) {
//           console.log('INVALIDATE TOKEN DATA in useRetrieveDocketStatusList');
//           invalidateTokenData();
//         }

//         if (onErrorCb) onErrorCb();
//       },
//     },
//   );
//   return docketQuery;
// };

// interface IuseUpdateDocketProp extends BaseAPIProps {
//   onSuccessCb?: (newDocket?: Docket) => void;
//   filter: IFullDocketDetailQueryFilterProp; //!IMPORTANT, this filter should be passed whenever doing some mutate function related to this query data

//   overwrite?: boolean;
// }
// export interface DocketUpdateBody
//   extends Partial<
//     Pick<
//       Docket,
//       | 'docketName'
//       | 'commenced'
//       | 'completed'
//       | 'project'
//       | 'status'
//       | 'statusColor'
//       | 'percentageCompleted'
//       | 'ballInCourt'
//       | 'watching'
//       | 'isArchived'
//       | 'projectSiteAddress'
//       | 'isSticky'
//     >
//   > {
//   startDate?: string;
//   endDate?: string;
// }
// export interface DocketUpdateMutateFunctionProps {
//   docketPk: string;
//   updateBody: DocketUpdateBody;
// }
// const useUpdateDocket = ({
//   company,
//   showNotification,
//   onSuccessCb,
//   accessToken,
//   filter,
//   overwrite = true,
//   onErrorCb,
// }: IuseUpdateDocketProp) => {
//   const queryClient = useQueryClient();
//   const {handleUpdateDocket} = useSetDocketQueryData({filter, overwrite});
//   const mutation = useMutation({
//     mutationKey: getMutateDocketQKey('update'),
//     mutationFn: ({
//       docketPk,

//       updateBody,
//     }: DocketUpdateMutateFunctionProps) => {
//       const body = formUpdateDocketPayload(updateBody);

//       return axios.patch<Docket>(
//         baseAddress + '/dockets/' + docketPk + '/',
//         body,
//         {
//           headers: {
//             Authorization: 'Bearer ' + accessToken,
//             'User-Company': company?.companyId,
//           },
//         },
//       );
//     },
//     onSuccess: (result, variables, context) => {
//       handleUpdateDocket(result.data);
//       // if (showNotification)
//       //   showNotification(
//       //     'UPDATED DATA',
//       //     'success',
//       //     'SUCCESSFULLY UPDATED DATA',
//       //   );
//       if (onSuccessCb) onSuccessCb(result.data);
//     },
//     onError: (error, variables, context) => {
//       if (showNotification)
//         showNotification('SOMETHING WRONG!', 'error', 'Fail To Update Docket');
//       if (onErrorCb) onErrorCb();
//       if ((error as any).response.status === 403) {
//         Alert.alert('Your session might be expired!', 'Please log in again!', [
//           {
//             text: 'OK',
//             onPress: () =>
//               queryClient.setQueryData(authQueryKey, (old: any) => {
//                 if (old) {
//                   console.log('SET OLD ATUH');
//                   return produce(old, (draft: any) => {
//                     draft.data.accessToken = undefined;
//                     draft.data.refreshToken = undefined;
//                     draft.data.user = undefined;
//                   });
//                 } else return old;
//               }),
//           },
//         ]);
//       }
//     },
//     onSettled: (result, error, variables, context) => {
//       if (result) {
//         queryClient.resetQueries({
//           predicate: query =>
//             query.queryKey.includes(baseDocketDetailQKey[0]) &&
//             query.queryKey.includes(variables.docketPk) &&
//             !query.isActive(),
//         });

//         queryClient.resetQueries({
//           predicate: query =>
//             query.queryKey.includes(baseQKeyDocketList[0]) &&
//             query.queryKey.includes(`project:${result.data.project}`) &&
//             !query.isActive(),
//         });
//       }
//     },
//   });
//   const mutate = (data: DocketUpdateMutateFunctionProps) =>
//     mutation.mutate(data);
//   return {...mutation, mutate: mutate};
// };

// interface DeleteDocketQueryProps extends BaseAPIProps {
//   onSuccessCb?: (deletedDocketId?: string) => void;
//   filter: IFullDocketDetailQueryFilterProp;
//   overwrite?: boolean;
// }
// const useDeleteDocketQuery = ({
//   company,
//   showNotification,
//   onSuccessCb,
//   accessToken,
//   filter,
//   overwrite = true,
// }: DeleteDocketQueryProps) => {
//   const {handleRemoveDocket} = useSetDocketQueryData({filter, overwrite});
//   const queryClient = useQueryClient();
//   const mutation = useMutation({
//     mutationFn: (docketId: string) => {
//       return axios.delete(
//         baseAddress + '/dockets/' + docketId + '/',

//         {
//           headers: {
//             Authorization: 'Bearer ' + accessToken,
//             'User-Company': company?.companyId,
//           },
//         },
//       );
//     },
//     onSuccess: (result, variables, context) => {
//       if (showNotification)
//         showNotification(
//           'Item Deleted',
//           'success',
//           'SUCCESSFULLY UPDATED DATA',
//         );
//       if (onSuccessCb) onSuccessCb(variables);
//       handleRemoveDocket(variables);
//     },
//     onError: (error, variables, context) => {
//       if (showNotification)
//         showNotification(
//           'SOMETHING WRONG!',
//           'error',
//           'Fail To Update Action Timeline',
//         );

//       console.log('ERROR:', error);
//     },
//     onSettled(data, error, variables, context) {
//       if (data) {
//         queryClient.resetQueries({
//           predicate: query =>
//             query.queryKey.includes(baseQKeyDocketList[0]) &&
//             query.queryKey.includes(`project:${filter.project}`) &&
//             !query.isActive() &&
//             !query.isStale(),
//         });
//       }
//     },
//   });
//   const mutate = (docketId: string) => mutation.mutate(docketId);
//   return {...mutation, mutate: mutate};
// };

// interface DocketAddQueryProps extends BaseAPIProps {
//   onSuccessCb?: (addedDocket?: Docket) => void;
//   filter: IFullDocketDetailQueryFilterProp;
//   overwrite?: boolean;
// }
// const useAddDocketQuery = ({
//   company,
//   showNotification,
//   onSuccessCb,
//   accessToken,
//   filter,
//   overwrite = true,
// }: DocketAddQueryProps) => {
//   const {handleAddDocket} = useSetDocketQueryData({filter, overwrite});

//   const mutateFnc = useMutation({
//     mutationKey: getMutateDocketQKey('add'),
//     mutationFn: (newDocket: Docket) => {
//       return axios.post<Docket>(baseAddress + '/dockets/', newDocket, {
//         headers: {
//           Authorization: 'Bearer ' + accessToken,
//           'User-Company': company?.companyId,
//         },
//       });
//     },
//     onSuccess: (result, variables, context) => {
//       if (onSuccessCb) onSuccessCb({...result.data, isNew: true});

//       handleAddDocket({...result.data, isNew: true});
//     },
//     onError: (error: any, variables, context) => {
//       console.log('ERROR:', error.toJSON());
//       if (showNotification)
//         showNotification(
//           'SOMETHING WRONG!',
//           'error',
//           'Fail To Update Action Timeline',
//         );
//     },
//   });
//   const mutate = (newDocket: Docket) => mutateFnc.mutate(newDocket);
//   return {...mutateFnc, mutate: mutate};
// };

// //*SHARE DOCKET
// interface ShareDocketQueryProp extends BaseAPIProps {
//   onSuccessSendEmailCb?: (newPermission?: DocketPermission[]) => void;
// }
// export interface ShareDocketMutationProps {
//   docketPk: string;
//   contactIds?: string[];
//   newContacts?: NewContact[];
//   // permissions: SharedDocketPermissions
// }

// interface GetDocketLinkProps {
//   docketPk: string;
//   contactId?: string;
//   userId?: NewContact;
// }

// const useShareDocketLink = ({
//   accessToken,
//   company,
//   showNotification,
//   onSuccessSendEmailCb,
// }: ShareDocketQueryProp) => {
//   const emailLink = useMutation({
//     mutationKey: getShareDocketMuateQKey('sendEmail'),
//     mutationFn: ({
//       docketPk,
//       contactIds,
//       newContacts,
//     }: ShareDocketMutationProps) => {
//       const updateDocketURL = `${baseAddress}/dockets/share/${docketPk}/`;
//       return axios.post<DocketPermission[]>(
//         updateDocketURL,
//         {
//           contacts: contactIds,
//           newContacts,
//         },
//         {
//           headers: {
//             Authorization: 'Bearer ' + accessToken,
//             'User-Company': company?.companyId || '',
//           },
//         },
//       );
//     },
//     onSuccess: (result, variables, context) => {
//       if (showNotification)
//         showNotification('Shared', 'success', 'An Email Has been Sent');
//       if (onSuccessSendEmailCb) onSuccessSendEmailCb(result.data);
//     },
//     onError: (error: any, variables, context) => {
//       if (showNotification)
//         showNotification(
//           'Unable to share docket',
//           'error',
//           String(error?.request?.status) ??
//             'Unknown Error:' + String(error?.request?.data) ??
//             'No Data',
//         );
//     },
//   });

//   const getLink = useMutation({
//     mutationKey: getShareDocketMuateQKey('getLink'),
//     mutationFn: ({docketPk, contactId, userId}: GetDocketLinkProps) => {
//       const getURL = `${baseAddress}/dockets/share/${docketPk}/`;
//       let params: any = {};
//       if (contactId) params.contact = contactId;
//       if (userId) params.contact = userId;
//       return axios.get(getURL, {
//         headers: {
//           Authorization: 'Bearer ' + accessToken,
//           'User-Company': company?.companyId || '',
//         },
//         params,
//       });
//     },
//     onSuccess: (result, variables, context) => {},
//     onError: (error: any, variables, context) => {
//       if (showNotification)
//         showNotification(
//           'Unable to get docket link',
//           'error',
//           String(error?.request?.status) ??
//             'Unknown Error:' + String(error?.request?.data) ??
//             'No Data',
//         );
//     },
//   });
//   return {emailLink, getLink};
// };
//########################### HELPER FUNCTIONS #########################
export const baseQKeyDocketList = ['fullDocket-list'];
export const formDocketListQueryKey = (data: {
  filter: IFullDocketDetailQueryFilterProp;
  company: Company | undefined;
}) => {
  const {filter, company} = data;
  const {project, ...rest} = filter;
  const baseQKey = ['fullDocket-list'];
  if (company) baseQKey.push(company.companyId);
  if (project) baseQKey.push(`project:${project.projectId}`);
  for (const [key, value] of Object.entries(rest)) {
    if (value) baseQKey.push(`${key}:${value}`);
  }
  return baseQKey;
};

// const formDocketStatusQKey = (
//   filter: FilterRetrieveDocketStatusList,
//   company: Company | undefined,
// ) => {
//   const qKey = ['docket-status'];
//   if (company) qKey.push(company.companyId);
//   const {isNoticeBoardStatus, isBudgetStatus} = filter;
//   if (isNoticeBoardStatus) qKey.push('noticeboard');
//   if (isBudgetStatus) qKey.push('budget');
//   return qKey;
// };

export const baseDocketDetailQKey = ['docket-detail'];
export const formDocketDetailQKey = (docketPk: string) => {
  const qKey = ['docket-detail', docketPk];
  return qKey;
};

export const getMutateDocketQKey = (action: 'add' | 'update' | 'delete') => {
  if (action === 'add') return ['add-docket'];
  else if (action === 'update') return ['update-docket'];
  else return ['delete-docket'];
};

export const getShareDocketMuateQKey = (action: 'sendEmail' | 'getLink') => [
  `${action}-share-docket`,
];

const generateDocketAPIParams = (filter: IFullDocketDetailQueryFilterProp) => {
  const {
    project,
    inbox,
    searchText,

    stage,
    due,
    archived,

    order_by,
    ball_in_court,
    view,
    page_size,
  } = filter;
  let filterParam: any = {};

  if (project) {
    filterParam.project = project.projectId;
  }
  if (inbox) {
    filterParam.inbox = true;
  }
  if (searchText) {
    filterParam.search = searchText;
  }

  if (stage) filterParam.stage = stage;
  if (due) filterParam.due = due;
  if (archived) filterParam.archived = archived;

  if (ball_in_court) filterParam.ball_in_court = ball_in_court;
  if (view) filterParam.view = view;
  filterParam.page_size = page_size ?? 25;
  return filterParam;
};

// export const formUpdateDocketPayload = (updateBody: DocketUpdateBody) => {
//   const body: any = {};
//   if (updateBody.docketName) body.docket_name = updateBody.docketName;
//   if (updateBody.startDate !== undefined)
//     body.start_date = updateBody.startDate;
//   if (updateBody.endDate !== undefined) body.end_date = updateBody.endDate;
//   if (updateBody.commenced !== undefined) body.commenced = updateBody.commenced;
//   if (updateBody.completed !== undefined) body.completed = updateBody.completed;
//   if (updateBody.project !== undefined) body.project = updateBody.project;
//   if (updateBody.projectSiteAddress !== undefined)
//     body.projectSiteAddress = updateBody.projectSiteAddress;
//   if (updateBody.status !== undefined) body.status = updateBody.status;
//   if (updateBody.statusColor !== undefined)
//     body.statusColor = updateBody.statusColor;
//   if (updateBody.percentageCompleted !== undefined) {
//     body.percentageCompleted = updateBody.percentageCompleted;
//     if (updateBody.percentageCompleted === 100)
//       body.completed = formatTDateISO(new Date()); //!UPDATE COMPLETE IF PERCENTAGE =100
//   }
//   if (updateBody.ballInCourt !== undefined) {
//     body.ball_in_court = updateBody.ballInCourt;
//   }
//   if (updateBody.watching !== undefined) body.watching = updateBody.watching;
//   if (updateBody.isArchived !== undefined)
//     body.isArchived = updateBody.isArchived;
//   if (updateBody.isSticky !== undefined) body.isSticky = updateBody.isSticky;

//   return body;
// };
//################### END OF HELPER FUNCTIONS #########################
const DocketQuery = {
  useRetrieveDocketDetail,
  useRetrieveFullDetailDocketList,
  // useRetrieveDocketStatusList,
  // useUpdateDocket,
  // useDeleteDocketQuery,
  // useAddDocketQuery,
  // useShareDocketLink,
  // useRetrieveBasicCoreDocketList,
};

export default DocketQuery;
