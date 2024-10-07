import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyledHomeHeader, StyledProjectAddressText} from './StyledDoxleTopMenu';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useCompany} from '../../Providers/CompanyProvider';
import {useOrientation} from '../../Providers/OrientationContext';
import useGetProjectList from '../../GetQueryDataHooks/useGetProjectList';
import DoxleAnimatedButton from '../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import {useIsFetching} from '@tanstack/react-query';
import {formFullProjectListQKey} from '../../API/projectQueryAPI';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';
import EntyIcon from 'react-native-vector-icons/Entypo';
import ProjectListModal from '../ProjectListModal/ProjectListModal';

type Props = {};

const HomeHeader = () => {
  const [showModal, setshowModal] = useState(false);
  const {THEME_COLOR, staticMenuColor} = useDOXLETheme();
  const {company, selectedProject} = useCompany();
  const {deviceType, deviceSize} = useOrientation();

  const isFetchingProject = useIsFetching({
    queryKey: formFullProjectListQKey(company, {
      view: 'budget',
    }),
    exact: true,
  });
  return (
    <StyledHomeHeader>
      <DoxleAnimatedButton
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={[styles.projectBtn]}
        disabledColor="rgba(0,0,0,0)"
        onPress={() => {
          setshowModal(true);
        }}>
        {isFetchingProject && (
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              width={200}
              height={12}
              borderRadius={6}
              backgroundColor={THEME_COLOR.skeletonColor}
            />
          </SkeletonPlaceholder>
        )}

        {!isFetchingProject && (
          <>
            <StyledProjectAddressText numberOfLines={1} ellipsizeMode="tail">
              {isFetchingProject
                ? 'Getting projects...'
                : selectedProject
                ? selectedProject.siteAddress
                : 'Select Or Add A Project'}
            </StyledProjectAddressText>
            <EntyIcon
              name="chevron-down"
              size={deviceType === 'Smartphone' ? 18 : 22}
              color={editRgbaAlpha({
                rgbaColor: staticMenuColor.staticWhiteFontColor,
                alpha: '0.8',
              })}
              style={{marginLeft: 4}}
            />
          </>
        )}
      </DoxleAnimatedButton>

      <ProjectListModal
        showModal={showModal}
        closeModal={() => setshowModal(false)}
      />
    </StyledHomeHeader>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  projectBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  menuWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBtn: {
    paddingVertical: 5,
    paddingRight: 10,
  },
});
