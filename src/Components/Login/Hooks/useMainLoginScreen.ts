import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useState} from 'react';
import {GestureResponderEvent, Keyboard} from 'react-native';
import {useNotification} from '../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../DesignPattern/Notification/Notification';
import {useAuth} from '../../../Providers/AuthProvider';
import {AuthQueryAPI, LoginDetails} from '../../../API/authQueryAPI';

type Props = {};

interface IMainLoginScreen {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  shouldShowError: boolean;
  handleTextInputChange: (
    inputType: 'email' | 'password',
    value: string,
  ) => void;
  handleSubmitBtn: () => Promise<void>;
  isLoggingIn: boolean;
}
const useMainLoginScreen = (props: Props): IMainLoginScreen => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldShowError, setShouldShowError] = useState(false);
  const {notifierLoginRef} = useNotification();
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
      duration?: number,
    ) => {
      notifierLoginRef.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        duration: duration ?? 800,
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const {setEnableExchangeTokenQuery} = useAuth();
  const onSuccessLoginCb = (props: {refreshToken: string}) => {
    let date = new Date();
    let refreshTokenExpire: number =
      Math.floor(date.getTime() / 1000) + 2246400;

    AsyncStorage.multiSet([
      ['refreshToken', props.refreshToken],
      ['refreshTokenExpiry', refreshTokenExpire.toString()],
    ]);
    setEnableExchangeTokenQuery(false);
    setEnableExchangeTokenQuery(true);
    console.log('SUCCESS LOGIN');
  };
  const useLoginQuery = AuthQueryAPI.useLoginWithDetailsQuery({
    showNotification,
    onSuccessCb: onSuccessLoginCb,
  });
  const handleTextInputChange = useCallback(
    (inputType: 'email' | 'password', value: string) => {
      if (inputType === 'email') {
        setEmail(value);
      } else {
        setPassword(value);
      }
    },
    [],
  );

  const handleSubmitBtn = async (event?: GestureResponderEvent) => {
    event?.stopPropagation();
    if (!password || !email) setShouldShowError(true);
    else {
      Keyboard.dismiss();
      await AsyncStorage.setItem(
        'oldLoginInfo',
        JSON.stringify({
          user: email,
          password: password,
        } as LoginDetails),
      );
      useLoginQuery.mutate({user: email, password: password});
    }
  };

  const handleGetInitialLoginInfo = async () => {
    try {
      const oldLoginInfo = await AsyncStorage.getItem('oldLoginInfo');
      if (oldLoginInfo) {
        const loginInfo = JSON.parse(oldLoginInfo) as LoginDetails;
        setEmail(loginInfo.user);
        setPassword(loginInfo.password);
      }
    } catch (error) {
      console.log('ERROR GET OLD LOG IN INFO');
    }
  };
  //! auto fill initial details => fix back password autofill due to unsafe problem
  useEffect(() => {
    handleGetInitialLoginInfo();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (shouldShowError) setShouldShowError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [shouldShowError]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    shouldShowError,
    handleTextInputChange,
    handleSubmitBtn,
    isLoggingIn: useLoginQuery.isPending,
  };
};

export default useMainLoginScreen;
