import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useNavigationMenuStore} from '../../../../GeneralStore/useNavigationMenuStore';
import {shallow} from 'zustand/shallow';

type Props = {};
interface MainNavSection {
  handleThemeBtn: () => void;
  isSearchFocused: boolean;
  setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  showSideMenu: boolean;
  setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseSideMenu: () => void;
}
const useMainNavSection = (props: Props): MainNavSection => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const {setDOXLETheme, theme} = useDOXLETheme();
  const {setNavBarSearchValueText} = useNavigationMenuStore(
    state => ({
      setNavBarSearchValueText: state.setNavBarSearchValueText,
    }),
    shallow,
  );

  const handleThemeBtn = () => {
    if (theme === 'light') setDOXLETheme('dark');
    else setDOXLETheme('light');
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setNavBarSearchValueText(searchInput);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);
  return {
    handleThemeBtn,
    isSearchFocused,
    setIsSearchFocused,
    searchInput,
    setSearchInput,
    showSideMenu,
    setShowSideMenu,
    handleCloseSideMenu,
  };
};

export default useMainNavSection;

const styles = StyleSheet.create({});
