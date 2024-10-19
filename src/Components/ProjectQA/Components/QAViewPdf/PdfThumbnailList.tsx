import {StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PdfThumbnail from 'react-native-pdf-thumbnail';

import Animated, {LinearTransition} from 'react-native-reanimated';

import {StyledPdfThumbnailListContainer} from './StyledComponentQAViewPdf';
import PDFThumbnailItem from './PDFThumbnailItem';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';
import {exists} from 'react-native-fs';
type Props = {
  pdfPath: string;

  currentViewedPage: number;
};
export interface PDFThumbnailItemProp {
  uri: string;
  width: number;
  height: number;
}
const PdfThumbnailList: React.FC<Props> = ({
  pdfPath,

  currentViewedPage,
}: Props) => {
  const [thumnailList, setThumnailList] = useState<PDFThumbnailItemProp[]>([]);
  const {THEME_COLOR} = useDOXLETheme();

  const {deviceSize, isPortraitMode} = useOrientation();
  const generateThumbnail = async () => {
    try {
      console.log('PDF PATH', pdfPath);
      const resultCheck = await exists(pdfPath);
      console.log('RESULT CHECK', resultCheck);
      const result = await PdfThumbnail.generateAllPages(pdfPath);
      if (result) {
        setThumnailList([...result] as PDFThumbnailItemProp[]);
      }
    } catch (error) {
      console.log('ERROR CREATE THUMBNAIL PDF', error);
    }
  };
  useEffect(() => {
    setThumnailList([]);
    generateThumbnail();
  }, [pdfPath]);
  const thumbListRef = useRef<Animated.FlatList<PDFThumbnailItemProp>>(null);

  useEffect(() => {
    if (thumbListRef.current && thumnailList.length > 0) {
      thumbListRef.current.scrollToIndex({
        animated: true,
        index: currentViewedPage,
      });
    }
  }, [currentViewedPage, thumnailList]);
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(16)}
      style={
        isPortraitMode
          ? {
              height: getFontSizeScale(120),
              width: '100%',
              maxHeight: 160,
              display: 'flex',
            }
          : [
              {
                height: '100%',
                width: getFontSizeScale(120),
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
        $themeColor={THEME_COLOR}
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
const styles = StyleSheet.create({
  expandBtn: {
    position: 'absolute',
    top: 14,
    right: 4,

    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
