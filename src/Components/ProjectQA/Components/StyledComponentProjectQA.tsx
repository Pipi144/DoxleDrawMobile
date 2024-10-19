import {
  ReactNativeZoomableView,
  ReactNativeZoomableViewProps,
} from '@openspacelabs/react-native-zoomable-view';
import {ReactNativeZoomableViewState} from '@openspacelabs/react-native-zoomable-view/src/typings';
import {Component} from 'react';
import styled from 'styled-components/native';

export const StyledQAListItemStatusContainer = styled.View<{
  $bgColor: string;
  $marginRight: number;
}>`
  padding: 0px 4px;
  min-width: 16px;
  border-radius: 1px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.$bgColor};
  margin-right: ${p => p.$marginRight}px;
`;

export const StyledQAListItemStatusText = styled.Text<{
  $textColor: string;
  $fontSize: number;
}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.$fontSize}px;

  color: ${p => p.$textColor};
  text-transform: capitalize;
`;

export const StyledQATopNavSection = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const StyledQANavItemText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.secondaryTitleFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;
export const StyledQAViewImage = styled.Pressable`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px;
  padding-bottom: ${p => p.theme.deviceSize.insetBottom + 8}px;
`;
