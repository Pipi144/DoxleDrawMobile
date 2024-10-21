import {StyleSheet} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

import useQAVideoItem from './Hooks/useQAVideoItem';
import {ActivityIndicator} from 'react-native-paper';
import {QAVideo} from '../../../../Models/qa';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {FadeIn, LinearTransition} from 'react-native-reanimated';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {DeleteQAImageIcon} from '../QAIcons';
import {
  StyledQAImageHolder,
  StyledQAVideoItemContainer,
} from './StyledComponentQADetail';
type Props = {
  numOfListColumns: number;
  item: QAVideo;
};

const QAVideoItem = ({numOfListColumns, item}: Props) => {
  const {deviceType} = useOrientation();
  const {THEME_COLOR} = useDOXLETheme();
  const {onPressVideo, handleDeleteQAImage, isDeletingVideo, localThumbUrl} =
    useQAVideoItem({
      item,
    });
  return (
    <StyledQAVideoItemContainer
      $numOfCol={numOfListColumns}
      layout={LinearTransition.springify().damping(16).mass(0.5).stiffness(120)}
      onPress={onPressVideo}>
      {item.thumbUrl || localThumbUrl ? (
        <StyledQAImageHolder
          source={{uri: localThumbUrl || item.thumbUrl}}
          resizeMode="cover"
        />
      ) : (
        <IonIcons
          name="videocam-outline"
          color={THEME_COLOR.primaryFontColor}
          size={deviceType === 'Smartphone' ? 30 : 35}
        />
      )}

      <IonIcons
        name="play-outline"
        color={THEME_COLOR.doxleColor}
        size={deviceType === 'Smartphone' ? 40 : 50}
        style={styles.playIcon}
      />

      <DoxleAnimatedButton
        style={[
          styles.deleteBtn,
          {
            width: deviceType === 'Smartphone' ? 40 : 44,
            height: deviceType === 'Smartphone' ? 40 : 44,
            borderRadius: deviceType === 'Smartphone' ? 40 : 44,
          },
        ]}
        backgroundColor={'rgba(217, 217, 217, 1)'}
        hitSlop={14}
        onPress={handleDeleteQAImage}>
        {isDeletingVideo ? (
          <ActivityIndicator
            color={THEME_COLOR.errorColor}
            size={deviceType === 'Smartphone' ? 18 : 22}
          />
        ) : (
          // <Octicons
          //   name="trash"
          //   size={14}
          //   color={THEME_COLOR.primaryFontColor}
          // />
          <DeleteQAImageIcon deviceType={deviceType} />
        )}
      </DoxleAnimatedButton>
    </StyledQAVideoItemContainer>
  );
};

export default QAVideoItem;

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
  deleteBtn: {
    position: 'absolute',
    bottom: 14,
    right: 4,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
