import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SharedValue, useSharedValue, withSpring} from 'react-native-reanimated';

type Props = {
  handleSearchTextChange: (text: string) => void;
  showAddAssigneeForm: boolean;
  handleToggleAssigneeForm: () => void;
};

interface AssigneeSearchSection {
  searchInput: string;
  handleSearchInputChange: (value: string) => void;
  handleClearInput: () => void;
  showSearchAssigneeInput: boolean;
  handlePressSearchIconBtn: () => void;
  handleCloseSearchInput: () => void;

  handlePressAddAssigneeBtn: () => void;
  addAssigneeBtnIconAnimatedValue: SharedValue<number>;
}
const useAssigneeSearchSection = ({
  handleSearchTextChange,
  showAddAssigneeForm,
  handleToggleAssigneeForm,
}: Props): AssigneeSearchSection => {
  const [showSearchAssigneeInput, setShowSearchAssigneeInput] =
    useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };
  const handleClearInput = () => {
    setSearchInput('');
  };
  useEffect(() => {
    const timeout = setTimeout(() => handleSearchTextChange(searchInput), 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handlePressSearchIconBtn = () => {
    setShowSearchAssigneeInput(prev => !prev);
  };
  const handleCloseSearchInput = () => {
    setShowSearchAssigneeInput(false);
  };
  const handlePressAddAssigneeBtn = () => {
    handleToggleAssigneeForm();
    if (showSearchAssigneeInput) setShowSearchAssigneeInput(false);
  };

  const addAssigneeBtnIconAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;

  useEffect(() => {
    if (showAddAssigneeForm)
      addAssigneeBtnIconAnimatedValue.value = withSpring(1, {damping: 12});
    else addAssigneeBtnIconAnimatedValue.value = withSpring(0, {damping: 12});
  }, [showAddAssigneeForm]);
  return {
    searchInput,
    handleSearchInputChange,
    handleClearInput,
    showSearchAssigneeInput,
    handlePressSearchIconBtn,
    handleCloseSearchInput,

    handlePressAddAssigneeBtn,
    addAssigneeBtnIconAnimatedValue,
  };
};

export default useAssigneeSearchSection;

const styles = StyleSheet.create({});
