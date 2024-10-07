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

import React, {ReactElement, ReactNode} from 'react';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

interface IBackBtnProps {
  icon?: ReactNode;
  onPress: Function;
}
interface IAppModalHeaderState {
  overidenRouteName: string | undefined;
  setOveridenRouteName: (route: string | undefined) => void;

  openPopupMenu: boolean;
  setOpenPopupMenu: (value: boolean) => void;
  customisedPopupMenu: React.JSX.Element | null;
  setCustomisedPopupMenu: (popup: React.JSX.Element | null) => void;

  backBtn: IBackBtnProps | null;
  setBackBtn: (backBtn: IBackBtnProps | null) => void;
}

export const useAppModalHeaderStore = create(
  immer<IAppModalHeaderState>((set, get) => ({
    overidenRouteName: undefined,
    setOveridenRouteName: (route: string | undefined) => {
      set(state => {
        state.overidenRouteName = route;
      });
    },
    openPopupMenu: false,
    setOpenPopupMenu: (value: boolean) => {
      set(state => {
        state.openPopupMenu = value;
      });
    },
    customisedPopupMenu: null,
    setCustomisedPopupMenu: (popup: React.JSX.Element | null) => {
      set(state => {
        state.customisedPopupMenu = popup;
      });
    },

    backBtn: null,
    setBackBtn: (backBtn: IBackBtnProps | null) => {
      set(state => {
        state.backBtn = backBtn;
      });
    },
  })),
);
