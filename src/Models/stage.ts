import {TDateISODate} from './dateFormat';

export interface IStageBudget {
  stageId: string;
  project: string;
  company: string;
  coreStage: string | null;
  title: string;
  startDate: TDateISODate | null;
  endDate: TDateISODate | null;
  targetDate: TDateISODate | null;
  contractValue: string | null;
  totalOrders: string | null;
  totalInvoices: string | null;
  totalActuals: string | null;
  totalRunning: string | null;
  index: number;
}

export interface IStageAPIQueryFilter {
  projectId: string;
  order_by?: TStageAPIOrderByOptions;
  pagination?: 'none';
}

export type TStageAPIOrderByOptions =
  | 'index'
  | '-index'
  | 'target_date'
  | '-target_date'
  | 'title'
  | '-title';
