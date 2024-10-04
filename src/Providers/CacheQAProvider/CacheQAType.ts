import {QA, QAMedia, QAList} from '../../Models/qa';
import {Project} from '../../Models/project';
import {TBgUploadStatus} from '../../GeneralStore/useBgUploadVideoStore';

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
export interface LocalQAVideo extends QAMedia {
  status: TBgUploadStatus;
}
