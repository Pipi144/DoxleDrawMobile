import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useNavigationMenuStore} from '../../../../GeneralStore/useNavigationMenuStore';
import {shallow} from 'zustand/shallow';
import {usePrevSessionStore} from '../../../../GeneralStore/usePrevSessionStore';
import {TNavigationRootAppProps} from '../../../../Routes/RouteParams';
import {useShallow} from 'zustand/react/shallow';
import {TDoxleBottomTabStack} from '../../../../Routes/RouteTypes';

type Props = {};

type TSideMenuView = 'selectCompany' | 'OurStory' | 'fontSelect' | 'mainMenu';
const useSideMenu = (props: Props) => {
  const [sideMenuView, setSideMenuView] = useState<TSideMenuView>('mainMenu');
  const {theme, handleSetCurrentTheme} = useDOXLETheme();
  const {setNavBarPosition, navBarPosition} = useNavigationMenuStore(
    useShallow(state => ({
      navBarPosition: state.navBarPosition,

      setNavBarPosition: state.setNavBarPosition,
    })),
  );
  const {setPrevSession} = usePrevSessionStore(state => ({
    setPrevSession: state.setPrevSession,
  }));
  const handleThemeBtn = () => {
    if (theme === 'light') handleSetCurrentTheme('dark');
    else handleSetCurrentTheme('light');
  };
  const handleSwitchNavBar = () => {
    setNavBarPosition(navBarPosition === 'bottom' ? 'top' : 'bottom');
  };
  const navigation = useNavigation<StackNavigationProp<TDoxleBottomTabStack>>();
  const handlePressFilesMenu = () => {
    navigation.navigate('FilesCompany');
    setPrevSession({
      lastAppTab: 'FilesCompany',
    });
  };
  const handlePressNBMenu = () => {
    navigation.navigate('Actions');
    setPrevSession({
      lastAppTab: 'Actions',
    });
  };
  const handlePressProjectsMenu = () => {
    // navigation.navigate('Projects', {});
    // setPrevSession({
    //   lastAppTab: 'Projects',
    // });
  };
  const handlePressAddCompany = () => {
    navigation.navigate('AddCompany');
  };
  const handlePressInventory = () => {
    navigation.navigate('Inventory');
    setPrevSession({
      lastAppTab: 'Inventory',
    });
  };

  const handlePressPricebook = () => {
    navigation.navigate('Pricebook');
    setPrevSession({
      lastAppTab: 'Pricebook',
    });
  };
  const handlePressContacts = () => {
    navigation.navigate('Contacts');
    setPrevSession({
      lastAppTab: 'Contacts',
    });
  };
  return {
    handleThemeBtn,

    handlePressFilesMenu,
    sideMenuView,
    setSideMenuView,
    handlePressAddCompany,
    handlePressNBMenu,
    handlePressProjectsMenu,
    handlePressInventory,
    handleSwitchNavBar,

    handlePressPricebook,
    handlePressContacts,
  };
};

export default useSideMenu;

const styles = StyleSheet.create({});
