import {StyleSheet, View} from 'react-native';
import React from 'react';

import {ActivityIndicator} from 'react-native-paper';

import QAItemEmptyImagePlaceHolder from './QAItemEmptyImagePlaceHolder';

import FastImage from 'react-native-fast-image';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {QAWithFirstImg} from '../../../../../../../Models/qa';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import useQAItemImageSection from '../../Hooks/useQAItemImageSection';
import {StyledQAItemImageSectionContainer} from './StyledComponentsQAListDetail';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
type Props = {
  qaDetail: QAWithFirstImg;
  viewMode: 'list' | 'grid';
};

const QAItemImageSection = ({qaDetail, viewMode}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {isPortraitMode} = useOrientation();
  const {
    isLoadingImg,

    onLoadImgStart,
    onLoadImgEnd,
    onErrorLoadImg,
    isImageFailed,
    displayedImgUrl,
  } = useQAItemImageSection({qaDetail});

  return (
    <StyledQAItemImageSectionContainer
      $isPortraitMode={isPortraitMode}
      $viewMode={viewMode}>
      <>
        {displayedImgUrl ? (
          <>
            <FastImage
              source={{
                uri: displayedImgUrl,
              }}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 2,
              }}
              onLoadStart={onLoadImgStart}
              onLoadEnd={onLoadImgEnd}
              onError={onErrorLoadImg}
            />

            {isImageFailed && (
              <MaterialIcon
                name="image-off-outline"
                color={THEME_COLOR.primaryFontColor}
                size={doxleFontSize.pageTitleFontSize}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                }}
              />
            )}
          </>
        ) : (
          <QAItemEmptyImagePlaceHolder />
        )}
      </>

      {isLoadingImg && (
        <View style={styles.imgLoaderContainer}>
          <ActivityIndicator
            size={doxleFontSize.subContentTextSize}
            color={THEME_COLOR.primaryFontColor}
          />
        </View>
      )}
    </StyledQAItemImageSectionContainer>
  );
};

export default QAItemImageSection;

const styles = StyleSheet.create({
  imgLoaderContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
