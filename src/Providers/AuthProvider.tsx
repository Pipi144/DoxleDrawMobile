import React, {createContext, useContext, useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../Models/user';
import {useNotification} from './NotificationProvider';
import useAppState from '../CustomHooks/useAppState';
import {AuthQueryAPI} from '../service/DoxleAPI/QueryHookAPI/authQueryAPI';
import {useQueryClient} from '@tanstack/react-query';

export interface authContextInterface {
  // loginWithDetails: Function;
  // getAccessToken: Function;
  loggedIn: boolean;
  user: User | undefined;
  isCheckingLogInStatus: boolean;
  logOut: () => void;

  accessToken: string | undefined;
  refreshToken: string | undefined;
  isExchangingRefreshToken: boolean;
  setEnableExchangeTokenQuery: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext({});

const AuthProvider = (children: any) => {
  const [enableExchangeTokenQuery, setEnableExchangeTokenQuery] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const checkExpiry = (expiry: number) => {
    try {
      const currentTime = new Date().getTime() / 1000;
      return currentTime < expiry;
    } catch {
      console.error('Error Checking Expiry');
      return false;
    }
  };
  const {showNotification} = useNotification();

  const getStorageRefreshToken = async () => {
    try {
      const storageRefreshToken: string | null = await AsyncStorage.getItem(
        'refreshToken',
      );
      const storageRefreshTokenExpiry: string | null =
        await AsyncStorage.getItem('refreshTokenExpiry');
      const parsedRefreshTokenExpiry: number | undefined =
        storageRefreshTokenExpiry && !isNaN(parseInt(storageRefreshTokenExpiry))
          ? parseInt(storageRefreshTokenExpiry)
          : undefined;
      const refreshTokenIsValid = checkExpiry(
        parsedRefreshTokenExpiry ? parsedRefreshTokenExpiry : 0,
      );
      // console.log(storageRefreshToken);
      // console.log(refreshTokenIsValid);
      if (storageRefreshToken && refreshTokenIsValid) {
        // await exchangeRefreshToken(storageRefreshToken);
        if (!enableExchangeTokenQuery) setEnableExchangeTokenQuery(true);
        return storageRefreshToken;
      } else {
        return undefined;
      }
    } catch (err) {
      console.error(err);

      throw 'Error get storage refresh token';
    }
  };

  useEffect(() => {
    getStorageRefreshToken();
  }, []);

  const clearAuthAsyncStorage = async () => {
    queryClient.clear();

    AsyncStorage.removeItem('refreshToken');
    AsyncStorage.removeItem('refreshTokenExpiry');
    setEnableExchangeTokenQuery(false);
  };

  const onSuccessExchangeRefreshToken = async (props: {
    refreshToken: string;
  }) => {
    // await AsyncStorage.setItem('refreshToken', props.refreshToken);
    let date = new Date();
    let refreshTokenExpire: number =
      Math.floor(date.getTime() / 1000) + 2246400;
    // await AsyncStorage.setItem(
    //   'refreshTokenExpiry',
    //   refreshTokenExpire.toString(),
    // );
    await AsyncStorage.multiSet([
      ['refreshToken', props.refreshToken],
      ['refreshTokenExpiry', refreshTokenExpire.toString()],
    ]);
  };
  const useExchangeRefreshTokenQuery = AuthQueryAPI.useExchangeRefreshToken({
    getStorageExchangeRFToken: getStorageRefreshToken,
    onErrorCb: clearAuthAsyncStorage,
    showNotification,
    onSuccessCb: onSuccessExchangeRefreshToken,
    enable: enableExchangeTokenQuery,
  });

  const queryAccessToken: string | undefined =
    useExchangeRefreshTokenQuery.isSuccess
      ? useExchangeRefreshTokenQuery.data?.data.accessToken
      : undefined;

  const queryRefreshToken: string | undefined =
    useExchangeRefreshTokenQuery.isSuccess
      ? useExchangeRefreshTokenQuery.data?.data.refreshToken
      : undefined;
  const {appState} = useAppState();
  const queryUser: User | undefined =
    useExchangeRefreshTokenQuery.data?.data.user;

  const isLoggedIn: boolean = Boolean(queryAccessToken && queryRefreshToken);

  useEffect(() => {
    if (appState === 'active' && enableExchangeTokenQuery) {
      if (
        useExchangeRefreshTokenQuery.isStale &&
        !useExchangeRefreshTokenQuery.isFetching &&
        useExchangeRefreshTokenQuery.data
      )
        useExchangeRefreshTokenQuery.remove();
    } else if (
      appState === 'background' &&
      useExchangeRefreshTokenQuery.isStale
    ) {
      useExchangeRefreshTokenQuery.remove();
    }
  }, [appState]);

  const authContextValue: authContextInterface = {
    // loginWithDetails,
    // getAccessToken,
    loggedIn: isLoggedIn,
    user: queryUser,
    isCheckingLogInStatus:
      enableExchangeTokenQuery && useExchangeRefreshTokenQuery.isLoading,
    logOut: clearAuthAsyncStorage,

    accessToken: queryAccessToken,
    refreshToken: queryRefreshToken,
    isExchangingRefreshToken: useExchangeRefreshTokenQuery.isFetching,
    setEnableExchangeTokenQuery,
  };
  return <AuthContext.Provider value={authContextValue} {...children} />;
};

const useAuth = () => useContext(AuthContext) as authContextInterface;

export {AuthProvider, useAuth};
