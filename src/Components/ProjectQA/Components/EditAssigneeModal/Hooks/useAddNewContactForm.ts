import {Keyboard, StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

import {useEditAssigneeModalContext} from '../EditAssigneeModal';

import {produce} from 'immer';
import ContactQueryAPI, {
  FilterRetrieveContactQuery,
} from '../../../../../API/contactQueryAPI';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../DesignPattern/Notification/Notification';
import {CREATE_NEW_CONTACT_TEMPLATE} from '../../../../../Models/contacts';

type Props = {
  filterRetrieveContactListQuery: FilterRetrieveContactQuery;
  initialSearchText: string;
};

interface NewContactTextError {
  email: boolean;
  fName: boolean;
  lName: boolean;
  phone: boolean;
}

const regexPhone = /^[0-9]*$/;
const regexEmail = /^\S+@\S+\.\S+$/;
const useAddNewContactForm = ({
  filterRetrieveContactListQuery,
  initialSearchText,
}: Props) => {
  const [newFirstName, setNewFirstName] = useState<string>(
    initialSearchText.split(' ')[0] || '',
  );
  const [newLastName, setNewLastName] = useState<string>(
    initialSearchText.split(' ')[1] || '',
  );
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [errorToggle, setErrorToggle] = useState<NewContactTextError>({
    email: false,
    fName: false,
    lName: false,
    phone: false,
  });
  const [shouldShowError, setShouldShowError] = useState(false);
  const {company} = useCompany();
  const {accessToken, user} = useAuth();
  const {notifierEditAssigneModalRef, handleCloseAddContactForm} =
    useEditAssigneeModalContext();
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
    ) => {
      notifierEditAssigneModalRef.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'reset',
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const handleContactTextChange = (
    value: string,
    field: 'fName' | 'lName' | 'email' | 'phone',
  ) => {
    if (field === 'fName') setNewFirstName(value);
    if (field === 'lName') setNewLastName(value);
    if (field === 'email') setNewEmail(value);
    if (field === 'phone') setNewPhone(value);
  };
  //# useefect handle toggle error
  useEffect(() => {
    if (!newFirstName)
      setErrorToggle(produce(draft => void (draft.fName = true)));
    else {
      if (errorToggle.fName)
        setErrorToggle(produce(draft => void (draft.fName = false)));
    }
    if (!newLastName)
      setErrorToggle(produce(draft => void (draft.lName = true)));
    else {
      if (errorToggle.lName)
        setErrorToggle(produce(draft => void (draft.lName = false)));
    }
    if (newPhone && !regexPhone.test(newPhone))
      setErrorToggle(produce(draft => void (draft.phone = true)));
    else {
      if (errorToggle.phone)
        setErrorToggle(produce(draft => void (draft.phone = false)));
    }

    if ((newEmail && !regexEmail.test(newEmail)) || !newEmail)
      setErrorToggle(produce(draft => void (draft.email = true)));
    else {
      if (errorToggle.email)
        setErrorToggle(produce(draft => void (draft.email = false)));
    }
  }, [newFirstName, newLastName, newEmail, newPhone, errorToggle]);

  const onSuccessAdd = () => {
    handleCloseAddContactForm();
  };
  const addContactQuery = ContactQueryAPI.useAddNewContactQuery({
    showNotification,
    company,
    accessToken,
    filter: filterRetrieveContactListQuery,
    onSuccessCb: onSuccessAdd,
  });
  const handleAddContact = () => {
    Keyboard.dismiss();
    if (
      errorToggle.email ||
      errorToggle.fName ||
      errorToggle.lName ||
      errorToggle.phone
    ) {
      setShouldShowError(true);
      return;
    }
    if (newFirstName || newLastName) {
      const newContact = CREATE_NEW_CONTACT_TEMPLATE({
        userCompany: company?.companyId ?? '',
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
      });

      addContactQuery.mutate(newContact);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldShowError(false);
    }, 8000);

    return () => {
      clearTimeout(timeout);
    };
  }, [shouldShowError]);

  return {
    newFirstName,
    newLastName,
    newEmail,
    newPhone,
    handleContactTextChange,
    errorToggle,
    handleAddContact,

    isAddingContact: addContactQuery.isPending,
    shouldShowError,
  };
};

export default useAddNewContactForm;

const styles = StyleSheet.create({});
