import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useProjectFileStore} from '../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useFocusEffect} from '@react-navigation/native';

import FileMenuRootMode from '../Components/FilePopupMenu/FileMenuRootMode';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';

type Props = {};

const useProjectFileDisplayer = (props: Props) => {
  const {selectedProject} = useCompany();
  const {
    setWholeFilterProjectFolderQuery,
    setWholeFilterProjectFileQuery,
    setCurrentFolder,
    setPartialFilterProjectFileQuery,
    setPartialFilterProjectFolderQuery,
  } = useProjectFileStore(
    useShallow(state => ({
      setWholeFilterProjectFileQuery: state.setWholeFilterProjectFileQuery,
      setWholeFilterProjectFolderQuery: state.setWholeFilterProjectFolderQuery,
      setCurrentFolder: state.setCurrentFolder,
      setPartialFilterProjectFileQuery: state.setPartialFilterProjectFileQuery,
      setPartialFilterProjectFolderQuery:
        state.setPartialFilterProjectFolderQuery,
    })),
  );
  const {setCustomisedPopupMenu, setOveridenRouteName} = useAppModalHeaderStore(
    useShallow(state => ({
      setCustomisedPopupMenu: state.setCustomisedPopupMenu,
      setOveridenRouteName: state.setOveridenRouteName,
    })),
  );
  const onSearch = (val: string) => {
    setPartialFilterProjectFileQuery({});
    setPartialFilterProjectFolderQuery({});
  };
  useEffect(() => {
    setWholeFilterProjectFolderQuery({projectId: selectedProject?.projectId});
    setWholeFilterProjectFileQuery({projectId: selectedProject?.projectId});
    setCurrentFolder(undefined);
  }, [selectedProject]);

  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(<FileMenuRootMode />);
      setOveridenRouteName(undefined);
    }, []),
  );
  return {onSearch};
};

export default useProjectFileDisplayer;

const styles = StyleSheet.create({});