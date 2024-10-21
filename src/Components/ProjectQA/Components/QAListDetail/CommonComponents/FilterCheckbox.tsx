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
import {View, Text} from 'react-native';
import React from 'react';

import FeatherIcon from 'react-native-vector-icons/Feather';
import BouncyCheckbox, {
  BouncyCheckboxProps,
} from 'react-native-bouncy-checkbox';
import {useDOXLETheme} from '../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
type Props = BouncyCheckboxProps & {};

const FilterCheckbox = ({...props}: Props) => {
  const {staticMenuColor, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  return (
    <BouncyCheckbox
      {...props}
      size={20}
      unFillColor="transparent"
      fillColor={staticMenuColor.staticWhiteFontColor}
      iconStyle={{
        borderWidth: 0,
        marginRight: 0,
        paddingRight: 0,
        borderRadius: 4,
      }}
      innerIconStyle={{
        borderRadius: 4,
        borderColor: staticMenuColor.staticDivider,
      }}
      style={[{overflow: 'hidden', marginTop: 14}]}
      textStyle={{
        fontFamily: DOXLE_FONT.lexendRegular,
        fontWeight: '400',
        fontSize: doxleFontSize.subContentTextSize,
        color: staticMenuColor.staticWhiteFontColor,
        textTransform: 'capitalize',
        textDecorationLine: 'none',
        marginLeft: 0,
        letterSpacing: 0.25,
      }}
      textContainerStyle={{
        marginLeft: 10,
      }}
      iconComponent={
        props.isChecked && (
          <FeatherIcon
            name="check"
            size={doxleFontSize.headTitleTextSize}
            color={staticMenuColor.staticBlackFontColor}
          />
        )
      }
    />
  );
};

export default FilterCheckbox;
