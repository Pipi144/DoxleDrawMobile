import React, {useRef} from 'react';
import {Keyboard, Platform, StyleSheet, TextInput} from 'react-native';
import {
  StyledAnimatedErrorText,
  StyledLoadingMaskScreen,
  StyledLoginFieldWrapper,
  StyledLoginForm,
  StyledLoginTextInput,
  StyledLoginTitleText,
  StyledMagicLinkText,
  StyledSubmitBtnText,
} from '../StyledComponentLogin';
import {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';

import {DoxlePurpleIconWithText, LoginBanner} from '../LoginIcons';

import useMainLoginScreen from '../Hooks/useMainLoginScreen';

import OutsidePressHandler from 'react-native-outside-press';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../Providers/OrientationContext';
import DoxleKeyboardAvoidingView from '../../DesignPattern/DoxleKeyboardAvoidingView';
import {editRgbaAlpha} from '../../../Utilities/FunctionUtilities';
import DoxleAnimatedButton from '../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import LoadingDoxleIconWithText from '../../../Utilities/AnimationScreens/LoadingDoxleIconWithText/LoadingDoxleIconWithText';

function MainLoginScreen(props: {navigation: any}): JSX.Element {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceSize, deviceType, isPortraitMode} = useOrientation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    shouldShowError,
    handleTextInputChange,
    handleSubmitBtn,
    isLoggingIn,
  } = useMainLoginScreen({});
  const passwordInputRef = useRef<TextInput>(null);

  return (
    <DoxleKeyboardAvoidingView
      containerStyle={{
        height: '100%',
        width: '100%',

        display: 'flex',
        flexDirection: isPortraitMode ? 'column' : 'row',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME_COLOR.primaryContainerColor,
      }}
      keyboardVerticalOffset={8}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <DoxlePurpleIconWithText
        themeColor={THEME_COLOR}
        containerStyle={{
          position: 'absolute',
          left: 14,
          top: 14,
          width: deviceType === 'Smartphone' ? 44 : 50,
        }}
      />

      <LoginBanner
        themeColor={THEME_COLOR}
        containerStyle={{
          width: '40%',
          maxWidth: 300,
          marginBottom: 14,
        }}
      />

      <StyledLoginForm $isPortraitMode={isPortraitMode}>
        <StyledLoginTitleText>Login</StyledLoginTitleText>
        <OutsidePressHandler
          disabled={false}
          onOutsidePress={() => Keyboard.dismiss()}
          style={{width: '100%', display: 'flex'}}>
          <StyledLoginFieldWrapper
            layout={LinearTransition.springify().damping(16)}>
            <StyledLoginTextInput
              placeholderTextColor={editRgbaAlpha({
                rgbaColor: THEME_COLOR.primaryFontColor,
                alpha: '0.4',
              })}
              placeholder="Email"
              value={email}
              onChangeText={value => setEmail(value)}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit
              textContentType="oneTimeCode"
              autoCorrect={false}
            />

            {shouldShowError && !email && (
              <StyledAnimatedErrorText
                entering={FadeInDown.duration(200)}
                exiting={FadeOutDown.duration(200)}>
                Please enter an email!
              </StyledAnimatedErrorText>
            )}
          </StyledLoginFieldWrapper>
          <StyledLoginFieldWrapper
            layout={LinearTransition.springify().damping(16)}>
            <StyledLoginTextInput
              placeholder="Password"
              placeholderTextColor={editRgbaAlpha({
                rgbaColor: THEME_COLOR.primaryFontColor,
                alpha: '0.4',
              })}
              secureTextEntry={true}
              value={password}
              selectTextOnFocus
              ref={passwordInputRef}
              onChangeText={value => handleTextInputChange('password', value)}
              onSubmitEditing={() => {
                if (email && password) handleSubmitBtn();
              }}
              blurOnSubmit
            />

            {shouldShowError && !password && (
              <StyledAnimatedErrorText
                entering={FadeInDown.duration(200)}
                exiting={FadeOutDown.duration(200)}>
                Please enter password!
              </StyledAnimatedErrorText>
            )}
          </StyledLoginFieldWrapper>
        </OutsidePressHandler>

        <DoxleAnimatedButton
          backgroundColor={THEME_COLOR.primaryFontColor}
          onPress={handleSubmitBtn}
          style={styles.submitBtn}
          layout={LinearTransition.springify().damping(16)}>
          <StyledSubmitBtnText style={styles.submitBtn}>
            Submit
          </StyledSubmitBtnText>
        </DoxleAnimatedButton>
        <StyledMagicLinkText>Login via magic link</StyledMagicLinkText>
      </StyledLoginForm>

      {isLoggingIn && (
        <StyledLoadingMaskScreen>
          <LoadingDoxleIconWithText message="Login...Please Wait!" />
        </StyledLoadingMaskScreen>
      )}
    </DoxleKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  submitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 1,

    borderRadius: 4,
    marginVertical: 14,
  },
});

export default MainLoginScreen;
