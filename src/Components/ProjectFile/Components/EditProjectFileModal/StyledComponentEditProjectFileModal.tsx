import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';
import {Pressable} from 'react-native';

export const StyledEditProjectFileModal = styled.View<{}>`
  width: 100%;
  height: 50%;
  position: relative;
  display: flex;
  max-height: 400px;
  background-color: ${p => p.theme.staticMenuColor.staticBg};
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  padding-top: 10px;
`;

export const StyledProjectFileModalContentContainer = styled.View`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
export const StyledModalContentTopWrapper = styled.View`
  position: relative;
  display: flex;

  width: 100%;
  padding: 10px 30px;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.theme.staticMenuColor.staticDivider};
`;
export const StyledModalTopHeaderText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;
  line-height: normal;
  max-width: 100%;
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
`;
export const StyledModalFileInfoText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.interRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  line-height: normal;
  max-width: 100%;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.staticMenuColor.staticWhiteFontColor,
      alpha: '0.4',
    })};
  margin-top: 2px;
`;

export const StyledModalContentWrapper = styled.ScrollView`
  flex: 1;
  width: 100%;
  position: relative;
  margin-top: 10px;
`;
export const StyledModalMenuButton = styled(
  Animated.createAnimatedComponent(Pressable),
)<{}>`
  width: 100%;
  padding: 15px 30px;
  display: flex;
  flex-direction: row;

  align-items: center;
`;
export const StyledModalMenuBtnText = styled.Text<{}>`
  margin-left: 30px;
  font-family: ${p => p.theme.DOXLE_FONT.monoRegular};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;
  line-height: normal;
  color: ${p => p.theme.staticMenuColor.staticWhiteFontColor};
`;
