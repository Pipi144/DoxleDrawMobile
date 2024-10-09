import {StyleSheet} from 'react-native';
import React from 'react';
import {StyledProjectFileInsideFolderContainer} from '../ProjectFileDisplayer/StyledComponentProjectFileDisplayer';
import FolderFileListView from './FolderFileListView';
import FolderFilesGridView from './FolderFilesGridView';

import EditProjectFileModal from '../EditProjectFileModal/EditProjectFileModal';

import useProjectFileInsideFolderScreen from './Hooks/useProjectFileInsideFolderScreen';

import UploadIndicator from '../UploadIndicator/UploadIndicator';
import SearchSection from '../../../DesignPattern/SearchSection/SearchSection';

type Props = {navigation: any};

const ProjectFileInsideFolderScreen = (props: Props) => {
  const {currentView} = useProjectFileInsideFolderScreen();
  return (
    <StyledProjectFileInsideFolderContainer $paddingTop={4}>
      <SearchSection
        placeholder="Search files"
        containerStyle={{
          marginVertical: 14,
        }}
      />
      {currentView === 'ListView' && <FolderFileListView />}
      {currentView === 'GridView' && <FolderFilesGridView />}

      <EditProjectFileModal />

      <UploadIndicator />
    </StyledProjectFileInsideFolderContainer>
  );
};

export default ProjectFileInsideFolderScreen;

const styles = StyleSheet.create({});
