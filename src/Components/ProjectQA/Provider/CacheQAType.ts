import {Project} from '../../../Models/project';
import {QA, QAList, QAMedia} from '../../../Models/qa';
import {TAPIServerFile} from '../../../Models/utilityType';

export interface IStorageInfo {
  totalSpace: number;
  freeSpace: number;
}
export interface LocalQAProject extends Project {
  expired: number;
}

export type ExpiredProjectFile = Array<{
  projectId: string;
  pathToProjectFolder: string;
}>;

export type ExpiredQAListFile = Array<{
  qaListId: string;
  pathToQAListFolder: string;
}>;

export type ExpiredQAFile = Array<{
  qaId: string;
  pathToQAFolder: string;
}>;
export interface LocalQAList extends QAList {
  expired: number;
}

export interface LocalQA extends QA {
  expired: number;
}

export type DeletedQaImageFile = Array<string>;

export type QABatchPendingUpload = {
  qa: QA;
  qaImages: LocalQAImage[];
  qaVideo?: LocalQAVideo;
};

export type QAPendingUploadImageFile = Array<QABatchPendingUpload>;

export type LocalQAImageStatus = 'pending' | 'success';
export interface LocalQAImage extends QAMedia {
  status: LocalQAImageStatus;
}

export type TQAVideoUploadStatus = 'success' | 'pending' | 'error';

export interface LocalQAVideo extends QAMedia {
  status: TQAVideoUploadStatus;
}

export type IQAVideoUploadData<T = unknown> = {
  videoFile: TAPIServerFile;
  thumbnailPath?: string;
  hostId: string; //! could be any id to extract a list of video belong to a certain hostID
  videoId: string; //! to access a specific video
  expired: number | null; //! null it means the video is deleted and nolonger cached
  status: TQAVideoUploadStatus;
  hostItem?: T;
  errorMessage?: string;
};
