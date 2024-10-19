import axios, {AxiosResponse, isAxiosError} from 'axios';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {baseAddress} from './settings';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  AxiosBackendErrorReturn,
  AxiosInfiniteReturn,
} from '../Models/axiosReturn';
import {
  NewQA,
  QA,
  QAComment,
  QAList,
  QAMarkupArrow,
  QAMarkupCircle,
  QAMarkupLabel,
  QAMarkupPath,
  QAMarkupRectangle,
  QAMarkupStraightLine,
  QAMedia,
  QAVideo,
  QAWithFirstImg,
  TQAStatus,
} from '../Models/qa';
import {Company} from '../Models/company';
import useSetQaCommentQueryData from '../CustomHooks/QueryDataHooks/useSetQaCommentQueryData';
import useSetQAListQueryData from '../CustomHooks/QueryDataHooks/useSetQAListQueryData';
import {Platform} from 'react-native';
import {Contact} from '../Models/contacts';
import {IProjectFloor} from '../Models/location';
import useSetQAQueryData from '../CustomHooks/QueryDataHooks/useSetQAQueryData';
import {IBgVideoUploadData} from '../GeneralStore/useBgUploadStore';
import {TAPIServerFile} from '../Models/utilityType';
import {
  LocalQAImage,
  QABatchPendingUpload,
} from '../Components/ProjectQA/Provider/CacheQAType';

//# QA LIST
export type TOrderQAListQuery =
  | 'completed'
  | 'created_on'
  | 'defect_list_title'
  | 'due_date'
  | 'assignee_name';
export type TRevOrderQAListQuery = `-${TOrderQAListQuery}`;
export interface FilterGetQAListQuery {
  projectId?: string;
  docketId?: string;
  searchText?: string;
  order_by?: (TOrderQAListQuery | TRevOrderQAListQuery)[];
}
interface RetrieveDefectListQueryProps extends BaseAPIProps {
  filter: FilterGetQAListQuery;
  onSuccessCb?: Function;
  enableQuery?: boolean;
}

const useRetrieveQAListQuery = ({
  accessToken,
  company,
  filter,
  onSuccessCb,
  enableQuery,
}: RetrieveDefectListQueryProps) => {
  const {projectId, searchText, docketId, order_by} = filter;
  const qKey = formQAListQueryKey(filter, company);

  let defectURL = `${baseAddress}/defect/?page=1`;
  const getParams: any = {};
  if (company) getParams.company = company.companyId;
  if (projectId) getParams.project = projectId;
  if (docketId) getParams.docket = docketId;
  if (searchText) getParams.search = searchText;
  if (order_by) {
    order_by.forEach(order => (defectURL += `&order_by=${order}`));
  }
  const defectQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: defectURL,
    queryFn: async ({pageParam}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<QAList>>(pageParam, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
          params: getParams,
        });

        if (resp) {
          if (onSuccessCb) {
            onSuccessCb(resp.data.results);
          }

          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR useRetrieveQAListQuery:', error);
        throw error;
      }
    },
    getNextPageParam: prev => prev.data.next,
    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      (enableQuery ?? true),
    retry: 1,
    refetchInterval: 3 * 60 * 1000,
    refetchOnMount: true,
  });
  return defectQuery;
};

interface AddDefectListqueryProps extends BaseAPIProps {
  onSuccessCB?: Function;
  onErrorCB?: Function;
}

const useAddQAListQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  onErrorCB,
}: AddDefectListqueryProps) => {
  const {handleAddQAList} = useSetQAListQueryData({});

  const addDefectURL = `${baseAddress}/defect/`;
  const mutation = useMutation({
    mutationFn: (data: QAList) => {
      const {defectListId, ...rest} = data;
      return axios.post<QAList>(addDefectURL, rest, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (showNotification)
        showNotification(
          'ADDED DEFECT LIST',
          'success',
          'SUCCESSFULLY UPDATED DATA',
        );

      if (onSuccessCB) {
        onSuccessCB({...result.data, isNew: true});
      }
      handleAddQAList({...result.data, isNew: true});
    },
    onError: (error, variables, context) => {
      if (onErrorCB) onErrorCB();
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Add QA List',
          1000,
        );

      console.log('ERROR:', JSON.stringify(error));
    },
  });
  const mutate = (data: QAList) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};

interface DeleteDefectListQueryProps extends BaseAPIProps {
  onSuccessCB?: Function;
}
const useDeleteQAListQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
}: DeleteDefectListQueryProps) => {
  const mutation = useMutation({
    mutationFn: (defectListId: string) => {
      const addDefectURL = `${baseAddress}/defect/${defectListId}/`;
      return axios.delete(addDefectURL, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (showNotification)
        showNotification(
          'DELETED DEFECT LIST',
          'success',
          'SUCCESSFULLY UPDATED DATA',
        );
      if (onSuccessCB) onSuccessCB(variables);
    },
    onError: (error: any, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error.toJSON());
    },
  });
  const mutate = (defectListId: string) => mutation.mutate(defectListId);
  return {...mutation, mutate: mutate};
};
interface UpdateDefectListQueryProps extends BaseAPIProps {
  onSuccessCB?: (newQAList?: QAList) => void;
}
export interface UpdateDefectListParams {
  updateParams: Partial<
    Pick<
      QAList,
      | 'defectListTitle'
      | 'project'
      | 'dueDate'
      | 'assignee'
      | 'assigneeName'
      | 'completed'
    >
  >;
  qaList: QAList;
}
const useUpdateQAListQuery = ({
  showNotification,
  accessToken,
  company,

  onSuccessCB,
}: UpdateDefectListQueryProps) => {
  const mutation = useMutation({
    mutationFn: ({qaList, updateParams}: UpdateDefectListParams) => {
      const editDefectListURL = `${baseAddress}/defect/${qaList.defectListId}/`;
      return axios.patch(editDefectListURL, updateParams, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCB) {
        onSuccessCB(result.data);
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', (error as any).message);
    },
  });
  const mutate = (updateBody: UpdateDefectListParams) =>
    mutation.mutate(updateBody);
  return {...mutation, mutate: mutate};
};

interface GetDefectListDetailQueryProps extends BaseAPIProps {
  defectListId: string;
  assignee?: string;
  onSuccessCb?: (qaList: QAList) => void;
}
const useRetrieveQAListDetailQuery = ({
  accessToken,
  company,
  defectListId,
  onSuccessCb,
  assignee,
}: GetDefectListDetailQueryProps) => {
  const qKey = formDefectListDetailQKey(defectListId, company, assignee);
  let defectURL = `${baseAddress}/defect/${defectListId}/`;
  let params: any = {};
  if (assignee) params.assignee = assignee;
  const defectQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const resp = await axios.get<QAList>(defectURL, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
          params,
        });

        if (resp) {
          if (onSuccessCb) {
            onSuccessCb(resp.data);
          }
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR useRetrieveQAListDetailQuery:', error);
        throw error;
      }
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: false,

    refetchOnMount: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
  return defectQuery;
};

export interface UpdateQAListSignature extends BaseAPIProps {
  onSuccessCB?: Function;
}
interface UpdateQAListSignatureProps {
  qaList: QAList;
  signaturePath: string;
}
const useUpdateQAListSignatureQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  onErrorCb,
}: UpdateQAListSignature) => {
  const updateImgURL = `${baseAddress}/defect/update_defect_list_signature/`;
  const mutation = useMutation({
    mutationFn: (props: UpdateQAListSignatureProps) => {
      const {qaList, signaturePath} = props;
      let formData = new FormData();
      formData.append('defectListId', qaList.defectListId);

      formData.append('files', {
        uri: Platform.OS === 'ios' ? signaturePath : 'file://' + signaturePath,
        name: `${qaList.defectListTitle}-signature.jpeg`,
        type: 'image/jpeg',
      });

      return axios.post(updateImgURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      //   if (showNotification)
      //     showNotification(
      //       'ADDED DEFECT ITEM',
      //       'success',
      //       'SUCCESSFULLY UPDATED DATA',
      //     );

      if (onSuccessCB) {
        onSuccessCB();
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );
      if (onErrorCb) onErrorCb();
      console.log('ERROR:', error);
    },
  });
  const mutate = (props: UpdateQAListSignatureProps) => mutation.mutate(props);
  return {...mutation, mutate: mutate};
};
interface GenerateDefectListPdfQueryProp extends BaseAPIProps {
  toggleEnableValue?: boolean;
  onSuccessCb?: Function;
}
const useGenerateDefectListPdfQuery = ({
  showNotification,
  accessToken,
  company,

  onSuccessCb,
}: GenerateDefectListPdfQueryProp) => {
  const mutationKey = ['defect-list-pdf'];

  const defectQuery = useMutation({
    mutationKey,
    mutationFn: (defectListId: string) => {
      let defectURL = `${baseAddress}/defect/defectPdf/${defectListId}/`;
      return axios.get(defectURL, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: res => {
      if (onSuccessCb && res.data.result) onSuccessCb(res.data.result);
      console.log('RESULT DEFECT PDF SERVER:', res.data);
    },
    onError: () => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG',
          'error',
          'fail to get defect detail',
        );
    },
  });
  return defectQuery;
};

interface CreatePdfForAssignee extends BaseAPIProps {
  onSuccessCb?: (responseBase64: string) => void;
}
export interface CreatePdfForAssigneeParam {
  qaListId: string;
  assigneeId: string | null;
  status?: TQAStatus;
}
const useCreateQAPdfForAssigneeQuery = ({
  showNotification,
  accessToken,
  company,

  onSuccessCb,
}: CreatePdfForAssignee) => {
  let defectURL = `${baseAddress}/defect/defect_pdf_with_assignee/`;
  const queryClient = useQueryClient();
  const defectQuery = useMutation({
    mutationKey: getPDFWithAssigneeMutationKey,
    mutationFn: ({qaListId, assigneeId, status}: CreatePdfForAssigneeParam) => {
      let getParams = {
        defect_list: qaListId,
        assignee: assigneeId,
        status,
      };
      return axios.get<{
        result: string;
      }>(defectURL, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
        params: getParams,
      });
    },
    onMutate: variables => {
      queryClient.cancelQueries({
        queryKey: ['defect-list-pdf', variables.qaListId],
      });
    },
    onSuccess: res => {
      if (onSuccessCb && res.data) onSuccessCb(res.data.result);
    },
    onError: () => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG',
          'error',
          'fail to get defect detail',
        );
    },
  });
  return defectQuery;
};
//# QA ITEM
export type TFilterQAItemsQuery = {
  defectListId?: string;
  search?: string;
  assignee?: Contact;
  floor?: 'none' | 'not-none' | IProjectFloor | undefined;
  status?: TQAStatus;
};
interface RetrieveDefectItemQueryProps extends BaseAPIProps {
  filter: TFilterQAItemsQuery;
  onSuccessRetrieveCB?: (data?: QAWithFirstImg) => void;
  enableQuery?: boolean;
}

const useRetrieveQAItemsQuery = ({
  accessToken,
  company,
  filter,
  onSuccessRetrieveCB,
  enableQuery = true,
}: RetrieveDefectItemQueryProps) => {
  const {defectListId, search, assignee, floor, status} = filter;
  const qKey = formQAItemListQKey(filter, company);

  const getParams: any = {};
  if (defectListId) getParams.defect_list = defectListId;
  if (search) getParams.search = search;
  if (assignee) getParams.assignee = assignee.contactId;
  if (floor)
    getParams.floor =
      floor === 'none' || floor === 'not-none' ? floor : floor.floorId;
  getParams.page_size = 25;
  if (status) getParams.status = status;
  let defectURL = `${baseAddress}/defect/defectItems/`;

  const defectQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: defectURL,
    queryFn: async ({pageParam}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<QAWithFirstImg>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company!.companyId,
            },
            params: getParams,
          },
        );

        if (resp) {
          if (onSuccessRetrieveCB) {
            onSuccessRetrieveCB();
          }

          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR useRetrieveQAItemsQuery:', error);
        throw error;
      }
    },
    getNextPageParam: prev => prev.data.next,
    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      defectListId !== undefined &&
      enableQuery,
    retry: 1,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });
  return defectQuery;
};

interface AddDefectItemQueryProps extends BaseAPIProps {
  onSuccessCB?: (newQA?: QA) => void;
  onErrorCB?: Function;
}

const useAddQAItemQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  onErrorCB,
}: AddDefectItemQueryProps) => {
  const {handleAddQAQueryData} = useSetQAQueryData({
    appendPos: 'end',
  });
  const addDefectURL = `${baseAddress}/defect/defectItems/`;
  const mutation = useMutation({
    mutationFn: (data: NewQA) => {
      return axios.post<QAWithFirstImg>(addDefectURL, data, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCB) {
        onSuccessCB(result.data);
      }
      handleAddQAQueryData(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
      if (onErrorCB) onErrorCB(variables);
    },
  });
  const mutate = (data: NewQA) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};

interface UpdateDefectItemQueryProps extends BaseAPIProps {
  onSuccessCB?: (edittedQa: QA) => void;
}
export interface UpdateDefectItemParams
  extends Partial<
      Pick<
        QA,
        | 'assignee'
        | 'assigneeName'
        | 'description'
        | 'dueDate'
        | 'status'
        | 'room'
        | 'floor'
      >
    >,
    Pick<QA, 'defectId'> {}

const useUpdateQAQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
}: UpdateDefectItemQueryProps) => {
  const {handleEditQAQueryData} = useSetQAQueryData({});

  const mutation = useMutation({
    mutationKey: getQAItemListMutationKey('update'),
    mutationFn: ({defectId, ...updateBody}: UpdateDefectItemParams) => {
      const editDefectItemURL = `${baseAddress}/defect/defectItems/${defectId}/`;
      return axios.patch<QA>(editDefectItemURL, updateBody, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      // if (showNotification)
      //   showNotification(
      //     'UPDATED DEFECT ITEM',
      //     'success',
      //     'SUCCESSFULLY UPDATED DATA',
      //   );
      // console.log('RESULT UPDATED:', result.data);
      if (onSuccessCB) {
        onSuccessCB(result.data);
      }
      handleEditQAQueryData(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (updateBody: UpdateDefectItemParams) =>
    mutation.mutate(updateBody);
  return {...mutation, mutate: mutate};
};

export interface DeleteDefectItemQueryProps extends BaseAPIProps {
  onSuccessCB?: Function;
}

const useDeleteQAQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
}: DeleteDefectItemQueryProps) => {
  const mutation = useMutation({
    mutationFn: (qaId: string) => {
      const deleteDefectItemURL = `${baseAddress}/defect/defectItems/${qaId}/`;
      return axios.delete(deleteDefectItemURL, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (showNotification)
        showNotification(
          'DELETED QA ITEM',
          'success',
          'SUCCESSFULLY UPDATED DATA',
        );
      if (onSuccessCB) {
        onSuccessCB();
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (qaId: string) => mutation.mutate(qaId);
  return {...mutation, mutate: mutate};
};

export interface RetrieveFirstQAItemImage extends BaseAPIProps {
  onSuccessCB?: Function;
  qaItem: QA;
}
const useRetrieveQAItemDetail = ({
  showNotification,
  accessToken,
  company,
  qaItem,
  onSuccessCB,
}: RetrieveFirstQAItemImage) => {
  const qKey = formQAItemDetailQKey(qaItem, company);
  let url = `${baseAddress}/defect/defectItems/${qaItem.defectId}/`;

  const firstImgQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      const resp = await axios.get<QAWithFirstImg>(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company!.companyId,
        },
      });

      if (resp) {
        if (onSuccessCB) onSuccessCB();
        return resp;
      } else throw new Error('No data');
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: false,
    staleTime: 0,
    gcTime: 0.5 * 60 * 1000,
    refetchOnMount: true,
    refetchInterval: false,
  });
  return firstImgQuery;
};

//# QA COMMENT
export interface RetrieveQAComment extends BaseAPIProps {
  qaItem: QA;
  onSuccessCB?: Function;
}

const useRetrieveQACommentList = ({
  showNotification,
  accessToken,
  company,
  qaItem,
  onSuccessCB,
}: RetrieveQAComment) => {
  const qKey = formQACommentQKey(qaItem.defectId, company);

  let url = `${baseAddress}/defect/defect_comment/`;
  let getParams = {defect: qaItem.defectId, order_by: '-time_stamp'};
  const qaCommentQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const resp = await axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
          params: getParams,
        });

        if (resp) {
          if (onSuccessCB) onSuccessCB();
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR useRetrieveQACommentList:', error);
        throw error;
      }
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: false,
  });
  return qaCommentQuery;
};

export interface AddQAComment extends BaseAPIProps {
  qaItem: QA;
  onSuccessCB?: (newComment?: QAComment) => void;
}
const useAddQACommentQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  qaItem,
}: AddQAComment) => {
  const {handleAddQAList} = useSetQaCommentQueryData({});
  const addCommentURL = `${baseAddress}/defect/defect_comment/`;
  const mutation = useMutation({
    mutationFn: (data: QAComment) => {
      return axios.post<QAComment>(addCommentURL, data, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCB) {
        onSuccessCB(result.data);
      }
      handleAddQAList(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (data: QAComment) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};

interface IMutateQAComment extends BaseAPIProps {
  qaItem: QA;
  onSuccessCB?: Function;
}

export interface PatchQAComment {
  commentId: string;
  commentText?: string;
  isOfficial?: boolean;
  qaId: string;
}
const useMutateQACommentQuery = ({
  showNotification,
  company,
  onSuccessCB,
  qaItem,
  accessToken,
}: IMutateQAComment) => {
  const {handlePatchQAComment} = useSetQaCommentQueryData({});

  const patch = useMutation({
    mutationFn: ({commentId, ...data}: PatchQAComment) => {
      return axios.patch<QAComment>(
        `${baseAddress}/defect/defect_comment/${commentId}/`,
        data,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId || '',
          },
        },
      );
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCB) {
        onSuccessCB();
      }
      handlePatchQAComment(variables);
    },
    onError: (error, variables, context) => {
      if (showNotification) {
        if (isAxiosError<AxiosBackendErrorReturn>(error)) {
          showNotification(
            `${
              error?.response?.status === 403
                ? 'Unauthorised action'
                : 'Something wrong'
            }`,
            'error',
            String(
              error?.response?.data?.detail ?? 'Failed to add comment',
            ).substring(0, 300),
          );
        } else {
          showNotification(
            'Something Wrong!',
            'error',
            'Failed to add comment',
          );
        }
      }

      console.log('ERROR:', error);
    },
  });

  return {patch};
};
//# QA Image
export interface RetrieveQAImage extends BaseAPIProps {
  qaItem: QA;
  onSuccessCB?: (serverList: QAMedia[]) => void;
}
const useRetrieveQAImageList = ({
  showNotification,
  accessToken,
  company,
  qaItem,
  onSuccessCB,
}: RetrieveQAImage) => {
  const qKey = formQAImageQKey(qaItem.defectId, company);

  let url = `${baseAddress}/defect/defect_image/`;
  let getParams = {defect: qaItem.defectId};
  const qaCommentQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const resp = await axios.get<{results: QAMedia[]}>(url, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
          params: getParams,
        });
        if (resp) {
          if (onSuccessCB) onSuccessCB(resp.data.results);
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR useRetrieveQAImageList:', error);
        throw error;
      }
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: false,

    staleTime: 0,
    gcTime: 4 * 60 * 1000,
    refetchOnMount: false,
    refetchInterval: 5 * 60 * 1000,
  });
  return qaCommentQuery;
};

export interface AddMultiQAImage extends BaseAPIProps {
  qaItem: QA;
  onSuccessCB?: (returnedData: QAMedia[]) => void;
}
interface AddMultiQAImageResponse {
  images: QAMedia[];
  errors: any;
}
const useAddMultiQAImageQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  qaItem,
}: AddMultiQAImage) => {
  const queryClient = useQueryClient();
  let formData = new FormData();
  formData.append('company', qaItem.company);
  formData.append('defectList', qaItem.defectList);
  formData.append('project', qaItem.project);
  formData.append('defect', qaItem.defectId);

  const addDefectURL = `${baseAddress}/defect/multi_add_defect_image/`;
  const mutation = useMutation({
    mutationFn: (dataList: QAMedia[]) => {
      //!IMPORTANT: the order adding defect and file need to be exactly same order to not messing up add
      dataList.forEach(data => {
        formData.append('defectImages', JSON.stringify(data));
        formData.append('files', {
          uri: data.imagePath,
          name: `${data.imageName}`,
          type: data.imageType,
        });
      });

      return axios.post<AddMultiQAImageResponse>(addDefectURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onMutate: () => {
      const qKey = formQAImageQKey(qaItem.defectId, company);
      queryClient.cancelQueries({queryKey: qKey});
    },
    onSuccess: (result, variables, context) => {
      if (onSuccessCB) {
        onSuccessCB(result.data.images);
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (data: QAMedia[]) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};

export interface BackgroundAddMultiQAImageQueryProps extends BaseAPIProps {
  onSuccessCB?: (returnedData: QAMedia[]) => void;
  onErrorCb?: (errorImages?: LocalQAImage[]) => void;
}
interface AddMultiQAImageResponse {
  images: QAMedia[];
  errors: any;
}

const useBackgroundAddMultiQAImageQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  onErrorCb,
}: BackgroundAddMultiQAImageQueryProps) => {
  const addDefectURL = `${baseAddress}/defect/multi_add_defect_image/`;
  const mutation = useMutation({
    mutationKey: addBackgroundQAImageMutatingKey,
    mutationFn: ({qa, qaImages}: QABatchPendingUpload) => {
      let formData = new FormData();
      formData.append('company', qa.company);
      formData.append('defectList', qa.defectList);
      formData.append('project', qa.project);
      formData.append('defect', qa.defectId);
      //!IMPORTANT: the order adding defect and file need to be exactly same order to not messing up add
      qaImages.forEach(data => {
        formData.append('defectImages', JSON.stringify(data));

        formData.append('files', {
          uri:
            Platform.OS === 'ios' ? data.imagePath : 'file://' + data.imagePath,
          name: `${data.imageName.replace('#', '-')}`,
          type: 'image/jpg',
        });
      });

      return axios.post<AddMultiQAImageResponse>(addDefectURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCB) {
        onSuccessCB(result.data.images);
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );
      if (onErrorCb) onErrorCb(variables.qaImages);
      console.log('ERROR:', error);
    },
  });
  const mutate = (data: QABatchPendingUpload) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};
export interface DeleteQAImageQuery extends BaseAPIProps {
  onSuccessCb?: (qaImage: QAMedia) => void;
}

const useDeleteQAImageQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCb,
}: DeleteQAImageQuery) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (item: QAMedia) => {
      const deleteURL = `${baseAddress}/defect/delete_defect_image/${item.imageId}/`;
      const qKey = ['qa-image', company?.companyId, item.defect];
      queryClient.cancelQueries({queryKey: qKey});
      return axios.delete(deleteURL, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCb) {
        if (variables) onSuccessCb(variables);
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (item: QAMedia) => mutation.mutate(item);
  return {...mutation, mutate: mutate};
};
//# VIDEO
export interface RetrieveQAVideo extends BaseAPIProps {
  qaItem: QA;
  onSuccessCB?: (serverList: QAVideo[]) => void;
}
const useRetrieveQAVideoList = ({
  showNotification,
  accessToken,
  company,
  qaItem,
  onSuccessCB,
}: RetrieveQAVideo) => {
  const qKey = formQAVideoQKey(qaItem.defectId, company);

  let url = `${baseAddress}/defect/file/`;
  let getParams = {defect: qaItem.defectId};
  const qaCommentQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const resp = await axios.get<{results: QAVideo[]}>(url, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
          params: getParams,
        });

        if (resp) {
          if (onSuccessCB) onSuccessCB(resp.data.results);
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR useRetrieveQAVideoList:', error);
        throw error;
      }
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnMount: false,
    refetchInterval: 5 * 60 * 1000,
  });
  return qaCommentQuery;
};

export interface IBgUploadQAVideoParams {
  uploadData: IBgVideoUploadData;
  postSuccessHandler?: (serverReturned: QAVideo) => void;
  postErrorHandler?: (
    uploadData: IBgVideoUploadData,
    errorMessage?: string,
  ) => void;
}
export interface IBGUploadQAVideoMutateProps extends BaseAPIProps {
  onSuccessAddVideo?: (serverVideo?: QAVideo) => void;
}
const useBgUploadQAVideoQuery = ({
  showNotification,
  accessToken,
  company,

  onErrorCb,
  onSuccessAddVideo,
}: IBGUploadQAVideoMutateProps) => {
  const addDefectURL = `${baseAddress}/defect/file/`;
  const mutation = useMutation({
    mutationKey: qaBGVideoUploadMutationKey,
    mutationFn: ({uploadData}: IBgUploadQAVideoParams) => {
      let formData = new FormData();
      formData.append('fileId', uploadData.videoId);
      formData.append('defect', uploadData.hostId);
      if (uploadData.thumbnailPath)
        formData.append('thumbnail', {
          uri: uploadData.thumbnailPath,
          type: 'image/jpeg',
          name: `thumb-${uploadData.videoFile.name}`,
        } as TAPIServerFile);
      formData.append('file', uploadData.videoFile);
      return axios.post<QAVideo>(addDefectURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (variables.postSuccessHandler)
        variables.postSuccessHandler(result.data);
      if (onSuccessAddVideo) onSuccessAddVideo(result.data);
    },
    onError: (error, variables, context) => {
      if (variables.postErrorHandler)
        variables.postErrorHandler(
          variables.uploadData,
          isAxiosError(error) && error.response && error.response.status === 413
            ? 'File too large'
            : undefined,
        );
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );
      if (onErrorCb) onErrorCb();
      console.log('ERROR:', error);
    },
  });
  const mutate = (data: IBgUploadQAVideoParams) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};

export interface DeleteQAVideoQuery extends BaseAPIProps {
  onSuccessCb?: (qaVideo?: QAVideo) => void;
}

const useDeleteQAVideoQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCb,
}: DeleteQAVideoQuery) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (item: QAVideo) => {
      const deleteURL = `${baseAddress}/defect/file/${item.fileId}/`;
      const qKey = formQAVideoQKey(item.defect, company);
      queryClient.cancelQueries({queryKey: qKey});
      return axios.delete(deleteURL, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (onSuccessCb) {
        if (variables) onSuccessCb(variables);
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (item: QAVideo) => mutation.mutate(item);
  return {...mutation, mutate: mutate};
};

//# QA Markup

export interface UpdateQAImageWithMarkup extends BaseAPIProps {
  onSuccessCB?: (prevData?: UpdateQAImageWithMarkupProps) => void;
}
export interface UpdateQAImageWithMarkupProps {
  qaImage: QAMedia;
  newUriPath: string;
}
const useUpdateQAImageWithMarkupQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
}: UpdateQAImageWithMarkup) => {
  const updateImgURL = `${baseAddress}/defect/update_image_markup/`;
  const mutation = useMutation({
    mutationFn: (props: UpdateQAImageWithMarkupProps) => {
      const {qaImage, newUriPath} = props;
      let formData = new FormData();
      formData.append('imageId', qaImage.imageId);

      formData.append('files', {
        uri: Platform.OS === 'ios' ? newUriPath : 'file://' + newUriPath,
        name: `${qaImage.imageName}-markup`,
        type: qaImage.imageType,
      });

      return axios.post(updateImgURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      //   if (showNotification)
      //     showNotification(
      //       'ADDED DEFECT ITEM',
      //       'success',
      //       'SUCCESSFULLY UPDATED DATA',
      //     );

      if (onSuccessCB) {
        onSuccessCB(variables);
      }
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', error);
    },
  });
  const mutate = (props: UpdateQAImageWithMarkupProps) =>
    mutation.mutate(props);
  return {...mutation, mutate: mutate};
};
export interface RetrieveQAImageMarkup extends BaseAPIProps {
  qaImage: LocalQAImage;
  onSuccessCB?: (
    serverList: Array<
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
    >,
  ) => void;
  enableQuery?: boolean;
}
const useRetrieveQAImageMarkupList = ({
  showNotification,
  accessToken,
  company,
  qaImage,
  onSuccessCB,
  enableQuery,
}: RetrieveQAImageMarkup) => {
  const qKey = formQAImageMarkupQKey(qaImage.imageId, company);

  let url = `${baseAddress}/defect/defect_image_markup/`;
  let getParams = {defect_image: qaImage.imageId};

  const qaCommentQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      const resp = await axios.get<
        Array<
          | QAMarkupRectangle
          | QAMarkupCircle
          | QAMarkupStraightLine
          | QAMarkupLabel
          | QAMarkupArrow
        >
      >(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company!.companyId,
        },
        params: getParams,
      });

      if (resp) {
        if (onSuccessCB) onSuccessCB(resp.data);
        return resp;
      } else throw new Error('No data');
    },
    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      enableQuery &&
      qaImage.status === 'success',
    retry: false,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
  return qaCommentQuery;
};

export interface UpdateQAImageMarkup extends BaseAPIProps {
  onSuccessCB?: (props: {
    successList: Array<
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    >;
    qaImage: QAMedia;
  }) => void;
}
interface UpdateQAImageMarkupProps {
  qaImage: QAMedia;
  markupList: Array<
    | QAMarkupRectangle
    | QAMarkupCircle
    | QAMarkupStraightLine
    | QAMarkupLabel
    | QAMarkupArrow
    | QAMarkupPath
  >;
}
const useUpdateQAImageMarkupQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCB,
  onErrorCb,
}: UpdateQAImageMarkup) => {
  const queryClient = useQueryClient();
  const updateImgURL = `${baseAddress}/defect/markup_update/`;
  const mutation = useMutation({
    mutationFn: ({qaImage, markupList}: UpdateQAImageMarkupProps) => {
      let formData = new FormData();
      formData.append('imageId', qaImage.imageId);
      markupList.forEach(data => {
        formData.append('markups', JSON.stringify(data));
      });

      return axios.post(updateImgURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      //   if (showNotification)
      //     showNotification(
      //       'ADDED DEFECT ITEM',
      //       'success',
      //       'SUCCESSFULLY UPDATED DATA',
      //     );

      if (onSuccessCB) {
        onSuccessCB({
          successList: result.data,
          qaImage: variables.qaImage,
        });
      }
      const qKey = formQAImageMarkupQKey(variables.qaImage.imageId, company);
      queryClient.invalidateQueries({queryKey: qKey});
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );
      if (onErrorCb) onErrorCb();
      console.log('ERROR:', error);
    },
  });
  const mutate = (props: UpdateQAImageMarkupProps) => mutation.mutate(props);
  return {...mutation, mutate: mutate};
};
//***************** DEFECT QUERY HELPER FUNCTIONS ************* */
//# QA LIST
export const formQAListQueryKey = (
  filter: FilterGetQAListQuery,
  company: Company | undefined,
) => {
  let qKey = ['defect-list'];
  const {projectId, searchText, docketId, order_by} = filter;
  if (company) qKey.push(company.companyId);
  if (projectId) qKey.push(projectId);
  if (docketId) qKey.push(docketId);
  if (searchText) qKey.push(searchText);
  if (order_by) {
    order_by.forEach(order => qKey.push(`order_by=${order}`));
  }
  return qKey;
};

export const formDefectListDetailQKey = (
  defectListId: string,

  company: Company | undefined,
  assignee?: string,
) => {
  let defectListDetailQKey = ['qa-list-detail'];
  if (company) defectListDetailQKey.push(company.companyId);
  if (assignee) defectListDetailQKey.push(`assignee:${assignee}`);
  defectListDetailQKey.push(defectListId);
  return defectListDetailQKey;
};

//#QA ITEM

export const formQAItemListQKey = (
  filter: TFilterQAItemsQuery,
  company: Company | undefined,
) => {
  let qKey = ['qa-item-list'];
  const {defectListId, search, assignee, floor, status} = filter;
  if (company) qKey.push(company.companyId);
  qKey.push(`defectList:${defectListId}`);
  if (search) qKey.push(`search:${search}`);
  if (assignee) qKey.push(`assignee:${assignee.contactId}`);
  if (floor)
    qKey.push(
      `floor:${
        floor === 'none' || floor === 'not-none' ? floor : floor.floorId
      }`,
    );
  if (status) qKey.push(`status:${status}`);
  return qKey;
};

export const formQAItemDetailQKey = (
  qaItem: QA,
  company: Company | undefined,
) => {
  const baseQKey = ['qa-item-detail'];
  if (company) baseQKey.push(company.companyId);
  baseQKey.push(qaItem.defectId);

  return baseQKey;
};

export const getQAItemListMutationKey = (
  action: 'add' | 'update' | 'delete',
) => [`${action}-qa-item`];
//# QA COMMENT
export const formQACommentQKey = (
  qaId: string,
  company: Company | undefined,
) => {
  let baseQKey = ['qa-comment'];
  if (company) baseQKey.push(company.companyId);
  baseQKey.push(`qa-${qaId}`);
  return baseQKey;
};

//# QA IMAGE
export const formQAImageQKey = (
  qaItemId: string,
  company: Company | undefined,
) => {
  let baseQKey = ['qa-image'];
  if (company) baseQKey.push(company.companyId);
  baseQKey.push(qaItemId);
  return baseQKey;
};
//# QA VIDEO
export const formQAVideoQKey = (
  qaItemId: string,
  company: Company | undefined,
) => {
  let baseQKey = ['qa-video'];
  if (company) baseQKey.push(company.companyId);
  baseQKey.push(qaItemId);
  return baseQKey;
};
//# QA Markup
export const formQAImageMarkupQKey = (
  qaImageId: string,
  company: Company | undefined,
) => {
  let baseQKey = ['qa-image-markup'];
  if (company) baseQKey.push(company.companyId);
  baseQKey.push(`image:${qaImageId}`);
  return baseQKey;
};

export const addBackgroundQAImageMutatingKey = ['qaImage-add-mutation'];

export const qaBGVideoUploadMutationKey = ['qaVideo-add-mutation'];

export const getPDFWithAssigneeMutationKey = [
  'qa-pdf-width-assignee-add-mutation',
];
//************************************************************* */
const QAQueryAPI = {
  useRetrieveQAListQuery,
  useAddQAListQuery,
  useDeleteQAListQuery,
  useRetrieveQAItemsQuery,
  useAddQAItemQuery,

  useGenerateDefectListPdfQuery,
  useUpdateQAListQuery,
  useUpdateQAQuery,
  useDeleteQAQuery,
  useRetrieveQAListDetailQuery,
  useRetrieveQAItemDetail,
  useRetrieveQACommentList,
  useAddQACommentQuery,
  useRetrieveQAImageList,
  useAddMultiQAImageQuery,
  useDeleteQAImageQuery,
  useRetrieveQAImageMarkupList,
  useUpdateQAImageWithMarkupQuery,
  useUpdateQAImageMarkupQuery,
  useUpdateQAListSignatureQuery,
  useCreateQAPdfForAssigneeQuery,
  useBackgroundAddMultiQAImageQuery,
  useBgUploadQAVideoQuery,
  useRetrieveQAVideoList,
  useDeleteQAVideoQuery,
  useMutateQACommentQuery,
};

export default QAQueryAPI;
