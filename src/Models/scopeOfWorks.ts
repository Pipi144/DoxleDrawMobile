import {Contact, ContactCompany} from './contacts';
import {TISODateTime} from './dateFormat';

export interface ScopeOfWorkGroup {
  scopeGroupId: string;
  scopeGroupTitle: string;
  scopeGroupIndex: number;
  timeStamp?: TISODateTime;
  // approved: boolean;
  itemCount: number;
  assignedContacts: string[] | null;
  assignedContactNames: string;
  assignedContactsJson?: Contact[];
  assignedContactCompany: string | null;
  assignedContactCompanyName: string;
  assignedContactCompanyJson?: ContactCompany;
  docket: string | null; //docketId
  project: string | null; //project ID
  company: string; //company Id

  isNew?: boolean; //* this prop is to handle in front end add new effect only
}

export interface ScopeOfWorkItem {
  scopeItemId: string;
  scopeItemDescription: string;
  timeStamp?: TISODateTime;
  scopeItemIndex: number;
  completed: boolean;
  approved: boolean;
  imageCount: number;
  assignedContacts: string[];
  assignedContactNames: string;
  scopeGroup: string; //scope of work group id

  docket: string | null; //docketId
  project: string | null; //project ID
  company: string; //company Id
}

export interface ScopeOfWorkImage {
  imageId: string;
  scopeItem: string;
  scopeGroup: string;
  scopeImageTitle: string; //can pass empty string
  scopeImageDescription: string; //can pass empty string
  path: string;
  thumbPath: string;
  timeStamp?: TISODateTime;
  index: number;
  url?: string;
  thumbUrl?: string;
}

interface NewScopeGroupTemplateProps
  extends Partial<
      Pick<
        ScopeOfWorkGroup,
        | 'assignedContacts'
        | 'assignedContactCompany'
        | 'docket'
        | 'project'
        | 'scopeGroupIndex'
      >
    >,
    Pick<ScopeOfWorkGroup, 'company' | 'scopeGroupTitle'> {}
export const NEW_SCOPE_GROUP_TEMPLATE = (
  data: NewScopeGroupTemplateProps,
): ScopeOfWorkGroup => {
  return {
    scopeGroupId: '',
    scopeGroupTitle: data.scopeGroupTitle,
    scopeGroupIndex: data.scopeGroupIndex ?? 0,
    itemCount: 0,
    // approved: data.approved ?? false,
    assignedContacts: data.assignedContacts ?? [],
    assignedContactNames: '',
    assignedContactCompanyName: '',
    assignedContactCompany: data.assignedContactCompany || null,

    docket: data.docket || null,
    project: data.project || null,
    company: data.company,
  };
};

interface NewScopeItemTemplateProps
  extends Partial<
      Pick<
        ScopeOfWorkItem,
        'approved' | 'docket' | 'project' | 'completed' | 'scopeItemIndex'
      >
    >,
    Pick<ScopeOfWorkItem, 'scopeGroup' | 'scopeItemDescription' | 'company'> {}

export const NEW_SCOPE_ITEM_TEMPLATE = (
  data: NewScopeItemTemplateProps,
): ScopeOfWorkItem => {
  return {
    scopeItemId: '',
    scopeItemDescription: data.scopeItemDescription,
    imageCount: 0,
    scopeItemIndex: data.scopeItemIndex || 0,
    completed: data.completed ?? false,
    approved: data.approved ?? false,
    assignedContacts: [],
    assignedContactNames: '',
    scopeGroup: data.scopeGroup,
    docket: data.docket || null,
    project: data.project || null,
    company: data.company,
  };
};
