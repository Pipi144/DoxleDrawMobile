import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';

import {
  StyledButtonContainer,
  StyledGreetingImageContainer,
  StyledGreetingLoginScreenContainer,
  StyledHeaderText,
  StyledLoginBtnText,
  StyledSubtitleText,
  StyledSubtitleTextContainer,
  StyledTextHeaderWrapper,
  StyledUploadDrawingText,
} from '../StyledComponentLogin';
import {
  DoxleIcon,
  DoxlePurpleIconWithText,
  LoginGreetingIcon,
} from '../LoginIcons';
import {FadeInUp, StretchInX} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../Providers/OrientationContext';
import {useNavigation} from '@react-navigation/native';
import {TLoginStack} from '../Routes/LoginRouteTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import DoxleAnimatedButton from '../../DesignPattern/DoxleButton/DoxleAnimatedButton';

const TEXT_HEADER = ['Budget ', 'better ', 'with ', 'Doxle.'];
const GreetingLoginScreen = ({}: {navigation: any}) => {
  const navigation = useNavigation<StackNavigationProp<TLoginStack>>();
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const handlePressLoginBtn = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <StyledGreetingLoginScreenContainer>
      <DoxlePurpleIconWithText
        themeColor={THEME_COLOR}
        containerStyle={{
          position: 'absolute',
          left: 14,
          top: 14,
          width: deviceType === 'Smartphone' ? 44 : 50,
        }}
      />

      <StyledGreetingImageContainer entering={StretchInX.duration(100)}>
        <LoginGreetingIcon {...THEME_COLOR} />
      </StyledGreetingImageContainer>

      <StyledTextHeaderWrapper>
        {TEXT_HEADER.map((headerText, idx) => (
          <StyledHeaderText
            key={`header#${idx}${headerText}`}
            entering={FadeInUp.delay(100 + 100 * idx)}
            style={{
              color:
                idx !== TEXT_HEADER.length - 1
                  ? THEME_COLOR.primaryFontColor
                  : THEME_COLOR.doxleColor,
            }}>
            {headerText}
          </StyledHeaderText>
        ))}
      </StyledTextHeaderWrapper>
      <StyledSubtitleTextContainer
        entering={FadeInUp.delay(100 + TEXT_HEADER.length * 100)}>
        <StyledSubtitleText>
          With state of the art machine learning algorithms, we aim to provide
          you transparent measurements and costings to help you budget your
          builds. Please verify all measurements with our measure tool to ensure
          accuracy.
        </StyledSubtitleText>
      </StyledSubtitleTextContainer>
      <StyledButtonContainer
        entering={FadeInUp.delay(100 + TEXT_HEADER.length * 100)}>
        <DoxleAnimatedButton>
          <StyledUploadDrawingText>Upload Drawings</StyledUploadDrawingText>
        </DoxleAnimatedButton>

        <DoxleAnimatedButton
          onPress={handlePressLoginBtn}
          style={styles.loginBtn}
          backgroundColor={THEME_COLOR.primaryFontColor}>
          <StyledLoginBtnText>Login</StyledLoginBtnText>
        </DoxleAnimatedButton>
      </StyledButtonContainer>
    </StyledGreetingLoginScreenContainer>
  );
};

export default GreetingLoginScreen;

const styles = StyleSheet.create({
  loginBtn: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 3,
    marginLeft: 8,
  },
});
