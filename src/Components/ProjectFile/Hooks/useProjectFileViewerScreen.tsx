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

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {useShallow} from 'zustand/react/shallow';

import {TProjectFileTabStack} from '../Routes/ProjectFileRouteTypes';
import {useOrientation} from '../../../Providers/OrientationContext';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';
import {LayoutChangeEvent} from 'react-native';

const useProjectFileViewerScreen = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isImageError, setisImageError] = useState<boolean>(false);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [layoutEditStage, setlayoutEditStage] = useState<
    {width: number; height: number; x: number; y: number} | undefined
  >(undefined);
  const {url, type} = useRoute()
    .params as TProjectFileTabStack['ProjectFileViewerScreen'];
  const navigation = useNavigation();
  const {deviceSize} = useOrientation();
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,

        setBackBtn: state.setBackBtn,
      })),
    );
  const ITEM_WIDTH = 0.95 * deviceSize.deviceWidth;

  const handleNavBack = () => {
    navigation.goBack();
    setBackBtn(null);
  };

  const getLayoutEditStage = (event: LayoutChangeEvent) => {
    setlayoutEditStage({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y,
    });
  };

  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(null);
      setOveridenRouteName(`View File`);
      setBackBtn({
        onPress: handleNavBack,
      });
    }, []),
  );
  return {
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
  };
};

export default useProjectFileViewerScreen;
