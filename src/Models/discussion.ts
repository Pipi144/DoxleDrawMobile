import {uniqueId} from 'lodash';
import {Company} from './company';
import {TDateISODate} from './dateFormat';
import {DoxleFile} from './files';

import {User} from './user';
import {TAPIServerFile} from './utilityType';

export interface Discussion {
  commentId: string;
  commentText: string;
  pinned: boolean;
  taggedUsers: string[]; //userIds
  hasAttachments: boolean;
  author: string; //userId
  authorJson?: User; //USER INFO IN JSON
  docket: string;
  project: string | null;
  timeStamp?: TDateISODate;
  company: string;
  attachments?: DoxleFile[];
}

export interface DissionVideoPending extends Discussion {}

export interface TempDiscussionHolder extends Discussion {
  localBatchId: string;
}
interface GetNewDiscussionTemplateParams {
  commentText: string;
  taggedUsers?: string[];
  docket: string;
  project?: string;
  company: Company | undefined;
}

export const getNewTemplateDiscussion = ({
  commentText,
  taggedUsers,
  docket,
  project,
  company,
}: GetNewDiscussionTemplateParams): Discussion => {
  let newDiscussion: Discussion = {
    commentId: '',
    commentText: commentText,
    pinned: false,
    hasAttachments: false,
    taggedUsers: [],
    author: '',

    company: company?.companyId || '',
    docket: docket,
    project: null,
  };

  if (taggedUsers) newDiscussion.taggedUsers = taggedUsers;
  if (project) newDiscussion.project = project;
  return newDiscussion;
};

export const getTemplateVideoDiscussion = ({
  commentText,
  taggedUsers,
  docket,
  project,
  company,
  videoFile,
}: GetNewDiscussionTemplateParams & {
  videoFile: TAPIServerFile;
}): TempDiscussionHolder => {
  let newDiscussion: TempDiscussionHolder = {
    commentId: '',
    commentText: commentText,
    pinned: false,
    hasAttachments: false,
    taggedUsers: [],
    author: '',
    localBatchId: uniqueId(docket),
    company: company?.companyId || '',
    docket: docket,
    project: null,
  };

  if (taggedUsers) newDiscussion.taggedUsers = taggedUsers;
  if (project) newDiscussion.project = project;
  return newDiscussion;
};

export function isDiscussion(item: any): item is Discussion {
  return item.hasOwnProperty('commentId');
}
