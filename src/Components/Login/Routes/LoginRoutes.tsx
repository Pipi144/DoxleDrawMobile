import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GreetingLoginScreen from '../Pages/GreetingLoginScreen';
import MainLoginScreen from '../Pages/MainLoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TLoginStack} from './LoginRouteTypes';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {navigation: any};

const LoginRoutes = (props: Props) => {
  const LoginStack = createNativeStackNavigator<TLoginStack>();
  const {THEME_COLOR} = useDOXLETheme();
  return (
    <LoginStack.Navigator
      initialRouteName="GreetingScreen"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME_COLOR.primaryBackgroundColor,
        },
      }}>
      <LoginStack.Screen name="GreetingScreen">
        {props => <GreetingLoginScreen {...props} />}
      </LoginStack.Screen>
      <LoginStack.Screen name="LoginScreen">
        {props => <MainLoginScreen {...props} />}
      </LoginStack.Screen>
    </LoginStack.Navigator>
  );
};

export default LoginRoutes;

const styles = StyleSheet.create({});
