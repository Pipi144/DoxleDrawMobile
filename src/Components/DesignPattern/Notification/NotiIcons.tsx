import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {ISVGResponsiveCustom} from '../../../../Models/utilityType';

export const SuccessNotiIcon = ({
  themeColor,
  containerStyle,
  ...props
}: ISVGResponsiveCustom) => (
  <View
    style={{
      width: 29,
      ...containerStyle,
      aspectRatio: 1,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 29 29"
      fill="none"
      {...props}>
      <Path
        fill={themeColor.primaryContainerColor}
        d="M14.5 0C22.508 0 29 6.492 29 14.5S22.508 29 14.5 29 0 22.508 0 14.5 6.492 0 14.5 0Zm6.26 9.872a.906.906 0 0 0-1.209-.066l-.073.066-7.334 7.334-2.622-2.622a.906.906 0 0 0-1.348 1.208l.066.074 3.263 3.262c.33.33.852.353 1.208.066l.074-.066 7.975-7.975a.906.906 0 0 0 0-1.281Z"
      />
    </Svg>
  </View>
);
