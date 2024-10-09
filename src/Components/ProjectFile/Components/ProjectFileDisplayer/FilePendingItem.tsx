// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {TFileBgUploadData} from '../../Provider/StorageModels';
import {
  StyledFileIconWrapper,
  StyledListFileInfoText,
  StyledListFileNameText,
  StyledPendingImageWrapper,
  StyledProjectFileListItemContainer,
  StyledUploadFileProgressText,
} from './StyledComponentProjectFileDisplayer';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {
  DoxleCSVIcon,
  DoxleExcelIcon,
  DoxlePDFIcon,
  DoxleWordIcon,
} from '../../../DesignPattern/DoxleIcons';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import IonIcons from 'react-native-vector-icons/Ionicons';
import useFilePendingItem from './Hooks/useFilePendingItem';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

type Props = {
  item: TFileBgUploadData;
};
const AnimatedIonIcon = Animated.createAnimatedComponent(IonIcons);
const FilePendingItem = ({item}: Props) => {
  const {deviceType} = useOrientation();
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();

  const {fileState, handlePressProgress} = useFilePendingItem({
    item,
  });
  useEffect(() => {
    console.log('pENDING:', item);
  }, []);

  return (
    <StyledProjectFileListItemContainer
      delayLongPress={200}
      layout={LinearTransition.springify().damping(16)}
      unstable_pressDelay={100}
      style={{
        opacity: 0.8,
      }}>
      <StyledFileIconWrapper $width={deviceType === 'Smartphone' ? 45 : 55}>
        {item.file.type.toLowerCase().includes('pdf') ? (
          <DoxlePDFIcon
            containerStyle={{
              width: deviceType === 'Smartphone' ? 35 : 45,
            }}
          />
        ) : item.file.type.toLowerCase().includes('doc') ||
          item.file.type.toLowerCase().includes('docx') ? (
          <DoxleWordIcon
            containerStyle={{
              width: deviceType === 'Smartphone' ? 35 : 45,
            }}
          />
        ) : item.file.type.toLowerCase().includes('xlsx') ||
          item.file.type.toLowerCase().includes('xls') ? (
          <DoxleExcelIcon
            containerStyle={{
              width: deviceType === 'Smartphone' ? 35 : 45,
            }}
          />
        ) : item.file.type.toLowerCase().includes('csv') ? (
          <DoxleCSVIcon
            themeColor={THEME_COLOR}
            containerStyle={{
              width: deviceType === 'Smartphone' ? 35 : 45,
            }}
          />
        ) : item.file.type.toLowerCase().includes('image') ? (
          <>
            <StyledPendingImageWrapper
              style={{}}
              $width={deviceType === 'Smartphone' ? 35 : 45}
              source={{
                uri: item.file.uri,
              }}
              resizeMode="cover"
            />
          </>
        ) : (
          <>
            {item.thumbnailPath && (
              <StyledPendingImageWrapper
                style={{}}
                $width={deviceType === 'Smartphone' ? 35 : 45}
                source={{
                  uri: item.thumbnailPath,
                }}
                resizeMode="cover"
              />
            )}
            <IonIcons
              name="play-outline"
              color={THEME_COLOR.doxleColor}
              size={deviceType === 'Smartphone' ? 24 : 28}
              style={styles.playIcon}
            />
          </>
        )}
      </StyledFileIconWrapper>

      <View style={styles.fileNameSection}>
        <StyledListFileNameText numberOfLines={1} ellipsizeMode="tail">
          {item.file.name}
        </StyledListFileNameText>

        <StyledListFileInfoText numberOfLines={1} ellipsizeMode="tail">
          {(Number(item.file.size ?? 0) / 1024 / 1024).toFixed(2)} MB /{' '}
        </StyledListFileInfoText>
      </View>

      <AnimatedCircularProgress
        size={deviceType === 'Smartphone' ? 40 : 50}
        width={deviceType === 'Smartphone' ? 4 : 5}
        fill={fileState.progress}
        tintColor={
          item.status === 'pending'
            ? THEME_COLOR.primaryFontColor
            : 'transparent'
        }
        fillLineCap="round"
        backgroundColor={editRgbaAlpha({
          rgbaColor: THEME_COLOR.primaryFontColor,
          alpha: '0.2',
        })}
        style={{marginLeft: 4}}
        childrenContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          padding: 2,
        }}
        prefill={0}

        // renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
      >
        {fill => (
          <Pressable onPress={handlePressProgress} hitSlop={10}>
            {item.status === 'pending' && (
              <StyledUploadFileProgressText>
                {Math.floor(fill)}
              </StyledUploadFileProgressText>
            )}
            {item.status === 'error' && (
              <AnimatedIonIcon
                name="reload"
                size={doxleFontSize.headTitleTextSize}
                color={'red'}
              />
            )}
          </Pressable>
        )}
      </AnimatedCircularProgress>
    </StyledProjectFileListItemContainer>
  );
};

export default FilePendingItem;

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
