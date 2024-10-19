import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';

import {useIsFocused, useRoute} from '@react-navigation/native';

import useQAImageMarkup from '../../Hooks/useQAImageMarkup';
import ProcessingScreen from '../../../../../../../Utilities/AnimationScreens/ProcessingAnimation/ProcessingScreen';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {TQATabStack} from '../../Routes/QARouteType';
import {
  IArrow,
  ICircle,
  ILabel,
  IPath,
  IRectangle,
  IStraightLine,
} from '../../../../../../../Models/MarkupTypes';
import {PhotoAnnotation} from '../../../../../PhotoAnnotation/PhotoAnnotation';

type Props = {navigation: any};

const QAImageMarkup = ({navigation}: Props) => {
  const route = useRoute();
  const {selectedAnnotationImage} = route.params as TQATabStack['QAMarkup'];
  const {onSaveAnnotationImage, isSavingData, handleGoback, imgPathForMarkup} =
    useQAImageMarkup({
      selectedAnnotationImage,
    });

  const initialMarkup:
    | Array<ICircle | IStraightLine | ILabel | IRectangle | IArrow | IPath>
    | undefined = selectedAnnotationImage
    ? selectedAnnotationImage.markupList.length > 0
      ? selectedAnnotationImage.markupList.map(markup => {
          if (markup.shape === 'circle')
            return {
              type: 'Circle',
              x: Number(markup.startX),
              y: Number(markup.startY),
              r: Number(markup.radius),
              color: markup.borderColor,
            } as ICircle;
          else if (markup.shape === 'arrow')
            return {
              type: 'Arrow',
              x1:
                typeof markup.startX === 'string'
                  ? Number(markup.startX)
                  : markup.startX,
              y1:
                typeof markup.startY === 'string'
                  ? Number(markup.startY)
                  : markup.startY,
              x2:
                typeof markup.endX === 'string'
                  ? Number(markup.endX)
                  : markup.endX,
              y2:
                typeof markup.endY === 'string'
                  ? Number(markup.endY)
                  : markup.endY,
              color: markup.bgColor,
            } as IArrow;
          else if (markup.shape === 'rectangle')
            return {
              type: 'Rectangle',
              x: Number(markup.startX),
              y: Number(markup.startY),
              w: Number(markup.endX) - Number(markup.startX),
              h: Number(markup.endY) - Number(markup.startY),
              color: markup.bgColor,
            } as IRectangle;
          else if (markup.shape === 'line')
            return {
              type: 'StraightLine',
              x1: Number(markup.startX),
              y1: Number(markup.startY),
              x2: Number(markup.endX),
              y2: Number(markup.endY),
              color: markup.bgColor,
            } as IStraightLine;
          else if (markup.shape === 'path') {
            return {
              type: 'Pencil',
              pathPoints: markup.path,
              color: markup.bgColor,
            } as IPath;
          } else
            return {
              type: 'Text',
              x: Number(markup.startX),
              y: Number(markup.startY),
              text: markup.markupText,
              color: markup.bgColor,
              width: 30,
              height: 30,
            } as ILabel;
        })
      : undefined
    : undefined;
  useEffect(() => {
    console.log('selectedAnnotationImage', selectedAnnotationImage);
  }, [selectedAnnotationImage]);

  const isFocused = useIsFocused();
  if (isFocused)
    return selectedAnnotationImage ? (
      <>
        {/* <ActivityIndicator
          size={getFontSizeScale(40)}
          color={THEME_COLOR.doxleColor}
          style={{
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        /> */}
        <PhotoAnnotation
          backgroundImage={{
            imageUri: imgPathForMarkup,
            width: selectedAnnotationImage.qaImage.imageWidth,
            height: selectedAnnotationImage.qaImage.imageHeight,
            imageId: selectedAnnotationImage.qaImage.imageId,
          }}
          initialMarkup={initialMarkup}
          onCloseAnnotation={handleGoback}
          onCaptureImage={onSaveAnnotationImage}
        />
        {isSavingData && (
          <View style={styles.loadingContainer}>
            <ProcessingScreen
              processingType="update"
              processingText="Saving Image, Please wait..."
              animationSize={88}
              loadingTextStyle={styles.loadingText}
            />
          </View>
        )}
      </>
    ) : (
      <></>
    );
  else return <></>;
};

export default QAImageMarkup;

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    fontSize: getFontSizeScale(20),
    fontWeight: '500',
  },

  rootContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
  },
});
