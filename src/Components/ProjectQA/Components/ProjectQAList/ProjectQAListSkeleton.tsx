import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';

import Animated, {FadeInUp, FadeOutRight} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {};

const ProjectQAListSkeleton = (props: Props) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutRight}
      style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 14,
      }}>
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          data={Array(20).fill('qaListSkel')}
          renderItem={({item, index}) => <QASkelRow />}
          keyExtractor={(item, index) => item + index}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </Animated.View>
  );
};

export default ProjectQAListSkeleton;

const styles = StyleSheet.create({
  skelRowContainer: {
    width: '100%',
    height: 80,
    marginBottom: 28,
    display: 'flex',
    borderRadius: 12,
  },
  skelTopTitle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
const QASkelRow = () => {
  const {THEME_COLOR, theme} = useDOXLETheme();

  return <View style={[styles.skelRowContainer]}></View>;
};
