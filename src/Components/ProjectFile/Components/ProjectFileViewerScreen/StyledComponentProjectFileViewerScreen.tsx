import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {styled} from 'styled-components/native';

export const StyledProjectFileViewerScreen = styled.View<{
  $insetTop: number;
}>`
  flex: 1;
  width: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.9);
  padding-top: ${p => p.$insetTop}px;
  align-items: center;
  justify-content: center;
`;
export const StyledZoomableStageView = styled(ReactNativeZoomableView)`
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
export const StyledPDFLoaderText = styled.Text`
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  font-weight: 500;
  font-family: ${p => p.theme.DOXLE_FONT.lexendRegular};
`;
