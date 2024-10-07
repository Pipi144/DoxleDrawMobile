import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {DoxleFile, DoxleFolder} from '../../../Models/files';
import {
  IFilterGetFileQueryFilter,
  IFilterGetFolderQueryFilter,
} from '../../../API/fileQueryAPI';

export type FileView = 'GridView' | 'ListView';

interface FileStore {
  currentFile: DoxleFile | undefined;
  currentFolder: DoxleFolder | undefined;
  edittedFolder: DoxleFolder | undefined;
  currentView: FileView;
  //*control folder query filter
  filterProjectFolderQuery: IFilterGetFolderQueryFilter;

  //*control file root query filter
  filterProjectFileQuery: IFilterGetFileQueryFilter;

  showModal: boolean;
  setCurrentFile: (newFile: DoxleFile | undefined) => void;
  setCurrentFolder: (newFolder: DoxleFolder | undefined) => void;
  setEdittedFolder: (folder: DoxleFolder | undefined) => void;
  setCurrentView: (view: FileView) => void;
  setShowModal: (isVisible: boolean) => void;

  setPartialFilterProjectFolderQuery: (
    filter: Partial<IFilterGetFolderQueryFilter>,
  ) => void;
  setWholeFilterProjectFolderQuery: (
    filter: Partial<IFilterGetFolderQueryFilter>,
  ) => void;
  setPartialFilterProjectFileQuery: (
    filter: Partial<IFilterGetFileQueryFilter>,
  ) => void;
  setWholeFilterProjectFileQuery: (
    filter: Partial<IFilterGetFileQueryFilter>,
  ) => void;
}

export const useProjectFileStore = create(
  immer<FileStore>((set, get) => ({
    currentFile: undefined,
    currentFolder: undefined,
    edittedFolder: undefined,

    currentView: 'ListView',
    showModal: false,

    filterProjectFolderQuery: {},
    filterProjectFileQuery: {},
    setCurrentFile: (newFile: DoxleFile | undefined) =>
      set(state => {
        state.currentFile = newFile;
      }),

    setCurrentFolder: (newFolder: DoxleFolder | undefined) =>
      set(state => {
        state.currentFolder = newFolder;
      }),
    setEdittedFolder: (folder: DoxleFolder | undefined) =>
      set(state => {
        state.edittedFolder = folder;
      }),
    setCurrentView: (newView: FileView) =>
      set(state => {
        state.currentView = newView;
      }),

    setShowModal: (isVisible: boolean) =>
      set(state => {
        state.showModal = isVisible;
      }),

    setPartialFilterProjectFolderQuery: (
      filter: Partial<IFilterGetFolderQueryFilter>,
    ) =>
      set(state => {
        state.filterProjectFolderQuery = {
          ...state.filterProjectFolderQuery,
          ...filter,
        };
      }),
    setWholeFilterProjectFolderQuery: (
      filter: Partial<IFilterGetFolderQueryFilter>,
    ) =>
      set(state => {
        state.filterProjectFolderQuery = filter;
      }),
    setPartialFilterProjectFileQuery: (
      filter: Partial<IFilterGetFileQueryFilter>,
    ) =>
      set(state => {
        state.filterProjectFileQuery = {
          ...state.filterProjectFileQuery,
          ...filter,
        };
      }),
    setWholeFilterProjectFileQuery: (
      filter: Partial<IFilterGetFileQueryFilter>,
    ) =>
      set(state => {
        state.filterProjectFileQuery = filter;
      }),
  })),
);
