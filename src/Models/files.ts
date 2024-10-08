import {TISODateTime} from './dateFormat';
import {User} from './user';

export interface DoxleFolder {
  readonly folderId: string;
  folderName: string;
  folderSize?: number;
  readonly createdOn?: TISODateTime | string;
  readonly lastModified: TISODateTime | string;
  docket: string | null;
  project: string | null;
  company: string;
  isNew?: boolean;
}

export interface DoxleFile {
  fileId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  filePath: string;
  thumbPath: string;
  url: string;
  thumbUrl: string;
  created: TISODateTime | string;
  modified: TISODateTime | string;
  folderName: string | null;
  folder: string | null;
  docket: string | null;
  project: string | null;
  company: string | null;
  isNew?: boolean;
  readonly owner?: string;
  readonly ownerName?: string;
  readonly modifiedBy?: string | null;
  readonly modifiedByName?: string | null;
}
