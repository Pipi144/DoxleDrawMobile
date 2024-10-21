import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {StyledPdfPageSkeleton} from './StyledComponentQAViewPdf';

import {FadeIn, FadeOut} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import Skeleton from 'react-native-reanimated-skeleton';

type Props = {};

const PdfPageSkeleton = (props: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();

  const {deviceSize, deviceType} = useOrientation();
  return (
    <Skeleton
      containerStyle={{
        marginBottom: deviceSize.insetBottom,
        flex: 1,
        display: 'flex',
        width: '95%',
        borderRadius: 8,
        backgroundColor: THEME_COLOR.primaryContainerColor,
        padding: 14,
        overflow: 'hidden',
      }}
      isLoading={true}>
      <Text
        style={{
          borderRadius: 8,
          width: '30%',
          height: deviceType === 'Smartphone' ? 44 : 48,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 60,
        }}
      />
      <Text
        style={{
          borderRadius: 8,
          width: '40%',
          height: deviceType === 'Smartphone' ? 14 : 16,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 15,
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '50%',
          height: deviceType === 'Smartphone' ? 14 : 16,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 15,
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '60%',
          height: deviceType === 'Smartphone' ? 14 : 16,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 15,
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '30%',
          height: deviceType === 'Smartphone' ? 20 : 23,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 20,
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '100%',
          height: deviceType === 'Smartphone' ? 14 : 16,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 100,
          alignSelf: 'center',
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '100%',
          height: deviceType === 'Smartphone' ? 14 : 16,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 20,
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '90%',
          height: deviceType === 'Smartphone' ? 14 : 16,
          backgroundColor: THEME_COLOR.skeletonColor,
          marginBottom: 140,
        }}
      />

      <Text
        style={{
          borderRadius: 8,
          width: '100%',
          flex: 1,
        }}
      />
    </Skeleton>
  );
};

export default PdfPageSkeleton;

const styles = StyleSheet.create({});
