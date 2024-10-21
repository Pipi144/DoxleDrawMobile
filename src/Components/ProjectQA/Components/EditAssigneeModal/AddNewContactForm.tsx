import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {
  StyledAddContactFormBtnText,
  StyledAddNewContactForm,
  StyledAddNewContactHeaderText,
  StyledAddNewContactTextInput,
  StyledErrorToggleAddNewContactText,
  StyledNewContactFormFieldContainer,
} from './StyledComponentEditAssigneeModal';
import {
  FadeInLeft,
  FadeInUp,
  FadeOutLeft,
  LinearTransition,
  StretchInY,
  StretchOutY,
} from 'react-native-reanimated';
import {FilterRetrieveContactQuery} from '../../../../API/contactQueryAPI';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import useAddNewContactForm from './Hooks/useAddNewContactForm';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {ScrollView} from 'react-native-gesture-handler';
import ProcessingScreen from '../../../../Utilities/AnimationScreens/ProcessingAnimation/ProcessingScreen';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
type Props = {
  initialSearchText: string;
  filterRetrieveContactListQuery: FilterRetrieveContactQuery;
};

const AddNewContactForm = ({
  initialSearchText,
  filterRetrieveContactListQuery,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {
    newFirstName,
    newLastName,
    newEmail,
    newPhone,
    handleContactTextChange,
    errorToggle,
    handleAddContact,
    isAddingContact,
    shouldShowError,
  } = useAddNewContactForm({
    initialSearchText,
    filterRetrieveContactListQuery,
  });

  const fNameTextInputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (fNameTextInputRef.current) fNameTextInputRef.current.focus();
  }, []);

  return (
    <StyledAddNewContactForm entering={StretchInY} exiting={StretchOutY}>
      <View style={styles.topFormSection}>
        <StyledAddNewContactHeaderText>
          New Contact
        </StyledAddNewContactHeaderText>
      </View>
      <ScrollView
        automaticallyAdjustContentInsets
        automaticallyAdjustsScrollIndicatorInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        style={{flex: 1, width: '100%'}}
        showsVerticalScrollIndicator={false}>
        <StyledNewContactFormFieldContainer
          entering={FadeInUp.delay(0)}
          layout={LinearTransition.springify().damping(16)}>
          <StyledAddNewContactTextInput
            ref={fNameTextInputRef}
            value={newFirstName}
            placeholder="First name..."
            placeholderTextColor={THEME_COLOR.primaryInputPlaceholderColor}
            onChangeText={value => handleContactTextChange(value, 'fName')}
          />
          {errorToggle.fName && shouldShowError && (
            <StyledErrorToggleAddNewContactText
              entering={FadeInLeft}
              exiting={FadeOutLeft}>
              Please fill in first name!!!
            </StyledErrorToggleAddNewContactText>
          )}
        </StyledNewContactFormFieldContainer>

        <StyledNewContactFormFieldContainer
          entering={FadeInUp.delay(100)}
          layout={LinearTransition.springify().damping(16)}>
          <StyledAddNewContactTextInput
            value={newLastName}
            placeholder="Last name..."
            placeholderTextColor={THEME_COLOR.primaryInputPlaceholderColor}
            onChangeText={value => handleContactTextChange(value, 'lName')}
          />
          {errorToggle.lName && shouldShowError && (
            <StyledErrorToggleAddNewContactText
              entering={FadeInLeft}
              exiting={FadeOutLeft}>
              Please fill in last name!!!
            </StyledErrorToggleAddNewContactText>
          )}
        </StyledNewContactFormFieldContainer>

        <StyledNewContactFormFieldContainer
          entering={FadeInUp.delay(200)}
          layout={LinearTransition.springify().damping(16)}>
          <StyledAddNewContactTextInput
            value={newEmail}
            placeholder="Email..."
            placeholderTextColor={THEME_COLOR.primaryInputPlaceholderColor}
            onChangeText={value => handleContactTextChange(value, 'email')}
          />
          {errorToggle.email && shouldShowError && (
            <StyledErrorToggleAddNewContactText
              entering={FadeInLeft}
              exiting={FadeOutLeft}
              layout={LinearTransition.springify().damping(16)}>
              {!newEmail
                ? 'Please enter an email...'
                : 'Please input correct email...'}
            </StyledErrorToggleAddNewContactText>
          )}
        </StyledNewContactFormFieldContainer>

        <StyledNewContactFormFieldContainer
          entering={FadeInUp.delay(300)}
          layout={LinearTransition.springify().damping(16)}>
          <StyledAddNewContactTextInput
            value={newPhone}
            placeholder="Phone number..."
            placeholderTextColor={THEME_COLOR.primaryInputPlaceholderColor}
            onChangeText={value => handleContactTextChange(value, 'phone')}
          />
          {errorToggle.phone && shouldShowError && (
            <StyledErrorToggleAddNewContactText
              entering={FadeInLeft}
              exiting={FadeOutLeft}
              layout={LinearTransition.springify().damping(16)}>
              Please input correct phone number...
            </StyledErrorToggleAddNewContactText>
          )}
        </StyledNewContactFormFieldContainer>

        <DoxleAnimatedButton
          onPress={handleAddContact}
          backgroundColor={THEME_COLOR.primaryFontColor}
          style={[styles.btnAddStyle]}
          hitSlop={20}>
          <StyledAddContactFormBtnText>Add Contact</StyledAddContactFormBtnText>
        </DoxleAnimatedButton>
      </ScrollView>

      {/* <StyledAddContactFormButtonSection>
          
        </StyledAddContactFormButtonSection> */}

      {isAddingContact && (
        <ProcessingScreen
          processingType="add"
          containerStyle={{
            position: 'absolute',
            zIndex: 10,
            top: 14,
            width: '100%',
            height: '100%',
            left: 14,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: editRgbaAlpha({
              rgbaColor: THEME_COLOR.primaryContainerColor,
              alpha: '0.8',
            }),
          }}
          animationSize={60}
          processingText="Adding New Contact..."
          loadingTextStyle={{
            fontSize: deviceType === 'Smartphone' ? 16 : 18,
            fontFamily: DOXLE_FONT.primaryFont,
          }}
        />
      )}
    </StyledAddNewContactForm>
  );
};

export default AddNewContactForm;

const styles = StyleSheet.create({
  btnAddStyle: {
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',

    borderRadius: 4,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  topFormSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
