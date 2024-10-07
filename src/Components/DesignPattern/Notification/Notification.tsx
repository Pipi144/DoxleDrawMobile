//!PT- THIS COMPONENT IS USED TO COMBINE WITH "react-native-notifier" LIBRARY, THE UI PART IS EXPORT DEFAULT, THE OTHER SPECS IS THE ANIMATED PROPS ALSO EXPORTED FROM THIS FILE, USE THE PROPS TO MAKE THE NOTIFICATION ON THE BOTTOM SCREEN

import {Animated, View} from 'react-native';
import React from 'react';

import {
  StyledTextContainer,
  StyledTitleText,
} from './StyledComponentNotification';
import {FadeInRight} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../Providers/OrientationContext';
import {SuccessNotiIcon} from './NotiIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
type Props = {
  title: string;
  description?: string;
  type: 'success' | 'error';
  backgroundOpacity?: 'mild' | 'deep';
  imageSrc?: string;
  height?: number;
};

const Notification = ({
  title,
  description,
  type,
  imageSrc,
  backgroundOpacity,
  height,
}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceSize, deviceType} = useOrientation();

  return (
    <View
      style={{
        width: '100%',

        // : 'rgba(255,103,103, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
      }}>
      <StyledTextContainer $width={'95%'}>
        {type === 'success' && (
          <SuccessNotiIcon
            themeColor={THEME_COLOR}
            containerStyle={{width: deviceType === 'Smartphone' ? 30 : 35}}
          />
        )}
        {type === 'error' && (
          <AntIcon
            name="closecircle"
            size={deviceType === 'Smartphone' ? 30 : 35}
            color={THEME_COLOR.primaryContainerColor}
          />
        )}
        <StyledTitleText entering={FadeInRight.duration(200).delay(50)}>
          {title}
        </StyledTitleText>
      </StyledTextContainer>
    </View>
  );
};

export default Notification;

export const getContainerStyleWithTranslateY = (
  translateY: Animated.Value,
) => ({
  top: undefined,
  bottom: 14,
  left: 0,
  zIndex: 100,

  transform: [
    {
      // reverse translateY value
      translateY: translateY.interpolate({
        inputRange: [-1000, 0],
        outputRange: [1000, 0],

        extrapolate: 'clamp',
      }),
    },
  ],
});
