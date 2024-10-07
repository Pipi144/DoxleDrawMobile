import {StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {
  StyledDoxleNavButton,
  StyledMainNavSection,
  StyledSearchDoxleInput,
  StyledSearchWrapper,
} from './StyledComponentDoxleBottomNav';
import {DoxlePurpleIcon} from '../../../RootAppIcons';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../Providers/OrientationContext';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {shallow} from 'zustand/shallow';
import {useNavigationMenuStore} from '../../../GeneralStore/useNavigationMenuStore';
import {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  Layout,
  StretchOutX,
} from 'react-native-reanimated';
import {editRgbaAlpha, TRgbaFormat} from '../../../Utilities/FunctionUtilities';
import {NavSearchIcon} from './DoxleNavIcons';
import useMainNavSection from './Hooks/useMainNavSection';
import DoxleAnimatedButton from '../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import Modal from 'react-native-modal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SideMenu from './SideMenu/SideMenu';
import {useNavigation} from '@react-navigation/native';

type Props = {};

const MainNavSection = (props: Props) => {
  const {THEME_COLOR, DOXLE_FONT, setDOXLETheme, theme} = useDOXLETheme();
  const {deviceSize, deviceType} = useOrientation();
  const searchInputRef = useRef<TextInput>(null);
  const {
    isSearchFocused,
    setIsSearchFocused,
    searchInput,
    setShowSideMenu,
    setSearchInput,
    showSideMenu,
    handleCloseSideMenu,
  } = useMainNavSection({});
  const {currentRouteName, navBarPosition} = useNavigationMenuStore(
    state => ({
      currentRouteName: state.currentRouteName,
      navBarPosition: state.navBarPosition,
    }),
    shallow,
  );

  const navigation = useNavigation();
  return (
    <StyledMainNavSection
      $position={navBarPosition}
      $themeColor={THEME_COLOR}
      $height={deviceType === 'Smartphone' ? 45 : 55}>
      <StyledDoxleNavButton
        style={styles.toggleMenuBtn}
        onPress={() => setShowSideMenu(true)}>
        <DoxlePurpleIcon
          containerStyle={{
            width: deviceType === 'Smartphone' ? 45 : 55,
          }}
        />
      </StyledDoxleNavButton>

      <StyledSearchWrapper
        $themeColor={THEME_COLOR}
        $theme={theme}
        $fullWidth={isSearchFocused}
        entering={FadeInDown}
        exiting={StretchOutX}
        layout={Layout.springify().damping(16)}>
        <NavSearchIcon themeColor={THEME_COLOR} />
        <StyledSearchDoxleInput
          $fontSize={deviceType === 'Smartphone' ? 13 : 15}
          $themeColor={THEME_COLOR}
          ref={searchInputRef}
          $doxleFont={DOXLE_FONT}
          placeholder="Search Doxle"
          placeholderTextColor={editRgbaAlpha({
            rgbaColor: THEME_COLOR.primaryFontColor as TRgbaFormat,
            alpha: '0.4',
          })}
          value={searchInput}
          onChangeText={value => setSearchInput(value)}
          selectTextOnFocus
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />

        {isSearchFocused && (
          <DoxleAnimatedButton
            hitSlop={14}
            onPress={e => {
              setSearchInput('');
              searchInputRef.current?.blur();
            }}
            entering={FadeIn}
            exiting={FadeOut}>
            <AntIcon
              name="closecircle"
              color={editRgbaAlpha({
                rgbaColor: THEME_COLOR.primaryFontColor as TRgbaFormat,
                alpha: '0.4',
              })}
              size={deviceType === 'Smartphone' ? 16 : 18}
            />
          </DoxleAnimatedButton>
        )}
      </StyledSearchWrapper>

      {currentRouteName === 'Files' && (
        <DoxleAnimatedButton
          style={styles.closeFileBtn}
          entering={FadeInRight}
          exiting={FadeOutRight}
          onPress={() => {
            if (navigation.canGoBack()) {
              // setCurrentRouteName(undefined);
              navigation.goBack();
            }
          }}>
          <AntIcon
            name="closecircle"
            color={THEME_COLOR.primaryFontColor}
            size={deviceType === 'Smartphone' ? 25 : 30}
          />
        </DoxleAnimatedButton>
      )}

      {/* <StyledRightNavBtnWrapper>
        <DoxleAnimatedButton style={styles.btnStyle}>
          <StyledShareBtnText
            $fontSize={deviceType === 'Smartphone' ? 14 : 16}
            $themeColor={THEME_COLOR}
            $doxleFont={DOXLE_FONT}>
            Share
          </StyledShareBtnText>
        </DoxleAnimatedButton>
        <DoxleAnimatedButton style={styles.btnStyle}>
          <NavMailIcon themeColor={THEME_COLOR} />
        </DoxleAnimatedButton>
      </StyledRightNavBtnWrapper> */}

      <Modal
        isVisible={showSideMenu}
        hasBackdrop={true}
        backdropColor={THEME_COLOR.primaryBackdropColor}
        onBackdropPress={handleCloseSideMenu}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        animationInTiming={400}
        animationOutTiming={200}
        backdropTransitionOutTiming={0}
        style={{
          margin: 0,
          width: deviceSize.deviceWidth,
          height: deviceSize.deviceHeight,
          display: 'flex',
        }}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SideMenu handleCloseSideMenu={handleCloseSideMenu} />
        </GestureHandlerRootView>
      </Modal>
    </StyledMainNavSection>
  );
};

export default MainNavSection;

const styles = StyleSheet.create({
  btnStyle: {
    paddingHorizontal: 8,
  },
  toggleMenuBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    paddingHorizontal: 8,
    left: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeSideMenuBtn: {
    alignSelf: 'flex-end',
  },
  closeFileBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    paddingHorizontal: 8,
    right: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
