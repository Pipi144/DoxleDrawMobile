import {
  Keyboard,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {
  StyledQANavItemText,
  StyledQATopNavSection,
} from './StyledComponentProjectQA';
import DoxleAnimatedButton from '../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {useProjectStore} from '../../../Store/useProjectStore';
import {shallow} from 'zustand/shallow';
import {useDOXLETheme} from '../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import {useOrientation} from '../../../../../../Providers/OrientationContext';
import {useNavigationMenuStore} from '../../../../../../GeneralStore/useNavigationMenuStore';
import {useShallow} from 'zustand/react/shallow';
type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};

const QATopNavSection = ({containerStyle}: Props) => {
  const {selectedProject} = useProjectStore(
    useShallow(state => ({selectedProject: state.selectedProject})),
  );
  const {qaNavigationMenu} = useProjectQAStore(
    useShallow(state => ({qaNavigationMenu: state.qaNavigationMenu})),
  );

  const navigation = useNavigation();
  const handleNavBackToProject = () => {
    navigation.dispatch(StackActions.pop(qaNavigationMenu.length));
  };
  const handlePressNavItem = (index: number) => {
    navigation.dispatch(StackActions.pop(qaNavigationMenu.length - 1 - index));
  };
  return (
    <StyledQATopNavSection style={containerStyle}>
      <DoxleAnimatedButton
        style={styles.subNavBtn}
        hitSlop={14}
        onPress={handleNavBackToProject}>
        <StyledQANavItemText>
          {selectedProject && selectedProject.siteAddress} /
        </StyledQANavItemText>
      </DoxleAnimatedButton>

      <DoxleAnimatedButton
        style={styles.subNavBtn}
        hitSlop={14}
        onPress={handleNavBackToProject}>
        <StyledQANavItemText>Check list /</StyledQANavItemText>
      </DoxleAnimatedButton>

      {qaNavigationMenu.map((nav, index) => (
        <DoxleAnimatedButton
          style={styles.subNavBtn}
          hitSlop={14}
          onPress={() => handlePressNavItem(index)}
          key={`nav${nav.routeKey}`}
          entering={FadeInUp}
          exiting={FadeOutUp}>
          <StyledQANavItemText>{nav.routeName} /</StyledQANavItemText>
        </DoxleAnimatedButton>
      ))}
    </StyledQATopNavSection>
  );
};

export default QATopNavSection;

const styles = StyleSheet.create({
  subNavBtn: {
    marginHorizontal: 2,
    marginVertical: 4,
  },
});
