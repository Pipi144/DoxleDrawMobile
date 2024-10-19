import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {StyledHomeHeader, StyledProjectAddressText} from './StyledDoxleTopMenu';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useCompany} from '../../Providers/CompanyProvider';
import {useOrientation} from '../../Providers/OrientationContext';
import DoxleAnimatedButton from '../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import {useIsFetching} from '@tanstack/react-query';
import {formFullProjectListQKey} from '../../API/projectQueryAPI';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';
import EntyIcon from 'react-native-vector-icons/Entypo';
import ProjectListModal from '../ProjectListModal/ProjectListModal';
import {ActivityIndicator} from 'react-native-paper';

type Props = {};

const HomeHeader = () => {
  const [showModal, setshowModal] = useState(false);
  const {doxleFontSize, staticMenuColor} = useDOXLETheme();
  const {company, selectedProject} = useCompany();
  const {deviceType, deviceSize} = useOrientation();

  const isFetchingProject =
    useIsFetching({
      queryKey: formFullProjectListQKey(company, {
        view: 'budget',
      }),
      exact: true,
    }) > 0;
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
          <ActivityIndicator
            color={staticMenuColor.staticWhiteFontColor}
            size={doxleFontSize.contentTextSize + 2}
          />
        )}

        {!isFetchingProject && (
          <>
            <StyledProjectAddressText
              numberOfLines={1}
              ellipsizeMode="tail"
              $textSizeMode={
                selectedProject
                  ? selectedProject.siteAddress.length < 40
                    ? undefined
                    : selectedProject.siteAddress.length < 55
                    ? 's'
                    : 'xs'
                  : undefined
              }>
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
