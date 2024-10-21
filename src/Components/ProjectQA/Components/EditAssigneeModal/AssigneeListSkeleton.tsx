import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Skeleton from 'react-native-reanimated-skeleton';

type Props = {};

const AssigneeListSkeleton = (props: Props) => {
  const array: string[] = Array(20).fill('skelAssignee');
  const {THEME_COLOR} = useDOXLETheme();
  return (
    <FlatList
      contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}
      data={array}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <Skeleton
          containerStyle={{
            width: '90%',
            marginVertical: 2,
            marginHorizontal: 4,
          }}
          isLoading={true}>
          <Text style={{width: '100%', height: 14}} />
        </Skeleton>
      )}
      keyExtractor={(item, index) => `${item}#${index}`}
    />
  );
};

export default AssigneeListSkeleton;

const styles = StyleSheet.create({});
