import React from 'react';
import {StyledProjectFileDisplayerContainer} from './StyledComponentProjectFileDisplayer';

import ProjectFileListView from './ProjectFileListView';
import EditProjectFileModal from '../EditProjectFileModal/EditProjectFileModal';
import ProjectFileGridView from './ProjectFileGridView';
import useProjectFileDisplayer from '../../Hooks/useProjectFileDisplayer';
import {useProjectFileStore} from '../../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import UploadIndicator from '../UploadIndicator/UploadIndicator';
import SearchSection from '../../../DesignPattern/SearchSection/SearchSection';

type Props = {};

const ProjectFileDisplayer = () => {
  const {onSearch} = useProjectFileDisplayer({});
  const {currentView} = useProjectFileStore(
    useShallow(state => ({
      currentView: state.currentView,
    })),
  );

  return (
    <StyledProjectFileDisplayerContainer>
      <SearchSection
        placeholder="Search folder or files"
        containerStyle={{
          marginVertical: 14,
        }}
        onSearch={onSearch}
      />

      {currentView === 'ListView' && <ProjectFileListView />}
      {currentView === 'GridView' && <ProjectFileGridView />}

      <EditProjectFileModal />

      <UploadIndicator />
    </StyledProjectFileDisplayerContainer>
  );
};

export default ProjectFileDisplayer;
