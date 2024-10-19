import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Skeleton} from 'native-base';
import {getFontSizeScale} from '../../../../../../../Utilities/FunctionUtilities';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {};

const AssigneeListSkeleton = (props: Props) => {
  const array: string[] = Array(20).fill('skelAssignee');
  const {theme, THEME_COLOR} = useDOXLETheme();
  return (
    <FlatList
      contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}
      data={array}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <Skeleton
          rounded="full"
          width="90%"
          height={getFontSizeScale(4)}
          startColor={THEME_COLOR.skeletonColor}
          marginY={2}
          marginX={4}
        />
      )}
      keyExtractor={(item, index) => `${item}#${index}`}
    />
  );
};

export default AssigneeListSkeleton;

const styles = StyleSheet.create({});
