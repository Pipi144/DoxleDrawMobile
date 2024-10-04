import {Contact} from './contacts';
import {TDateISODate} from './dateFormat';
import {User} from './user';
import {TAPIServerFile} from './utilityType';

export type MailOrderByFields =
  | 'ball_in_court'
  | 'to_string'
  | 'from_string'
  | 'time_stamp'
  | 'status';

export type RevMailOrderByFields = `-${MailOrderByFields}`;

export interface MailQueryFilter {
  ordering?: MailOrderByFields | RevMailOrderByFields;
  search?: string;
  ball_in_court?: 'true';
  is_resolved?: 'true';
  status?: string;
  order?: string;
  rfi?: string;
  docket?: string;
  project?: string;
  from?: string;
  subject?: string;
  start_date?: TDateISODate;
  end_date?: TDateISODate;
}

export interface MailConversationParam {
  mailId: string | undefined;
  onSuccessCb?: () => void;
}

export interface Mail {
  mailId: string;
  type: string;
  outgoingType: string;
  toStringName?: string;
  fromString: string;
  recipients: string;
  ccRecipients: string;
  watchers: string[];
  subject: string;
  textBody: string;
  sesMessageId: string;
  timeStamp: string;
  isFlagged: boolean;
  isResolved: boolean;
  replies: number;
  dueDate: string | null;
  readonly mailComments?: MailComments[];
  readonly replyMail?: ReplyMail[];
  readonly watchersJson?: Contact[];
  readonly attachments: MailAttachment[];
  readonly attachmentsCount: number;
  statusName: string;
  statusColor: string;
  status: string;
  ballInCourt: string;
  readonly ballInCourtJson?: Contact;
  fromUser: User;
  watcherContacts: string[];
  quote: string | null;
  rfi: string | null;
  order: string | null;
  payment: string | null;
  docket: string | null;
  project: string | null;
  company: string;
}

export interface NewMail {
  watchers: string[];
  subject: string;
  textBody: string;
  isFlagged?: boolean;
  isResolved?: boolean;
  dueDate?: string | null;
  status?: string;
  ballInCourt: string;
  docket?: string | null;
  project?: string | null;
  attachments: TAPIServerFile[];
}

export interface MailAttachment {
  attachmentId: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  mail: string;
  replyMail: string | null;
  mailComment: string | null;
}

export interface MailComments {
  commentId: string;
  timeStamp: string;
  textBody: string;
  pinned: string;
  taggedUsers: string;
  hasAttachments: string;
  fromUser: string;
  fromString: string;
  docket: string | undefined;
  project: string | undefined;
  company: string;
  attachments: MailAttachment[];
}

export interface ReplyMail {
  replyId: string;
  type: 'Received' | 'CCd';
  recipients: string;
  toStringName: string;
  fromString: string;
  inReplyToMessageId: string;
  ccRecipients: string;
  subject: string;
  textBody: string;
  isOfficialResponse: string;
  timeStamp: string;
  fromUser: string;
  readonly attachments: MailAttachment[];
  mail: string;
}
