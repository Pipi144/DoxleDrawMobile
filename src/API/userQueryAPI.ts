import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {baseAddress} from './settings';
import axios from 'axios';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';
import {User} from '../Models/user';

interface GetUserListQueryProps extends BaseAPIProps {
  project?: string; //!filter with project id
  search?: string;
  onSuccessRetrieveCB?: Function;
}

const useGetUserList = ({
  accessToken,
  company,
  project,
  onSuccessRetrieveCB,
  search,
}: GetUserListQueryProps) => {
  const qKey = ['user-list'];
  const getParams: any = {};
  if (company) {
    qKey.push(company.companyId);
    getParams.company = company.companyId;
  }
  if (project !== undefined) {
    qKey.push(project);
    getParams.project = project;
  }
  if (search) {
    qKey.push(search);
    getParams.search = search;
  }
  let userURL = `${baseAddress}/user/?page=1`;

  const defectQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: userURL,
    queryFn: async ({pageParam}) => {
      try {
        const response = await axios.get<AxiosInfiniteReturn<User>>(pageParam, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
          params: getParams,
        });
        if (onSuccessRetrieveCB) onSuccessRetrieveCB(response.data.results);
        return response;
      } catch (error) {}
    },
    enabled: company !== undefined && accessToken !== undefined,
    getNextPageParam: prev => prev?.data.next,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    gcTime: 40 * 60 * 1000,
  });
  return defectQuery;
};

interface GetUserDetailQueryProps extends BaseAPIProps {
  userId: string;
  onSuccessCB?: Function;
}
const userRetrieveUserInfo = ({
  accessToken,
  company,
  userId,
  onSuccessCB,
}: GetUserDetailQueryProps) => {
  const qKey = ['user-info', userId];
  const getParams: any = {};
  if (company) {
    qKey.push(company.companyId);
  }
  let userURL = `${baseAddress}/user/${userId}/`;

  const defectQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const response = await axios.get<User>(userURL, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company!.companyId,
          },
        });
        if (onSuccessCB) onSuccessCB(response.data);

        return response;
      } catch (error) {
        console.log('ERROR:', error as any);
      }
    },
    enabled: company !== undefined && accessToken !== undefined,
    retry: 1,
    staleTime: 0,
  });
  return defectQuery;
};
export interface UpdateUserFields {
  userName?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  signature?: string | null;
}
interface EditUserQueryProps extends BaseAPIProps {
  userId: string;
  onSuccessCB?: Function;
}

const useUpdateUserInfo = ({
  userId,
  showNotification,
  company,
  accessToken,
  onSuccessCB,
}: EditUserQueryProps) => {
  const queryClient = useQueryClient();
  const qKey = ['user-info', userId];
  const addDefectURL = `${baseAddress}/user/${userId}/`;
  const mutation = useMutation({
    mutationFn: (data: UpdateUserFields) => {
      const updateFormData = new FormData();
      Object.keys(data).map(
        key =>
          key !== 'signature' &&
          updateFormData.append(key, data[key as keyof UpdateUserFields]),
      );
      if (data.signature)
        updateFormData.append('signature', {
          name: 'signature.jpeg',
          uri: data.signature,
          type: 'image/jpeg',
        });
      return axios.post(addDefectURL, updateFormData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (showNotification)
        showNotification(
          'Data Updated...',
          'success',
          'SUCCESSFULLY UPDATED DATA',
        );
      console.log('UPDATE USER RESULT:', result.data);

      if (onSuccessCB) {
        if (variables.signature) onSuccessCB(variables.signature);
      }
      queryClient.invalidateQueries({queryKey: qKey});
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
  const mutate = (data: UpdateUserFields) => mutation.mutate(data);
  return {...mutation, mutate: mutate};
};

const UserQueryAPI = {
  useGetUserList,
  useUpdateUserInfo,
  userRetrieveUserInfo,
};
export default UserQueryAPI;
