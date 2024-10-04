import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {usePrevSessionStore} from '../../GeneralStore/usePrevSessionStore';
import {TRgbaFormat} from '../../Utilities/FunctionUtilities';
import {
  BARLOW_FONT,
  INTER_FONT,
  LEXEND_FONT,
  MONO_FONT,
  SERIF_FONT,
  STATIC_MENU_COLOR,
} from './FontColorConstant';
import {useShallow} from 'zustand/react/shallow';
import {useOrientation} from '../OrientationContext';

type Props = {};
export type TDOXLETheme = 'dark' | 'light';
export type TDoxleFontMode = 'default' | 'serif' | 'mono' | 'Inter';
export interface IDoxleStaticMenuColor {
  staticBg: TRgbaFormat;
  staticHover: TRgbaFormat;
  staticWhiteBg: TRgbaFormat;
  staticWhiteFontColor: TRgbaFormat;
  staticBlackFontColor: TRgbaFormat;
  staticDivider: TRgbaFormat;
  staticBoldDivider: TRgbaFormat;
  staticBackdrop: TRgbaFormat;
  staticTextFieldBg: TRgbaFormat;
  confirmBtnColor: TRgbaFormat;
  staticDoxleColor: TRgbaFormat;
  staticTbRowHightlight: TRgbaFormat;
  canvasBgColor: TRgbaFormat;
  staticBorderColorWhiteBg: TRgbaFormat;
  canvasGridLineColor: TRgbaFormat;
  canvasSubMenuBg: TRgbaFormat;
}
export interface IDoxleFontSize {
  pageTitleFontSize: number;
  headTitleTextSize: number;
  contentTextSize: number;
  textInputSize: number;
  subContentTextSize: number;
  errorToggleTextSize: number;
}
export interface IDOXLEThemeProviderContext {
  theme: TDOXLETheme;
  setDOXLETheme: (theme: TDOXLETheme) => void;
  THEME_COLOR: IDOXLEThemeColor;
  DOXLE_FONT: IDoxleFont;
  currentFontMode: TDoxleFontMode;
  setCurrentFontMode: React.Dispatch<React.SetStateAction<TDoxleFontMode>>;
  tileBgMode: boolean;
  setTileBgMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetCurrentFontMode: (currentFontMode: TDoxleFontMode) => void;
  handleSetCurrentTheme: (theme: TDOXLETheme) => void;
  handleSetCurrentTileBgMode: (tileBgMode: boolean) => void;
  staticMenuColor: IDoxleStaticMenuColor;
  doxleFontSize: IDoxleFontSize;
}

export interface IDOXLEThemeColor {
  primaryFontColor: TRgbaFormat;
  primaryReverseFontColor: TRgbaFormat;
  primaryBackgroundColor: TRgbaFormat;
  secondaryBackgroundColor: TRgbaFormat;
  primaryContainerColor: TRgbaFormat;
  primaryBackdropColor: TRgbaFormat;
  primaryReverseBackdropColor: TRgbaFormat;
  primaryDividerColor: TRgbaFormat;
  bolderDividerColor: TRgbaFormat;
  primaryBoxShadowColor: TRgbaFormat;
  doxleColor: TRgbaFormat;
  doxleReverseColor: TRgbaFormat;
  errorColor: TRgbaFormat;
  successColor: TRgbaFormat;
  doxleColorRGB: string;
  primaryInputPlaceholderColor: TRgbaFormat;
  textInputBgColor: TRgbaFormat;
  rowBorderColor: TRgbaFormat;
  rowHoverColor: TRgbaFormat;
  skeletonColor: TRgbaFormat;
}

export interface IDoxleFont {
  primaryFont: string;
  titleFont: string;
  subTitleFont: string;
  secondaryFont: string;
  secondaryTitleFont: string;
  serifFont: string;
  monoRegular: string;
  sarinaRegular: string;
  interRegular: string;
  sourceCodeRegular: string;
  lexendRegular: string;
}

const ThemeContext = createContext({});
const DOXLEThemeProvider = (children: any) => {
  const [theme, setDOXLETheme] = useState<TDOXLETheme>('light');
  const [currentFontMode, setCurrentFontMode] =
    useState<TDoxleFontMode>('default');
  const [tileBgMode, setTileBgMode] = useState(false);
  const {prevThemeContext, setPrevSession} = usePrevSessionStore(
    useShallow(state => ({
      prevThemeContext: state.prevSession?.lastThemeContext,
      setPrevSession: state.setPrevSession,
    })),
  );
  const DOXLE_FONT: IDoxleFont =
    currentFontMode === 'default'
      ? LEXEND_FONT
      : currentFontMode === 'serif'
      ? SERIF_FONT
      : currentFontMode === 'mono'
      ? MONO_FONT
      : INTER_FONT;
  const THEME_COLOR: IDOXLEThemeColor = useMemo(
    () => ({
      primaryFontColor:
        theme === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255,1)',
      primaryReverseFontColor:
        theme === 'light' ? 'rgba(255, 255, 255,1)' : 'rgba(0, 0, 0,1)',
      primaryBackgroundColor:
        theme === 'light' ? 'rgba(250, 250, 252, 1)' : 'rgba(0,0,0,1)',
      secondaryBackgroundColor:
        theme === 'light' ? 'rgba(239,240,244,1.0)' : 'rgba(31, 33, 42, 1)',
      primaryContainerColor:
        theme === 'light' ? 'rgba(255,255,255,1)' : 'rgba(7, 7, 10,1)',
      primaryBackdropColor:
        theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      primaryReverseBackdropColor:
        theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)',
      primaryDividerColor:
        theme === 'light' ? 'rgba(180,180,180,1)' : 'rgba(45, 45, 59, 1)',
      bolderDividerColor:
        theme === 'light' ? 'rgba(209, 215, 222,1)' : 'rgba(239, 240, 244,0.8)',
      errorColor: theme === 'light' ? 'rgba(255,6,6,0.7)' : 'rgba(255,0,0,1)',
      doxleColor: 'rgba(82,82,255,1)',
      doxleColorRGB: 'rgb(112,112,255)',
      doxleReverseColor: 'rgba(255,100,152,0.55)',
      primaryBoxShadowColor:
        theme === 'light' ? 'rgba(128,128,128,0.25)' : 'rgba(120,120,120,0.25)',
      successColor: 'rgba(18, 183, 24,1)',
      primaryInputPlaceholderColor:
        theme === 'light' ? 'rgba(128,128,128,0.4)' : 'rgba(255,255,255,0.4)',
      textInputBgColor:
        theme === 'light' ? 'rgba(240,240,240, 1)' : 'rgba(18, 18, 24, 1)',
      rowBorderColor:
        theme === 'light' ? 'rgba(239,240,244,1)' : 'rgba(14, 14, 14, 1)',
      rowHoverColor:
        theme === 'light'
          ? 'rgba(245, 246, 247, 0.70)'
          : 'rgba(54, 52, 52, 0.70)',
      skeletonColor:
        theme === 'light' ? 'rgba(241,242,243,1)' : 'rgba(18, 18, 24, 1)',
    }),
    [theme],
  );

  const {deviceType} = useOrientation();
  const doxleFontSize: IDoxleFontSize = useMemo(
    () => ({
      pageTitleFontSize:
        deviceType === 'Smartphone'
          ? 32 - (currentFontMode !== 'default' ? 2 : 0)
          : 34 - (currentFontMode !== 'default' ? 2 : 0),
      headTitleTextSize:
        deviceType === 'Smartphone'
          ? 20 - (currentFontMode !== 'default' ? 2 : 0)
          : 22 - (currentFontMode !== 'default' ? 2 : 0),
      contentTextSize:
        deviceType === 'Smartphone'
          ? 16 - (currentFontMode !== 'default' ? 2 : 0)
          : 18 - (currentFontMode !== 'default' ? 2 : 0),
      textInputSize:
        deviceType === 'Smartphone'
          ? 16 - (currentFontMode !== 'default' ? 2 : 0)
          : 18 - (currentFontMode !== 'default' ? 2 : 0),
      subContentTextSize:
        deviceType === 'Smartphone'
          ? 14 - (currentFontMode !== 'default' ? 2 : 0)
          : 16 - (currentFontMode !== 'default' ? 2 : 0),
      errorToggleTextSize:
        deviceType === 'Smartphone'
          ? 12 - (currentFontMode !== 'default' ? 2 : 0)
          : 14 - (currentFontMode !== 'default' ? 2 : 0),
    }),
    [deviceType, currentFontMode],
  );
  //# handle get previous state of theme
  // const handleSetInitialTheme = async () => {
  //   const prevTheme = await AsyncStorage.getItem('prevTheme');

  //   if (prevTheme) setDOXLETheme(prevTheme as TDOXLETheme);
  // };
  useEffect(() => {
    if (prevThemeContext) {
      console.log('CHANGE THEME:', prevThemeContext);
      if (prevThemeContext?.theme) {
        setDOXLETheme(prevThemeContext.theme);
      }
      if (prevThemeContext?.currentFontMode) {
        setCurrentFontMode(prevThemeContext.currentFontMode);
      }
      if (prevThemeContext?.tileBgMode) {
        setTileBgMode(prevThemeContext.tileBgMode);
      }
    }
  }, [prevThemeContext]);

  const handleSetCurrentFontMode = useCallback(
    (currentFontMode: TDoxleFontMode) => {
      setCurrentFontMode(currentFontMode);
      setPrevSession({
        lastThemeContext: {
          currentFontMode,
        },
      });
    },
    [],
  );
  const handleSetCurrentTheme = useCallback((theme: TDOXLETheme) => {
    setDOXLETheme(theme);
    setPrevSession({
      lastThemeContext: {
        theme,
      },
    });
  }, []);
  const handleSetCurrentTileBgMode = useCallback((tileBgMode: boolean) => {
    setTileBgMode(tileBgMode);
    setPrevSession({
      lastThemeContext: {
        tileBgMode,
      },
    });
  }, []);

  useEffect(() => {
    console.log('currentFontMode:', currentFontMode);
  }, [currentFontMode]);

  const themeContextValue: IDOXLEThemeProviderContext = useMemo(
    () => ({
      DOXLE_FONT,
      THEME_COLOR,
      theme,
      setDOXLETheme,
      currentFontMode,
      setCurrentFontMode,
      tileBgMode,
      setTileBgMode,
      handleSetCurrentFontMode,
      handleSetCurrentTheme,
      handleSetCurrentTileBgMode,
      staticMenuColor: STATIC_MENU_COLOR,
      doxleFontSize,
    }),
    [
      theme,
      currentFontMode,
      tileBgMode,
      handleSetCurrentFontMode,
      handleSetCurrentTheme,
      handleSetCurrentTileBgMode,
      doxleFontSize,
    ],
  );
  return <ThemeContext.Provider {...children} value={themeContextValue} />;
};
const useDOXLETheme = () =>
  useContext(ThemeContext) as IDOXLEThemeProviderContext;
export {DOXLEThemeProvider, useDOXLETheme};
