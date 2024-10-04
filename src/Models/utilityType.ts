import {ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {IDOXLEThemeColor} from '../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {TRgbaFormat} from '../Utilities/FunctionUtilities';

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Partial<
  Pick<T, Exclude<keyof T, Keys>>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type TAPIServerFile = {
  name: string;
  type: string;
  uri: string;
};

export interface ISVGResponsiveCustom extends SvgProps {
  themeColor: IDOXLEThemeColor;
  containerStyle?: ViewStyle;
}
export interface ISVGResponsiveColorCustom extends SvgProps {
  staticColor?: string;
  containerStyle?: ViewStyle;
}
export type TXYCord = {
  x: number;
  y: number;
};
export interface TAddedCommentImage extends TAPIServerFile {
  imageWidth: number;
  imageHeight: number;
}
export interface IProgressCompressState {
  totalProgress: number;
  currentProgress: number;
  onCancel: () => void;
}
