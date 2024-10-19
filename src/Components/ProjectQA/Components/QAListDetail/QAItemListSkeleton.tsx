import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import Animated from 'react-native-reanimated';

import {Skeleton} from 'native-base';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';

type Props = {listWidth: number};

const QAItemListSkeleton = ({listWidth}: Props) => {
  const {deviceType, isPortraitMode} = useOrientation();
  const numOfCol = useMemo(
    () => (deviceType === 'Smartphone' ? 1 : 2),
    [deviceType, isPortraitMode],
  );
  return (
    <Animated.FlatList
      key={`qaList_${numOfCol}`}
      numColumns={numOfCol}
      data={Array(20).fill('qaItemSkel')}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <QAItemSkeletonRow
          item={item}
          numOfCol={numOfCol}
          listWidth={listWidth}
        />
      )}
      keyExtractor={(item, index) => item + index}
    />
  );
};

export default QAItemListSkeleton;

const QAItemSkeletonRow = (props: {
  item: string;
  numOfCol: number;
  listWidth: number;
}) => {
  const {numOfCol, listWidth} = props;
  const {THEME_COLOR, theme} = useDOXLETheme();
  const {deviceType} = useOrientation();
  return (
    <View
      style={[
        styles.skelRowContainer,
        {
          height: deviceType === 'Smartphone' || numOfCol > 2 ? 140 : 200,
        },
        numOfCol <= 1
          ? {
              width: '100%',
              marginBottom: 14,

              padding: 8,
            }
          : {
              width: `${100 / numOfCol}%`,
              padding: 5,
            },
      ]}>
      <View
        style={[
          styles.skelRowContainer,
          {
            height: '100%',
            width: '100%',
            padding: 8,
          },
          numOfCol <= 1
            ? {
                borderBottomWidth: 1,
                borderBottomColor: THEME_COLOR.primaryDividerColor,
              }
            : {
                borderWidth: 1,
                borderColor: THEME_COLOR.primaryDividerColor,
                borderRadius: 4,
              },
        ]}>
        <Skeleton
          startColor={THEME_COLOR.skeletonColor}
          rounded="full"
          style={{height: '100%', width: '28%'}}
          borderRadius={6}
          marginRight={2}
        />
        <View style={styles.contentSkelContainer}>
          <Skeleton
            startColor={THEME_COLOR.skeletonColor}
            rounded="full"
            width="50%"
            height={'16px'}
            marginTop={2}
          />
          <View style={styles.subTitleSkelContainer}>
            <Skeleton
              startColor={THEME_COLOR.skeletonColor}
              rounded="full"
              width="40%"
              height={'8px'}
            />

            <Skeleton
              startColor={THEME_COLOR.skeletonColor}
              rounded="full"
              width="30%"
              height={'8px'}
              marginTop={1}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skelRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentSkelContainer: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  subTitleSkelContainer: {
    display: 'flex',
  },
  skelMainContent: {},
});
