import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios, {AxiosResponse} from 'axios';

import {produce} from 'immer';
import {User} from '../Models/user';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {baseAddress} from './settings';

export const authQueryKey = ['token-query'];
interface ExchangeRefreshTokenQueryProps
  extends Pick<BaseAPIProps, 'showNotification'> {
  onSuccessCb?: (props: {refreshToken: string}) => void;
  onErrorCb?: Function;
  getStorageExchangeRFToken: () => Promise<string | undefined>;
  enable: boolean;
}
interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
const useExchangeRefreshToken = ({
  onSuccessCb,
  onErrorCb,

  showNotification,
  getStorageExchangeRFToken,
  enable,
}: ExchangeRefreshTokenQueryProps) => {
  const docketQuery = useQuery<AxiosResponse<ITokenResponse, any>>({
    queryKey: authQueryKey,
    queryFn: async () => {
      const storageRefreshToken = await getStorageExchangeRFToken();

      const requestBody: any = {
        grant_type: 'refresh_token',
        client_id: 'b5Y0MqZdwi3NMdaEcJSJWIPSGBm3hr0NTMQT4RUK',
        client_secret:
          'TDOIue9kSmQUXV9JVe4cUHWcRnN7CZdflDGuNir4khFrhwI43pBpYbn3ZM4w2xfY4TK91QApEGT91oeDcz8UVOjYIOVVAKsb2KgzOwYTLwE3AzZdeI5Jh6RnOijeb3tp',
        refresh_token: storageRefreshToken,
      };
      let formBody: string[] = [];
      for (let property in requestBody) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(requestBody[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      const formBodyStr: string = formBody.join('&');
      try {
        const response = await axios.post<ITokenResponse>(
          baseAddress + '/token/',
          formBodyStr,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: '*/*',
            },
          },
        );

        // Call the onSuccess callback passed via meta
        if (onSuccessCb)
          onSuccessCb({refreshToken: response.data.refreshToken});
        return response;
      } catch (error: any) {
        if (onErrorCb) onErrorCb(error);
        // Call the onError callback passed via meta
        throw error;
      }
    },
    retry: 2,
    enabled: enable,
    refetchInterval: 16 * 60 * 1000,
    refetchOnMount: true,
    staleTime: 15 * 60 * 1000, // Optional, adjust as needed
    gcTime: 20 * 60 * 1000, // Cache for 45 minutes
    refetchIntervalInBackground: true, // Optionally set to false if desired
    refetchOnReconnect: true,
  });

  return docketQuery;
};

export interface LoginDetails {
  user: string;
  password: string;
}

interface LoginWithDetailsQueryProp
  extends Partial<Pick<BaseAPIProps, 'showNotification'>> {
  onSuccessCb?: (props: {refreshToken: string}) => void;
}
const useLoginWithDetailsQuery = ({
  showNotification,
  onSuccessCb,
}: LoginWithDetailsQueryProp) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (loginDetail: LoginDetails) => {
      const requestBody: any = {
        grant_type: 'password',
        client_id: 'b5Y0MqZdwi3NMdaEcJSJWIPSGBm3hr0NTMQT4RUK',
        client_secret:
          'TDOIue9kSmQUXV9JVe4cUHWcRnN7CZdflDGuNir4khFrhwI43pBpYbn3ZM4w2xfY4TK91QApEGT91oeDcz8UVOjYIOVVAKsb2KgzOwYTLwE3AzZdeI5Jh6RnOijeb3tp',
        username: loginDetail.user,
        password: loginDetail.password,
      };
      let formBody: string[] = [];
      for (let property in requestBody) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(requestBody[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      const formBodyStr: string = formBody.join('&');
      return axios.post(baseAddress + '/token/', formBodyStr, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      // if (showNotification) showNotification('Project Updated', 'success');
      const refreshToken = result.data.refreshToken;
      if (onSuccessCb) onSuccessCb({refreshToken});
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(authQueryKey, (old: any) => {
        if (old)
          return produce(old, (draft: any) => {
            draft.data.accessToken = undefined;
            draft.data.refreshToken = undefined;
            draft.data.user = undefined;
          });
        else return old;
      });
      if (showNotification)
        showNotification(
          'Incorrect Username Or Password!',
          'error',
          'Please try again',
        );
    },
  });
  const mutate = (loginDetail: LoginDetails) => mutation.mutate(loginDetail);
  return {...mutation, mutate};
};

export const AuthQueryAPI = {
  useExchangeRefreshToken,
  useLoginWithDetailsQuery,
};
interface ITokenControl {
  removeTokenData: () => void;
  invalidateTokenData: () => void;
}
export const useTokenControl = (): ITokenControl => {
  const queryClient = useQueryClient();
  const removeTokenData = () => {
    queryClient.removeQueries({queryKey: authQueryKey});
  };
  const invalidateTokenData = () => {
    const isQueryFetching =
      useIsFetching({queryKey: authQueryKey, exact: true}) > 0;
    if (!isQueryFetching)
      queryClient.invalidateQueries({queryKey: authQueryKey});
  };
  return {
    removeTokenData,
    invalidateTokenData,
  };
};
