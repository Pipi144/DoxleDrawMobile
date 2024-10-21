import {StyleSheet} from 'react-native';
import React, {createContext, useContext} from 'react';
import {
  StyledImageBackground,
  StyledPhotoAnnotationContainer,
} from './StyledComponentPhotoAnnotation';
import ViewShot from 'react-native-view-shot';
import AnnotationHandler from './AnnotationHandler';
import AnnotationDisplayer from './AnnotationDisplayer';
import usePhotoAnnotation, {
  IPhotoAnnotationContextValue,
} from './Hooks/usePhotoAnnotation';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import AnnotateTopMenu from './AnnotateTopMenu';
import MarkupTextHandler from './MarkupTextHandler';
import {
  IArrow,
  ICircle,
  ILabel,
  IPath,
  IPhotoAnnotationBgImageProp,
  IRectangle,
  IStraightLine,
} from '../../Models/MarkupTypes';
import {useOrientation} from '../../Providers/OrientationContext';

type Props = {
  backgroundImage: IPhotoAnnotationBgImageProp;
  initialMarkup?: Array<
    ICircle | IStraightLine | ILabel | IRectangle | IArrow | IPath
  >;
  onCaptureImage?: (props: {
    uri: string;
    markupList: Array<
      ICircle | IStraightLine | ILabel | IRectangle | IArrow | IPath
    >;
  }) => void;
  onCloseAnnotation: () => void;
};

const PhotoAnnotationContext =
  createContext<IPhotoAnnotationContextValue | null>(null);
const PhotoAnnotation = ({
  backgroundImage,
  onCaptureImage,
  onCloseAnnotation,
  initialMarkup,
}: Props) => {
  const {deviceSize} = useOrientation();
  const hookValues = usePhotoAnnotation({
    backgroundImage,
    onCaptureImage,
    onCloseAnnotation,
    initialMarkup,
  });
  const {
    getLayoutEditStage,
    layoutEditStage,
    viewshotRef,
    showNotification,
    zoomRef,
    scaledHeight,
  } = hookValues;

  return (
    <PhotoAnnotationContext.Provider value={hookValues}>
      <StyledPhotoAnnotationContainer onLayout={getLayoutEditStage}>
        {layoutEditStage ? (
          <ReactNativeZoomableView
            maxZoom={14}
            minZoom={0.4}
            ref={zoomRef}
            zoomStep={0.8}
            initialZoom={1}
            bindToBorders={false}
            movementSensibility={1.2}
            style={{
              ...styles.zoomStage,
              width: layoutEditStage.width,
              height: scaledHeight,
            }}
            doubleTapZoomToCenter={false}>
            <ViewShot
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: layoutEditStage.width,
                height: scaledHeight,
                zIndex: 0,
                position: 'relative',
              }}
              ref={viewshotRef}
              options={{
                format: 'jpg',
                quality: 1,
              }}>
              <StyledImageBackground
                source={{
                  uri: backgroundImage.imageUri,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
                onError={error =>
                  showNotification(
                    'Failed To Read Image!',
                    'error',
                    error.nativeEvent.error,
                  )
                }
              />

              <AnnotationDisplayer />
              <AnnotationHandler />
            </ViewShot>
          </ReactNativeZoomableView>
        ) : null}
        <MarkupTextHandler />
        <AnnotateTopMenu />
      </StyledPhotoAnnotationContainer>
    </PhotoAnnotationContext.Provider>
  );
};

const usePhotoAnnotationContext = () =>
  useContext(PhotoAnnotationContext) as IPhotoAnnotationContextValue;
export {PhotoAnnotation, usePhotoAnnotationContext};

const styles = StyleSheet.create({
  zoomStage: {
    zIndex: 1,
    display: 'flex',

    position: 'relative',

    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});
