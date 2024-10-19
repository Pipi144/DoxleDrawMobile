import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {baseAddress} from './settings';
import axios from 'axios';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';
import {Contact, ContactCompany} from '../Models/contacts';
import {Company} from '../Models/company';
import {RequireAtLeastOne} from '../Models/utilityType';
import useSetCompanyContactQueryData from '../CustomHooks/QueryDataHooks/useSetCompanyContactQueryData';
import useSetContactsQueryData from '../CustomHooks/QueryDataHooks/useSetContactsQueryData';

const baseContactQkey = ['contacts-list'];
const baseCompanyContactQKey = ['contact-company-list'];
const baseCompantContactDetailQKey = ['contact-company-details'];
export type ContactCompanyOrderByFields =
  | 'name'
  | 'abn'
  | 'address'
  | 'contacts_count';
export type RevContactCompanyOrderByFields = `-${ContactCompanyOrderByFields}`;

export interface FilterGetContactCompanyQuery {
  searchText?: string;
  has_contact?: 'true';
  page?: number;
  order_by?: ContactCompanyOrderByFields | RevContactCompanyOrderByFields;
}
interface RetrieveContactCompanyQueryProp extends BaseAPIProps {
  onSuccessCB?: Function;
  filter: FilterGetContactCompanyQuery;
}

const useRetrieveContactCompanyQuery = ({
  accessToken,
  company,
  onSuccessCB,
  filter,
}: RetrieveContactCompanyQueryProp) => {
  const qKey = formCompanyContactListQKey(filter, company);
  const getParams: any = {};
  if (company) {
    getParams.company = company.companyId;
  }
  getParams.page_size = 11;
  if (filter.searchText) {
    getParams.search = filter.searchText;
  }
  if (filter.has_contact) getParams.has_contact = filter.has_contact;
  if (filter.order_by) getParams.order_by = filter.order_by;
  // if (filter.page) {
  //   getParams.page = filter.page;
  //   qKey.push(filter.page.toString());
  // }
  let contactGetURL = `${baseAddress}/contact/company/?page=1`;

  const defectQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: contactGetURL,
    queryFn: async ({pageParam}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<ContactCompany>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company?.companyId || '',
            },
            params: getParams,
          },
        );
        if (resp) {
          if (onSuccessCB) {
            onSuccessCB();
          }
          return resp;
        } else {
          throw new Error('No Data');
        }
      } catch (error) {
        console.log('error in useRetrieveContactCompanyQuery', error);
        throw new Error('No Data');
      }
    },
    getNextPageParam: res => res?.data.next,
    enabled: company !== undefined && accessToken !== undefined,
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
  return defectQuery;
};
interface GetContactCompanyDetailQueryProps extends BaseAPIProps {
  contactCompanyId: string;
  onSuccessCb?: Function;
}
const useGetContactCompanyDetailQuery = ({
  contactCompanyId,
  onSuccessCb,
  showNotification,
  accessToken,
  company,
}: GetContactCompanyDetailQueryProps) => {
  const qKey = formContactCompanyDetailQKey(contactCompanyId, company);
  const contactCompanyDetailQuery = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const resp = await await axios.get<
          RequireAtLeastOne<ContactCompany, 'contactsJson'>
        >(baseAddress + '/contact/company/' + `${contactCompanyId}/`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId || '',
          },
        });
        if (resp) {
          if (onSuccessCb) onSuccessCb();
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('error in useGetContactCompanyDetailQuery:', error);
        throw error;
      }
    },
    enabled: Boolean(accessToken && company && contactCompanyId),
  });

  return contactCompanyDetailQuery;
};
export interface IPatchExistingCompanyContacts {
  contactCompany: string;
  name?: string;
  abn?: string;
  address?: string;
  phone?: string;
  contacts?: Contact[];
}
interface PatchExistingCompanyQueryProps extends BaseAPIProps {
  onSuccessCb?: (updatedItem?: ContactCompany) => void;
}
const usePatchExistingCompany = ({
  onSuccessCb,
  showNotification,
  accessToken,
  company,
}: PatchExistingCompanyQueryProps) => {
  const {handleEditCompanyContact} = useSetCompanyContactQueryData({});
  const mutation = useMutation({
    mutationKey: getCompanyContactMutateQKey('update'),
    mutationFn: async (newContacts: IPatchExistingCompanyContacts) => {
      let body: any = {};
      if (newContacts.name) {
        body.name = newContacts.name;
      }
      if (newContacts.abn) {
        body.abn = newContacts.abn;
      }
      if (newContacts.address) {
        body.address = newContacts.address;
      }
      if (newContacts.phone) {
        body.phone = newContacts.phone;
      }
      body.contactsJson = [];
      if (newContacts.contacts && newContacts.contacts.length > 0) {
        body.contactsJson = newContacts.contacts;
      }
      let companiesUrl = baseAddress + '/contact/company/';
      return axios.patch<ContactCompany>(
        companiesUrl + newContacts.contactCompany + '/',
        body,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId || '',
          },
        },
      );
    },
    onSuccess: (result, variables, context) => {
      handleEditCompanyContact(result.data);
      // if (showNotification)
      //   showNotification(
      //     "Contacts Uploaded",
      //     "success",
      //     "SUCCESSFULLY Updated Contacts"
      //   );
      if (onSuccessCb) onSuccessCb(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Contacts',
        );
    },
  });

  return mutation;
};

interface AddContactCompanyQueryProps extends BaseAPIProps {
  onSuccessCb?: (newContact?: ContactCompany) => void;
}
const useAddContactCompanyQuery = ({
  onSuccessCb,
  showNotification,
  accessToken,
  company,
}: AddContactCompanyQueryProps) => {
  const {handleAddNewCompanyContact} = useSetCompanyContactQueryData({});
  const mutation = useMutation({
    mutationKey: getCompanyContactMutateQKey('add'),
    mutationFn: async (newCompany: {
      name: string;
      abn: string;
      address: string;
      contacts: Contact[];
    }) => {
      let {contacts, ...rest} = newCompany;
      let data: any = {...rest};
      data.contactsJson = contacts;
      let companiesUrl = baseAddress + '/contact/company/';
      return axios.post<ContactCompany>(companiesUrl, data, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      handleAddNewCompanyContact(result.data);
      if (showNotification)
        showNotification(
          "Contact's Company Uploaded",
          'success',
          "SUCCESSFULLY Added Contact's Company",
        );
      if (onSuccessCb) onSuccessCb(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          "Fail To Add Contact's Company",
        );
    },
  });

  return mutation;
};

interface RemoveContactCompanyQueryProps extends BaseAPIProps {
  onSuccessCb?: (deletedId?: string) => void;
}
const useRemoveContactsCompanyQuery = ({
  onSuccessCb,
  showNotification,
  company,
  accessToken,
}: RemoveContactCompanyQueryProps) => {
  const queryClient = useQueryClient();
  const {handleDeleteCompanyContact} = useSetCompanyContactQueryData({});
  const mutation = useMutation({
    mutationKey: getCompanyContactMutateQKey('delete'),
    mutationFn: async (deletedId: string) => {
      let companiesUrl = baseAddress + '/contact/company/';
      return axios.delete(companiesUrl + deletedId + '/', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      handleDeleteCompanyContact(variables);

      if (showNotification)
        showNotification(
          'Contact Deleted',
          'success',
          'SUCCESSFULLY Delete Contact',
        );
      if (onSuccessCb) onSuccessCb(variables);
    },
    onError: (err: any, variables, context) => {
      if (showNotification) {
        showNotification(
          `${err?.response?.status ?? 'ERROR'}: ${
            err?.response?.statusText ?? 'Unkown Error'
          }`,
          'error',
          err?.response?.data ?? 'Error Deleting Contact',
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: baseContactQkey});
      // queryClient.invalidateQueries(baseCompanyContactQKey);
      // queryClient.invalidateQueries(baseCompantContactDetailQKey);
    },
  });
  const mutate = (contactId: string) => mutation.mutate(contactId);
  return {...mutation, mutate};
};
//* CONTACT PERSON
export interface FilterRetrieveContactQuery {
  searchInput?: string;
}

interface RetrieveContactsQueryProps extends BaseAPIProps {
  filter: FilterRetrieveContactQuery;
  enable?: boolean;
  onSuccessCb?: Function;
}

const useRetrieveContactsQuery = ({
  accessToken,
  company,
  showNotification,
  filter,
  enable,
  onSuccessCb,
}: RetrieveContactsQueryProps) => {
  const {searchInput} = filter;
  const qKey = formContactListQKey(filter, company);
  const getParams: any = {};
  if (searchInput) getParams.search = searchInput;
  getParams.page_size = 14;
  const contactsUrl = `${baseAddress}/contact/?page=1`;
  const contactsQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: contactsUrl,
    queryFn: async ({pageParam}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<Contact>>(pageParam, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId || '',
          },
          params: getParams,
        });

        if (resp) {
          if (onSuccessCb) onSuccessCb();
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('ERROR in useRetrieveContactsQuery:', error);
        throw error;
      }
    },
    getNextPageParam: prevData => prevData.data?.next,

    enabled: Boolean(
      accessToken !== undefined && company !== undefined && (enable ?? true),
      // &&  retrieveContactsQuery.contactPageDisplay === "Contact"
    ),
    retry: 1,

    refetchInterval: 5 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    // refetchOnReconnect: true,
  });
  return contactsQuery;
};

interface AddContactsQueryProps extends BaseAPIProps {
  filter: FilterRetrieveContactQuery;
  onSuccessCb?: (newContact?: Contact) => void;
  addPos?: 'start' | 'end';
}
const useAddNewContactQuery = ({
  filter,
  showNotification,
  company,
  accessToken,
  onSuccessCb,
  addPos = 'start',
}: AddContactsQueryProps) => {
  const queryClient = useQueryClient();
  const {handleAddNewContact} = useSetContactsQueryData({addPos});
  const addContactURL = `${baseAddress}/contact/`;
  const mutation = useMutation({
    mutationKey: getContactMutateQKey('add'),
    mutationFn: (
      newContact: Omit<Contact, 'user' | 'userCompany'> &
        Partial<Pick<Contact, 'user' | 'userCompany'>>,
    ) => {
      return axios.post(addContactURL, newContact, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },

    onSuccess: (result, variables, context) => {
      if (showNotification)
        showNotification(
          'Data Updated...',
          'success',
          'SUCCESSFULLY UPDATED DATA',
        );
      console.log('UPDATE USER RESULT:', result.data);

      if (onSuccessCb) {
        onSuccessCb(result.data);
      }
      handleAddNewContact(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification(
          'SOMETHING WRONG!',
          'error',
          'Fail To Update Action Timeline',
        );

      console.log('ERROR:', (error as any).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: baseCompanyContactQKey});
      queryClient.invalidateQueries({queryKey: baseCompantContactDetailQKey});
    },
  });
  const mutate = (newContact: Contact) => mutation.mutate(newContact);
  return {...mutation, mutate};
};

interface PatchContactQueryProps extends BaseAPIProps {
  filter: FilterRetrieveContactQuery;
  onSuccessCb?: (updatedContact?: Contact) => void;
}
const usePatchContactQuery = ({
  filter,
  onSuccessCb,
  showNotification,
  company,
  accessToken,
}: PatchContactQueryProps) => {
  const {handleEditContactQueryData} = useSetContactsQueryData({});
  const mutation = useMutation({
    mutationKey: getContactMutateQKey('update'),
    mutationFn: async (props: {
      data: Partial<Omit<Contact, 'contactId'>>;
      contactId: string;
    }) => {
      const {data, contactId} = props;
      let contactsUrl = `${baseAddress}/contact/`;
      return axios.patch<Contact>(contactsUrl + contactId + '/', data, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      handleEditContactQueryData(result.data);

      // if (showNotification)
      //   showNotification(
      //     "Contact's Company Uploaded",
      //     'success',
      //     'SUCCESSFULLY Edited Contact',
      //   );
      if (onSuccessCb) onSuccessCb(result.data);
    },
    onError: (error, variables, context) => {
      if (showNotification)
        showNotification('SOMETHING WRONG!', 'error', 'Fail To Edit Contact');
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries(baseCompanyContactQKey);
    //   queryClient.invalidateQueries(baseCompantContactDetailQKey);
    // },
  });
  const mutate = (props: {data: Partial<Contact>; contactId: string}) =>
    mutation.mutate(props);
  return {...mutation, mutate};
};

interface RemoveContactQueryProps extends BaseAPIProps {
  filter: FilterRetrieveContactQuery;
  onSuccessCb?: (deletedId?: string) => void;
}
const useRemoveContactsQuery = ({
  filter,
  onSuccessCb,
  showNotification,
  company,
  accessToken,
}: RemoveContactQueryProps) => {
  const queryClient = useQueryClient();
  const {handleDeleteContactQueryData} = useSetContactsQueryData({});
  const mutation = useMutation({
    mutationKey: getContactMutateQKey('delete'),
    mutationFn: async (contactId: string) => {
      let contactsUrl = `${baseAddress}/contact/`;
      return axios.delete(contactsUrl + contactId + '/', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId || '',
        },
      });
    },
    onSuccess: (result, variables, context) => {
      handleDeleteContactQueryData(variables);

      if (showNotification)
        showNotification(
          'Contact Deleted',
          'success',
          'SUCCESSFULLY Delete Contact',
        );
      if (onSuccessCb) onSuccessCb(variables);
    },
    onError: (err: any, variables, context) => {
      if (showNotification) {
        showNotification(
          `${err?.response?.status ?? 'ERROR'}: ${
            err?.response?.statusText ?? 'Unkown Error'
          }`,
          'error',
          err?.response?.data ?? 'Error Deleting Contact',
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: baseContactQkey});
      // queryClient.invalidateQueries(baseCompanyContactQKey);
      // queryClient.invalidateQueries(baseCompantContactDetailQKey);
    },
  });
  const mutate = (contactId: string) => mutation.mutate(contactId);
  return {...mutation, mutate};
};
//##### HELPER FUNCTIONS
//* CONTACT COMPANY
export const formCompanyContactListQKey = (
  filter: FilterGetContactCompanyQuery,
  company: Company | undefined,
) => {
  const baseQkey = ['contact-company-list'];
  const {searchText, has_contact, order_by} = filter;

  if (company) baseQkey.push(company.companyId);
  if (searchText) baseQkey.push(`search:${searchText}`);
  if (has_contact) baseQkey.push(`has_contact`);
  if (order_by) baseQkey.push(`order:${order_by}`);
  return baseQkey;
};
export const formContactCompanyDetailQKey = (
  contactCompanyId: string,
  company: Company | undefined,
) => {
  const baseQKey = ['contact-company-details'];
  if (company) baseQKey.push(company.companyId);

  baseQKey.push(contactCompanyId);
  return baseQKey;
};

export const getCompanyContactMutateQKey = (
  action: 'add' | 'update' | 'delete',
) => [`${action}-company-contacts`];
//*CONTACT
export const formContactListQKey = (
  filter: FilterRetrieveContactQuery,
  company: Company | undefined,
) => {
  const baseQkey = ['contacts-list'];
  const {searchInput} = filter;
  if (company) baseQkey.push(company.companyId);
  if (searchInput) baseQkey.push(`search:${searchInput}`);
  return baseQkey;
};

export const getContactMutateQKey = (action: 'add' | 'update' | 'delete') => [
  `${action}-private-contacts`,
];
const ContactQueryAPI = {
  useRetrieveContactCompanyQuery,
  useRetrieveContactsQuery,
  useAddNewContactQuery,
  usePatchContactQuery,
  useRemoveContactsQuery,
  useAddContactCompanyQuery,
  usePatchExistingCompany,
  useGetContactCompanyDetailQuery,
  useRemoveContactsCompanyQuery,
};
export default ContactQueryAPI;
