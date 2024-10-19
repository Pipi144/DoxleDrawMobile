import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {PDFThumbnailItemProp} from './PdfThumbnailList';
import {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  StyledImageThumnail,
  StyledThumbnailItemContainer,
} from './StyledComponentQAViewPdf';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {useQAViewPDFContext} from './QAViewPDF';

type Props = {
  item: PDFThumbnailItemProp;
  index: number;

  selected: boolean;
};

const PDFThumbnailItem: React.FC<Props> = ({
  item,
  index,

  selected,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceSize, isPortraitMode} = useOrientation();
  const ITEM_WIDTH = deviceSize.deviceWidth * 0.14;
  const NUM_OF_VISIBLE_ITEMS = 3;
  //################## HANDLE ANIMATION ################
  const selectedAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(selected ? 1 : 0),
  ).current;
  const thumnailAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(selectedAnimatedValue.value, [0, 1], [0.8, 1]);

    const opacity = interpolate(selectedAnimatedValue.value, [0, 1], [0.7, 1]);
    return {
      transform: [{scale}],
      opacity,
    };
  });
  const {pdfViewerRef} = useQAViewPDFContext();

  useEffect(() => {
    if (selected) selectedAnimatedValue.value = withSpring(1, {damping: 16});
    else selectedAnimatedValue.value = withSpring(0, {damping: 16});
  }, [selected]);

  //############ END OF HANDLE ANIMATION ###############

  return (
    <StyledThumbnailItemContainer
      $isPortraitMode={isPortraitMode}
      $themeColor={THEME_COLOR}
      onPress={() => pdfViewerRef.current?.setPage(index + 1)}>
      <StyledImageThumnail
        style={[thumnailAnimatedStyle]}
        heightInPixel={`${deviceSize.deviceHeight * 0.1}px`}
        widthInPixel={`${ITEM_WIDTH}px`}
        source={{uri: item.uri}}
        resizeMode="cover"
      />
    </StyledThumbnailItemContainer>
  );
};

export default React.memo(PDFThumbnailItem);

const styles = StyleSheet.create({});
