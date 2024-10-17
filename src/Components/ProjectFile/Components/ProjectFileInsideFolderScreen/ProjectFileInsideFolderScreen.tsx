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
  const {currentView, onSearch, searchInput} =
    useProjectFileInsideFolderScreen();
  return (
    <StyledProjectFileInsideFolderContainer $paddingTop={4}>
      <SearchSection
        placeholder="Search files"
        containerStyle={{
          marginVertical: 14,
        }}
        onSearch={onSearch}
      />
      {currentView === 'ListView' && (
        <FolderFileListView search={searchInput} />
      )}
      {currentView === 'GridView' && (
        <FolderFilesGridView search={searchInput} />
      )}

      <EditProjectFileModal />

      <UploadIndicator />
    </StyledProjectFileInsideFolderContainer>
  );
};

export default ProjectFileInsideFolderScreen;

const styles = StyleSheet.create({});
