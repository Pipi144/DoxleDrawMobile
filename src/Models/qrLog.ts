import {TDateISODate, TISODateTime} from './dateFormat';
import {User} from './user';

export interface IQRCodeFilterQuery {
  project?: string; // project id
  created_by?: TDateISODate; // user id
  search?: string; // plain text string search
}
export interface IQRLogFilterQuery {
  project?: string;
  user?: string;
  search?: string; // plain text string search
  search_date?: TDateISODate; // date search
  search_date_range?: [TDateISODate, TDateISODate]; // date range search
}

export interface IQRUserLogFilterQuery {
  project?: string;
  user?: string;
  search?: string; // plain text string search
  search_date?: TDateISODate; // date search
  search_date_range?: [TDateISODate, TDateISODate]; // date range search
  page_size?: number;
  order_by?: TOrderQRUserLog[];
  pagination?: 'none';
}

export type TOrderQRUserLog =
  | 'user__first_name'
  | '-user__first_name'
  | 'entry_time'
  | '-entry_time'
  | 'exit_time'
  | '-exit_time';
//* <--- QR CODE ---> *//
export interface IQRCode {
  codeId: string; //  id of qr
  name: string; // name/description of qr
  path: string; // path/url of qr
  expires: TISODateTime | null; //  expiration date of qr
  disabled: boolean; //  is qr disabled
  autoLogoutTimeHours: number | null; // auto logout time in hours
  limitToWhiteList: boolean; //  is qr limited to whitelist
  readonly createdOn: TISODateTime; // date created
  createdBy: string; // user id
  project: string; // project id
  company: string; // company id
  url?: string | null; // url of qr img
  siteAddress?: string; // site address of project
}

export interface IQRCodeFullDetail extends IQRCode {
  whiteList: IQRWhiteList[]; //  list of user ids
  blackList: IQRBlackList[]; //  list of user ids
}

export interface IAddQRCodeParams {
  project: string; // project id
  name: string; // name/description of qr
  expires?: TISODateTime; //  expiration date of qr
  autoLogoutTimeHours?: number; // auto logout time in hours
  limitToWhiteList: boolean; //  is qr limited to whitelist
  grantedUserList: IQRWhiteList[]; //  list of user ids
}

export interface IPatchQRCodeParams
  extends Partial<
    Pick<
      IQRCode,
      | 'name'
      | 'expires'
      | 'autoLogoutTimeHours'
      | 'limitToWhiteList'
      | 'disabled'
    >
  > {
  qrCodeId: string; // id of qr
  whiteList?: IQRWhiteList[]; //  white list of users
}

//* <------> *//

export interface IQRWhiteList {
  id: string; // id of whitelist
  user: string; // user id
  userName: string; // user name
  qrCode: string; // qr id
}

export interface IQRBlackList {
  id: string; // id of whitelist
  user: string; // user id
  userName: string; // user name
  qrCode: string; // qr id
}

export type TQRAccessLogType = 'in' | 'out';
export interface IQRAccessLog {
  accessLogId: string; // id of access log
  siteAddress: string; // site address of project
  timeStamp: TDateISODate; // time of access
  type: TQRAccessLogType; // type of access
  user: User; // user id
  qrCode: string; //   qr id
  project: string; // project id
  company: string; // company id
  qrCodeTitle?: string;
}

export interface IQRAccessScanParams {
  qrCode: string;
}

export interface IQRLogDateGroup {
  date: Date;
  data: IQRAccessLog[];
}

export interface IQRUserLog {
  userLogId: string; // id of user log
  entryTime: TISODateTime; // time of entry
  exitTime: TISODateTime | null; // time of exit
  siteAddress: string; // site address of project
  userName: string; // user name
  user: string; // user id
  qrCode: string; // qr id
  project: string; // project id
  company: string; // company id
}
export interface IQRUserLogDateGroup {
  date: Date;
  data: IQRUserLog[];
}

export interface IScanQRCodeReturnedData {
  newLog: IQRAccessLog;
  userLog: IQRUserLog;
}
