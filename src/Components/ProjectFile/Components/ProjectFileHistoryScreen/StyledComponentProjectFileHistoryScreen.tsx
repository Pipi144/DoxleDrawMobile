import styled from 'styled-components/native';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

export const StyledProjectFileHistoryScreenContainer = styled.View<{}>`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  background-color: ${p => p.theme.THEME_COLOR.primaryBackgroundColor};
`;
export const StyledProjectFileHistoryTopView = styled.View<{}>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${p => p.theme.THEME_COLOR.primaryFontColor};
  padding-bottom: 14px;
`;
export const StyledHistoryTitleWrapper = styled.View`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const StyledFileHistoryTitleText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 600;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize + 5}px;

  width: 100%;
  text-align: center;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;
export const StyledFileIconAndNameWrapper = styled.View`
  margin-top: 12px;

  display: flex;

  align-items: center;
  justify-content: center;
`;
export const StyledFileHistoryNameText = styled.Text<{}>`
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;
  max-width: 80%;
  text-align: center;
  margin-top: 10px;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;
export const StyledProjectFileHistoryBottomView = styled.ScrollView`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  margin-top: 0px;
`;
export const StyledFileDetailsTitleText = styled.Text<{}>`
  margin-top: 20px;
  margin-left: 10px;
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 500;
  font-size: ${p => p.theme.doxleFontSize.headTitleTextSize}px;

  text-align: left;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.5',
    })};
`;
export const StyledFileLabelText = styled.Text<{}>`
  margin-top: 40px;
  margin-left: 30px;
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  text-align: left;
  color: ${p => p.theme.THEME_COLOR.primaryFontColor};
`;
export const StyledFileContentText = styled.Text<{}>`
  margin-top: 10px;
  margin-left: 30px;
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.subContentTextSize}px;

  text-align: left;
  color: ${p =>
    editRgbaAlpha({
      rgbaColor: p.theme.THEME_COLOR.primaryFontColor,
      alpha: '0.4',
    })};
`;
export const StyledFileDirectLinkText = styled.Text<{}>`
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 12px;
  font-family: ${p => p.theme.DOXLE_FONT.primaryFont};
  font-style: normal;
  font-weight: 400;
  font-size: ${p => p.theme.doxleFontSize.contentTextSize}px;

  text-align: left;
  border: 1px solid ${p => p.theme.THEME_COLOR.primaryDividerColor};

  color: ${p => p.theme.THEME_COLOR.doxleColor};
`;
