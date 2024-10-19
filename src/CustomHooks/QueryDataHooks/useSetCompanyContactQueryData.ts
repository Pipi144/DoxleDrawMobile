import {StyleSheet, Text, View} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {useCompany} from '../../Providers/CompanyProvider';
import {ContactCompany} from '../../Models/contacts';
import {produce} from 'immer';
import {formCompanyContactListQKey} from '../../API/contactQueryAPI';
import {InfiniteAxiosQueryData} from '../../Models/axiosReturn';

type Props = {
  addPos?: 'start' | 'end';
  overwrite?: boolean;
};

const useSetCompanyContactQueryData = ({
  addPos = 'start',
  overwrite = true,
}: Props) => {
  const queryClient = useQueryClient();
  const {company} = useCompany();

  const handleAddNewCompanyContact = (addedContact: ContactCompany) => {
    const qKey = formCompanyContactListQKey({}, company);
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
        queryClient.setQueryData<InfiniteAxiosQueryData<ContactCompany>>(
          query.queryKey,
          old => {
            if (old)
              return produce(old, draftOld => {
                if (addPos === 'start')
                  draftOld.pages[0].data.results.unshift(addedContact);
                else
                  draftOld.pages[draftOld.pages.length - 1].data.results.push(
                    addedContact,
                  );

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

  const handleDeleteCompanyContact = (deletedContactId: string) => {
    const qKey = formCompanyContactListQKey({}, company);
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
        queryClient.setQueryData<InfiniteAxiosQueryData<ContactCompany>>(
          query.queryKey,
          old => {
            if (old)
              return produce(old, draftOld => {
                const pageFound = draftOld.pages.find(page =>
                  page.data.results.find(
                    contact => contact.contactCompanyId === deletedContactId,
                  ),
                );
                if (pageFound) {
                  const removedIdx = pageFound.data.results.findIndex(
                    item => item.contactCompanyId === deletedContactId,
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

  const handleEditCompanyContact = (edittedContact: ContactCompany) => {
    const qKey = formCompanyContactListQKey({}, company);
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
        queryClient.setQueryData<InfiniteAxiosQueryData<ContactCompany>>(
          query.queryKey,
          old => {
            if (old)
              return produce(old, draftOld => {
                const pageFound = draftOld.pages.find(page =>
                  page.data.results.find(
                    contact =>
                      contact.contactCompanyId ===
                      edittedContact.contactCompanyId,
                  ),
                );
                if (pageFound) {
                  const editedItem = pageFound.data.results.find(
                    item =>
                      item.contactCompanyId === edittedContact.contactCompanyId,
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
  return {
    handleAddNewCompanyContact,
    handleDeleteCompanyContact,
    handleEditCompanyContact,
  };
};

export default useSetCompanyContactQueryData;

const styles = StyleSheet.create({});
