import {Contact} from './contacts';

export interface CompanyPermission {
  user: string;
  company: string;
  project: undefined;
  docket: undefined;
  contact: Contact;
  manageUsers: boolean;

  viewRfi: boolean;
  addRfi: boolean;
  deleteRfi: boolean;

  viewEstimate: boolean;
  addEstimate: boolean;
  deleteEstimate: boolean;

  viewOrders: boolean;
  addOrders: boolean;
  deleteOrders: boolean;
  approveOrders: boolean;

  viewSpecifications: boolean;
  addSpecifications: boolean;
  deleteSpecifications: boolean;
  approveSpecifications: boolean;

  viewTasks: boolean;
  addTasks: boolean;
  deleteTasks: boolean;
  toggleTasks: boolean;

  viewComments: boolean;
  addComments: boolean;
  deleteComments: boolean;

  viewQuotes: boolean;
  addQuotes: boolean;
  deleteQuotes: boolean;

  viewTakeOffs: boolean;
  addTakeOffs: boolean;
  deleteTakeOffs: boolean;

  viewFiles: boolean;
  addFiles: boolean;
  deleteFiles: boolean;

  viewDefects?: boolean;
  addDefects?: boolean;
  deleteDefects?: boolean;

  viewBookings?: boolean;
  addBookings?: boolean;
  deleteBookings?: boolean;
}

export interface ProjectPermission {
  user: string;
  company: undefined;
  project: string;
  docket: undefined;
  contact: Contact;
  manageUsers: boolean;
  editDocket: boolean;

  viewDrawings: boolean;
  addDrawings: boolean;
  deleteDrawings: boolean;

  viewRfi: boolean;
  addRfi: boolean;
  deleteRfi: boolean;

  viewEstimate: boolean;
  addEstimate: boolean;
  deleteEstimate: boolean;

  viewOrders: boolean;
  addOrders: boolean;
  deleteOrders: boolean;
  approveOrders: boolean;

  viewSpecifications: boolean;
  addSpecifications: boolean;
  deleteSpecifications: boolean;
  approveSpecifications: boolean;

  viewTasks: boolean;
  addTasks: boolean;
  deleteTasks: boolean;
  toggleTasks: boolean;

  viewComments: boolean;
  addComments: boolean;
  deleteComments: boolean;

  viewQuotes: boolean;
  addQuotes: boolean;
  deleteQuotes: boolean;

  viewTakeOffs: boolean;
  addTakeOffs: boolean;
  deleteTakeOffs: boolean;

  viewFiles: boolean;
  addFiles: boolean;
  deleteFiles: boolean;

  viewDefects?: boolean;
  addDefects?: boolean;
  deleteDefects?: boolean;

  viewBookings?: boolean;
  addBookings?: boolean;
  deleteBookings?: boolean;
}

export interface DocketPermission {
  user: string;
  company: undefined;
  project: undefined;
  docket: string;
  manageUsers: boolean;
  contact: Contact;

  viewRfi: boolean;
  addRfi: boolean;
  deleteRfi: boolean;

  viewEstimate: boolean;
  addEstimate: boolean;
  deleteEstimate: boolean;

  viewOrders: boolean;
  addOrders: boolean;
  deleteOrders: boolean;
  approveOrders: boolean;

  viewSpecifications: boolean;
  addSpecifications: boolean;
  deleteSpecifications: boolean;
  approveSpecifications: boolean;

  viewTasks: boolean;
  addTasks: boolean;
  deleteTasks: boolean;
  toggleTasks: boolean;

  viewComments: boolean;
  addComments: boolean;
  deleteComments: boolean;

  viewQuotes: boolean;
  addQuotes: boolean;
  deleteQuotes: boolean;

  viewTakeOffs: boolean;
  addTakeOffs: boolean;
  deleteTakeOffs: boolean;

  viewFiles: boolean;
  addFiles: boolean;
  deleteFiles: boolean;

  viewDefects?: boolean;
  addDefects?: boolean;
  deleteDefects?: boolean;

  viewBookings?: boolean;
  addBookings?: boolean;
  deleteBookings?: boolean;
}
export interface RelatedPermissions {
  companyPermissionsTotal: number;
  companyPermissions: Contact[];
  projectPermissionsTotal: number;
  projectPermissions: Contact[];
}
export type CompanyPermissionKey = keyof CompanyPermission;
export type ProjectPermissionKey = keyof ProjectPermission;
export type DocketPermissionKey = keyof DocketPermission;
