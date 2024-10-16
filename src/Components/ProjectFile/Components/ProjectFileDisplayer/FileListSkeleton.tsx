import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {FlatList} from 'react-native-gesture-handler';

import {StyledSkeletonGridWrapper} from './StyledComponentProjectFileDisplayer';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Skeleton from 'react-native-reanimated-skeleton';

type Props = {
  mode?: 'list' | 'grid';
};

const FileListSkeleton = ({mode = 'list'}: Props) => {
  const {deviceSize} = useOrientation();
  const numOfCol = useMemo(
    () =>
      deviceSize.deviceWidth <= 300
        ? 1
        : deviceSize.deviceWidth > 300 && deviceSize.deviceWidth <= 700
        ? 2
        : deviceSize.deviceWidth <= 1024 && deviceSize.deviceWidth > 700
        ? 3
        : 4,
    [deviceSize.deviceWidth],
  );
  const fillArray = useMemo(() => Array(20).fill(20), []);

  if (mode === 'list')
    return (
      <FlatList
        key={`skelList`}
        style={{
          width: '100%',
          height: '100%',
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        data={fillArray}
        keyExtractor={(item, idx) => `itemList#${idx}`}
        renderItem={({item}) => <SkeletonRow />}
      />
    );
  else
    return (
      <FlatList
        key={`gridList`}
        extraData={[numOfCol]}
        numColumns={numOfCol}
        style={{
          width: '100%',
          height: '100%',
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        data={fillArray}
        keyExtractor={(item, idx) => `itemGrid#${idx}`}
        renderItem={({item}) => <SkeletonGrid numOfCol={numOfCol} />}
      />
    );
};

export default FileListSkeleton;

const styles = (themeColor: IDOXLEThemeColor) =>
  StyleSheet.create({
    gridSkelCell: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: themeColor.rowBorderColor,
      borderRadius: 2,
    },
  });

const SkeletonRow: React.FC = () => {
  return (
    <Skeleton
      containerStyle={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'space-between',
      }}
      isLoading={true}>
      <Text
        style={{
          width: 20,
          height: 20,
        }}
      />
      <Text
        style={{
          width: '60%',
          height: 20,
        }}
      />
      <Text
        style={{
          width: 40,
          height: 20,
        }}
      />
    </Skeleton>
  );
};

const SkeletonGrid: React.FC<{numOfCol: number}> = ({
  numOfCol,
}: {
  numOfCol: number;
}) => {
  const {THEME_COLOR} = useDOXLETheme();
  return (
    <StyledSkeletonGridWrapper $numOfCol={numOfCol}>
      <Skeleton
        containerStyle={styles(THEME_COLOR).gridSkelCell}
        isLoading={true}>
        <Text
          style={{
            width: '40%',
            height: '30%',
            marginBottom: 14,
          }}
        />
        <Text
          style={{
            width: '20%',
            height: 14,
            marginBottom: 8,
          }}
        />
        <Text
          style={{
            width: '70%',
            height: 14,
          }}
        />
      </Skeleton>
    </StyledSkeletonGridWrapper>
  );
};
