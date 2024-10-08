//!PT: Each ref is the notifierRoot placed on each component, to control the notification should show in the selected component by calling ref.current?.showNotification({.....}). Ex: notifierLoginRef.current?.showNotification({.....}).

import {StyleSheet} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import {NotifierRoot} from 'react-native-notifier';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../Components/DesignPattern/Notification/Notification';

export interface INotificationContext {
  notifierLoginRef: React.RefObject<NotifierRoot>;
  notifierRootAppRef: React.RefObject<NotifierRoot>;
  showNotification: (
    message: string,
    messageType: 'success' | 'error',
    extraMessage?: string,
    duration?: number,
    customNotifierRef?: React.RefObject<NotifierRoot>,
  ) => void;
}
interface ICustomNotification {}
const NotificationContext = createContext({});
const NotificationProvider = (children: any) => {
  const notifierLoginRef = useRef<NotifierRoot>(null);
  const notifierRootAppRef = useRef<NotifierRoot>(null);
  //  //************* NOTIFICATION PROVIDER*************** */
  //  const {notifierRootAppRef} = useNotification() as INotificationContext;
  //  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
      duration?: number,
      customNotifierRef?: React.RefObject<NotifierRoot>,
    ) => {
      if (customNotifierRef)
        customNotifierRef.current?.showNotification({
          title: message,
          description: extraMessage,
          Component: Notification,
          queueMode: 'immediate',
          duration: duration || 1000,
          showAnimationDuration: 120,
          hideAnimationDuration: 120,
          componentProps: {
            type: messageType,
          },
          containerStyle: getContainerStyleWithTranslateY,
        });
      else
        notifierRootAppRef.current?.showNotification({
          title: message,
          description: extraMessage,
          Component: Notification,
          queueMode: 'immediate',
          duration: duration || 1000,
          showAnimationDuration: 120,
          hideAnimationDuration: 120,
          componentProps: {
            type: messageType,
          },
          containerStyle: getContainerStyleWithTranslateY,
        });
    },
    [],
  );
  //  //*********************************************** */
  const notificationValue: INotificationContext = useMemo(
    () => ({
      notifierLoginRef,
      notifierRootAppRef,
      showNotification,
    }),
    [notifierLoginRef, notifierRootAppRef],
  );
  return (
    <NotificationContext.Provider value={notificationValue} {...children} />
  );
};
const useNotification = () =>
  useContext(NotificationContext) as INotificationContext;
export {NotificationProvider, useNotification};

const styles = StyleSheet.create({});
