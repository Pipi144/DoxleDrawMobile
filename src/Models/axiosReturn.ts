import {InfiniteData} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

export interface AxiosInfiniteReturn<T> {
  results: T[];
  next: string | null;
  pages: number;
  count: number;
  previous: string | null;
}

export interface InfiniteAxiosQueryData<T>
  extends InfiniteData<AxiosResponse<AxiosInfiniteReturn<T>>> {}

export interface DefiniteAxiosQueryData<T> extends AxiosResponse<T> {}

export interface AxiosBackendErrorReturn {
  detail?: string;
  message?: string;
}
