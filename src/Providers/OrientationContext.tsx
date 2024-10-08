import {Dimensions} from 'react-native';
import {useEffect, useState, useContext, useMemo} from 'react';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  OrientationType,
  useDeviceOrientationChange,
} from 'react-native-orientation-locker';
import Orientation from 'react-native-orientation-locker';
import {isTablet, isLandscape} from 'react-native-device-info';

export type TMobileDeviceType = 'Tablet' | 'Smartphone';
export interface IOrientation {
  deviceSize: IDeviceSize;
  isPortraitMode: boolean;
  deviceType: TMobileDeviceType;
  // deviceModel: string | undefined;
}
export interface IDeviceSize {
  deviceWidth: number;
  deviceHeight: number;
  insetTop: number;
  insetBottom: number;
}

const OrientationContext = React.createContext({});

const OrientationProvider = (children: any) => {
  //****************Handle Get Orientation informtion************** */
  //!PT-@@@@@ IOS only support portrait right side, both landscape side... but portrait upside down will get error
  const [isPortraitMode, setIsPortraitMode] = useState<boolean>(!isLandscape()); //true: portrait, false: landscape
  const inset = useSafeAreaInsets();

  const [deviceSize, setDeviceSize] = useState<IDeviceSize>({
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
    insetTop: inset.top,
    insetBottom: inset.bottom,
  });
  const [deviceType, setDeviceType] = useState<TMobileDeviceType>(
    isTablet() ? 'Tablet' : 'Smartphone',
  );
  // const [deviceModel, setdeviceModel] = useState<string | undefined>(undefined);
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDeviceSize(prev => ({
          ...prev,
          deviceWidth: window.width,
          deviceHeight: window.height,
        }));

        // if (window.width > window.height) setIsPortraitMode(false);
        // else setIsPortraitMode(true);
      },
    );
    return () => subscription?.remove();
  });

  useEffect(() => {
    setDeviceSize(prev => ({
      ...prev,
      insetBottom: inset.bottom,
      insetTop: inset.top,
    }));
  }, [inset.bottom, inset.top]);

  useDeviceOrientationChange(o => {
    if (
      o === OrientationType.PORTRAIT ||
      o === OrientationType['PORTRAIT-UPSIDEDOWN']
    )
      setIsPortraitMode(true);
    else if (
      o === OrientationType['LANDSCAPE-LEFT'] ||
      o === OrientationType['LANDSCAPE-RIGHT']
    )
      setIsPortraitMode(false);
  });

  useEffect(() => {
    Orientation.getDeviceOrientation(o => {
      if (
        o === OrientationType.PORTRAIT ||
        o === OrientationType['PORTRAIT-UPSIDEDOWN']
      )
        setIsPortraitMode(true);
      else if (
        o === OrientationType['LANDSCAPE-LEFT'] ||
        o === OrientationType['LANDSCAPE-RIGHT']
      )
        setIsPortraitMode(false);
      else setIsPortraitMode(true);
    });
  }, []);

  // const getDeviceModel = async () => {
  //   try {
  //     const result = await DeviceInfo.getDeviceId();
  //     if (result) setdeviceModel(result);
  //   } catch (error) {
  //     console.error('FAIL TO GET MODEL');
  //     return false;
  //   }
  // };
  //******************************************************* */

  const orientationContextValue: IOrientation = {
    deviceSize,
    isPortraitMode: deviceType === 'Smartphone' ? true : isPortraitMode,
    deviceType,
    // deviceModel,
  };
  return (
    <OrientationContext.Provider
      value={orientationContextValue}
      {...children}
    />
  );
};

const useOrientation = () => useContext(OrientationContext) as IOrientation;

export {OrientationProvider, useOrientation};
