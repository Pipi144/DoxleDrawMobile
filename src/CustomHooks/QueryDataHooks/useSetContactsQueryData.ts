import {StyleSheet} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {
  ICompanyProviderContextValue,
  useCompany,
} from '../../Providers/CompanyProvider';
import {Contact} from '../../Models/contacts';
import {produce} from 'immer';
import {formContactListQKey} from '../../API/contactQueryAPI';
import {InfiniteAxiosQueryData} from '../../Models/axiosReturn';

type Props = {
  addPos?: 'start' | 'end';
  overwrite?: boolean;
};

const useSetContactsQueryData = ({
  addPos = 'start',
  overwrite = true,
}: Props) => {
  const queryClient = useQueryClient();
  const {company} = useCompany() as ICompanyProviderContextValue;

  const handleAddNewContact = (addedContact: Contact) => {
    const qKey = formContactListQKey({}, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    dataActive.forEach(query => {
      if (overwrite) {
        queryClient.setQueryData<InfiniteAxiosQueryData<Contact>>(
          query.queryKey,
          old => {
            if (old) {
              const lengthOfPages = old.pages.length;
              return produce(old, draftOld => {
                draftOld.pages = produce(draftOld.pages, draftPages => {
                  if (addPos === 'start') {
                    draftPages[0].data.results.unshift(addedContact);
                  } else {
                    draftPages[lengthOfPages - 1].data.results.push(
                      addedContact,
                    );
                  }

                  return draftPages;
                });

                return draftOld;
              });
            } else queryClient.refetchQueries({queryKey: query.queryKey});
          },
        );
      } else queryClient.refetchQueries({queryKey: query.queryKey});
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const handleDeleteContactQueryData = (deletedContactId: string) => {
    const qKey = formContactListQKey({}, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    dataActive.forEach(query => {
      if (overwrite) {
        queryClient.setQueryData<InfiniteAxiosQueryData<Contact>>(
          query.queryKey,
          old => {
            if (old)
              return produce(old, draftOld => {
                const pageFound = draftOld.pages.find(page =>
                  page.data.results.find(
                    contact => contact.contactId === deletedContactId,
                  ),
                );
                if (pageFound) {
                  const removedIdx = pageFound.data.results.findIndex(
                    item => item.contactId === deletedContactId,
                  );
                  if (removedIdx !== -1)
                    pageFound.data.results.splice(removedIdx, 1);
                }

                return draftOld;
              });
            else queryClient.refetchQueries({queryKey: query.queryKey});
          },
        );
      } else queryClient.refetchQueries({queryKey: query.queryKey});
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const handleEditContactQueryData = (edittedContact: Contact) => {
    const qKey = formContactListQKey({}, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    dataActive.forEach(query => {
      if (overwrite) {
        queryClient.setQueryData<InfiniteAxiosQueryData<Contact>>(
          query.queryKey,
          old => {
            if (old)
              return produce(old, draftOld => {
                const pageFound = draftOld.pages.find(page =>
                  page.data.results.find(
                    contact => contact.contactId === edittedContact.contactId,
                  ),
                );
                if (pageFound) {
                  const editedItem = pageFound.data.results.find(
                    item => item.contactId === edittedContact.contactId,
                  );
                  if (editedItem) Object.assign(editedItem, edittedContact);
                }

                return draftOld;
              });
            else queryClient.refetchQueries({queryKey: query.queryKey});
          },
        );
      } else queryClient.refetchQueries({queryKey: query.queryKey});
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const clearSearchContactQueryData = () => {
    const qKey = formContactListQKey({}, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) &&
        query.queryKey.includes('search'),
    });

    for (let i = 0; i < dataActive.length; i++) {
      queryClient.removeQueries({queryKey: dataActive[i].queryKey});
    }
  };
  return {
    handleAddNewContact,
    handleDeleteContactQueryData,
    handleEditContactQueryData,
    clearSearchContactQueryData,
  };
};

export default useSetContactsQueryData;

const styles = StyleSheet.create({});
