import {Easing, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {
  StyledConstributorDisplay,
  StyledModalPdfAssignee,
  StyledPdfTopSectionContainer,
  StyledProgressCountText,
  StyledQAContributorText,
} from './StyledComponentQAViewPdf';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import FTIcon from 'react-native-vector-icons/Feather';
import {ActivityIndicator} from 'react-native-paper';

import SelectAssigneePdfView from './SelectAssigneePdfView';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import usePdfTopSection from './Hooks/usePdfTopSection';
import {useQAViewPDFContext} from './QAViewPDF';
import {QAList, TQAStatus} from '../../../../Models/qa';
import {Contact} from '../../../../Models/contacts';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Modal from 'react-native-modal/dist/modal';
import {useOrientation} from '../../../../Providers/OrientationContext';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

type Props = {
  qaListItem: QAList;
  setDisplayedPdfPath: React.Dispatch<React.SetStateAction<string | undefined>>;

  countUploadItemsInProgress: number;
  initialCountUploadItemsInProgress: number;
  initialAssignee?: Contact;
  initialStatus?: TQAStatus;
};
const AnimatedFIcon = Animated.createAnimatedComponent(FTIcon);
const PdfTopSection = ({
  qaListItem,
  setDisplayedPdfPath,

  countUploadItemsInProgress,
  initialCountUploadItemsInProgress,
  initialAssignee,
  initialStatus,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize, staticMenuColor} =
    useDOXLETheme();
  const {deviceSize} = useOrientation();
  const {
    selectedAssignee,
    handleGenerateQAReportForAssignee,
    isCreatingPdf,
    handleShareFile,
    openAssigneeModal,
    setOpenAssigneeModal,
    dropdownIconAnimatedStyle,
    displayedPdfPath,
    circularSize,
    circularThickness,
    circularRef,
  } = usePdfTopSection({
    qaListItem,
    setDisplayedPdfPath,

    initialAssignee,
    initialStatus,
    countUploadItemsInProgress,
    initialCountUploadItemsInProgress,
  });

  const layout = LinearTransition.springify()
    .damping(16)
    .mass(0.5)
    .stiffness(120);
  return (
    <StyledPdfTopSectionContainer layout={layout}>
      <StyledConstributorDisplay
        style={{display: 'flex', flexDirection: 'row'}}
        onPress={() => setOpenAssigneeModal(true)}
        hitSlop={20}
        layout={layout}>
        <StyledQAContributorText
          $null={Boolean(!selectedAssignee || isCreatingPdf)}>
          {/* {!selectedAssignee
                    ? 'Select Assignee to share'
                    : `${isCreatingPdf ? 'Generating Pdf for ' : ''}${
                        selectedAssignee.firstName
                      } ${selectedAssignee.lastName}`} */}

          {!isCreatingPdf
            ? selectedAssignee
              ? `${selectedAssignee.firstName} ${selectedAssignee.lastName}`
              : 'Select Assignee to share'
            : selectedAssignee
            ? `Generating Report For ${selectedAssignee.firstName} ${selectedAssignee.lastName}`
            : 'Generating Overall Report'}
        </StyledQAContributorText>
        {isCreatingPdf ? (
          <ActivityIndicator
            color={THEME_COLOR.primaryFontColor}
            size={14}
            style={{marginLeft: 8}}
          />
        ) : (
          <AnimatedFIcon
            exiting={FadeOutDown}
            entering={FadeInDown}
            name="chevron-down"
            color={THEME_COLOR.primaryFontColor}
            style={[dropdownIconAnimatedStyle, {marginLeft: 8}]}
            size={20}
          />
        )}
      </StyledConstributorDisplay>
      <View style={styles.btnMenuSection}>
        {displayedPdfPath && (
          <DoxleAnimatedButton
            entering={FadeIn}
            style={[
              styles.shareBtn,
              {
                borderWidth: 1,
                borderColor: THEME_COLOR.rowBorderColor,
              },
            ]}
            hitSlop={20}
            onPress={handleShareFile}
            backgroundColor={THEME_COLOR.primaryContainerColor}>
            <FTIcon
              name="share"
              size={doxleFontSize.contentTextSize}
              color={THEME_COLOR.primaryFontColor}
            />
          </DoxleAnimatedButton>
        )}

        {countUploadItemsInProgress > 0 && (
          <AnimatedCircularProgress
            size={circularSize}
            width={circularThickness}
            ref={circularRef}
            fill={Math.floor(
              ((initialCountUploadItemsInProgress -
                countUploadItemsInProgress) /
                initialCountUploadItemsInProgress) *
                100,
            )}
            tintColor={THEME_COLOR.doxleColor}
            tintTransparency
            backgroundColor={THEME_COLOR.primaryContainerColor}
            style={{marginLeft: 4}}
            childrenContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
              padding: 2,
            }}
            prefill={0}>
            {fill => <StyledProgressCountText>{fill}</StyledProgressCountText>}
          </AnimatedCircularProgress>
        )}
      </View>

      <Modal
        isVisible={openAssigneeModal}
        hasBackdrop={true}
        backdropColor={staticMenuColor.staticBackdrop}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onBackdropPress={() => setOpenAssigneeModal(false)}
        animationIn="slideInUp"
        animationOut="fadeOutDownBig"
        deviceHeight={deviceSize.deviceHeight}
        deviceWidth={deviceSize.deviceWidth}
        animationInTiming={200}
        animationOutTiming={300}
        style={{
          position: 'relative',
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        }}>
        <StyledModalPdfAssignee layout={layout}>
          <SelectAssigneePdfView
            handleGenerateQAReportForAssignee={
              handleGenerateQAReportForAssignee
            }
            onClose={() => setOpenAssigneeModal(false)}
            selectedAssignee={selectedAssignee}
          />
        </StyledModalPdfAssignee>
      </Modal>
    </StyledPdfTopSectionContainer>
  );
};

export default PdfTopSection;

const styles = StyleSheet.create({
  shareBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 500,
    padding: 4,
  },
  sendBtn: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMenuSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
