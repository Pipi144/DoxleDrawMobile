import {User} from './user';

export interface NoteLine {
  lineId?: string;
  text: string;
  isBold: boolean;
  isItalic: boolean;
  isQuoted: boolean;
  isBullet: boolean;
}

export interface Note {
  noteId: string;
  project: string | null;
  docket: string | null;
  company: string;
  title: string;
  body?: string;
  created: string;
  createdBy: User;
  lastModified: string;
  lastModifiedBy: User | string;
  lines: NoteLine[];

  //*prop just to handle frontend ui responsive
  isNew?: boolean;
}
