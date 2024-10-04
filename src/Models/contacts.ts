export type QuickContactCompany = {
  contactCompanyId?: string;
  companyName: string;
};

export interface NewContact {
  name: string;
  email: string;
}

export type ContactCompany = {
  readonly contactCompanyId: string;
  name: string;
  abn: string;
  email: string;
  phone: string;
  address: string;
  addressL1: string;
  addressL2: string;
  addressCity: string;
  addressPostCode: string;
  addressState: string;
  userCompany: string;
  accountingIdentifier?: string;
  contacts?: string[];
  contactsJson?: Contact[];
};

export type Contact = {
  contactId: string;
  userCompany: string;
  user: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactCompany: string | null;
  companyName?: string | null;
  companyAbn?: string | null;
  companyAddress?: string | null;
  companyAddressL1?: string | null;
  companyAddressL2?: string | null;
  companyAddressCity?: string | null;
  companyAddressState?: string | null;
  companyAddressPostCode?: string | null;
  companyAddressCountry?: string | null;
  isPrimary: boolean;
  sendQuotes: boolean;
};

export type AddContact = {
  contactId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactCompany?: string;
  companyName?: string;
  companyAbn?: string;
  companyAddress?: string;
  sendQuotes: boolean;
  userCompany: string;
};
export type AddCompanyContact = {
  contactCompanyId?: string;
  name: string;
  abn: string;
  address: string;
  contacts?: string[];
};

export const CREATE_NEW_CONTACT_COMPANY_TEMPLATE = (
  data: Partial<ContactCompany>,
): ContactCompany => {
  return {
    userCompany: data.userCompany || '',
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    abn: data.abn || '',
    addressL1: data.addressL1 || '',
    addressL2: data.addressL2 || '',
    addressCity: data.addressCity || '',
    addressPostCode: data.addressPostCode || '',
    addressState: data.addressState || '',
    address: data.address || '',
    contactCompanyId: '',
    contacts: [],
  };
};

export const CREATE_NEW_CONTACT_TEMPLATE = (
  data: Omit<Partial<Contact>, 'userCompany'> & Pick<Contact, 'userCompany'>,
): Contact => {
  return {
    contactId: '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    contactCompany: data.contactCompany || null,
    companyName: data.companyName || '',
    companyAbn: data.companyAbn || '',
    companyAddress: data.companyAddress || '',
    sendQuotes: data.sendQuotes || false,
    isPrimary: data.isPrimary || false,
    user: data.user || '',
    userCompany: data.userCompany || '',
  };
};
