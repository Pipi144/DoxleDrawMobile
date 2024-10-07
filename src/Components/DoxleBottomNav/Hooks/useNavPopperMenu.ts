import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {};

interface NavPopperMenu {
  showPopoverMenu: boolean;
  setshowPopoverMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menuView: PopoverMenuView;
  setMenuView: React.Dispatch<React.SetStateAction<PopoverMenuView>>;
  handleThemeBtn: () => void;
}

type PopoverMenuView = 'mainMenu' | 'changeFont' | 'OurStory';
const useNavPopperMenu = (props: Props): NavPopperMenu => {
  const [menuView, setMenuView] = useState<PopoverMenuView>('mainMenu');

  const [showPopoverMenu, setshowPopoverMenu] = useState(false);
  const {setDOXLETheme, theme} = useDOXLETheme();
  const handleThemeBtn = () => {
    if (theme === 'light') setDOXLETheme('dark');
    else setDOXLETheme('light');
  };
  useEffect(() => {
    if (!showPopoverMenu) setMenuView('mainMenu');
  }, [showPopoverMenu]);

  return {
    showPopoverMenu,
    setshowPopoverMenu,
    menuView,
    setMenuView,
    handleThemeBtn,
  };
};

export default useNavPopperMenu;

const styles = StyleSheet.create({});
