//$$$$$$$$$$$$$$$$$$$$$$$$$$ NEW DOCKET $$$$$$$$$$$$$$$$$$$$$$$$$

import {
  formatTDateISO,
  formatTDateISODate,
} from '../Utilities/FunctionUtilities';
import {Contact} from './contacts';
import {TISODateTime, TDateISODate} from './dateFormat';
import {Project} from './project';
import {User} from './user';
export interface BasicCoreDocket {
  coreDocketId: string;
  coreDocketName: string;
  coreDocketNumber: number;
}
export interface IFullDocketDetailQueryFilterProp {
  project?: Project | undefined;
  inbox?: boolean;
  searchText?: string;

  stage?: 'true' | Omit<string, 'true'>;
  due?: 'today' | 'month' | 'fortnight' | 'week';
  archived?: boolean;

  view?: 'noticeboard' | 'budget' | undefined;
  company_level?: 'true';
  ball_in_court?: string;
  budget?: 'true' | 'over';

  status?: string;
  page_size?: number;
  order_by?:
    | DocketOrderByOptions
    | RevDocketOrderByOptions
    | Array<DocketOrderByOptions | RevDocketOrderByOptions>;
}

export interface LightDocket {
  docketPk: string; // Id number for database
  docketId: string; //Id number to display
  readonly docketIdNum: string;
  docketName: string; //Description / title
  company: string;

  stageModel: string | null;
  stageName: string;

  isBudget: boolean;
  isNoticeboard: boolean;
  isExpense: boolean;
  isIncome: boolean;
  isVariation: boolean;
  isSticky: boolean;
  isArchived: boolean;

  status: string; // actionStatusId
  statusColor: `rgba(${number},${number},${number},${number})`; //rgba status color
  statusName: string; //status name
  readonly statusIndex: number;
  readonly statusBold: boolean;
  readonly statusItalics: boolean;
  readonly statusUnderline: boolean;
  readonly statusStrikethrough: boolean;
  readonly statusColorText: boolean;
  readonly statusColorBackground: boolean;
  readonly statusAnimateIcon: boolean;

  costBudget: string | null; // Decimal number in string format,budgeted amount or null if not expense
  costActual: string | null; // Decimal number in string format,total of orders or null if not expense
  costXero: string | null; // Decimal number in string format, costs from accounting service or null if not expense
  costRunning: string | null; // Decimal number in string format or null if not expense
  incomeBudget: string | null; // Decimal number in string format,budgeted amount or null if not income
  incomeActual: string | null; // Decimal number in string format, total of invoices or null if not income
  incomeXero: string | null; // Decimal number in string format, income from accounting service or null if not income
  incomeRunning: string | null; // Decimal number in string format or null if not income

  startDate: TDateISODate | null; //planned start date, null if not scheduled
  endDate: TDateISODate | null; //planned end date, null if not scheduled
  commenced: TISODateTime | null; //actual commenced time, null if not commenced
  completed: TISODateTime | null; //actual completed time, null if not complete

  project: string | null; // projectId
  projectSiteAddress: string; // project's site address

  percentageCompleted: number;
  ballInCourt: string | null; //abCompanyId
  ballInCourtName: string;
  watching: string[]; //userIds
  watchingNames: string[];
  assignedContractorName: string; //name of contractor

  commentCount: number;
  readonly invoiceCount: number;
  readonly orderCount: number;
  readonly noteCount: number;
  readonly takeOffCount: number;

  totalStorageSize?: number;
  //!----->

  isNew?: boolean; //*THIS IS TO INDICATE NEW ADDED ONE
}

export interface Docket extends LightDocket {
  latestComment?: null;

  assignedContractor: string | null; //abCompanyId
  accountTrackingId: string | null;
  accountCode?: string | null;

  coreDocket?: string;

  timerValue: number | null; //total seconds active, null if not started
  timerStart: TISODateTime | null; //time timer started, null if not started
  timerEnd: TISODateTime | null; //time timer ended, null if not ended
  reminder: TISODateTime | null; //time for reminder, null if not set

  ballInCourtJson?: Contact | null;

  watcherJson?: Contact[];

  readonly createdOn: TISODateTime; // Timestamp when created
  readonly lastModifiedOn: TISODateTime; // Timestamp last modifies
  readonly createdByJson?: User;
  readonly lastModifiedByJson?: User;
  readonly createdBy: string;
  readonly lastModifiedBy: string;
}
export type DocketOrderByOptions =
  | 'status'
  | 'project'
  | 'project__site_address&order_by=project__project_id'
  | 'ball_in_court'
  | 'start_date'
  | 'end_date'
  | 'docket_id'
  | 'docket_name'
  | 'cost_budget'
  | 'cost_actual'
  | 'cost_xero'
  | 'cost_running'
  | 'income_budget'
  | 'income_actual'
  | 'income_xero'
  | 'income_running'
  | 'ball_in_court_name'
  | 'is_sticky'
  | 'status__index'
  | 'stage_model__index';

export type RevDocketOrderByOptions = `-${DocketOrderByOptions}`;
export interface DocketStatus {
  statusId: string; // Id
  company: string; // CompanyId
  statusName: string; // eg working, draft etc
  color: string; // eg #0000ff or rgba(0, 0, 255, 1)
  index: string; // order to display in list
}

export interface NewDocket {
  docketPk: string;
  docketName: string;
  startDate: TDateISODate | null; //planned start date, null if not scheduled
  endDate: TDateISODate | null; //planned end date, null if not scheduled
  commenced: TISODateTime | null; //actual commenced time, null if not commenced
  completed: TISODateTime | null; //actual completed time, null if not complete
  status: string; // actionStatusId
  assignedContractor: string | null; //abCompanyId
  costActual: string | null; // Decimal number in string format,total of orders or null if not expense
  docketId: string; //Id number to display
  commentCount: number;

  isBudget?: boolean;
  isNoticeboard?: boolean;
  isPrivate?: boolean;

  isIncome?: boolean;
  isExpense?: boolean;
  isVariation?: boolean;
  project?: string;
  projectSiteAddress?: string; //!ALWAYS ADD TOGETHER
  createdBy?: string;
  company?: string;
  ballInCourt?: string | null;
}

type GetNewDocketTemplateProps = Omit<Partial<Docket>, 'docketName'> &
  Pick<Docket, 'docketName' | 'createdBy'>;

//###### FUNCTION RETURN NEW DOCKET TEMPLATE ####
export const getNewDocketTemplate = (
  data: GetNewDocketTemplateProps,
): Docket => {
  return {
    docketPk: '',
    docketId: '',
    docketIdNum: '',
    docketName: data.docketName,

    stageModel: null,
    stageName: '',
    // message: string; //not used - detailed description
    createdOn: formatTDateISO(new Date()),
    lastModifiedOn: formatTDateISO(new Date()),
    createdBy: data.createdBy,
    lastModifiedBy: data.createdBy,

    isBudget: data.isBudget ?? false,
    isNoticeboard: data.isNoticeboard ?? false,
    isExpense: data.isExpense ?? false,
    isIncome: data.isIncome ?? false,
    isVariation: data.isVariation ?? false,
    isSticky: data.isSticky ?? false,
    isArchived: data.isArchived ?? false,

    percentageCompleted: 0,

    project: data.project ?? null,
    projectSiteAddress: data.projectSiteAddress ?? '',
    status: data.status ?? '',
    statusColor: data.statusColor ?? 'rgba(0, 0, 0, 1)',
    statusName: data.statusName ?? '',

    statusIndex: 0,
    statusBold: false,
    statusItalics: false,
    statusUnderline: false,
    statusStrikethrough: false,
    statusColorText: false,
    statusColorBackground: false,
    statusAnimateIcon: false,
    costBudget: '0',
    costActual: '0',
    costXero: '0',
    costRunning: '0',
    incomeBudget: '0',
    incomeActual: '0',
    incomeXero: '0',
    incomeRunning: '0',
    accountTrackingId: data.accountTrackingId || null,
    startDate: data.startDate ?? formatTDateISODate(new Date()),
    endDate: data.endDate ?? formatTDateISODate(new Date()),
    commenced: data.commenced || null,
    completed: data.completed || null,
    timerValue: data.timerValue ?? null,
    timerStart: data.timerStart ?? null,
    timerEnd: data.timerEnd ?? null,
    reminder: data.reminder ?? null,
    commentCount: 0,
    invoiceCount: 0,
    noteCount: 0,
    takeOffCount: 0,
    orderCount: 0,
    company: data.company ?? '',
    ballInCourt: data.ballInCourt || null,
    ballInCourtName: '',
    watching: data.watching ?? [],
    watchingNames: [],
    assignedContractor: data.assignedContractor || null,
    assignedContractorName: '',
  };
};

//#############################################
