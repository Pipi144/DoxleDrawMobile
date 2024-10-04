import {StyleSheet, Text, View} from 'react-native';
import React, {createContext, useCallback, useContext, useMemo} from 'react';
import {trigger} from 'react-native-haptic-feedback';
type Props = {};

export interface VibrationContextValue {
  shortVibrateTrigger: () => void;
  doubleVibrateTrigger: () => void;
  tickVibrateTrigger: () => void;
}

const VibrationContext = createContext({});
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const VibrationProvider = (children: any) => {
  const shortVibrateTrigger = useCallback(() => {
    trigger('impactLight', options);
  }, []);
  const doubleVibrateTrigger = useCallback(() => {
    trigger('effectDoubleClick', options);
  }, []);
  const tickVibrateTrigger = useCallback(() => {
    trigger('effectTick', options);
  }, []);

  const vibrationContextValue: VibrationContextValue = useMemo(
    () => ({shortVibrateTrigger, doubleVibrateTrigger, tickVibrateTrigger}),
    [],
  );
  return (
    <VibrationContext.Provider {...children} value={vibrationContextValue} />
  );
};
const useVibration = () =>
  useContext(VibrationContext) as VibrationContextValue;
export {VibrationProvider, useVibration};

const styles = StyleSheet.create({});
