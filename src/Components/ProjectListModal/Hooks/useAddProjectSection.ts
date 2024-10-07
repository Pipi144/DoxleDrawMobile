import {Keyboard, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {NotifierRoot} from 'react-native-notifier';

import {useShallow} from 'zustand/react/shallow';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../DesignPattern/Notification/Notification';
import {Project} from '../../../Models/project';
import ProjectQueryAPI from '../../../API/projectQueryAPI';

type Props = {
  listRef: React.RefObject<Animated.FlatList<any>>;
  projectListModalNotifier: React.RefObject<NotifierRoot>;
  closeModal: () => void;
};

interface AddProjectSection {
  newProjectAddressText: string;
  handleNewProjectAddressTextChange: (value: string) => void;
  isAddingProject: boolean;
  handleAddProject: () => void;
  showAddInput: boolean;
  setShowAddInput: React.Dispatch<React.SetStateAction<boolean>>;
  iconAddAnimatedStyle: {
    transform: {
      rotateZ: string;
    }[];
  };
}
const useAddProjectSection = ({
  listRef,
  projectListModalNotifier,
  closeModal,
}: Props): AddProjectSection => {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newProjectAddressText, setNewProjectAddressText] =
    useState<string>('');
  const {accessToken} = useAuth();
  const {company, handleSelectProject} = useCompany();
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
      duration?: number,
    ) => {
      projectListModalNotifier.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        duration: duration ?? 1200,
        hideAnimationDuration: 1000,
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const onSuccessAddProject = (newProject?: Project) => {
    setNewProjectAddressText('');
    setShowAddInput(false);
    if (newProject) handleSelectProject(newProject);
    setTimeout(() => {
      listRef.current?.scrollToEnd({animated: true});
    }, 200);

    setTimeout(() => {
      closeModal();
    }, 500);
  };
  const addProjectQuery = ProjectQueryAPI.useAddProjectQuery({
    accessToken,
    company,
    onSuccessCb: onSuccessAddProject,
    showNotification,
  });

  const handleNewProjectAddressTextChange = (value: string) => {
    setNewProjectAddressText(value);
  };

  const handleAddProject = () => {
    Keyboard.dismiss();
    if (newProjectAddressText)
      addProjectQuery.mutate({siteAddress: newProjectAddressText});
  };

  const showInputAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const iconAddAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(showInputAnimatedValue.value, [0, 1], [0, 45]);

    return {
      transform: [
        {
          rotateZ: `${rotateZ}deg`,
        },
      ],
    };
  });

  useEffect(() => {
    if (showAddInput)
      showInputAnimatedValue.value = withSpring(1, {damping: 16});
    else {
      showInputAnimatedValue.value = withSpring(0, {damping: 16});
      setNewProjectAddressText('');
    }
  }, [showAddInput]);

  return {
    newProjectAddressText,
    handleNewProjectAddressTextChange,
    isAddingProject: addProjectQuery.isPending,
    handleAddProject,
    showAddInput,
    setShowAddInput,
    iconAddAnimatedStyle,
  };
};

export default useAddProjectSection;

const styles = StyleSheet.create({});
