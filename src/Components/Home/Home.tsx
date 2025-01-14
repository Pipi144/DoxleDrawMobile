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
import {StyleSheet} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import HomeNavMenu from '../HomeNavMenu/HomeNavMenu';
import FloorMenu from './Components/FloorMenu/FloorMenu';
import DrawStage from './Components/DrawStage/DrawStage';

type Props = {};

const StyledHome = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
`;

const Home = (props: Props) => {
  return (
    <StyledHome>
      <DrawStage />
      <FloorMenu />
      <HomeNavMenu />
    </StyledHome>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'relative',
  },
});
