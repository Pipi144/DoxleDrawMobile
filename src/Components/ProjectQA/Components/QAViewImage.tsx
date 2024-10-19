import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {StyledQAViewImage} from './StyledComponentProjectQA';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TQATabStack} from '../Routes/QARouteType';
import FastImage from 'react-native-fast-image';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {useOrientation} from '../../../../../../Providers/OrientationContext';

type Props = {};

const QAViewImage = (props: Props) => {
  const {imageURL, imageHeight, imageWidth} = useRoute()
    .params as TQATabStack['QAViewImage'];
  const {deviceSize} = useOrientation();
  const navigation = useNavigation();

  return (
    <StyledQAViewImage>
      <ReactNativeZoomableView
        // onStartShouldSetPanResponder={() => true}
        // onMoveShouldSetResponderCapture={() => true}
        // onStartShouldSetResponderCapture={() => true}
        onStartShouldSetPanResponder={e => {
          if (e.nativeEvent.touches.length > 1) return true;
          else return false;
        }}
        zoomEnabled={true}
        maxZoom={30}
        bindToBorders={true}
        zoomStep={0.5}
        initialZoom={1}
        style={{
          height: deviceSize.deviceHeight,
          width: deviceSize.deviceWidth,
        }}
        contentWidth={deviceSize.deviceWidth}
        contentHeight={(deviceSize.deviceWidth / imageWidth) * imageHeight}>
        <Pressable
          style={{height: '100%', width: '100%'}}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}>
          <FastImage
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
            source={{uri: imageURL}}
          />
        </Pressable>
      </ReactNativeZoomableView>
    </StyledQAViewImage>
  );
};

export default QAViewImage;

const styles = StyleSheet.create({});
