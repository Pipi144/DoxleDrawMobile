export type TDoxleDocketMenu =
  | 'Actions'
  | 'Projects'
  | 'Files'
  | 'AddCompany'
  | 'EditCompany'
  | 'Inventory'
  | 'VideoViewer';
export const DOXLE_MENU_LIST: TDoxleDocketMenu[] = [
  'Actions',
  'Projects',
  'Files',
  'AddCompany',
  'EditCompany',
  'Inventory',
];

export type TDoxleBottomTabStackName =
  | 'Drawings'
  | 'Budgets'
  | 'Bookings'
  | 'Checklist';

export type TDoxleBottomTabStack = {
  Drawings: undefined;
  Budgets: undefined;
  Bookings: undefined;
  Checklist: undefined;
  Files: undefined;
  Actions: undefined;
  Inventory: undefined;
  Notes: undefined;
  Pricebook: undefined;
  QR: undefined;
  AddCompany: undefined;
  EditCompany: undefined;
  CompanyVideoViewer: {
    videoUrl: string;
  };
  Contacts: undefined;
  FilesCompany: undefined;
};

export const DOXLE_BOTTOM_TAB_STACK_LIST: Array<keyof TDoxleBottomTabStack> = [
  'Drawings',
  'Budgets',
  'Bookings',
  'Checklist',
  'Files',
  'Actions',
  'Inventory',
  'AddCompany',
  'EditCompany',
  'Pricebook',
  'Notes',
  'QR',
  'CompanyVideoViewer',
  'Contacts',
  'FilesCompany',
];

export type TDoxleRootStack = {
  Home: undefined;
  BudgetRoute: undefined;
  FileRoute: undefined;
  ActionRoute: undefined;
  Login: undefined;
};

export const DOXLE_ROOT_STACK_LIST: Array<keyof TDoxleRootStack> = [
  'Home',
  'BudgetRoute',
  'FileRoute',
  'Login',
  'ActionRoute',
];
