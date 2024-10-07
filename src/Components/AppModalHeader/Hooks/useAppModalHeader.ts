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

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TDoxleRootStack} from '../../../../Routes/RouteTypes';
import {useAppModalHeaderStore} from '../../../../GeneralStore/useAppModalHeaderStore';
import {useShallow} from 'zustand/react/shallow';

const useAppModalHeader = () => {
  const navigation = useNavigation<StackNavigationProp<TDoxleRootStack>>();
  const {
    openPopupMenu,
    setOpenPopupMenu,
    customisedPopupMenu,
    backBtn,
    overidenRouteName,
  } = useAppModalHeaderStore(
    useShallow(state => ({
      openPopupMenu: state.openPopupMenu,
      setOpenPopupMenu: state.setOpenPopupMenu,
      customisedPopupMenu: state.customisedPopupMenu,
      overidenRouteName: state.overidenRouteName,
      backBtn: state.backBtn,
    })),
  );
  const handlePressClose = () => {
    if (backBtn) {
      backBtn.onPress();
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: 'Home',
    //     },
    //   ],
    // });
    else navigation.goBack();
  };
  return {
    handlePressClose,
    openPopupMenu,
    setOpenPopupMenu,
    customisedPopupMenu,
    overidenRouteName,
    backBtn,
  };
};

export default useAppModalHeader;
