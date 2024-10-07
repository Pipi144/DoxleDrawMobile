import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../Providers/OrientationContext';
import {
  StyledNavProjectSection,
  StyledProjectAddressText,
} from './StyledComponentDoxleBottomNav';
import ProjectListBottomModal from '../Projects/Components/ProjectListBottomModal';
import DoxleAnimatedButton from '../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import useGetProjectList from '../../../CustomHooks/GetQueryDataHooks/useGetProjectList';
import {useProjectStore} from '../Projects/Store/useProjectStore';
import {shallow} from 'zustand/shallow';
import {FadeInDown, FadeOutUp} from 'react-native-reanimated';

type Props = {};

const NavProjectSection = (props: Props) => {
  const [showProjectList, setShowProjectList] = useState<boolean>(false);
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {selectedProject} = useProjectStore(
    state => ({
      selectedProject: state.selectedProject,
    }),
    shallow,
  );
  const {
    projectList,
    isFetchingProject,
    isSuccessFetchingProject,
    isErrorFetchingProject,
  } = useGetProjectList({});
  return (
    <StyledNavProjectSection entering={FadeInDown} exiting={FadeOutUp}>
      <DoxleAnimatedButton
        style={styles.projectAddressBtn}
        disabled={isFetchingProject}
        disabledColor={'rgba(0,0,0,0)'}
        onPress={() => setShowProjectList(!showProjectList)}>
        <StyledProjectAddressText
          $fontSize={deviceType === 'Smartphone' ? 18 : 22}
          $themeColor={THEME_COLOR}
          $doxleFont={DOXLE_FONT}
          numberOfLines={1}
          ellipsizeMode="tail">
          {selectedProject ? selectedProject.siteAddress : 'Select A Project'}
        </StyledProjectAddressText>
      </DoxleAnimatedButton>

      <ProjectListBottomModal
        showProjectList={showProjectList}
        setShowProjectList={setShowProjectList}
      />
    </StyledNavProjectSection>
  );
};

export default NavProjectSection;

const styles = StyleSheet.create({
  projectAddressBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    alignSelf: 'flex-start',
  },
});
