import {LayoutChangeEvent, Platform} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';

import ViewShot from 'react-native-view-shot';
import {DocumentDirectoryPath} from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {SharedValue, useSharedValue, withSpring} from 'react-native-reanimated';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {
  ICircle,
  IPhotoAnnotationBgImageProp,
  IStraightLine,
  ILabel,
  IRectangle,
  IArrow,
  IPath,
  TAnnotationTools,
} from '../../../Models/MarkupTypes';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {TRgbaFormat} from '../../../Utilities/FunctionUtilities';
import {useNotification} from '../../../Providers/NotificationProvider';
import {useOrientation} from '../../../Providers/OrientationContext';

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

const usePhotoAnnotation = ({
  backgroundImage,
  onCaptureImage,
  onCloseAnnotation,
  initialMarkup,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const [tool, setTool] = useState<TAnnotationTools>('Pointer');
  const [currentColorForTool, setCurrentColorForTool] = useState<TRgbaFormat>(
    THEME_COLOR.primaryContainerColor,
  );
  const [oldMarkup, setOldMarkup] = useState<
    | Array<ICircle | IStraightLine | IRectangle | IArrow | IPath | ILabel>
    | undefined
  >(initialMarkup);

  const [addedMarkup, setAddedMarkup] = useState<
    Array<ICircle | IStraightLine | IRectangle | IArrow | IPath | ILabel>
  >([]);

  const [layoutEditStage, setlayoutEditStage] = useState<
    {width: number; height: number; x: number; y: number} | undefined
  >(undefined);
  const {showNotification} = useNotification();
  const {deviceSize} = useOrientation();
  const viewshotRef = useRef<ViewShot>(null);
  const zoomRef = useRef<ReactNativeZoomableView | null>(null);
  const handleTakeImg = useCallback(async () => {
    let captureURL: string | undefined;
    try {
      if (viewshotRef.current) {
        await (viewshotRef.current as any).capture().then((uri: any) => {
          captureURL = uri.toString();
        });
      }
      if (!captureURL) throw 'ERROR CAPTURE IMG';

      const newTempPath = DocumentDirectoryPath + '/tempCapture.jpeg';
      if (Platform.OS === 'ios')
        await ImageResizer.createResizedImage(
          captureURL,
          backgroundImage.width,
          backgroundImage.height,
          'JPEG',
          100,
          0,
          newTempPath,
        )
          .then(res => {
            if (onCaptureImage) {
              onCaptureImage({
                uri: res.uri,
                markupList: oldMarkup
                  ? [...oldMarkup, ...addedMarkup]
                  : addedMarkup,
              });
            }
          })
          .catch(error => {
            console.log('ERROR RESIZE:', error);

            return;
          });
      else {
        if (onCaptureImage) {
          onCaptureImage({
            uri: captureURL,
            markupList: oldMarkup
              ? [...oldMarkup, ...addedMarkup]
              : addedMarkup,
          });
        }
      }
    } catch (error) {
      console.log('ERROR CAPTUTRE IMG:', error);
      showNotification('Something Wrong! Unable To Process Image...', 'error');
    } finally {
    }
  }, [viewshotRef.current, oldMarkup, addedMarkup, backgroundImage]);

  const handleSaveBtn = useCallback(async () => {
    handleTakeImg();
  }, [handleTakeImg]);
  const handleClosePhotoAnnotationModal = useCallback(async () => {
    await handleTakeImg();

    setAddedMarkup([]);
    setOldMarkup(undefined);
    // setShowModal(false);
    onCloseAnnotation();
  }, [onCloseAnnotation, addedMarkup, initialMarkup, oldMarkup, handleTakeImg]);
  const getLayoutEditStage = useCallback((event: LayoutChangeEvent) => {
    setlayoutEditStage({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y,
    });
  }, []);

  const scaleFactor = deviceSize.deviceWidth / backgroundImage.width;
  const scaledHeight = backgroundImage.height * scaleFactor;
  const toggleAddedMarkupAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(addedMarkup.length > 0 ? 1 : 0),
  ).current;

  //useEffect listen to the change of addedMarkup to toggle the added markup animated value
  useEffect(() => {
    if (addedMarkup.length > 0)
      toggleAddedMarkupAnimatedValue.value = withSpring(1, {
        damping: 8,
        stiffness: 80,
      });
    else
      toggleAddedMarkupAnimatedValue.value = withSpring(0, {
        damping: 8,
        stiffness: 80,
      });
  }, [addedMarkup]);

  return {
    getLayoutEditStage,
    layoutEditStage,
    viewshotRef,
    showNotification,
    handleClosePhotoAnnotationModal,
    addedMarkup,
    oldMarkup,
    handleSaveBtn,
    tool,
    setTool,
    currentColorForTool,
    setCurrentColorForTool,
    setOldMarkup,
    setAddedMarkup,
    setlayoutEditStage,
    backgroundImage,
    zoomRef,
    scaledHeight,
    scaleFactor,
  };
};

export default usePhotoAnnotation;
export interface IPhotoAnnotationContextValue
  extends ReturnType<typeof usePhotoAnnotation> {}
