import {Project} from './project';
import {TAPIServerFile} from './utilityType';

export type Company = {
  companyId: string;
  name: string;
  phone: string;
  email: string;
  companyAbn: string;
  addressL1: string;
  addressL2: string;
  addressCity: string;
  addressPostCode: string;
  addressState: string;
  addressCountry: string;
  logo: string;
  projects?: Project[];
  owner?: string;
  totalStorageSize: number;
};

export type NewCompany = {
  abn: string;
  name: string;
  phone: string;
  email: string;
  companyAbn: string;
  addressL1: string;
  addressL2: string;
  addressCity: string;
  addressPostCode: string;
  addressState: string;
  addressCountry: string;
  logo: string;
};

export interface AddCompanyInputValue {
  name: string;
  email: string;
  phone: string;
  abn: string;
  address_l1: string;
  address_l2: string;
  addressCity: string;
  addressState: string;
  addressPostCode: string;
  logo: TAPIServerFile | null;
}
