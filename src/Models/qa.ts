import {formatTDateISODate} from '../Utilities/FunctionUtilities';
import {Company} from './company';
import {TDateISODate} from './dateFormat';

import {User} from './user';
import {Contact} from './contacts';
export interface QAList {
  defectListId: string;
  pdfPath: string;
  createdOn: TDateISODate;
  workingCount: number;
  unattendedCount: number;
  completedCount: number;
  dueDate: TDateISODate | null;
  company: string;
  project?: string | null;
  docket?: string | null;
  completed: boolean;
  createdBy: string;

  contributors: string[];
  assignee: string | null;
  assigneeName: string;
  defectListTitle: string;

  readonly contributorNameList?: string[];
  readonly pdfUrl?: string;
  readonly signatureUrl?: string;
  creatorJson?: User;
  contributorJson?: Contact[];
  assigneeJson?: Contact;

  //! this prop not relative to the model, just for handling UI
  isNew?: boolean;
}
export interface QA {
  defectId: string;
  description: string;
  createdOn: string;
  assigneeName: string;
  status: TQAStatus;
  company: string;
  project?: string | null;
  docket?: string | null;
  createdBy: string;
  assignee: string | null;
  defectList: string;
  creatorJson?: User;
  dueDate: TDateISODate | null;
  index: number;
  floorName: string;
  roomName: string;
  room: string | null; // room id
  floor: string | null; // floor id

  //! this prop is just for the purpose of  handling ui responsive, not for updating backend
  isNew?: boolean;
}
export type NewQA = Omit<
  QA,
  'index' | 'floor' | 'floorName' | 'roomName' | 'room'
>;

export interface LightQaImage {
  imageId: string;
  url: string;
  thumbUrl: string;
}
export interface QAWithFirstImg extends QA {
  firstImage: string | null;
  lastComment: QAComment | null;
}

export interface QAMedia {
  imageId: string;
  imagePath: string;
  imagePathWithMarkup: string;
  thumbPath: string;
  imageName: string;
  imageType: string;
  imageHeight: number;
  imageWidth: number;
  imageSize: number;
  createdOn?: TDateISODate;
  modified?: TDateISODate;
  createdBy?: string;
  modifiedBy?: string;
  project?: string | null;
  docket?: string | null;
  company: string;
  defectList: string;
  defect: string;
  readonly url?: string;
  readonly thumbUrl?: string;
  readonly urlWithMarkup?: string;
  markup?: Array<
    | QAMarkupRectangle
    | QAMarkupCircle
    | QAMarkupStraightLine
    | QAMarkupLabel
    | QAMarkupArrow
    | QAMarkupPath
    | QAMarkupPath
  >;
}
export interface QAVideo {
  fileId: string;
  filePath: string | null;
  thumbPath: string | null;
  fileName: string;
  fileType: string;
  fileSize: string;
  readonly createdOn: TDateISODate;
  readonly createdBy: string;
  defect: string;
  defectList: string;
  docket: string | null;
  project: string | null;
  company: string;
  url?: string;
  thumbUrl?: string;
}
export interface QAComment {
  commentId: string;
  timeStamp?: TDateISODate;
  commentText: string;
  author: string;
  readonly authorJson?: User;
  company: string;
  defect: string;
  project?: string | null;
  docket?: string | null;
  isOfficial?: boolean;
}
export type TQAStatus = 'Working' | 'Unattended' | 'Completed';

interface BaseQAMarkup {
  id: string;
  bgColor: string;
  borderColor: string;
  borderThickness: number;
  defectImage: string;
  markupIndex: number;
}

export interface QAMarkupRectangle extends BaseQAMarkup {
  shape: 'rectangle';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export interface QAMarkupPath extends BaseQAMarkup {
  shape: 'path';
  path: string[];
}
export interface QAMarkupCircle extends BaseQAMarkup {
  shape: 'circle';
  startX: number;
  startY: number;
  radius: number;
}
export interface QAMarkupStraightLine extends BaseQAMarkup {
  shape: 'line';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export interface QAMarkupLabel extends BaseQAMarkup {
  shape: 'label';
  startX: number;
  startY: number;
  markupText: string;
}
export interface QAMarkupArrow extends BaseQAMarkup {
  shape: 'arrow';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const NEW_QA_LIST_TEMPLATE = (data: {
  defectListTitle: string;
  company: Company | undefined;
  createdBy?: string;
  project?: string;
  docket?: string;
  assignee?: string;
  assigneeName?: string;
}): QAList => {
  const newQAList: QAList = {
    defectListId: '',
    pdfPath: '1234',
    createdOn: formatTDateISODate(new Date()),
    workingCount: 0,
    unattendedCount: 0,
    completedCount: 0,
    dueDate: formatTDateISODate(new Date()),
    company: data.company?.companyId || '',

    assignee: data.assignee || null,
    assigneeName: data.assigneeName || '',
    createdBy: data.createdBy || '',
    contributors: [],
    defectListTitle: data.defectListTitle,
    completed: false,
  };
  if (data.project) newQAList.project = data.project;
  if (data.docket) newQAList.docket = data.docket;
  return newQAList;
};

export const NEW_QA_ITEM_TEMPLATE = (
  data: Pick<QA, 'defectList' | 'company'> &
    Partial<
      Pick<
        QA,
        | 'assignee'
        | 'status'
        | 'createdBy'
        | 'description'
        | 'dueDate'
        | 'project'
        | 'docket'
      >
    >,
): NewQA => {
  const {
    company,
    defectList,
    description,
    project,
    assignee,
    status,
    createdBy,
    dueDate,
    docket,
  } = data;

  const newQA: NewQA = {
    defectId: '',
    description: description || 'Untitled QA ITEM',
    createdOn: formatTDateISODate(new Date()),
    assigneeName: '',
    status: status || 'Unattended',

    company: company,

    createdBy: createdBy || '',
    assignee: assignee || null,
    defectList: defectList,
    dueDate: dueDate || null,
  };
  if (project) newQA.project = project;
  if (docket) newQA.docket = docket;
  return newQA;
};

export const NEW_QA_COMMENT_TEMPLATE = (
  data: Pick<QAComment, 'commentText' | 'company' | 'defect' | 'author'>,
): QAComment => {
  return {
    commentId: '',
    commentText: data.commentText,
    author: data.author,
    company: data.company,
    defect: data.defect,
  };
};

export const NEW_QA_IMAGE_TEMPLATE = (
  data: Omit<QAMedia, 'createdOn' | 'modified' | 'modifiedBy' | 'imageId'> &
    Partial<Pick<QAMedia, 'createdBy' | 'imageId'>>,
): QAMedia => {
  return {
    imageId: data.imageId || '',
    imagePath: data.imagePath,
    imagePathWithMarkup: data.imagePathWithMarkup,
    thumbPath: data.thumbPath,
    imageName: data.imageName,
    imageType: data.imageType,
    imageHeight: data.imageHeight,
    imageWidth: data.imageWidth,
    imageSize: data.imageSize,
    createdBy: data.createdBy || undefined,
    project: data.project,
    company: data.company,
    defectList: data.defectList,
    defect: data.defect,
  };
};
