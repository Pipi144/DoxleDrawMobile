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
import React, {useEffect, useMemo} from 'react';
import {IBackground} from '../../../../Models/DrawModels/Backgrounds';
import {Image} from 'react-native-svg';

import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {
  bgItem: IBackground;
};

const Background = ({bgItem}: Props) => {
  const {theme} = useDOXLETheme();

  const {width, height} = useMemo(() => {
    const width = bgItem?.width ?? 100;
    const height = bgItem?.height ?? 100;

    return {
      width: isNaN(width) ? 100 : width * bgItem.scaleX,
      height: isNaN(height) ? 100 : height * bgItem.scaleY,
    };
  }, [bgItem]);

  useEffect(() => {
    console.log(bgItem);
  }, [bgItem]);

  return (
    <>
      <Image
        href={bgItem.imageUrl}
        width={width}
        height={height}
        x={bgItem.xPosition}
        y={bgItem.yPosition}
        opacity={1}
      />
    </>
  );
};

export default Background;

const styles = StyleSheet.create({});
