import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  StyledProjectFileViewerScreen,
  StyledZoomableStageView,
} from './StyledComponentProjectFileViewerScreen';
import Pdf from 'react-native-pdf';

import useProjectFileViewerScreen from '../../Hooks/useProjectFileViewerScreen';
import VideoPlayer from 'react-native-media-console';
import {useAnimations} from '@react-native-media-console/reanimated';
import Animated from 'react-native-reanimated';
import {FasterImageView} from '@candlefinance/faster-image';
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
  } = useProjectFileViewerScreen();
  return (
    <StyledProjectFileViewerScreen $insetTop={8} onLayout={getLayoutEditStage}>
      {type.toLowerCase() === 'application/pdf' ? (
        <Pdf
          style={styles.viewFile}
          source={{uri: url}}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          trustAllCerts={false}
          onError={error => {
            console.log('Error:', error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          maxScale={40}
          minScale={0.1}
        />
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
                source={{url: url, resizeMode: 'contain'}}
              />
            </View>
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
});
