import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import OctIcons from 'react-native-vector-icons/Octicons';
import {ActivityIndicator} from 'react-native-paper';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
import useQAPendingVideo from './Hooks/useQAPendingVideo';
import {IQAVideoUploadData} from '../../Provider/CacheQAType';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  StyledQAImageHolder,
  StyledQAPendingVideoContainer,
} from './StyledComponentQADetail';
type Props = {
  pendingItem: IQAVideoUploadData;
  numOfListColumns: number;
};

const QAPendingVideo = ({pendingItem, numOfListColumns}: Props) => {
  const {deviceType} = useOrientation();
  const {THEME_COLOR} = useDOXLETheme();
  const {
    onPressErrorBtn,
    onPressItem,
    isInUploadingProcess,
    handlePressUploadBtn,
  } = useQAPendingVideo({pendingItem});

  return (
    <StyledQAPendingVideoContainer
      $numOfCol={numOfListColumns}
      onPress={onPressItem}>
      {pendingItem.thumbnailPath ? (
        <StyledQAImageHolder
          source={{uri: pendingItem.thumbnailPath}}
          resizeMode="cover"
        />
      ) : (
        <IonIcons
          name="play-outline"
          color={THEME_COLOR.primaryFontColor}
          size={deviceType === 'Smartphone' ? 40 : 50}
          style={styles.playIcon}
        />
      )}

      {isInUploadingProcess ? (
        <ActivityIndicator
          color={THEME_COLOR.doxleColor}
          size={deviceType === 'Smartphone' ? 20 : 24}
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 4,
          }}
        />
      ) : pendingItem.status === 'pending' ? (
        <Pressable
          style={styles.statusBtn}
          hitSlop={20}
          onPress={handlePressUploadBtn}>
          <OctIcons
            name="upload"
            color={THEME_COLOR.primaryFontColor}
            size={30}
          />
        </Pressable>
      ) : (
        pendingItem.status === 'error' && (
          <Pressable
            style={styles.statusBtn}
            hitSlop={20}
            onPress={onPressErrorBtn}>
            <MateIcon
              name="error"
              color={THEME_COLOR.errorColor}
              size={30}
              style={{}}
            />
          </Pressable>
        )
      )}

      <IonIcons
        name="play-outline"
        color={THEME_COLOR.doxleColor}
        size={deviceType === 'Smartphone' ? 40 : 50}
        style={styles.playIcon}
      />
    </StyledQAPendingVideoContainer>
  );
};

export default QAPendingVideo;

const styles = StyleSheet.create({
  videoThumbWrapper: {
    flex: 1,
    width: '100%',
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    zIndex: 10,
  },
  statusBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 4,
  },
});
