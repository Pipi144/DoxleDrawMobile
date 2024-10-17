import {StyleSheet, View} from 'react-native';
import React from 'react';

import {
  StyledFileImageWrapper,
  StyledGridContentWrapper,
  StyledGridFileInfoText,
  StyledGridFileNameText,
  StyledGridListItemWrapper,
} from './StyledComponentProjectFileDisplayer';
import {ActivityIndicator} from 'react-native-paper';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
import {LinearTransition} from 'react-native-reanimated';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {FolderItemIcon} from '../../ProjectFileIcon';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {DoxleFile, DoxleFolder} from '../../../../Models/files';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
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
import useProjectFileGridItem from './Hooks/useProjectFileGridItem';

dayjs.extend(relativeTime);

type Props = {fileItem?: DoxleFile; folderItem?: DoxleFolder; numOfCol: number};

const ProjectFileGridItem: React.FC<Props> = ({
  fileItem,
  folderItem,
  numOfCol,
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();

  const {
    onLongPress,
    folderPressed,
    filePressed,

    isLoadingImg,
    setIsLoadingImg,
    isErrorImg,
    setIsErrorImg,
    cachedThumbUrl,
  } = useProjectFileGridItem({fileItem, folderItem});
  const {deviceType} = useOrientation();
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
    <StyledGridListItemWrapper
      $numOfCol={numOfCol}
      layout={LinearTransition.springify().damping(16)}>
      {fileItem && (
        <StyledGridContentWrapper
          onPress={filePressed}
          onLongPress={() => onLongPress('file')}
          delayLongPress={100}>
          <View style={styles(THEME_COLOR).iconWrapper}>
            {fileItem.fileType.toLowerCase().includes(DOXLE_MIME_TYPE.pdf) ? (
              <DoxlePDFIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 80 : 100,
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
                  width: deviceType === 'Smartphone' ? 80 : 100,
                }}
              />
            ) : fileItem.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.xlsx) ||
              fileItem.fileType.toLowerCase().includes(DOXLE_MIME_TYPE.xls) ? (
              <DoxleExcelIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 80 : 100,
                }}
              />
            ) : fileItem.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.csv.toLowerCase()) ? (
              <DoxleCSVIcon
                themeColor={THEME_COLOR}
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 80 : 100,
                }}
              />
            ) : fileItem.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.images) ? (
              <>
                <StyledFileImageWrapper
                  style={{}}
                  $width={deviceType === 'Smartphone' ? 80 : 100}
                  source={{
                    url: fileItem.thumbUrl,
                    resizeMode: 'cover',
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
                          width: deviceType === 'Smartphone' ? 80 : 85,
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
                          width: deviceType === 'Smartphone' ? 80 : 85,
                          position: 'absolute',
                          zIndex: 1,
                        }}
                      />
                    )}
                    <MateIcon
                      name="error-outline"
                      size={deviceType === 'Smartphone' ? 30 : 35}
                      color={'black'}
                      style={styles(THEME_COLOR).imgErrorIcon}
                    />
                  </>
                )}

                {isLoadingImg && (
                  <ActivityIndicator
                    color={THEME_COLOR.primaryFontColor}
                    size={deviceType === 'Smartphone' ? 10 : 14}
                    style={styles(THEME_COLOR).imgLoader}
                  />
                )}
              </>
            ) : (
              <>
                <StyledFileImageWrapper
                  style={{opacity: 0.5}}
                  $width={deviceType === 'Smartphone' ? 80 : 100}
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
                  size={doxleFontSize.pageTitleFontSize}
                  style={styles(THEME_COLOR).playIcon}
                />
              </>
            )}
          </View>

          <StyledGridFileNameText numberOfLines={1} ellipsizeMode="tail">
            {fileItem.fileName}
          </StyledGridFileNameText>
          <StyledGridFileInfoText>
            {(parseInt(fileItem.fileSize) / 1024 / 1024).toFixed(2)} MB /{' '}
            {modifiedTime}
          </StyledGridFileInfoText>
        </StyledGridContentWrapper>
      )}
      {folderItem && (
        <StyledGridContentWrapper
          onPress={() => folderPressed()}
          onLongPress={() => onLongPress('folder')}
          delayLongPress={100}>
          <View style={styles(THEME_COLOR).iconWrapper}>
            <FolderItemIcon
              containerStyle={{
                width: deviceType === 'Smartphone' ? 96 : 106,
              }}
            />
          </View>

          <StyledGridFileNameText numberOfLines={1} ellipsizeMode="tail">
            {folderItem.folderName}
          </StyledGridFileNameText>
          <StyledGridFileInfoText>
            {folderItem.folderSize
              ? (folderItem.folderSize / 1024 / 1024).toFixed(2)
              : '0'}
            MB / {modifiedTime}
          </StyledGridFileInfoText>
        </StyledGridContentWrapper>
      )}
    </StyledGridListItemWrapper>
  );
};

export default React.memo(ProjectFileGridItem);

const styles = (themeColor: IDOXLEThemeColor) =>
  StyleSheet.create({
    editBtn: {
      borderWidth: 1.5,
      borderColor: themeColor.primaryFontColor,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 12,
      right: 12,
    },
    loaderStyle: {
      position: 'absolute',
      top: 12,
      right: 12,
    },
    iconWrapper: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
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

      zIndex: 5,
    },
    playIcon: {
      position: 'absolute',
      zIndex: 10,
    },
  });
