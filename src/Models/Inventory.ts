import {TISODateTime} from './dateFormat';

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export interface InventoryItem {
  readonly inventoryId: string; //UUID
  title: string;
  subtitle: string;
  quantity: string; // Decimal String
  unit: string;
  cost: string; // Decimal String
  readonly totalCost: string; // Decimal String
  readonly createdOn: TISODateTime;
  readonly createdBy: string; // User Name
  readonly lastModifiedOn: TISODateTime;
  readonly lastModifiedBy: string; // User Name
  readonly createdByUser: string; // User Id
  readonly lastModifiedByUser: string; // User Id
  readonly company: string; // CompanyId
  defaultImage?: string | null; // url to first thumbnail if exists]
  readonly latestComment: null | InventoryComment;
}

export interface UpdateInventoryItem
  extends Omit<
    Partial<InventoryItem>,
    | 'inventoryId'
    | 'totalCost'
    | 'createdOn'
    | 'createdBy'
    | 'lastModifiedOn'
    | 'lastModifiedBy'
    | 'createdByUser'
    | 'lastModifiedByUser'
    | 'company'
    | 'defaultImage'
  > {}

export interface NewInventoryItem
  extends Omit<
    Partial<Pick<InventoryItem, 'title'>>,
    | 'inventoryId'
    | 'totalCost'
    | 'createdOn'
    | 'createdBy'
    | 'lastModifiedOn'
    | 'lastModifiedBy'
    | 'createdByUser'
    | 'lastModifiedByUser'
    | 'company'
    | 'defaultImage'
  > {}

export interface InventoryImage {
  readonly imageId: string;
  readonly url: string;
  // readonly thumbUrl:  string;
  readonly timeStamp: TISODateTime;
  index: number; // integer
  readonly inventoryItem: string; // InventoryItemId
  readonly company: string; // CompanyId
}

export interface UploadImagesResponse {
  created: InventoryImage[];
  errors: Object;
}

export interface DeleteInventoryImages {
  imageIds: string[]; // list of ids
}

export interface InventoryChangeLog {
  readonly logId: string;
  readonly previousQuantity: string | null;
  readonly newQuantity: string | null;
  readonly previousCost: string | null;
  readonly newCost: string | null;
  readonly previousTotalCost: string | null;
  readonly newTotalCost: string | null;
  readonly previousUnit: string | null;
  readonly newUnit: string | null;
  readonly userName: string;
  readonly timeStamp: TISODateTime;
  readonly inventoryItem: string;
  readonly user: string;
  readonly company: string;
}

export interface InventoryComment {
  readonly commentId: string;
  commentText: string;
  readonly userName: string;
  readonly timeStamp: TISODateTime;
  readonly inventoryItem: string;
  readonly user: string;
  readonly company: string;
}

export interface NewComment extends Pick<InventoryComment, 'commentText'> {}
