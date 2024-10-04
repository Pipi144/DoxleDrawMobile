import {AppState, AppStateStatus, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';

type Props = {};
interface AppStateValue {
  appState: AppStateStatus;
}
const useAppState = (
  handleAppStateChange?: (status: AppStateStatus) => void,
): AppStateValue => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (handleAppStateChange) handleAppStateChange(nextAppState);
        // console.log('Next AppState is: ', nextAppState);
        setAppState(nextAppState);
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  return {
    appState,
  };
};

export default useAppState;

const styles = StyleSheet.create({});
