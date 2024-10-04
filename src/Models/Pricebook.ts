import {BasicCoreDocket} from './docket';
import {IPaginationFilter} from './filterTypes';

export interface PricebookItem {
  pricebookId: string;
  coreDockets: string[];
  coreDocketsJson: BasicCoreDocket[];
  description: string;
  company: string;
  supplierRates: PricebookSupplierRate[];
  swatches: PricebookSwatch[];
}

export interface PricebookSupplierRate {
  rateId: string;
  pricebookItemDescription: string;
  supplierName: string;
  uom: string;
  unitCost: string;
  timeStamp: string;
  pricebookItem: string;
  supplier: string | null;
  company?: string;

  isNew?: boolean;
}

export interface PricebookSwatch {
  swatchId: string;
  url: string;
  thumbUrl: string;
  index: number;
  isDefault: boolean;
}

export type PricebookRateOrderByFields =
  | 'pricebook_item_description'
  | 'supplier_name'
  | 'uom'
  | 'unit_cost'
  | 'time_stamp';
// |'swatch_count'

export type RevPricebookRateOrderByFields = `-${PricebookRateOrderByFields}`;
type PricebookHeadersBackwardMapInterface = {
  [Property in TPricebookTableHeaders]: PricebookRateOrderByFields;
};
export const PRICEBOOK_SUPPLIER_RATEHEADERS_MAP: PricebookHeadersBackwardMapInterface =
  {
    Item: 'pricebook_item_description',
    Supplier: 'supplier_name',
    Unit: 'uom',
    'Unit Price': 'unit_cost',
    Modified: 'time_stamp',
    // Swatches: "swatch_count",
  };

export interface PricebookSupplierRateFilters extends IPaginationFilter {
  search?: string;
  supplier?: string;
  uom?: string;
  pricebook_item__core_dockets?: string;
  company?: string;
  order_by?: PricebookRateOrderByFields | RevPricebookRateOrderByFields;
  core_docket?: string;
}

export type PricebookItemOrderByFields =
  | 'description'
  | 'core_dockets'
  | 'swatch_count'
  | 'item_count';

export type RevPricebookItemOrderByFields = `-${PricebookItemOrderByFields}`;

export interface PricebookItemFilters extends IPaginationFilter {
  search?: string;
  core_dockets?: string;
  company?: string;
  order_by?: PricebookItemOrderByFields | RevPricebookItemOrderByFields;
}

export type TPricebookTableHeaders =
  | 'Item'
  | 'Supplier'
  | 'Unit'
  | 'Unit Price'
  | 'Modified';
// |"Swatches"

export interface IPricebookTableHeaders {
  headerName: TPricebookTableHeaders;
  isDisplayed: boolean;
}

export const PRICEBOOK_TABLE_HEADER_LIST: IPricebookTableHeaders[] = [
  {
    headerName: 'Item',
    isDisplayed: true,
  },
  {
    headerName: 'Supplier',
    isDisplayed: true,
  },
  {
    headerName: 'Unit Price',
    isDisplayed: true,
  },
  {
    headerName: 'Unit',
    isDisplayed: true,
  },
  {
    headerName: 'Modified',
    isDisplayed: true,
  },
  // {
  //   headerName: "Swatches",
  //   isDisplayed: true,
  // },
];
