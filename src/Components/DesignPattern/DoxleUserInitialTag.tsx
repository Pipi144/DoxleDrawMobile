import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {
  IDoxleFont,
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';

type Props = {
  userFullName: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  extraPreTag?: string;
};

const DoxleUserInitialTag = ({
  userFullName,
  containerStyle,
  textStyle,
  extraPreTag,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const splitName = userFullName.split(' ');
  return (
    <View
      style={{
        ...styles(THEME_COLOR, DOXLE_FONT).tagContainer,
        ...containerStyle,
      }}>
      <Text
        style={
          textStyle ? textStyle : styles(THEME_COLOR, DOXLE_FONT).textStyle
        }>
        {extraPreTag}
        {splitName[0] && splitName[0][0] ? splitName[0][0] : ''}
        {splitName[1] && splitName[1][0] ? splitName[1][0] : ''}
      </Text>
    </View>
  );
};

export default DoxleUserInitialTag;

const styles = (themeColor: IDOXLEThemeColor, doxleFont: IDoxleFont) =>
  StyleSheet.create({
    tagContainer: {
      backgroundColor: editRgbaAlpha({
        rgbaColor: themeColor.doxleColor,
        alpha: '0.4',
      }),
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    textStyle: {
      color: themeColor.primaryFontColor,
      fontFamily: doxleFont.secondaryTitleFont,
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '500',
      textTransform: 'uppercase',
    },
  });
