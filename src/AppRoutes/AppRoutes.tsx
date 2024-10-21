import {StatusBar, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {TDoxleRootStack} from './RouteTypes';
import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  IOrientation,
  OrientationProvider,
  useOrientation,
} from '../Providers/OrientationContext';
import {
  NavigationContainer,
  Theme,
  DefaultTheme as RNavTheme,
} from '@react-navigation/native';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../Providers/AuthProvider';
import {useNotification} from '../Providers/NotificationProvider';
import {editRgbaAlpha, TRgbaFormat} from '../Utilities/FunctionUtilities';
import {ThemeProvider} from 'styled-components/native';
import DoxleUploadVideoBgProvider from '../Providers/DoxleUploadVideoBgProvider';
import styled from 'styled-components/native';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
import LoadingDoxleIconWithText from '../Utilities/AnimationScreens/LoadingDoxleIconWithText/LoadingDoxleIconWithText';
import {NotifierRoot} from 'react-native-notifier';
import LoginRoutes from '../Components/Login/Routes/LoginRoutes';
import Home from '../Components/Home/Home';
import HomeHeader from '../Components/HomeHeader/HomeHeader';
import AppModalHeader from '../Components/AppModalHeader/AppModalHeader';
import ProjectFilesRoute from '../Components/ProjectFile/Routes/ProjectFilesRoute';
import FileBgUploader from '../Components/ProjectFile/Provider/FileBgUploader';
import BudgetRoutes from '../Components/ProjectBudget/Routes/BudgetRoutes';
import CacheQAProvider from '../Components/ProjectQA/Provider/CacheQAProvider';
import QARoutes from '../Components/ProjectQA/Routes/QARoutes';

const RootStack = createNativeStackNavigator<TDoxleRootStack>();
type Props = {};
declare module 'styled-components/native' {
  export interface DefaultTheme
    extends IDOXLEThemeProviderContext,
      IOrientation {}
}
const StyledRootAppContainer = styled.View`
  flex: 1;
  display: flex;
  background-color: ${p => p.theme.THEME_COLOR.primaryContainerColor};
  position: relative;
`;
const RootAppRouting = (props: Props) => {
  const {loggedIn, isCheckingLogInStatus} = useAuth();

  const {deviceType} = useOrientation();
  const orientationContext = useOrientation();
  const {THEME_COLOR, theme} = useDOXLETheme();
  const doxleThemeContext = useDOXLETheme();
  const {notifierRootAppRef} = useNotification();
  const navTheme: Theme = {
    ...RNavTheme,
    dark: theme === 'dark',
    colors: {
      ...RNavTheme.colors,
      background: editRgbaAlpha({
        rgbaColor: THEME_COLOR.primaryBackgroundColor as TRgbaFormat,
        alpha: '0.8',
      }),
    },
  };
  // useEffect(() => {
  //   unlink(DocumentDirectoryPath);
  // }, []);

  return (
    <ThemeProvider theme={{...doxleThemeContext, ...orientationContext}}>
      <PaperProvider theme={{...DefaultTheme}}>
        <OrientationProvider>
          {/* <DoxleUploadVideoBgProvider> */}
          <CacheQAProvider>
            <FileBgUploader>
              <NavigationContainer theme={navTheme}>
                <StyledRootAppContainer>
                  <StatusBar barStyle={'light-content'} />
                  {deviceType === 'Smartphone' && (
                    <OrientationLocker orientation={PORTRAIT} />
                  )}
                  {isCheckingLogInStatus && (
                    <LoadingDoxleIconWithText
                      message="Checking session...Please Wait!"
                      containerStyle={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                        backgroundColor: 'rgba(255,255,255,1)',
                      }}
                    />
                  )}

                  {loggedIn ? (
                    <RootStack.Navigator
                      initialRouteName="Home"
                      screenOptions={{
                        animationDuration: 50,
                      }}>
                      <RootStack.Screen
                        name="Home"
                        component={Home}
                        options={{
                          freezeOnBlur: true,
                          header: HomeHeader,
                        }}
                      />

                      <RootStack.Group
                        screenOptions={{
                          presentation: 'containedModal',
                          header: AppModalHeader,
                        }}>
                        <RootStack.Screen
                          name="BudgetRoute"
                          component={BudgetRoutes}
                        />
                        <RootStack.Screen
                          name="FileRoute"
                          component={ProjectFilesRoute}
                        />
                        <RootStack.Screen
                          name="ActionRoute"
                          component={QARoutes}
                        />
                      </RootStack.Group>
                    </RootStack.Navigator>
                  ) : (
                    <RootStack.Navigator
                      screenOptions={{
                        headerShown: false,
                        contentStyle: {
                          backgroundColor: THEME_COLOR.primaryBackgroundColor,
                        },
                      }}>
                      <RootStack.Screen name="Login">
                        {props => <LoginRoutes {...props} />}
                      </RootStack.Screen>
                    </RootStack.Navigator>
                  )}

                  <NotifierRoot ref={notifierRootAppRef} />
                </StyledRootAppContainer>
              </NavigationContainer>
            </FileBgUploader>
          </CacheQAProvider>
          {/* </DoxleUploadVideoBgProvider> */}
        </OrientationProvider>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default RootAppRouting;

const styles = StyleSheet.create({});
