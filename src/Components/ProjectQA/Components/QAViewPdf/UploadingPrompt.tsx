import {Easing, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {
  StyledMessagePromptText,
  StyledPromptMessageSection,
  StyledPromtBanner,
  StyledTitlePrompt,
  StyledTitlePromptSection,
  StyledUploadingPrompt,
} from './StyledComponentQAViewPdf';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';

type Props = {
  initialCountUploadItemsInProgress: number;
  setShowPromtPendingUpload: (value: React.SetStateAction<boolean>) => void;
};
const AnimatedAntIcon = Animated.createAnimatedComponent(AntIcon);
const UploadingPrompt = ({
  initialCountUploadItemsInProgress,
  setShowPromtPendingUpload,
}: Props) => {
  const [showCloseIcon, setShowCloseIcon] = useState<boolean>(false);
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const circularRef = useRef<AnimatedCircularProgress>(null);
  useEffect(() => {
    circularRef.current?.animate(100, 3000, Easing.quad);
  }, []);
  const circularSize = deviceType === 'Smartphone' ? 30 : 34;
  const circularThickness = deviceType === 'Smartphone' ? 3 : 5;
  return (
    <StyledUploadingPrompt
      entering={FadeIn.duration(200)}
      exiting={FadeOut.delay(300)}>
      <StyledPromtBanner
        entering={SlideInDown.delay(400)}
        exiting={SlideOutDown.duration(200)}>
        <StyledTitlePromptSection>
          <StyledTitlePrompt>Uploading In Progress!</StyledTitlePrompt>
          {!showCloseIcon ? (
            <AnimatedCircularProgress
              size={circularSize}
              width={circularThickness}
              ref={circularRef}
              fill={circularRef.current?.props.fill ?? 0}
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
              onAnimationComplete={() => setShowCloseIcon(true)}
              // renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
            />
          ) : (
            <AnimatedAntIcon
              name="closecircle"
              size={deviceType === 'Smartphone' ? 25 : 28}
              color={THEME_COLOR.primaryFontColor}
              onPress={() => setShowPromtPendingUpload(false)}
            />
          )}
        </StyledTitlePromptSection>

        <StyledPromptMessageSection>
          <StyledMessagePromptText>
            There are {initialCountUploadItemsInProgress} images still in upload
            progress, your file will be fully updated when those images uploaded
            completely
          </StyledMessagePromptText>
        </StyledPromptMessageSection>
      </StyledPromtBanner>
    </StyledUploadingPrompt>
  );
};

export default UploadingPrompt;

const styles = StyleSheet.create({});
