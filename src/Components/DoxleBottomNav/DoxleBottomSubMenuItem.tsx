import {StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {
  IDOXLEThemeProviderContext,
  useDOXLETheme,
} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  StyledDoxleBottomSubMenuItem,
  StyledDoxleBottomSubMenuItemText,
} from './StyledComponentDoxleBottomNav';
import {useNavigation} from '@react-navigation/native';
import {
  FileNavMenuIcon,
  NBNavMenuIcon,
  ProjectNavMenuIcon,
} from './DoxleNavIcons';
import {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {editRgbaAlpha, TRgbaFormat} from '../../../Utilities/FunctionUtilities';
import {useOrientation} from '../../../Providers/OrientationContext';
import {TDoxleDocketMenu} from '../../../Routes/RouteTypes';
type Props = {
  itemMenu: TDoxleDocketMenu;
  selected: boolean;
};

const DoxleBottomSubMenuItem = ({itemMenu, selected}: Props) => {
  const {THEME_COLOR, DOXLE_FONT, theme} =
    useDOXLETheme() as IDOXLEThemeProviderContext;
  const navigation = useNavigation();
  const {deviceType} = useOrientation();
  const handlePressTabMenuItem = (item: TDoxleDocketMenu) => {
    // if (navigation.canGoBack()) navigation.dispatch(StackActions.popToTop());
    navigation.navigate(item as never);
  };
  const selectedAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(selected ? 1 : 0),
  ).current;
  useEffect(() => {
    if (selected) selectedAnimatedValue.value = withSpring(1, {damping: 14});
    else selectedAnimatedValue.value = withSpring(0, {damping: 14});
  }, [selected]);

  const unselectedBgColor = editRgbaAlpha({
    rgbaColor: THEME_COLOR.doxleColor as TRgbaFormat,
    alpha: '0',
  });
  const selectedBgColor =
    theme === 'light'
      ? editRgbaAlpha({
          rgbaColor: THEME_COLOR.doxleColor as TRgbaFormat,
          alpha: '0.15',
        })
      : editRgbaAlpha({
          rgbaColor: THEME_COLOR.doxleColor as TRgbaFormat,
          alpha: '0.6',
        });

  const itemAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selectedAnimatedValue.value,
      [0, 1],
      [unselectedBgColor, selectedBgColor],
    );
    return {
      backgroundColor,
    };
  });
  return (
    <StyledDoxleBottomSubMenuItem
      $themeColor={THEME_COLOR}
      style={[itemAnimatedStyle]}
      onPress={() => handlePressTabMenuItem(itemMenu)}>
      {itemMenu === 'Files' && <FileNavMenuIcon {...THEME_COLOR} />}
      {itemMenu === 'Actions' && <NBNavMenuIcon {...THEME_COLOR} />}
      {itemMenu === 'Projects' && <ProjectNavMenuIcon {...THEME_COLOR} />}

      <StyledDoxleBottomSubMenuItemText
        $fontSize={deviceType === 'Smartphone' ? 13 : 15}
        $themeColor={THEME_COLOR}
        $doxleFont={DOXLE_FONT}>
        {itemMenu === 'Actions' ? 'Notice Board' : itemMenu}
      </StyledDoxleBottomSubMenuItemText>
    </StyledDoxleBottomSubMenuItem>
  );
};

export default DoxleBottomSubMenuItem;

const styles = StyleSheet.create({});
