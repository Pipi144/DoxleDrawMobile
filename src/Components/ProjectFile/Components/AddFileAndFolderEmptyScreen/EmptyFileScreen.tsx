import {StyleSheet} from 'react-native';
import React from 'react';
import {FileEmptyBanner} from '../../ProjectFileIcon';

import {
  StyledEmptyFileScreenContainer,
  StyledEmptyFileText,
} from './StyledComponentEmptyFileScreen';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {};

const EmptyFileScreen = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();

  return (
    <StyledEmptyFileScreenContainer>
      <FileEmptyBanner
        themeColor={THEME_COLOR}
        containerStyle={{
          maxWidth: 500,
          maxHeight: 500,
        }}
      />
      <StyledEmptyFileText>Empty, No files</StyledEmptyFileText>
    </StyledEmptyFileScreenContainer>
  );
};

export default EmptyFileScreen;

const styles = StyleSheet.create({
  loaderStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingBottom: 100,
  },
});
