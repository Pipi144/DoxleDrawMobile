import React from 'react';

import {useProjectFileStore} from '../../Store/useProjectFileStore';
import {
  StyledProjectFileModalContentContainer,
  StyledModalContentTopWrapper,
  StyledModalContentWrapper,
  StyledModalMenuBtnText,
  StyledModalMenuButton,
  StyledModalTopHeaderText,
  StyledModalFileInfoText,
} from './StyledComponentEditProjectFileModal';
import {
  FileCommentIcon,
  FileDeleteIcon,
  FileHistoryIcon,
  FileRenameIcon,
  FileShareIcon,
} from '../../ProjectFileIcon';
import {useShallow} from 'zustand/react/shallow';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {DoxleFile} from '../../../../Models/files';
import {FadeInUp} from 'react-native-reanimated';
import useProjectFileModalContent from './Hooks/useProjectFileModalContent';

dayjs.extend(relativeTime);
type Props = {};

const ProjectFileModalContent = ({}: Props) => {
  const {staticMenuColor} = useDOXLETheme();

  const {currentFile, edittedFolder} = useProjectFileStore(
    useShallow(state => ({
      currentFile: state.currentFile,
      edittedFolder: state.edittedFolder,
    })),
  );
  const {onShare, onFileComment, onRename, onDelete, onFileHistory} =
    useProjectFileModalContent({});

  let type: string =
    (currentFile as DoxleFile) !== undefined ? 'File' : 'Folder';

  const modifiedTime = edittedFolder
    ? dayjs(new Date()).diff(dayjs(edittedFolder.lastModified), 'hour') > 24
      ? dayjs(edittedFolder.lastModified).format('DD.MMM.YY')
      : dayjs(edittedFolder.lastModified).fromNow()
    : currentFile
    ? dayjs(new Date()).diff(dayjs(currentFile.modified), 'hour') > 24
      ? dayjs(currentFile.modified).format('DD.MMM.YY')
      : dayjs(currentFile.modified).fromNow()
    : '';
  return (
    <StyledProjectFileModalContentContainer>
      <StyledModalContentTopWrapper>
        <StyledModalTopHeaderText numberOfLines={1} ellipsizeMode="tail">
          {currentFile && currentFile.fileName}
          {edittedFolder && edittedFolder.folderName}
        </StyledModalTopHeaderText>
        <StyledModalFileInfoText>
          {(
            Number(
              currentFile
                ? currentFile.fileSize
                : edittedFolder
                ? edittedFolder.folderSize ?? 0
                : 0,
            ) /
            1024 /
            1024
          ).toFixed(2)}{' '}
          MB / {modifiedTime}
        </StyledModalFileInfoText>
      </StyledModalContentTopWrapper>

      <StyledModalContentWrapper>
        <StyledModalMenuButton
          hitSlop={15}
          onPress={() => onShare()}
          entering={FadeInUp.delay(100)}>
          <FileShareIcon staticColor={staticMenuColor.staticWhiteFontColor} />
          <StyledModalMenuBtnText>Share</StyledModalMenuBtnText>
        </StyledModalMenuButton>

        <StyledModalMenuButton
          hitSlop={15}
          onPress={() => onFileComment()}
          entering={FadeInUp.delay(150)}>
          <FileCommentIcon staticColor={staticMenuColor.staticWhiteFontColor} />
          <StyledModalMenuBtnText>Comment</StyledModalMenuBtnText>
        </StyledModalMenuButton>

        <StyledModalMenuButton
          hitSlop={15}
          onPress={() => onRename()}
          entering={FadeInUp.delay(200)}>
          <FileRenameIcon
            staticColor={staticMenuColor.staticWhiteFontColor}
            staticStrokeColor={staticMenuColor.staticBg}
          />
          <StyledModalMenuBtnText>Rename</StyledModalMenuBtnText>
        </StyledModalMenuButton>

        <StyledModalMenuButton
          hitSlop={15}
          onPress={() => onDelete()}
          entering={FadeInUp.delay(250)}>
          <FileDeleteIcon staticColor={staticMenuColor.staticWhiteFontColor} />
          <StyledModalMenuBtnText>Delete</StyledModalMenuBtnText>
        </StyledModalMenuButton>

        {type == 'File' && (
          <StyledModalMenuButton
            hitSlop={15}
            onPress={() => onFileHistory()}
            entering={FadeInUp.delay(300)}>
            <FileHistoryIcon
              staticColor={staticMenuColor.staticWhiteFontColor}
            />
            <StyledModalMenuBtnText>File History</StyledModalMenuBtnText>
          </StyledModalMenuButton>
        )}
      </StyledModalContentWrapper>
    </StyledProjectFileModalContentContainer>
  );
};

export default ProjectFileModalContent;
