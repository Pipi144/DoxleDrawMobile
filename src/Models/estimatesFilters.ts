import {Docket} from './docket';

export interface EstimateDocket extends Docket {
  estimates: Estimate[];
}

export interface Estimate {
  estimateId: string;
  index: number;
  description: string;
  quantity: string | number;
  quantityCalculation: string;
  unit: string;
  unitCost: string | number;
  lineCost: string | number;
  estimateValue: string | number;
  isAllowance: boolean;
  takeOffName: string;
  pricebookItemName: string;
  takeOff: string | null;
  pricebookItem: string | null;
  docket: string | null;
  coreDocket: string | null;
  project: string | null;
  company: string;
}

export type EstimatesOrderByFields =
  | 'index'
  | 'description'
  | 'unit'
  | 'estimate_value'
  | 'docket__docket_id'
  | 'unit_cost'
  | 'line_cost'
  | 'is_allowance';
// |'docket__docket_name'

export type RevEstimatesOrderByFields = `-${EstimatesOrderByFields}`;

export interface EstimatesFilters {
  search?: string;
  project?: string;
  docket?: string;
  core_docket?: string;
  is_allowance?: 'true';
  order_by?: EstimatesOrderByFields | RevEstimatesOrderByFields;
}
