import {StyleSheet, View} from 'react-native';
import React from 'react';

import {
  StyledProjectFileListItemContainer,
  StyledFileIconWrapper,
  StyledFilePressEffect,
  StyledListFileNameText,
  StyledFileImageWrapper,
  StyledListFileInfoText,
} from './StyledComponentProjectFileDisplayer';
import {
  FadeInDown,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native-paper';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {FolderItemIcon} from '../../ProjectFileIcon';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {DoxleFile, DoxleFolder} from '../../../../Models/files';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {DOXLE_MIME_TYPE} from '../../../../Models/MimeFileType';
import {
  DoxleCSVIcon,
  DoxleExcelIcon,
  DoxleJPGIcon,
  DoxlePDFIcon,
  DoxlePNGIcon,
  DoxleWordIcon,
} from '../../../DesignPattern/DoxleIcons';
import useProjectFileListItem from './Hooks/useProjectFileListItem';

dayjs.extend(relativeTime);
type Props = {fileItem?: DoxleFile; folderItem?: DoxleFolder};

const ProjectFileListItem: React.FC<Props> = ({
  fileItem,
  folderItem,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {
    onLongPress,
    folderPressed,
    filePressed,

    isUpdatingFile,
    isUpdatingFolder,
    onPressIn,
    onPressOut,
    pressAnimatedValue,
    isLoadingImg,
    setIsLoadingImg,
    isErrorImg,
    setIsErrorImg,
    cachedThumbUrl,
  } = useProjectFileListItem({fileItem, folderItem});
  const {deviceType} = useOrientation();
  const pressAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressAnimatedValue.value, [0, 1], [0, 1]);
    return {
      transform: [{scale}],
    };
  });

  const modifiedTime = folderItem
    ? dayjs(new Date()).diff(dayjs(folderItem.lastModified), 'hour') > 24
      ? dayjs(folderItem.lastModified).format('DD.MMM.YY')
      : dayjs(folderItem.lastModified).fromNow()
    : fileItem
    ? dayjs(new Date()).diff(dayjs(fileItem.modified), 'hour') > 24
      ? dayjs(fileItem.modified).format('DD.MMM.YY')
      : dayjs(fileItem.modified).fromNow()
    : '';
  return (
    <StyledProjectFileListItemContainer
      delayLongPress={200}
      entering={fileItem?.isNew || folderItem?.isNew ? FadeInDown : undefined}
      layout={LinearTransition.springify().damping(16)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      unstable_pressDelay={100}
      onPress={() => {
        if (fileItem) filePressed();
        else folderPressed();
      }}
      onLongPress={() => {
        if (fileItem) onLongPress('file');
        else onLongPress('folder');
      }}>
      <StyledFilePressEffect style={[pressAnimatedStyle]} />
      {fileItem && (
        <>
          <StyledFileIconWrapper $width={deviceType === 'Smartphone' ? 45 : 55}>
            {!isUpdatingFile ? (
              <>
                {fileItem.fileType
                  .toLowerCase()
                  .includes(DOXLE_MIME_TYPE.pdf) ? (
                  <DoxlePDFIcon
                    containerStyle={{
                      width: deviceType === 'Smartphone' ? 35 : 45,
                    }}
                  />
                ) : fileItem.fileType
                    .toLowerCase()
                    .includes(DOXLE_MIME_TYPE.doc.toLowerCase()) ||
                  fileItem.fileType
                    .toLowerCase()
                    .includes(DOXLE_MIME_TYPE.docx.toLowerCase()) ? (
                  <DoxleWordIcon
                    containerStyle={{
                      width: deviceType === 'Smartphone' ? 35 : 45,
                    }}
                  />
                ) : fileItem.fileType
                    .toLowerCase()
                    .includes(DOXLE_MIME_TYPE.xlsx) ||
                  fileItem.fileType
                    .toLowerCase()
                    .includes(DOXLE_MIME_TYPE.xls) ? (
                  <DoxleExcelIcon
                    containerStyle={{
                      width: deviceType === 'Smartphone' ? 35 : 45,
                    }}
                  />
                ) : fileItem.fileType
                    .toLowerCase()
                    .includes(DOXLE_MIME_TYPE.csv) ? (
                  <DoxleCSVIcon
                    themeColor={THEME_COLOR}
                    containerStyle={{
                      width: doxleFontSize.headTitleTextSize + 5,
                    }}
                  />
                ) : fileItem.fileType
                    .toLowerCase()
                    .includes(DOXLE_MIME_TYPE.images) ? (
                  <>
                    <StyledFileImageWrapper
                      style={{}}
                      $width={deviceType === 'Smartphone' ? 35 : 45}
                      source={{
                        url: fileItem.thumbUrl ?? fileItem.url,
                        resizeMode: 'contain',
                        cachePolicy: 'discWithCacheControl',
                      }}
                      onSuccess={() => setIsLoadingImg(false)}
                      onError={() => {
                        setIsErrorImg(true);
                        setIsLoadingImg(false);
                      }}
                    />

                    {isErrorImg && (
                      <>
                        {fileItem.fileType
                          .toLowerCase()
                          .includes(DOXLE_MIME_TYPE.png) && (
                          <DoxlePNGIcon
                            containerStyle={{
                              width: deviceType === 'Smartphone' ? 35 : 45,
                              position: 'absolute',
                              zIndex: 1,
                            }}
                          />
                        )}
                        {(fileItem.fileType
                          .toLowerCase()
                          .includes(DOXLE_MIME_TYPE.jpeg) ||
                          fileItem.fileType
                            .toLowerCase()
                            .includes(DOXLE_MIME_TYPE.jpg)) && (
                          <DoxleJPGIcon
                            containerStyle={{
                              width: deviceType === 'Smartphone' ? 35 : 45,
                              position: 'absolute',
                              zIndex: 1,
                            }}
                          />
                        )}
                        <MateIcon
                          name="error-outline"
                          size={deviceType === 'Smartphone' ? 35 : 45}
                          color={'black'}
                          style={styles.imgErrorIcon}
                        />
                      </>
                    )}

                    {isLoadingImg && (
                      <ActivityIndicator
                        color={THEME_COLOR.primaryFontColor}
                        size={doxleFontSize.errorToggleTextSize}
                        style={styles.imgLoader}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <StyledFileImageWrapper
                      style={{opacity: 0.5}}
                      $width={deviceType === 'Smartphone' ? 35 : 45}
                      source={{
                        url: cachedThumbUrl ?? fileItem.thumbUrl,
                        resizeMode: 'cover',
                        cachePolicy: 'discWithCacheControl',
                      }}
                      onSuccess={() => setIsLoadingImg(false)}
                      onError={() => {
                        setIsErrorImg(true);
                        setIsLoadingImg(false);
                      }}
                    />
                    <IonIcons
                      name="play-outline"
                      color={THEME_COLOR.doxleColor}
                      size={deviceType === 'Smartphone' ? 24 : 28}
                      style={styles.playIcon}
                    />
                  </>
                )}
              </>
            ) : (
              <ActivityIndicator
                color={THEME_COLOR.primaryFontColor}
                size={doxleFontSize.errorToggleTextSize}
              />
            )}
          </StyledFileIconWrapper>

          <View style={styles.fileNameSection}>
            <StyledListFileNameText numberOfLines={1} ellipsizeMode="tail">
              {fileItem.fileName}
            </StyledListFileNameText>

            <StyledListFileInfoText numberOfLines={1} ellipsizeMode="tail">
              {(Number(fileItem.fileSize ?? 0) / 1024 / 1024).toFixed(2)} MB /{' '}
              {modifiedTime}
            </StyledListFileInfoText>
          </View>
        </>
      )}

      {folderItem && (
        <>
          <StyledFileIconWrapper $width={deviceType === 'Smartphone' ? 45 : 55}>
            {!isUpdatingFolder ? (
              <FolderItemIcon
                containerStyle={{
                  width: '100%',
                }}
              />
            ) : (
              <ActivityIndicator
                color={THEME_COLOR.primaryFontColor}
                size={16}
              />
            )}
          </StyledFileIconWrapper>
          <View style={styles.fileNameSection}>
            <StyledListFileNameText numberOfLines={1} ellipsizeMode="tail">
              {folderItem.folderName}
            </StyledListFileNameText>

            <StyledListFileInfoText numberOfLines={1} ellipsizeMode="tail">
              {(Number(folderItem.folderSize ?? 0) / 1024 / 1024).toFixed(2)} MB
              / {modifiedTime}
            </StyledListFileInfoText>
          </View>
        </>
      )}
    </StyledProjectFileListItemContainer>
  );
};

export default React.memo(ProjectFileListItem);

const styles = StyleSheet.create({
  fileNameSection: {
    flex: 1,
    display: 'flex',
  },
  imgLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  imgErrorIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 5,
  },
  playIcon: {
    position: 'absolute',
    zIndex: 10,
  },
});
