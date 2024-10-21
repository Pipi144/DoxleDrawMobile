// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import Animated from 'react-native-reanimated';

type Props = {pdfPath: string; currentViewedPage: number};
export interface PDFThumbnailItemProp {
  uri: string;
  width: number;
  height: number;
}
const usePdfThumbnailList = ({pdfPath, currentViewedPage}: Props) => {
  const [thumnailList, setThumnailList] = useState<PDFThumbnailItemProp[]>([]);
  const generateThumbnail = async () => {
    try {
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
  return {thumnailList, thumbListRef};
};

export default usePdfThumbnailList;
