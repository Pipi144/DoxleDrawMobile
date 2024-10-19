import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import {useShallow} from 'zustand/shallow';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';
import {useFocusEffect} from '@react-navigation/native';
import FileMenuRootMode from '../../FilePopupMenu/FileMenuRootMode';
import useSetFileQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetFileQueryData';
import useSetRootFolderQueryData from '../../../../../CustomHooks/QueryDataHooks/useSetRootFolderQueryData';

type Props = {};

const useProjectFileDisplayer = (props: Props) => {
  const [searchInput, setSearchInput] = useState<string>('');

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
  const {removeFileQueryDataWithSearch} = useSetFileQueryData({});
  const {removeFolderQueryDataWithSearch} = useSetRootFolderQueryData({});
  const onSearch = (val: string) => {
    setSearchInput(val);
  };
  useEffect(() => {
    setWholeFilterProjectFolderQuery({projectId: selectedProject?.projectId});
    setWholeFilterProjectFileQuery({projectId: selectedProject?.projectId});
    setCurrentFolder(undefined);
  }, [selectedProject]);

  useEffect(() => {
    setPartialFilterProjectFileQuery({
      search: searchInput || undefined,
    });
    setPartialFilterProjectFolderQuery({
      search: searchInput || undefined,
    });
    if (!searchInput) {
      removeFileQueryDataWithSearch();
      removeFolderQueryDataWithSearch();
    }
  }, [searchInput]);

  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(<FileMenuRootMode />);
      setOveridenRouteName(undefined);

      return () => {
        setSearchInput('');
      };
    }, []),
  );
  return {onSearch, searchInput};
};

export default useProjectFileDisplayer;

const styles = StyleSheet.create({});
