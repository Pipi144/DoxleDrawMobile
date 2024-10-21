import React, {useEffect, useRef, useState} from 'react';
import PdfThumbnail from 'react-native-pdf-thumbnail';

import Animated, {LinearTransition} from 'react-native-reanimated';
import {StyledPdfThumbnailListContainer} from './StyledComponentQAViewPdf';
import PDFThumbnailItem from './PDFThumbnailItem';
import {exists} from 'react-native-fs';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import usePdfThumbnailList, {
  PDFThumbnailItemProp,
} from './Hooks/usePdfThumbnailList';
type Props = {
  pdfPath: string;

  currentViewedPage: number;
};

const PdfThumbnailList: React.FC<Props> = ({
  pdfPath,

  currentViewedPage,
}: Props) => {
  const {isPortraitMode, deviceType} = useOrientation();
  const {thumnailList, thumbListRef} = usePdfThumbnailList({
    pdfPath,

    currentViewedPage,
  });
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(16)}
      style={
        isPortraitMode
          ? {
              height: deviceType === 'Smartphone' ? 120 : 140,
              width: '100%',
              maxHeight: 160,
              display: 'flex',
            }
          : [
              {
                height: '100%',
                width: deviceType === 'Smartphone' ? 120 : 140,
                maxWidth: 300,
                display: 'flex',
                position: 'relative',
                zIndex: 1,
              },
            ]
      }>
      <StyledPdfThumbnailListContainer
        data={thumnailList}
        style={{
          height: '100%',
          width: '100%',
        }}
        horizontal={isPortraitMode ? true : false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',

          paddingHorizontal: isPortraitMode ? 14 : undefined,
          paddingVertical: !isPortraitMode ? 14 : undefined,
        }}
        ref={thumbListRef as any}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        renderItem={({item, index}) => (
          <PDFThumbnailItem
            item={item as PDFThumbnailItemProp}
            index={index}
            selected={index === currentViewedPage}
          />
        )}
        keyExtractor={(item, index) => `${index}`}
        onScrollToIndexFailed={info => {
          thumbListRef.current?.scrollToOffset({offset: 0, animated: true});
        }}
      />
    </Animated.View>
  );
};

export default React.memo(PdfThumbnailList);
