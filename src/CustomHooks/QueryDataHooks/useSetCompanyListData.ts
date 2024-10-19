import {useQueryClient} from '@tanstack/react-query';
import {getCompanyListQKey} from '../../API/companyQueryAPI';
import {Company} from '../../Models/company';
import {
  AxiosInfiniteReturn,
  DefiniteAxiosQueryData,
} from '../../Models/axiosReturn';
import {produce} from 'immer';

type Props = {
  addPos?: 'start' | 'end';
  overwrite?: boolean;
};

const useSetCompanyListData = ({addPos = 'start', overwrite = true}: Props) => {
  const qKey = getCompanyListQKey();
  const queryClient = useQueryClient();

  const handleAddCompany = (newCompany: Company) => {
    const queryData = queryClient.getQueryData(qKey);
    if (overwrite && queryData) {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<Company>>
      >(qKey, old => {
        if (old)
          return produce(old, draft => {
            if (addPos === 'start') draft.data.results.unshift(newCompany);
            else draft.data.results.push(newCompany);

            return draft;
          });
        else queryClient.refetchQueries({queryKey: qKey});
      });
    } else queryClient.refetchQueries({queryKey: qKey});
  };
  const handleDeleteCompany = (deletedId: string) => {
    const queryData = queryClient.getQueryData(qKey);
    if (overwrite && queryData) {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<Company>>
      >(qKey, old => {
        if (old)
          return produce(old, draft => {
            draft.data.results = (draft.data.results as Company[]).filter(
              company => company.companyId !== deletedId,
            );

            return draft;
          });
        else queryClient.refetchQueries({queryKey: qKey});
      });
    } else queryClient.refetchQueries({queryKey: qKey});
  };

  const handleUpdateCompany = (newCompany: Company) => {
    const queryData = queryClient.getQueryData(qKey);
    if (overwrite && queryData) {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<Company>>
      >(qKey, old => {
        if (old)
          return produce(old, draft => {
            const updatedItem = (draft.data.results as Company[]).find(
              company => company.companyId === newCompany.companyId,
            );
            if (updatedItem) Object.assign(updatedItem, newCompany);

            return draft;
          });
        else queryClient.refetchQueries({queryKey: qKey});
      });
    } else queryClient.refetchQueries({queryKey: qKey});
  };
  return {handleAddCompany, handleDeleteCompany, handleUpdateCompany};
};

export default useSetCompanyListData;
