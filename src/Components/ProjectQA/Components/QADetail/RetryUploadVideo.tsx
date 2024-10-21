import {StyleSheet, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal/dist/modal';
import useRetryUploadVideo from './Hooks/useRetryUploadVideo';
import {useProjectQAStore} from '../../Store/useProjectQAStore';

import {
  StyledCloseRetryVideoBtn,
  StyledRetryUploadVideoContainer,
  StyledRetryVideoActionBtn,
  StyledRetryVideoActionBtnText,
  StyledRetryVideoTitleText,
} from './StyledComponentQADetail';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useShallow} from 'zustand/react/shallow';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {QADeleteIcon} from '../QAIcons';

type Props = {};

const RetryUploadVideo = (props: Props) => {
  const {deviceType} = useOrientation();
  const {staticMenuColor, THEME_COLOR} = useDOXLETheme();
  const {handleRetry, handleCloseRetry, handleDeleteRetryVideo} =
    useRetryUploadVideo({});

  const {retryVideo} = useProjectQAStore(
    useShallow(state => ({
      retryVideo: state.retryVideo,
    })),
  );

  return (
    <Modal
      isVisible={retryVideo !== undefined}
      hasBackdrop={true}
      backdropColor={staticMenuColor.staticBackdrop}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackdropPress={handleCloseRetry}
      animationIn="bounceInUp"
      animationOut="bounceOutDown"
      animationInTiming={200}
      animationOutTiming={100}
      style={{
        justifyContent: deviceType === 'Smartphone' ? 'flex-end' : 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
      }}>
      <StyledRetryUploadVideoContainer>
        <View style={styles.titleWrapper}>
          <StyledRetryVideoTitleText>
            {retryVideo?.errorMessage ?? 'Failed to upload video'}
          </StyledRetryVideoTitleText>

          <StyledCloseRetryVideoBtn hitSlop={14} onPress={handleCloseRetry}>
            <MateIcon
              name="close"
              color={staticMenuColor.staticWhiteFontColor}
              size={deviceType === 'Smartphone' ? 20 : 24}
            />
          </StyledCloseRetryVideoBtn>
        </View>
        <StyledRetryVideoActionBtn
          onPress={handleRetry}
          $hasBorderBottom={true}>
          <StyledRetryVideoActionBtnText>Retry</StyledRetryVideoActionBtnText>

          <IonIcon
            name="reload"
            color={staticMenuColor.staticWhiteFontColor}
            size={deviceType === 'Smartphone' ? 24 : 28}
          />
        </StyledRetryVideoActionBtn>
        <StyledRetryVideoActionBtn onPress={handleDeleteRetryVideo}>
          <StyledRetryVideoActionBtnText
            style={{color: THEME_COLOR.errorColor}}>
            Delete Video
          </StyledRetryVideoActionBtnText>

          <QADeleteIcon
            themeColor={THEME_COLOR}
            containerStyle={{
              width: deviceType === 'Smartphone' ? 24 : 28,
            }}
            iconColor={THEME_COLOR.errorColor}
          />
        </StyledRetryVideoActionBtn>
      </StyledRetryUploadVideoContainer>
    </Modal>
  );
};

export default RetryUploadVideo;

const styles = StyleSheet.create({
  titleWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
