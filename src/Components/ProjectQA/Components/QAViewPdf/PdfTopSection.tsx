import {Easing, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {
  StyledConstributorDisplay,
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
import {Popover, useDisclose} from 'native-base';

import {ActivityIndicator} from 'react-native-paper';

import SelectAssigneePdfView from './SelectAssigneePdfView';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {QAList, TQAStatus} from '../../../../../../../Models/qa';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import usePdfTopSection from '../../Hooks/usePdfTopSection';
import {
  editRgbaAlpha,
  getFontSizeScale,
  TRgbaFormat,
} from '../../../../../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../../../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {Contact} from '../../../../../../../Models/contacts';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {useQAViewPDFContext} from './QAViewPDF';

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
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    selectedAssignee,
    handleGenerateQAReportForAssignee,
    isCreatingPdf,
    handleShareFile,
  } = usePdfTopSection({
    qaListItem,
    setDisplayedPdfPath,

    initialAssignee,
    initialStatus,
  });
  const {isOpen, onClose, onOpen} = useDisclose();
  const {displayedPdfPath} = useQAViewPDFContext();
  //* animation
  const dropdownIconAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const dropdownIconAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      dropdownIconAnimatedValue.value,
      [0, 1],
      [0, 180],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    return {
      transform: [
        {
          rotateZ: `${rotateZ}deg`,
        },
      ],
    };
  }, []);
  useEffect(() => {
    if (isOpen) dropdownIconAnimatedValue.value = withSpring(1, {damping: 16});
    else dropdownIconAnimatedValue.value = withSpring(0, {damping: 16});
  }, [isOpen]);
  const circularSize = getFontSizeScale(30);
  const circularThickness = getFontSizeScale(3);
  const circularRef = useRef<AnimatedCircularProgress>(null);
  useEffect(() => {
    circularRef.current?.animate(
      Math.floor(
        ((initialCountUploadItemsInProgress - countUploadItemsInProgress) /
          initialCountUploadItemsInProgress) *
          100,
      ),
      500,
      Easing.quad,
    );
  }, [countUploadItemsInProgress, initialCountUploadItemsInProgress]);

  return (
    <StyledPdfTopSectionContainer
      layout={LinearTransition.springify().damping(16)}>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        trigger={triggerProps => {
          return (
            <StyledConstributorDisplay
              style={{display: 'flex', flexDirection: 'row'}}
              {...triggerProps}
              flexDirection="row"
              onPress={onOpen}
              hitSlop={20}
              $doxleFont={DOXLE_FONT}>
              <Animated.View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 4,
                  paddingHorizontal: 14,
                  borderRadius: 13,
                  backgroundColor: THEME_COLOR.primaryContainerColor,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: THEME_COLOR.primaryDividerColor,
                }}
                layout={LinearTransition.springify().damping(16)}>
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
              </Animated.View>
            </StyledConstributorDisplay>
          );
        }}>
        <Popover.Content
          accessibilityLabel="Doxle Dropdown Menu"
          w={`${getFontSizeScale(240)}px`}
          h={`${getFontSizeScale(400)}px`}
          maxH={'500px'}
          maxW={'300px'}
          ml="2"
          backgroundColor={THEME_COLOR.primaryContainerColor}
          borderColor={'transparent'}
          style={{overflow: 'visible'}}>
          <Popover.Arrow
            bgColor={THEME_COLOR.primaryContainerColor}
            borderColor={THEME_COLOR.primaryContainerColor}
          />

          <Popover.Body
            h="100%"
            w="100%"
            p={0}
            backgroundColor={THEME_COLOR.primaryContainerColor}
            style={{
              shadowColor: editRgbaAlpha({
                rgbaColor: THEME_COLOR.primaryFontColor as TRgbaFormat,
                alpha: '0.4',
              }),
              elevation: 4,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowRadius: 12,
              shadowOpacity: 0.4,
            }}>
            <SelectAssigneePdfView
              handleGenerateQAReportForAssignee={
                handleGenerateQAReportForAssignee
              }
              onClose={onClose}
              selectedAssignee={selectedAssignee}
            />
          </Popover.Body>
        </Popover.Content>
      </Popover>
      <View style={styles.btnMenuSection}>
        {displayedPdfPath && (
          <DoxleAnimatedButton
            entering={FadeIn}
            style={[
              styles.shareBtn,
              {
                borderWidth: 1,
                borderColor: THEME_COLOR.primaryDividerColor,
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
            prefill={0}
            // renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
          >
            {fill => <StyledProgressCountText>{fill}</StyledProgressCountText>}
          </AnimatedCircularProgress>
        )}
      </View>
    </StyledPdfTopSectionContainer>
  );
};

export default PdfTopSection;

const styles = StyleSheet.create({
  shareBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
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
