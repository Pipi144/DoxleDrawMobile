import React, {createContext, useContext, useEffect, useState} from 'react';
import NetInfo, {NetInfoStateType} from '@react-native-community/netinfo';
type Props = {};

export interface IInternetConnectionContext {
  isConnectionWeak: boolean;
  networkType: NetInfoStateType | undefined;
  isConnected: boolean;
}

const ConnectionContext = createContext({});
const InternetConnectionProvider = (children: any) => {
  const [networkType, setnetworkType] = useState<NetInfoStateType | undefined>(
    undefined,
  );
  const [isConnected, setisConnected] = useState<boolean>(false);
  const [isConnectionWeak, setisConnectionWeak] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setnetworkType(state.type);
      setisConnected(state.isConnected ? state.isConnected : false);
      if (state.type === 'cellular') {
        if (state.details.isConnectionExpensive) setisConnectionWeak(true);
      }
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);
  // useEffect(() => {
  //   console.log('NETWORK TYPE:', networkType);
  //   if (networkType === 'wifi') {
  //     console.log('WIFI CONNECTED');
  //   }
  // }, [networkType]);
  const connectionValue: IInternetConnectionContext = {
    isConnectionWeak,
    networkType,
    isConnected,
  };
  return <ConnectionContext.Provider {...children} value={connectionValue} />;
};

const useConnection = () =>
  useContext(ConnectionContext) as IInternetConnectionContext;
export {InternetConnectionProvider, useConnection};
