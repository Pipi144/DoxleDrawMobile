import styled from 'styled-components/native';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';

export const StyledHomeHeader = styled.View`
  padding: 8px;
  padding-top: ${p => p.theme.deviceSize.insetTop + 8}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: ${p => p.theme.doxleFontSize.pageTitleFontSize + 10}px;
  background-color: ${p => p.theme.staticMenuColor.staticHover};
  padding-left: 20px;
`;

export const StyledDoxleIconButton = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0px;
  padding: 5px;
  z-index: 2;
  align-items: center;
  justify-content: center;
`;
export const StyledProjectAddressText = styled.Text`
  font-size: ${p => p.theme.doxleFontSize.contentTextSize + 2}px;
  font-weight: 600;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.staticMenuColor.staticWhiteFontColor,
      alpha: '0.8',
    })};
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  text-transform: capitalize;
  letter-spacing: -0.5px;
`;
