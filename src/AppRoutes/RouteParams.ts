import {Company} from '../Models/company';

export type TNavigationRootAppProps = {
  Projects?: {};
  Actions?: {};
  Files?: {};
  AddCompany?: {};
  EditCompany?: {edittedCompany: Company};
  Inventory?: {};
  VideoViewer?: {
    videoUrl: string;
  };
};
