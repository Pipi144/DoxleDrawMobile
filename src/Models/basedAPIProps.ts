import {Company} from './company';

export interface BaseAPIProps {
  accessToken?: string | undefined;
  company: Company | undefined;
  showNotification?: (
    message: string,
    messageType: 'success' | 'error',
    extraMessage?: string,
    duration?: number,
  ) => void;
  onErrorCb?: Function;
}
