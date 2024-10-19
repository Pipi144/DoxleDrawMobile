import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {StyledPdfPageSkeleton} from './StyledComponentQAViewPdf';
import {Skeleton} from 'native-base';

import {FadeIn, FadeOut} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';

type Props = {};

const PdfPageSkeleton = (props: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();

  const {deviceSize, deviceType} = useOrientation();
  return (
    <StyledPdfPageSkeleton
      $themeColor={THEME_COLOR}
      entering={FadeIn}
      exiting={FadeOut}
      style={{marginBottom: deviceSize.insetBottom}}>
      <Skeleton
        borderRadius={8}
        width="30%"
        height={deviceType === 'Smartphone' ? 44 : 48}
        startColor={THEME_COLOR.skeletonColor}
        style={{marginBottom: 60}}
      />

      <Skeleton
        borderRadius={8}
        width="40%"
        height={deviceType === 'Smartphone' ? 14 : 16}
        startColor={THEME_COLOR.skeletonColor}
        mb="1.5"
      />
      <Skeleton
        borderRadius={8}
        width="50%"
        height={deviceType === 'Smartphone' ? 14 : 16}
        startColor={THEME_COLOR.skeletonColor}
        mb="1.5"
      />
      <Skeleton
        borderRadius={8}
        width="60%"
        height={deviceType === 'Smartphone' ? 14 : 16}
        startColor={THEME_COLOR.skeletonColor}
        marginBottom="32"
      />

      <Skeleton
        borderRadius={8}
        width="30%"
        height={deviceType === 'Smartphone' ? 20 : 23}
        startColor={THEME_COLOR.skeletonColor}
        mb={2}
      />
      <Skeleton
        borderRadius={8}
        width="100%"
        height={deviceType === 'Smartphone' ? 14 : 16}
        alignSelf="center"
        startColor={THEME_COLOR.skeletonColor}
        mb="10"
      />

      <Skeleton
        borderRadius={8}
        width="100%"
        height={deviceType === 'Smartphone' ? 14 : 16}
        startColor={THEME_COLOR.skeletonColor}
        mb={2}
      />

      <Skeleton
        borderRadius={8}
        width="90%"
        height={deviceType === 'Smartphone' ? 14 : 16}
        startColor={THEME_COLOR.skeletonColor}
        mb={14}
      />

      <Skeleton
        borderRadius={8}
        width="100%"
        style={{flex: 1}}
        startColor={THEME_COLOR.skeletonColor}
      />
    </StyledPdfPageSkeleton>
  );
};

export default PdfPageSkeleton;

const styles = StyleSheet.create({});
