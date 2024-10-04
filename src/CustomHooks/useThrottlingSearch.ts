import {StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';

type Props = {
  controlledValue: string;
  delayTime?: number;
  onThrottleChange?: (value: string) => void;
};

interface ThrottlingSearch {
  searchThrottleValue: string;
}
const useThrottlingSearch = ({
  controlledValue,
  delayTime = 300,
  onThrottleChange,
}: Props): ThrottlingSearch => {
  const [searchThrottleValue, setSearchThrottleValue] =
    useState(controlledValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchThrottleValue(controlledValue);
      if (onThrottleChange) onThrottleChange(controlledValue);
    }, delayTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [controlledValue]);

  return {
    searchThrottleValue,
  };
};

export default useThrottlingSearch;

const styles = StyleSheet.create({});
