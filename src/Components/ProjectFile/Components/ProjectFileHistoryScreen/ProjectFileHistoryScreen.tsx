import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledProjectFileHistoryBottomView,
  StyledProjectFileHistoryScreenContainer,
  StyledProjectFileHistoryTopView,
  StyledFileContentText,
  StyledFileDirectLinkText,
  StyledFileHistoryNameText,
  StyledFileHistoryTitleText,
  StyledFileIconAndNameWrapper,
  StyledFileLabelText,
  StyledHistoryTitleWrapper,
} from './StyledComponentProjectFileHistoryScreen';

import AntIcon from 'react-native-vector-icons/AntDesign';
import dayjs from 'dayjs';

import useProjectFileHistoryScreen from '../../Hooks/useProjectFileHistoryScreen';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {DOXLE_MIME_TYPE} from '../../../../Models/MimeFileType';
import {
  DoxleExcelIcon,
  DoxleJPGIcon,
  DoxlePDFIcon,
  DoxlePNGIcon,
  DoxleWordIcon,
} from '../../../DesignPattern/DoxleIcons';
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

type Props = {navigation: any};

const ProjectFileHistoryScreen = ({navigation}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const {onPressLink, currentFile} = useProjectFileHistoryScreen();
  if (currentFile)
    return (
      <StyledProjectFileHistoryScreenContainer>
        <StyledProjectFileHistoryTopView>
          <StyledHistoryTitleWrapper>
            <StyledFileHistoryTitleText>
              File History
            </StyledFileHistoryTitleText>
          </StyledHistoryTitleWrapper>
          <StyledFileIconAndNameWrapper>
            {currentFile.fileType
              .toLowerCase()
              .includes(DOXLE_MIME_TYPE.pdf) ? (
              <DoxlePDFIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 35 : 45,
                }}
              />
            ) : currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.jpg) ||
              currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.jpeg) ? (
              <DoxleJPGIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 35 : 45,
                }}
              />
            ) : currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.png) ? (
              <DoxlePNGIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 35 : 45,
                }}
              />
            ) : currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.doc.toLowerCase()) ||
              currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.docx.toLowerCase()) ? (
              <DoxleWordIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 35 : 45,
                }}
              />
            ) : currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.xls.toLowerCase()) ||
              currentFile.fileType
                .toLowerCase()
                .includes(DOXLE_MIME_TYPE.xlsx.toLowerCase()) ? (
              <DoxleExcelIcon
                containerStyle={{
                  width: deviceType === 'Smartphone' ? 35 : 45,
                }}
              />
            ) : (
              <AntIcon
                name="videocamera"
                size={deviceType === 'Smartphone' ? 35 : 45}
                color={THEME_COLOR.primaryFontColor}
              />
            )}

            <StyledFileHistoryNameText>
              {currentFile.fileName}
            </StyledFileHistoryNameText>
          </StyledFileIconAndNameWrapper>
        </StyledProjectFileHistoryTopView>
        <StyledProjectFileHistoryBottomView>
          <StyledFileLabelText>Created By:</StyledFileLabelText>
          <StyledFileContentText>
            {currentFile?.ownerName ?? '-'}
          </StyledFileContentText>

          <StyledFileLabelText>Last update by:</StyledFileLabelText>
          <StyledFileContentText>
            {currentFile.modifiedByName ?? '-'}
          </StyledFileContentText>

          <StyledFileLabelText>File size:</StyledFileLabelText>
          <StyledFileContentText>
            {(parseInt(currentFile.fileSize) / 1024 / 1024).toFixed(2)} MB
          </StyledFileContentText>

          <StyledFileLabelText>Docket:</StyledFileLabelText>
          <StyledFileContentText>
            {currentFile.docket ?? '-'}
          </StyledFileContentText>

          <StyledFileLabelText>Direct Link:</StyledFileLabelText>
          <StyledFileDirectLinkText
            numberOfLines={4}
            ellipsizeMode="tail"
            onPress={onPressLink}>
            {currentFile.url}
          </StyledFileDirectLinkText>
        </StyledProjectFileHistoryBottomView>
      </StyledProjectFileHistoryScreenContainer>
    );

  return <></>;
};

export default ProjectFileHistoryScreen;
