import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';

import {ActivityIndicator} from 'react-native-paper';
import {FadeIn, FadeOut, LinearTransition} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {GestureResponderEvent} from 'react-native-modal';
import {LocalQAImage} from '../../Provider/CacheQAType';
import {
  QAMarkupRectangle,
  QAMarkupCircle,
  QAMarkupStraightLine,
  QAMarkupLabel,
  QAMarkupArrow,
  QAMarkupPath,
} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import useQAImageItem from './Hooks/useQAImageItem';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {DeleteQAImageIcon, MarkupQAImageIcon, QAMarkupIcon} from '../QAIcons';
import {
  StyledQAImageHolder,
  StyledQAImageItemContainer,
  StyledQAImageItemMenu,
} from './StyledComponentQADetail';

type Props = {
  imageItem: LocalQAImage;
  numOfListColumns: number;
  handleSelectAnnotationImage: (props: {
    qaImage: LocalQAImage;
    markupList: (
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    )[];
  }) => void;
};

const QAImageItem: React.FC<Props> = ({
  imageItem,
  numOfListColumns,
  handleSelectAnnotationImage,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceType} = useOrientation();

  const {
    isLoadingImage,
    onLoadImgEnd,
    onLoadImgStart,
    handleDeleteQAImage,
    isDeletingImg,
    qaImageDisplayedPath,
    onLoadError,
    isError,
    handlePressImg,
  } = useQAImageItem({
    imageItem,
  });

  const handlePressEditMarkupBtn = (e: GestureResponderEvent) => {
    e.stopPropagation();
    handleSelectAnnotationImage({
      qaImage: imageItem,
      markupList: imageItem.markup || [],
    });
  };

  return (
    <StyledQAImageItemContainer
      $numOfCol={numOfListColumns}
      layout={LinearTransition.springify().damping(14)}
      entering={FadeIn}
      exiting={FadeOut}
      onPress={handlePressImg}>
      {qaImageDisplayedPath && (
        <StyledQAImageHolder
          source={{uri: `${qaImageDisplayedPath}`}}
          resizeMode="cover"
          onLoadStart={onLoadImgStart}
          onLoadEnd={onLoadImgEnd}
          onError={onLoadError}
        />
      )}

      {isError && (
        <MaterialIcon
          name="image-off-outline"
          color={THEME_COLOR.primaryFontColor}
          size={deviceType === 'Smartphone' ? 50 : 60}
          style={styles.errorImg}
        />
      )}

      <StyledQAImageItemMenu>
        <DoxleAnimatedButton
          style={[
            styles.menuBtn,
            {
              width: deviceType === 'Smartphone' ? 40 : 44,
              height: deviceType === 'Smartphone' ? 40 : 44,
              borderRadius: deviceType === 'Smartphone' ? 40 : 44,
            },
          ]}
          backgroundColor={'rgba(217, 217, 217, 1)'}
          hitSlop={14}
          onPress={handlePressEditMarkupBtn}>
          <MarkupQAImageIcon deviceType={deviceType} />
        </DoxleAnimatedButton>

        <DoxleAnimatedButton
          style={[
            styles.menuBtn,
            {
              width: deviceType === 'Smartphone' ? 40 : 44,
              height: deviceType === 'Smartphone' ? 40 : 44,
              borderRadius: deviceType === 'Smartphone' ? 40 : 44,
            },
          ]}
          backgroundColor={'rgba(217, 217, 217, 1)'}
          hitSlop={14}
          onPress={handleDeleteQAImage}>
          {isDeletingImg ? (
            <ActivityIndicator
              color={THEME_COLOR.errorColor}
              size={deviceType === 'Smartphone' ? 14 : 16}
            />
          ) : (
            <DeleteQAImageIcon deviceType={deviceType} />
          )}
        </DoxleAnimatedButton>
      </StyledQAImageItemMenu>
      {imageItem.markup && imageItem.markup.length > 0 && !isError && (
        <>
          <View style={[styles.markupSignContainer]}>
            <QAMarkupIcon />
          </View>
        </>
      )}

      {isLoadingImage && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator
            color={THEME_COLOR.primaryFontColor}
            size={deviceType === 'Smartphone' ? 20 : 23}
          />
        </View>
      )}
    </StyledQAImageItemContainer>
  );
};

export default React.memo(QAImageItem);

const styles = StyleSheet.create({
  loadingWrapper: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  markupSignContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 4,
    right: 4,
    padding: 4,
    borderRadius: 2,
  },
  markupIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  errorImg: {
    position: 'absolute',
    zIndex: 4,
  },
});
