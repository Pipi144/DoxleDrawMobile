import {StyleSheet} from 'react-native';
import React, {useRef} from 'react';

import {useRoute} from '@react-navigation/native';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';

import useQAEditSignaturePage from './Hooks/useQAEditSignaturePage';
import {
  StyledDrawSignatureLabel,
  StyledQAEditSignaturePageContainer,
  StyledSignatureBtnSection,
  StyledSignatureBtnText,
  StyledSignaturePreviewSection,
  StyledSignaturePreviewText,
  StyledSignatureReviewImage,
  StyledSignatureScreenWrapper,
} from './StyledComponentQAListEditSignature';

import {TQATabStack} from '../../Routes/QARouteType';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import ProcessingScreen from '../../../../Utilities/AnimationScreens/ProcessingAnimation/ProcessingScreen';

type Props = {navigation: any};

const QAEditSignature = () => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceSize, deviceType} = useOrientation();
  const route = useRoute();
  const {qaListItem} = route.params as TQATabStack['QAEditSignature'];
  const signatureScreenRef = useRef<SignatureViewRef>(null);
  const signatureScreenHeight = deviceType === 'Smartphone' ? 144 : 300;
  const overwrittenSignatureScreenStyle = `
  .m-signature-pad--footer {display: none; margin: 0px;}
  .m-signature-pad--body { 
    background-color:${THEME_COLOR.primaryContainerColor};
    width: 100% !important;
    height: 100% !important;
    border-radius:4px;
   }
  .m-signature-pad {

    width: 100% !important ;
    height: ${signatureScreenHeight}px !important;
    margin:0px;
    .m-signature-pad--body {border: none;
    
    
    }
    background-color:${THEME_COLOR.primaryBackgroundColor};
    border: 1px solid ${THEME_COLOR.primaryDividerColor} !important;
    box-shadow: none;
    display:flex;
    justify-content:center;
    align-items:center;
   
   
    position:absolute;
    top:0;
    left:0
  }

  body {
    width:100% !important;
    height: ${signatureScreenHeight}px !important;
    display:flex;
    background-color: ${THEME_COLOR.primaryBackgroundColor};
    
    padding: 0px !important;
    margin: 0px !important;
    position:relative
}
    `;
  const {
    onEndDrawing,
    handleCaptureSignature,
    handleClearSignature,
    finalSignaturePath,
    handleSaveSignature,
    isUpdatingSignature,
  } = useQAEditSignaturePage({qaListItem, signatureScreenRef});

  return (
    <StyledQAEditSignaturePageContainer
      style={{
        paddingBottom: deviceSize.insetBottom,
        paddingHorizontal: 14,
        paddingTop: 14,
      }}>
      <StyledDrawSignatureLabel>Draw Signature</StyledDrawSignatureLabel>

      <StyledSignaturePreviewSection $height={signatureScreenHeight}>
        {finalSignaturePath && (
          <StyledSignatureReviewImage
            entering={FadeInLeft}
            exiting={FadeOutRight}
            source={{uri: finalSignaturePath}}
            resizeMode="contain"
          />
        )}

        <StyledSignaturePreviewText>Preview</StyledSignaturePreviewText>
      </StyledSignaturePreviewSection>

      <StyledSignatureScreenWrapper
        layout={LinearTransition.springify().damping(16)}
        style={{height: signatureScreenHeight}}>
        <SignatureScreen
          style={{height: signatureScreenHeight}}
          onOK={handleCaptureSignature}
          onEnd={onEndDrawing}
          ref={signatureScreenRef}
          webStyle={overwrittenSignatureScreenStyle}
          imageType="image/jpeg"
          backgroundColor={THEME_COLOR.primaryContainerColor}
          penColor={THEME_COLOR.primaryFontColor}
          onClear={handleClearSignature}
        />
      </StyledSignatureScreenWrapper>

      <StyledSignatureBtnSection
        layout={LinearTransition.springify().damping(16)}>
        <DoxleAnimatedButton
          onPress={handleClearSignature}
          backgroundColor={THEME_COLOR.primaryContainerColor}
          style={[
            styles.signatureBtn,
            {
              marginRight: 8,
              width: deviceType === 'Smartphone' ? 88 : 108,
              height: deviceType === 'Smartphone' ? 35 : 40,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: THEME_COLOR.primaryDividerColor,
            },
          ]}
          hitSlop={14}>
          <StyledSignatureBtnText style={{color: THEME_COLOR.primaryFontColor}}>
            Clear
          </StyledSignatureBtnText>
        </DoxleAnimatedButton>

        <DoxleAnimatedButton
          hitSlop={14}
          disabled={Boolean(!finalSignaturePath)}
          onPress={handleSaveSignature}
          backgroundColor={THEME_COLOR.primaryFontColor}
          style={[
            styles.signatureBtn,
            {
              width: deviceType === 'Smartphone' ? 88 : 108,
              height: deviceType === 'Smartphone' ? 35 : 40,
              borderRadius: 4,
            },
          ]}>
          <StyledSignatureBtnText
            style={{color: THEME_COLOR.primaryReverseFontColor}}>
            Save
          </StyledSignatureBtnText>
        </DoxleAnimatedButton>
      </StyledSignatureBtnSection>

      {isUpdatingSignature && (
        <ProcessingScreen
          processingType="update"
          processingText="Updating Signature, Please wait..."
          animationSize={80}
          containerStyle={{
            position: 'absolute',
            top: 0,
            left: 28,
            width: '100%',
            height: '100%',
            zIndex: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
    </StyledQAEditSignaturePageContainer>
  );
};

export default QAEditSignature;

const styles = StyleSheet.create({
  signatureBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
