import {TDoxleVideoViewerRouteParams} from '../../DesignPattern/DoxleVideoViewer/DoxleVideoViewer';

export type TProjectFileTabStack = {
  RootProjectFile: undefined;
  ProjectFolderFileScreen: {};
  ProjectNewFolderScreen: {};
  ProjectFileHistoryScreen: {};
  ProjectFileViewerScreen: {
    url: string;
    type: string;
  };
  ProjectFileRenameScreen: {};
  ProjectFileViewVideo: TDoxleVideoViewerRouteParams;
};
