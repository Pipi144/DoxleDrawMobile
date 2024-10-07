import Svg, {Path, Rect} from 'react-native-svg';
import {ISVGResponsiveCustom} from '../Models/utilityType';
import {View} from 'native-base';

export const PricebookTabIcon = ({
  themeColor,
  containerStyle,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 23,
      ...containerStyle,
      aspectRatio: 23 / 29,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 23 29"
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 1v27m6-21h3m-3 6h3M2.5 1H19a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H2.5A1.5 1.5 0 0 1 1 23.5v-21A1.5 1.5 0 0 1 2.5 1Z"
      />
    </Svg>
  </View>
);

export const ContactTabIcon = ({
  containerStyle,
  themeColor,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 27,
      ...containerStyle,
      aspectRatio: 1,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={27}
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.071 13.5 20.643 26H6.357L9.93 13.5m7.142 0H9.93m7.142 0c2.977 0 5.952 1.191 8.929 3.571M9.929 13.5c-2.977 0-5.952 1.191-8.929 3.571m8.929-12.5a3.571 3.571 0 1 0 7.142 0 3.571 3.571 0 0 0-7.142 0Z"
      />
    </Svg>
  </View>
);

export const SearchTabIcon = ({
  containerStyle,
  themeColor,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 27,
      ...containerStyle,
      aspectRatio: 1,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={'100%'}
      height={'100%'}
      viewBox="0 0 27 27"
      fill="none"
      {...props}>
      <Path
        fill={staticColor ?? themeColor.primaryFontColor}
        fillRule="evenodd"
        d="M1.5 10.892C1.5 5.728 5.834 1.5 11.232 1.5c5.399 0 9.733 4.228 9.733 9.392 0 5.165-4.334 9.393-9.733 9.393-5.398 0-9.732-4.228-9.732-9.393ZM11.232 0C5.052 0 0 4.854 0 10.892c0 6.04 5.052 10.893 11.232 10.893 2.829 0 5.421-1.017 7.401-2.699l3.888 3.762a.75.75 0 1 0 1.043-1.078l-3.855-3.73c1.715-1.91 2.756-4.407 2.756-7.148C22.465 4.854 17.412 0 11.232 0Z"
        clipRule="evenodd"
      />
    </Svg>
  </View>
);

export const BookingTabIcon = ({
  containerStyle,
  themeColor,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 22,
      ...containerStyle,
      aspectRatio: 22 / 24,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 22 24"
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 1v4.889M6 1v4.889m-5 4.889h20M1 5.888c0-.647.263-1.27.732-1.728A2.53 2.53 0 0 1 3.5 3.444h15a2.53 2.53 0 0 1 1.768.716c.469.459.732 1.08.732 1.729v14.667c0 .648-.263 1.27-.732 1.728A2.53 2.53 0 0 1 18.5 23h-15a2.529 2.529 0 0 1-1.768-.716A2.417 2.417 0 0 1 1 20.556V5.889Zm5 9.779h2.5v2.444H6v-2.444Z"
      />
    </Svg>
  </View>
);

export const BudgetTabIcon = ({
  containerStyle,
  themeColor,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 22,
      ...containerStyle,
      aspectRatio: 22 / 24,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={'100%'}
      height={'100%'}
      fill="none"
      viewBox="0 0 22 24"
      {...props}>
      <Path
        stroke={staticColor ?? themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 14.444v.013m5-.013v.013m5-.013v.013M6 18.11v.012m5-.012v.012m5-.012v.012M1 3.444c0-.648.263-1.27.732-1.728A2.53 2.53 0 0 1 3.5 1h15a2.53 2.53 0 0 1 1.768.716c.469.458.732 1.08.732 1.728v17.112c0 .648-.263 1.27-.732 1.728A2.53 2.53 0 0 1 18.5 23h-15a2.529 2.529 0 0 1-1.768-.716A2.417 2.417 0 0 1 1 20.556V3.444Zm5 3.667c0-.324.132-.635.366-.864.235-.23.552-.358.884-.358h7.5c.332 0 .65.129.884.358.234.23.366.54.366.864v1.222c0 .324-.132.635-.366.865-.235.229-.553.358-.884.358h-7.5c-.332 0-.65-.13-.884-.358A1.209 1.209 0 0 1 6 8.333V7.111Z"
      />
    </Svg>
  </View>
);

export const ChecklistTabIcon = ({
  containerStyle,
  themeColor,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 19,
      ...containerStyle,
      aspectRatio: 19 / 24,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 19 24"
      fill="none"
      {...props}>
      <Path
        stroke={staticColor ?? themeColor.primaryFontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5.857 3.444H3.43a2.42 2.42 0 0 0-1.718.716A2.453 2.453 0 0 0 1 5.89v14.667c0 .648.256 1.27.711 1.728A2.42 2.42 0 0 0 3.43 23H15.57a2.42 2.42 0 0 0 1.718-.716c.455-.458.711-1.08.711-1.728V5.889c0-.648-.256-1.27-.711-1.729a2.42 2.42 0 0 0-1.718-.716h-2.428m-7.286 0c0-.648.256-1.27.711-1.728A2.42 2.42 0 0 1 8.286 1h2.428a2.42 2.42 0 0 1 1.717.716c.456.458.712 1.08.712 1.728m-7.286 0c0 .649.256 1.27.711 1.729a2.42 2.42 0 0 0 1.718.716h2.428a2.42 2.42 0 0 0 1.717-.716c.456-.458.712-1.08.712-1.729m-7.286 11h.012m-.012 3.667h.012M9.5 16.89l1.214 1.222 3.643-3.667"
      />
    </Svg>
  </View>
);

export const DrawingTabIcon = ({
  containerStyle,
  themeColor,
  staticColor,
  ...props
}: ISVGResponsiveCustom & {staticColor?: string}) => (
  <View
    style={{
      width: 29,
      ...containerStyle,
      aspectRatio: 29 / 23,
      display: 'flex',
    }}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 29 23"
      fill="none"
      {...props}>
      <Rect
        width={26.583}
        height={1.813}
        x={2.414}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
      />
      <Rect
        width={26.583}
        height={1.813}
        x={2.414}
        y={20.743}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
      />
      <Rect
        width={17.504}
        height={1.813}
        x={10.168}
        y={11.32}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
      />
      <Rect
        width={4.647}
        height={1.813}
        x={2.41}
        y={11.293}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
      />
      <Rect
        width={3.424}
        height={1.813}
        x={7.047}
        y={9.666}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
        transform="rotate(90 7.047 9.666)"
      />
      <Rect
        width={3.424}
        height={1.813}
        x={11.881}
        y={9.666}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
        transform="rotate(90 11.88 9.666)"
      />
      <Rect
        width={2.618}
        height={1.813}
        x={17.119}
        y={18.931}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
        transform="rotate(90 17.12 18.93)"
      />
      <Rect
        width={2.819}
        height={1.813}
        x={13.293}
        y={3.222}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
      />
      <Rect
        width={3.021}
        height={1.813}
        x={13.293}
        y={6.848}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
      />
      <Rect
        width={4.833}
        height={1.813}
        x={14.498}
        y={5.035}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
        transform="rotate(-90 14.498 5.035)"
      />
      <Rect
        width={21.951}
        height={1.813}
        x={2.414}
        y={22.152}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
        transform="rotate(-90 2.414 22.152)"
      />
      <Rect
        width={22.354}
        height={1.813}
        x={27.186}
        y={22.556}
        fill={staticColor ?? themeColor.primaryFontColor}
        rx={0.906}
        transform="rotate(-90 27.186 22.556)"
      />
    </Svg>
  </View>
);
