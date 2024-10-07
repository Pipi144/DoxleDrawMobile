import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import VideoPlayer from 'react-native-media-console';
import {useAnimations} from '@react-native-media-console/reanimated';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Animated, {StretchInX, StretchOutY} from 'react-native-reanimated';
type Props = {
  navigation: any;
};

export type TDoxleVideoViewerRouteParams = {
  videoUrl: string;
  onFocusFnc?: () => void;
  onGoBackFnc?: () => void;
};

const DoxleVideoViewer = ({navigation}: Props) => {
  const routeParams = useRoute().params as TDoxleVideoViewerRouteParams;

  useFocusEffect(
    useCallback(() => {
      if (routeParams.onFocusFnc) {
        routeParams.onFocusFnc();
      }
    }, []),
  );
  return (
    <View style={styles.container}>
      <Animated.View
        style={{width: '100%', height: '100%'}}
        entering={StretchInX.delay(200)}
        exiting={StretchOutY}>
        <VideoPlayer
          useAnimations={useAnimations}
          source={{uri: routeParams?.videoUrl}}
          onBack={() => {
            if (routeParams.onGoBackFnc) {
              routeParams.onGoBackFnc();
            } else navigation.goBack();
          }}
          style={{width: '100%', height: '100%'}}
        />
      </Animated.View>
    </View>
  );
};

export default DoxleVideoViewer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
