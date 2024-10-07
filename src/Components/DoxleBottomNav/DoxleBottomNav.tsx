import {Platform} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {StyledDoxleBottomNavContainer} from './StyledComponentDoxleBottomNav';
import {useOrientation} from '../../../Providers/OrientationContext';

import {shallow} from 'zustand/shallow';

import MainNavSection from './MainNavSection';
import {
  NavbarPosition,
  useNavigationMenuStore,
} from '../../../GeneralStore/useNavigationMenuStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
type Props = {
  navOriginalPosition?: NavbarPosition;
};

const DoxleBottomNav = ({navOriginalPosition = 'bottom'}: Props) => {
  const {THEME_COLOR, theme} = useDOXLETheme() as IDOXLEThemeProviderContext;
  const {deviceSize, deviceType} = useOrientation();
  const {
    setNavBarSearchValueText,
    setNavBarPosition,
    navBarPosition,
    setNavBarHeight,
  } = useNavigationMenuStore(
    state => ({
      setNavBarSearchValueText: state.setNavBarSearchValueText,
      setNavBarPosition: state.setNavBarPosition,

      navBarPosition: state.navBarPosition,

      addBtnFnc: state.addBtnFnc,
      setNavBarHeight: state.setNavBarHeight,
    }),
    shallow,
  );

  const navBarHeight = useMemo(
    () => (deviceType === 'Smartphone' ? 100 : 120),
    [deviceType],
  );

  useEffect(() => {
    setNavBarHeight(navBarHeight);
  }, [navBarHeight]);

  const getInitialNavPos = async () => {
    const lastPos = await AsyncStorage.getItem('lastNavPos');
    if (lastPos) setNavBarPosition(lastPos as NavbarPosition);
  };

  useEffect(() => {
    getInitialNavPos();
  }, []);

  return (
    <StyledDoxleBottomNavContainer
      $position={navBarPosition}
      $currentTheme={theme}
      $height={
        navBarPosition === 'top'
          ? navBarHeight
          : navBarHeight + deviceSize.insetBottom
      }
      style={{
        paddingTop:
          Platform.OS === 'ios'
            ? navBarPosition === 'top'
              ? deviceSize.insetTop
              : 0
            : 8,
        paddingBottom:
          Platform.OS === 'ios'
            ? navBarPosition === 'bottom'
              ? deviceSize.insetBottom
              : 0
            : 8,
        bottom:
          Platform.OS === 'ios'
            ? navBarPosition === 'bottom'
              ? deviceSize.insetBottom
              : undefined
            : undefined,
      }}
      $themeColor={THEME_COLOR}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={8}>
      <MainNavSection />
    </StyledDoxleBottomNavContainer>
  );
};

export default DoxleBottomNav;
