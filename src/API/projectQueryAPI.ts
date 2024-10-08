//!-------- > QUERY KEYS < -----------
//* ["simple-projects", companyId] => require "projects-timeline" and pass in companyId to retrieve projects for timeline
//!-----------------------------------

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {IFullProject, NewProject, Project} from '../Models/project';
import {baseAddress} from './settings';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';
import useSetProjectQueryData from '../QueryDataHooks/useSetProjectQueryData';
import {Company} from '../Models/company';

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
  company,

  filter,
  accessToken,
}: RetrieveFullProjectListQuery) => {
  const {searchText, view} = filter;
  const qKey = formFullProjectListQKey(company, filter);
  let projectURL = `${baseAddress}/project/?page=1`;
  const getParams: any = {view};

  if (searchText) getParams.search = searchText;
  const projectQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: projectURL,
    queryFn: async ({pageParam = projectURL}) => {
      try {
        const response = await axios.get<AxiosInfiniteReturn<IFullProject>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company?.companyId ?? '',
            },
            params: getParams,
          },
        );
        console.log('RUN:', onSuccessCb);
        if (onSuccessCb) {
          console.log('onSuccessCb:', onSuccessCb);
          onSuccessCb(response.data.results);
        }
        return response;
      } catch (error) {
        console.log('ERROR useRetrieveFullProjectListQuery:', error);
      }
    },
    enabled:
      company !== undefined && accessToken !== undefined && (enable || true),
    // retry: 1,
    // staleTime: Infinity,
    staleTime: 15 * 60 * 1000,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,

    getNextPageParam: prevData => prevData?.data.next,
  });
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

  const projectQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      let getParams: any = {};
      if (company) getParams.company = company.companyId;
      if (searchText) getParams.search = searchText;
      try {
        const response = await axios.get(baseAddress + '/project/simple/', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId ?? '',
          },
          params: getParams,
        });
        if (onSuccessCB) onSuccessCB(response.data.results);
        return response;
      } catch (error) {
        console.log('ERROR useRetrieveSimpleProjectQuery:', error);
      }
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: 1,
    gcTime: 20 * 60 * 1000,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    refetchInterval: false,
  });
  return projectQuery;
};

const usePrefetchProjectQuery = ({
  company,
  accessToken,
  searchText,
}: RetrieveSimpleProjectQueryProps) => {
  const qKey = formRetrieveSimpleProjectQKey(company, searchText);
  const queryClient = useQueryClient();
  const projectQuery = queryClient.prefetchQuery({
    queryKey: qKey,
    queryFn: async () => {
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
    },
  });
  return projectQuery;
};
export interface IUpdateProjectQueryProps {
  projectId: string;

  updateData: Partial<IFullProject>;
}

interface UpdateProjectQueryProps extends BaseAPIProps {
  onSuccessUpdateCb?: (newProject?: IFullProject) => void;
}
const useUpdateProjectQuery = ({
  showNotification,
  company,
  accessToken,
  onSuccessUpdateCb,
}: UpdateProjectQueryProps) => {
  const {handleUpdateProjectQueryData} = useSetProjectQueryData({});
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
  onSuccessCb?: (newProject?: Project) => void;
}

const useAddProjectQuery = ({
  showNotification,
  accessToken,
  company,

  onSuccessCb,
}: AddProjectQueryProps) => {
  const {handleAddProjectQueryData} = useSetProjectQueryData({});
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
  onSuccessCb?: (deletedId?: string) => void;
}

const useDeleteProjectQuery = ({
  showNotification,
  accessToken,
  company,
  onSuccessCb,
}: DeleteProjectQueryProps) => {
  const {handleDeleteProjectQueryData} = useSetProjectQueryData({});
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

//******** PROJECT HELPER FuNCTIONS ******** */

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
  useAddProjectQuery,
  useDeleteProjectQuery,
  usePrefetchProjectQuery,
  useRetrieveFullProjectListQuery,
};

export default ProjectQueryAPI;
