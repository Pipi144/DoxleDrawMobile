//!-------- > QUERY KEYS < -----------
//* ["simple-projects", companyId] => require "projects-timeline" and pass in companyId to retrieve projects for timeline
//!-----------------------------------

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios, {isAxiosError} from 'axios';
import {Company} from '../../../Models/company';
import {baseAddress} from '../../../../settings';
import {IFullProject, NewProject, Project} from '../../../Models/project';

import {Docket} from '../../../Models/docket';
import useSetProjectQueryData from '../../../CustomHooks/SetQueryDataHooks/useSetProjectQueryData';
import {BaseAPIProps} from '../../../Models/basedAPIProps';
import {
  AxiosBackendErrorReturn,
  AxiosInfiniteReturn,
} from '../../../Models/axiosReturn';
export type TProjectType = 'noticeboard' | 'budget';
export interface FilterGetProjectQuery {
  searchText?: string | null;
  view: TProjectType;
}
interface RetrieveFullProjectListQuery extends BaseAPIProps {
  onSuccessCb?: (data: IFullProject[]) => void;
  enable?: boolean;
  filter: FilterGetProjectQuery;
}

const useRetrieveFullProjectListQuery = ({
  onSuccessCb,
  enable,
  showNotification,
  company,

  filter,
  accessToken,
}: RetrieveFullProjectListQuery) => {
  const {searchText, view} = filter;
  const qKey = formFullProjectListQKey(company, filter);
  let projectURL = `${baseAddress}/project/?page=1`;
  const getParams: any = {view};
  // if (company) getParams.company = company?.companyId;
  if (searchText) getParams.search = searchText;
  const projectQuery = useInfiniteQuery(
    qKey,
    ({pageParam = projectURL}) =>
      axios.get<AxiosInfiniteReturn<IFullProject>>(pageParam, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId ?? '',
        },
        params: getParams,
      }),
    {
      enabled: Boolean(company && (enable || true)),
      // retry: 1,
      // staleTime: Infinity,
      staleTime: 15 * 60 * 1000,
      cacheTime: 20 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,

      getNextPageParam: prevData => prevData.data?.next,
      onSuccess: res => {
        if (onSuccessCb)
          onSuccessCb(
            res.pages.reduce((acc, data) => {
              return acc.concat(data.data.results);
            }, [] as IFullProject[]),
          );
      },
      onError: error => {
        // if (showNotification) {
        //   if (isAxiosError<AxiosBackendErrorReturn>(error)) {
        //     showNotification(
        //       `${error?.response?.status ?? 'ERROR'}: ${
        //         error.response?.data.detail ?? 'UNKNOWN ERROR'
        //       }`,
        //       'error',
        //       String(
        //         error?.response?.data?.detail ?? 'Failed to get project list',
        //       ).substring(0, 300),
        //     );
        //   } else {
        //     showNotification(
        //       'Something Wrong!',
        //       'error',
        //       'Failed to get project list',
        //     );
        //   }
        // }
      },
    },
  );
  return projectQuery;
};
interface RetrieveSimpleProjectQueryProps extends BaseAPIProps {
  onSuccessCB?: Function;
  searchText?: string;
}
const useRetrieveSimpleProjectQuery = ({
  company,
  accessToken,
  showNotification,
  onSuccessCB,
  searchText,
}: RetrieveSimpleProjectQueryProps) => {
  const qKey = formRetrieveSimpleProjectQKey(company, searchText);

  const projectQuery = useQuery(
    qKey,
    () => {
      let getParams: any = {};
      if (company) getParams.company = company.companyId;
      if (searchText) getParams.search = searchText;
      console.log('FETCHING PROJECT');
      return axios.get(baseAddress + '/project/simple/', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId ?? '',
        },
        params: getParams,
      });
    },
    {
      enabled: company !== undefined && accessToken !== undefined,
      retry: 1,
      cacheTime: 20 * 60 * 1000,
      refetchOnMount: false,
      staleTime: 10 * 60 * 1000,
      refetchInterval: false,
      onSuccess: res => {
        if (onSuccessCB) onSuccessCB(res.data.results);
      },

      onError: () => {
        // if (showNotification)
        //   showNotification(
        //     'SOMETHING WRONG',
        //     'error',
        //     'fail to fetch projects',
        //   );
      },
    },
  );
  return projectQuery;
};

const usePrefetchProjectQuery = ({
  company,
  accessToken,
  showNotification,
  onSuccessCB,
  searchText,
}: RetrieveSimpleProjectQueryProps) => {
  const qKey = formRetrieveSimpleProjectQKey(company, searchText);
  const queryClient = useQueryClient();
  const projectQuery = queryClient.prefetchQuery(qKey, () => {
    let getParams: any = {};
    if (company) getParams.company = company.companyId;
    if (searchText) getParams.search = searchText;
    return axios.get(baseAddress + '/project/simple/', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'User-Company': company?.companyId ?? '',
      },
      params: getParams,
    });
  });
  return projectQuery;
};
export interface IUpdateProjectQueryProps {
  projectId: string;

  updateData: Partial<IFullProject>;
}

interface UpdateProjectQueryProps extends BaseAPIProps {
  searchText?: string;
  onSuccessUpdateCb?: (newProject?: IFullProject) => void;
}
const useUpdateProjectQuery = ({
  showNotification,
  company,
  accessToken,
  searchText,
  onSuccessUpdateCb,
}: UpdateProjectQueryProps) => {
  const {handleUpdateProjectQueryData} = useSetProjectQueryData({searchText});
  const mutation = useMutation({
    mutationKey: getProjectMutationKey('update'),
    mutationFn: async ({updateData, projectId}: IUpdateProjectQueryProps) => {
      let body: any = {};
      if (updateData.siteAddress) {
        body.siteAddress = updateData.siteAddress;
      }
      if (updateData.contractPrice) {
        body.contractPrice = updateData.contractPrice;
      }
      // if (updateData.budget) {
      //   body.budget = updateData.budget;
      // }
      if (updateData.startDate) {
        body.startDate = updateData.startDate;
      }
      if (updateData.endDate) {
        body.endDate = updateData.endDate;
      }
      if (updateData.ownerName) {
        body.ownerName = updateData.ownerName;
      }
      if (updateData.ownerAbn) {
        body.ownerAbn = updateData.ownerAbn;
      }
      if (updateData.ownerEmail) {
        body.ownerEmail = updateData.ownerEmail;
      }
      if (updateData.ownerPhone) {
        body.ownerPhone = updateData.ownerPhone;
      }
      if (updateData.projectPrefix) {
        body.projectPrefix = updateData.projectPrefix;
      }
      if (updateData.trackingId) {
        body.trackingId = updateData.trackingId;
      }
      return axios.patch<IFullProject>(
        baseAddress + '/project/' + projectId + '/',
        body,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId || '',
          },
        },
      );
    },
    onSuccess: (result, variables, context) => {
      handleUpdateProjectQueryData(result.data);
      if (showNotification) showNotification('Project Updated', 'success');

      if (onSuccessUpdateCb) onSuccessUpdateCb(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification('SOMETHING WRONG!', 'error', 'Fail To update spec');
    },
  });
  const mutate = (data: IUpdateProjectQueryProps) => mutation.mutate(data);
  return {...mutation, mutate};
};

interface AddProjectQueryProps extends BaseAPIProps {
  searchText?: string;
  onSuccessCb?: (newProject?: Project) => void;
}

const useAddProjectQuery = ({
  showNotification,
  accessToken,
  company,
  searchText,
  onSuccessCb,
}: AddProjectQueryProps) => {
  const {handleAddProjectQueryData} = useSetProjectQueryData({searchText});
  const mutation = useMutation({
    mutationKey: getProjectMutationKey('add'),
    mutationFn: async (newProject: NewProject) => {
      return axios.post<Project>(baseAddress + '/project/', newProject, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      if (showNotification) showNotification('Project Updated', 'success');
      handleAddProjectQueryData(result.data);
      if (onSuccessCb) onSuccessCb(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification('SOMETHING WRONG!', 'error', 'Fail To update spec');
    },
  });
  const mutate = (newProject: NewProject) => mutation.mutate(newProject);
  return {...mutation, mutate};
};

interface DeleteProjectQueryProps extends BaseAPIProps {
  searchText?: string;
  onSuccessCb?: (deletedId?: string) => void;
}

const useDeleteProjectQuery = ({
  showNotification,
  accessToken,
  company,
  searchText,
  onSuccessCb,
}: DeleteProjectQueryProps) => {
  const {handleDeleteProjectQueryData} = useSetProjectQueryData({searchText});
  const mutation = useMutation({
    mutationKey: getProjectMutationKey('delete'),
    mutationFn: async (deletedProjectId: string) => {
      return axios.delete(baseAddress + `/project/${deletedProjectId}/`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      if (showNotification) showNotification('Project Deleted', 'success');
      handleDeleteProjectQueryData(variables);
      if (onSuccessCb) onSuccessCb(variables);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification('SOMETHING WRONG!', 'error', 'Fail To update spec');
    },
  });
  const mutate = (deletedProjectId: string) =>
    mutation.mutate(deletedProjectId);
  return {...mutation, mutate};
};

export interface FilterRetrieveProjectListWithDockets {
  view?: 'Inbox';
  due?: 'today' | 'week' | 'month';
  archived?: boolean;
  searchText?: string;
}

interface RetrieveProjectsListWithDockets extends BaseAPIProps {
  onSuccessCb?: Function;
  filter: FilterRetrieveProjectListWithDockets;
  enable?: boolean;
}
export interface ResponseSuccessRetrieveProjectsListWithDockets {
  projectId: string | null;
  siteAddress: string;
  data: Docket[];
  docketCount: number;
}

const useRetrieveProjectListWithDockets = ({
  company,
  accessToken,
  showNotification,
  onSuccessCb,
  filter,
  enable,
}: RetrieveProjectsListWithDockets) => {
  const {view, searchText, due, archived} = filter;
  const qKey = formRetrieveProjectListWithDocketsQKey(filter, company);
  const projectQuery = useQuery(
    qKey,
    () => {
      let getParams: any = {};
      if (view) getParams.view = view;
      if (searchText) getParams.search = searchText;
      if (due) getParams.due = due;
      if (archived !== undefined) getParams.archived = archived;
      return axios.get<ResponseSuccessRetrieveProjectsListWithDockets[]>(
        baseAddress + '/project/project_with_dockets/',
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId ?? '',
          },
          params: getParams,
        },
      );
    },
    {
      enabled:
        company !== undefined && accessToken !== undefined && (enable ?? true),
      retry: 1,
      refetchInterval: 5 * 60 * 1000,
      staleTime: 4 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      refetchOnMount: true,
      onSuccess: res => {
        if (onSuccessCb) onSuccessCb();
      },
      onError: () => {
        // if (showNotification)
        //   showNotification(
        //     'SOMETHING WRONG',
        //     'error',
        //     'fail to fetch projects',
        //   );
      },
    },
  );
  return projectQuery;
};

//******** PROJECT HELPER FuNCTIONS ******** */
export const formRetrieveProjectListWithDocketsQKey = (
  filter: FilterRetrieveProjectListWithDockets,
  company: Company | undefined,
) => {
  const baseQKey = ['project-list-with-dockets'];
  if (company) baseQKey.push(company.companyId);
  if (filter.view) baseQKey.push(filter.view);
  if (filter.searchText) baseQKey.push(filter.searchText);
  if (filter.due) baseQKey.push(filter.due);
  if (filter.archived) baseQKey.push(`archived:${filter.archived}`);
  return baseQKey;
};

export const formRetrieveSimpleProjectQKey = (
  company: Company | undefined,
  searchText?: string,
) => {
  const baseQKey = ['simple-projects'];
  if (company) baseQKey.push(company.companyId);
  if (searchText) baseQKey.push(searchText);

  return baseQKey;
};
export const formFullProjectListQKey = (
  company: Company | undefined,
  filter: FilterGetProjectQuery,
) => {
  const baseQKey = ['full-detail-projects'];

  const {searchText, view} = filter;
  if (company) baseQKey.push(company?.companyId);
  baseQKey.push(view);
  if (searchText) baseQKey.push(searchText);
  return baseQKey;
};
export const getProjectMutationKey = (action: 'add' | 'update' | 'delete') => [
  `${action}-project`,
];
const ProjectQueryAPI = {
  useUpdateProjectQuery,
  useRetrieveSimpleProjectQuery,
  useRetrieveProjectListWithDockets,
  useAddProjectQuery,
  useDeleteProjectQuery,
  usePrefetchProjectQuery,
  useRetrieveFullProjectListQuery,
};

export default ProjectQueryAPI;
