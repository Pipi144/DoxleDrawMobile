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

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {Linking} from 'react-native';
import {useAppModalHeaderStore} from '../../../../../../GeneralStore/useAppModalHeaderStore';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

const AnimatedAntIcon = Animated.createAnimatedComponent(AntIcon);
const useProjectFileHistoryScreen = () => {
  const navigator = useNavigation();
  const {staticMenuColor} = useDOXLETheme();
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,

        setBackBtn: state.setBackBtn,
      })),
    );
  const {setCurrentFile, currentFile} = useProjectFileStore(
    useShallow(state => ({
      currentFile: state.currentFile,
      setCurrentFile: state.setCurrentFile,
    })),
  );
  const onPressLink = () => {
    if (currentFile) Linking.openURL(currentFile.url);
  };
  const handleNavBack = () => {
    navigator.goBack();
    setBackBtn(null);
    setCurrentFile(undefined);
  };
  useFocusEffect(() => {
    setCustomisedPopupMenu(null);
    setOveridenRouteName('File History');
    setBackBtn({
      icon: (
        <AnimatedAntIcon
          name="left"
          color={staticMenuColor.staticWhiteFontColor}
          size={25}
          entering={ZoomIn.springify().damping(16).stiffness(120)}
          exiting={ZoomOut.springify().damping(16).stiffness(120)}
        />
      ),
      onPress: handleNavBack,
    });
  });
  return {onPressLink, currentFile};
};

export default useProjectFileHistoryScreen;
