import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import axios from 'axios';
import {AddCompanyInputValue, Company} from '../Models/company';
import {baseAddress} from './settings';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';
import {BaseAPIProps} from '../Models/basedAPIProps';
import useSetCompanyListData from '../QueryDataHooks/useSetCompanyListData';

interface IRetrieveCompanyListQueryProp {
  onSuccessCb?: (companyList: Company[]) => void;
  onErrorCb?: Function;
  accessToken: string | undefined;
  enable?: boolean;
}
const useRetrieveCompanyList = ({
  onSuccessCb,
  accessToken,
  onErrorCb,
  enable,
}: IRetrieveCompanyListQueryProp) => {
  let actionTimelineQKey = getCompanyListQKey();

  let getCompanyUrl = baseAddress + '/company/';

  const companyListQuery = useQuery({
    queryKey: actionTimelineQKey,
    queryFn: async () => {
      try {
        const response = await axios.get<AxiosInfiniteReturn<Company>>(
          getCompanyUrl,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
            params: {ordering: 'name'},
          },
        );
        if (onSuccessCb) onSuccessCb(response.data.results);
        return response;
      } catch (error) {
        if (onErrorCb) onErrorCb(error);
        console.log('Error', error);
      }
    },
    enabled: accessToken !== undefined && (enable ?? true),
    retry: 2,
    retryDelay: 3 * 1000,
    staleTime: 30 * 60 * 1000,
    gcTime: Infinity,
  });

  return companyListQuery;
};
interface IMutateCompanyQueryProps extends BaseAPIProps {
  onSuccessDeleteCb?: (deletedId?: string) => void;
  onSuccessEditCb?: (updatedCompany?: Company) => void;
  onSuccessAddCb?: (addedCom?: Company) => void;
}

const useAddCompany = ({
  company,
  showNotification,
  accessToken,
  onSuccessAddCb,
}: IMutateCompanyQueryProps) => {
  const {handleAddCompany} = useSetCompanyListData({});

  const qKey = getMutateCompanyKey('add');
  let companyURL = `${baseAddress}/company/`;
  const mutation = useMutation({
    mutationKey: qKey,
    mutationFn: async (companyDetails: AddCompanyInputValue) => {
      const formData = new FormData();

      for (const [key, value] of Object.entries(companyDetails)) {
        if (value) formData.append(key, value);
      }
      return axios.post<Company>(companyURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    retry: 1,
    onSuccess: (result, variables, context) => {
      if (showNotification) showNotification(`New Company Saved`, 'success');
      handleAddCompany(result.data);
      if (onSuccessAddCb) onSuccessAddCb(result.data);
    },
    onError: (err: any, variables, context) => {
      console.log('Error', err);
      if (showNotification)
        showNotification(
          `[${err?.response?.status ?? 'ERR'}]Failed To Create Company`,
          'error',
          String(err?.response?.data ?? 'Unknown Error').substring(0, 300),
        );
    },
  });

  const mutate = (companyDetails: AddCompanyInputValue) =>
    mutation.mutate(companyDetails);
  return {...mutation, mutate};
};

const useDeleteCompany = ({
  company,
  showNotification,
  accessToken,
  onSuccessDeleteCb,
}: IMutateCompanyQueryProps) => {
  const {handleDeleteCompany} = useSetCompanyListData({});

  const qKey = getMutateCompanyKey('delete');
  const mutation = useMutation({
    mutationKey: qKey,
    mutationFn: async (companyId: string) => {
      return axios.delete(`${baseAddress}/company/${companyId}/`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
        },
      });
    },
    retry: 1,
    onSuccess: (result, variables, context) => {
      console.log('Success', result);

      if (showNotification) showNotification(`Company Deleted`, 'success');
      if (onSuccessDeleteCb) onSuccessDeleteCb(variables);
      handleDeleteCompany(variables);
    },
    onError: (err: any, variables, context) => {
      console.log('Error', err);
      if (showNotification)
        showNotification(
          `[${err?.response?.status ?? 'ERR'}]Failed To Delete Company`,
          'error',
          String(err?.response?.data ?? 'Unknown Error').substring(0, 300),
        );
    },
  });
  const mutate = (deletedProjectId: string) =>
    mutation.mutate(deletedProjectId);
  return {...mutation, mutate};
};

const useUpdateCompanyQuery = ({
  company,
  showNotification,
  accessToken,
  onSuccessEditCb,
}: IMutateCompanyQueryProps) => {
  const {handleUpdateCompany} = useSetCompanyListData({});
  const qKey = getMutateCompanyKey('update');
  let companyURL = `${baseAddress}/company/${company?.companyId}/`;
  return useMutation({
    mutationKey: qKey,
    mutationFn: async (companyDetails: AddCompanyInputValue) => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(companyDetails)) {
        if (value) formData.append(key, value);
      }
      return axios.patch<Company>(companyURL, formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId ?? '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    retry: 1,
    onSuccess: (result, variables, context) => {
      handleUpdateCompany(result.data);
      if (showNotification) showNotification(`New Company Saved`, 'success');
      if (onSuccessEditCb) onSuccessEditCb(result.data);
    },
    onError: (err: any, variables, context) => {
      console.log('Error', err);
      if (showNotification)
        showNotification(
          `[${err?.response?.status ?? 'ERR'}]Failed To Create Company`,
          'error',
          String(err?.response?.data ?? 'Unknown Error').substring(0, 300),
        );
    },
  });
};

export const getCompanyListQKey = () => {
  return ['company-list'];
};

export const getMutateCompanyKey = (action: 'add' | 'delete' | 'update') => [
  `${action}-company`,
];
const CompanyQueryAPI = {
  useRetrieveCompanyList,
  useDeleteCompany,
  useUpdateCompanyQuery,
  useAddCompany,
};

export default CompanyQueryAPI;
