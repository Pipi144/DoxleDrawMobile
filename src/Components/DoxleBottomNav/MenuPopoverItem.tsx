import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {
  FileMenuIcon,
  MenuChangeFontIcon,
  MenuExportIcon,
  MenuInviteIcon,
  MenuLibraryIcon,
  MenuStoryIcon,
  MenuSwitchBottomIcon,
  MenuSwitchTopIcon,
  MenuXeroIcon,
  PricebookMenuIcon,
  TileBgIcon,
} from './DoxleNavIcons';
import {StyledPopoverMenuItemText} from './StyledComponentDoxleBottomNav';
import {useNavigationMenuStore} from '../../../GeneralStore/useNavigationMenuStore';
import {shallow} from 'zustand/shallow';
import {useOrientation} from '../../../Providers/OrientationContext';
import {DoxleNBIcon, DoxleProjectIcon} from '../../DesignPattern/DoxleIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';
import AntIcon from 'react-native-vector-icons/AntDesign';
type MenuButtonType =
  | 'Library'
  | 'Our Story'
  | 'Change Font'
  | 'Switch to Bottom Bar'
  | 'Export to PDF, CSV'
  | 'Xero Settings'
  | 'Invite to Doxle'
  | 'Become a member'
  | 'Recommend Features'
  | 'Apply to the Partner Program'
  | 'Register for beta release'
  | 'Files'
  | 'Projects'
  | 'Tile Background'
  | 'Notice Board'
  | 'Inventory'
  | 'QR'
  | 'Pricebook'
  | 'Contacts';
type Props = {
  type: MenuButtonType;
  menuFunction?: Function;
};

const MenuPopoverItem = ({type, menuFunction}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {navBarPosition} = useNavigationMenuStore(
    useShallow(state => ({
      navBarPosition: state.navBarPosition,
    })),
  );
  const {deviceSize, deviceType} = useOrientation();
  return (
    <DoxleAnimatedButton
      style={styles.menuItemButton}
      onPress={() => {
        if (menuFunction) menuFunction();
      }}>
      {type === 'Library' && (
        <MenuLibraryIcon {...THEME_COLOR} deviceType={deviceType} />
      )}
      {type === 'Our Story' && (
        <MenuStoryIcon {...THEME_COLOR} deviceType={deviceType} />
      )}
      {type === 'Change Font' && (
        <MenuChangeFontIcon themeColor={THEME_COLOR} />
      )}
      {type === 'Switch to Bottom Bar' &&
        (navBarPosition === 'top' ? (
          <MenuSwitchBottomIcon {...THEME_COLOR} deviceType={deviceType} />
        ) : (
          <MenuSwitchTopIcon {...THEME_COLOR} deviceType={deviceType} />
        ))}
      {type === 'Export to PDF, CSV' && (
        <MenuExportIcon {...THEME_COLOR} deviceType={deviceType} />
      )}
      {type === 'Xero Settings' && (
        <MenuXeroIcon {...THEME_COLOR} deviceType={deviceType} />
      )}

      {type === 'Invite to Doxle' && (
        <MenuInviteIcon {...THEME_COLOR} deviceType={deviceType} />
      )}
      {type === 'Files' && <FileMenuIcon themeColor={THEME_COLOR} />}

      {type === 'Tile Background' && <TileBgIcon themeColor={THEME_COLOR} />}

      {type === 'Notice Board' && (
        <DoxleNBIcon
          themeColor={THEME_COLOR}
          animated={false}
          containerStyle={{
            width: deviceType === 'Smartphone' ? 18 : 21,
            marginRight: 2,
            opacity: 0.5,
          }}
          strokeWidthLine={0.2}
        />
      )}
      {type === 'Projects' && (
        <DoxleProjectIcon
          themeColor={THEME_COLOR}
          containerStyle={{
            width: deviceType === 'Smartphone' ? 18 : 21,
            marginRight: 2,
            opacity: 0.5,
          }}
        />
      )}
      {type === 'Inventory' && (
        <MaterialIcon
          color={THEME_COLOR.primaryFontColor}
          size={deviceType === 'Smartphone' ? 18 : 21}
          name="inventory"
        />
      )}
      {type === 'QR' && (
        <AntIcon
          name="qrcode"
          size={deviceType === 'Smartphone' ? 18 : 21}
          color={THEME_COLOR.primaryFontColor}
        />
      )}
      {type === 'Pricebook' && (
        <PricebookMenuIcon
          themeColor={THEME_COLOR}
          containerStyle={{
            width: deviceType === 'Smartphone' ? 18 : 21,
          }}
        />
      )}
      {type === 'Contacts' && (
        <AntIcon
          color={THEME_COLOR.primaryFontColor}
          size={deviceType === 'Smartphone' ? 18 : 21}
          name="contacts"
        />
      )}
      <StyledPopoverMenuItemText>
        {type === 'Switch to Bottom Bar'
          ? navBarPosition === 'top'
            ? 'Switch to Bottom Bar'
            : 'Switch to Top Bar'
          : type}
      </StyledPopoverMenuItemText>
    </DoxleAnimatedButton>
  );
};

export default MenuPopoverItem;

const styles = StyleSheet.create({
  menuItemButton: {
    width: '100%',
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
