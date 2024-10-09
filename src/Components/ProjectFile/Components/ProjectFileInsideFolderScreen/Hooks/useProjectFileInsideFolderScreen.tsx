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
import React, {useCallback} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import FileMenuFolderMode from '../../FilePopupMenu/FileMenuFolderMode';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';

const useProjectFileInsideFolderScreen = () => {
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );
  const {currentView, currentFolder, setCurrentFolder} = useProjectFileStore(
    useShallow(state => ({
      currentView: state.currentView,
      currentFolder: state.currentFolder,
      setCurrentFolder: state.setCurrentFolder,
    })),
  );
  const navigation = useNavigation();
  const handleNavBack = () => {
    navigation.goBack();
    setCurrentFolder(undefined);
    setOveridenRouteName(undefined);

    setBackBtn(null);
  };

  useFocusEffect(
    useCallback(() => {
      if (currentFolder) {
        setCustomisedPopupMenu(<FileMenuFolderMode />);
        setOveridenRouteName(currentFolder.folderName);
        setBackBtn({
          onPress: handleNavBack,
        });
      }
    }, [currentFolder]),
  );
  return {currentView};
};

export default useProjectFileInsideFolderScreen;
