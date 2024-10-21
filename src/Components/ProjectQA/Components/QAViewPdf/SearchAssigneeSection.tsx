import {StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyledSearchAssigneeSection,
  StyledSearchAssigneeTextInput,
} from './StyledComponentQAViewPdf';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

type Props = {handleSearchAssigneeTextChange: (value: string) => void};

const SearchAssigneeSection = ({handleSearchAssigneeTextChange}: Props) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const {staticMenuColor} = useDOXLETheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearchAssigneeTextChange(searchInput);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);
  const textInputRef = useRef<TextInput>(null);
  useEffect(() => {
    textInputRef.current?.focus();
  }, [textInputRef]);
  return (
    <StyledSearchAssigneeSection>
      <StyledSearchAssigneeTextInput
        value={searchInput}
        ref={textInputRef}
        onChangeText={value => setSearchInput(value)}
        placeholder="Search Contact..."
        placeholderTextColor={editRgbaAlpha({
          rgbaColor: staticMenuColor.staticWhiteFontColor,
          alpha: '0.4',
        })}
        autoFocus
        selectTextOnFocus
      />
    </StyledSearchAssigneeSection>
  );
};

export default SearchAssigneeSection;

const styles = StyleSheet.create({});
