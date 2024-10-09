import {Easing, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  StyledPDFLoaderText,
  StyledProjectFileViewerScreen,
  StyledZoomableStageView,
} from './StyledComponentProjectFileViewerScreen';
import Pdf from 'react-native-pdf';

import useProjectFileViewerScreen from './Hooks/useProjectFileViewerScreen';
import VideoPlayer from 'react-native-media-console';
import {useAnimations} from '@react-native-media-console/reanimated';
import Animated from 'react-native-reanimated';
import {FasterImageView} from '@candlefinance/faster-image';
import {ActivityIndicator} from 'react-native-paper';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
type Props = {navigation: any};

const AnimatedImage = Animated.createAnimatedComponent(FasterImageView);
const ProjectFileViewerScreen = (props: Props) => {
  const {
    setIsLoadingImage,
    setisImageError,
    setImageHeight,
    layoutEditStage,

    getLayoutEditStage,
    type,
    imageHeight,
    url,
    ITEM_WIDTH,
    isLoadingImage,
    isImageError,
    pdfLoaderRef,
    isLoadingPdf,
    setIsLoadingPdf,
    pdfLoadProgress,
    setPdfLoadProgress,
  } = useProjectFileViewerScreen();
  const {staticMenuColor, doxleFontSize} = useDOXLETheme();
  return (
    <StyledProjectFileViewerScreen $insetTop={8} onLayout={getLayoutEditStage}>
      {type.toLowerCase() === 'application/pdf' ? (
        <>
          {/* {true && (
            <AnimatedCircularProgress
              size={50}
              width={5}
              ref={pdfLoaderRef}
              fill={pdfLoadProgress}
              tintColor={staticMenuColor.staticWhiteFontColor}
              tintTransparency
              backgroundColor={staticMenuColor.staticWhiteFontColor}
              style={styles.loaderStyle}
              childrenContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                padding: 2,
              }}
              prefill={0}>
              {fill => (
                <StyledPDFLoaderText>{Math.floor(fill)}</StyledPDFLoaderText>
              )}
            </AnimatedCircularProgress>
          )} */}
          <Pdf
            style={styles.viewFile}
            source={{uri: url}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
              setIsLoadingPdf(false);
            }}
            onLoadProgress={percent => {
              pdfLoaderRef.current?.animate(
                Math.floor(percent),
                500,
                Easing.quad,
              );
              setPdfLoadProgress(percent);
            }}
            trustAllCerts={false}
            onError={error => {
              console.log('Error:', error);
              setIsLoadingPdf(false);
            }}
            renderActivityIndicator={progress => {
              return (
                <AnimatedCircularProgress
                  size={50}
                  width={5}
                  ref={pdfLoaderRef}
                  fill={progress * 100}
                  fillLineCap="round"
                  tintColor={staticMenuColor.staticWhiteFontColor}
                  backgroundColor={'transparent'}
                  style={styles.loaderStyle}
                  childrenContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    padding: 2,
                  }}
                  prefill={0}>
                  {fill => (
                    <StyledPDFLoaderText>
                      {Math.floor(fill)}
                    </StyledPDFLoaderText>
                  )}
                </AnimatedCircularProgress>
              );
            }}
            maxScale={40}
            minScale={0.1}
          />
        </>
      ) : type.toLowerCase().includes('image') ? (
        layoutEditStage && (
          <StyledZoomableStageView
            maxZoom={14}
            minZoom={0.4}
            zoomStep={0.3}
            initialZoom={layoutEditStage.width / ITEM_WIDTH} //this scale will make the img fit the screen
            bindToBorders={true}
            doubleTapZoomToCenter={true}>
            <View pointerEvents="none">
              <AnimatedImage
                style={{width: ITEM_WIDTH, height: imageHeight}}
                onSuccess={event => {
                  setImageHeight(
                    (event.nativeEvent.height / event.nativeEvent.width) *
                      ITEM_WIDTH,
                  );
                  setIsLoadingImage(false);
                }}
                onError={() => {
                  setIsLoadingImage(false);
                  setisImageError(true);
                }}
                source={{url: url, resizeMode: 'contain'}}
              />
            </View>

            {isLoadingImage && (
              <ActivityIndicator
                color={staticMenuColor.staticWhiteFontColor}
                size={doxleFontSize.pageTitleFontSize}
                style={styles.loaderStyle}
              />
            )}

            {isImageError && (
              <MateIcon
                name="image-not-supported"
                style={styles.loaderStyle}
                size={doxleFontSize.pageTitleFontSize * 2}
                color={staticMenuColor.staticWhiteFontColor}
              />
            )}
          </StyledZoomableStageView>
        )
      ) : type.toLowerCase().includes('mp4') ||
        type.toLowerCase().includes('video') ? (
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <VideoPlayer
            useAnimations={useAnimations}
            source={{uri: url}}
            disableBack
            style={{width: '100%', height: '100%', backgroundColor: 'blue'}}
          />
        </View>
      ) : null}
    </StyledProjectFileViewerScreen>
  );
};

export default ProjectFileViewerScreen;

const styles = StyleSheet.create({
  viewFile: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    right: 10,

    position: 'absolute',
    zIndex: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderStyle: {
    position: 'absolute',
    zIndex: 100,
    alignSelf: 'center',
  },
});
