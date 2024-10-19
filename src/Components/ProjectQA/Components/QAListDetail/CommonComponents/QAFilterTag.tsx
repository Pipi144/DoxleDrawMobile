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
import {View} from 'react-native';
import React from 'react';
import {StyledQAFilterTag, StyledQAFilterTagText} from './StyledComponents';
import {LinearTransition} from 'react-native-reanimated/src/layoutReanimation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useDOXLETheme} from '../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
type Props<TItem> = {
  item: TItem;
  displayText: string;
  enableRemove?: boolean;
  onRemove?: (item: TItem) => void;
  extraContent?: React.ReactNode;
};

const QAFilterTag = <T extends any>(props: Props<T>) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  return (
    <StyledQAFilterTag
      layout={LinearTransition.springify().damping(16).mass(0.6)}>
      <View style={{}}>
        <StyledQAFilterTagText>{props.displayText}</StyledQAFilterTagText>
        {props.extraContent}
      </View>

      <AntIcon
        name="close"
        color={THEME_COLOR.primaryFontColor}
        size={doxleFontSize.headTitleTextSize}
        style={{
          marginLeft: 8,
        }}
        onPress={() => props.onRemove?.(props.item)}
      />
    </StyledQAFilterTag>
  );
};

export default QAFilterTag;
