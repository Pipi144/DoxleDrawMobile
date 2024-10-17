import React from 'react';

import {useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useCompany} from '../Providers/CompanyProvider';
import {DoxleFolder} from '../Models/files';
import {getFolderQKey} from '../API/fileQueryAPI';
import {DefiniteAxiosQueryData} from '../Models/axiosReturn';

type Props = {
  appendPos?: 'start' | 'end';
  overwrite?: boolean;
};

const useSetRootFolderQueryData = ({
  appendPos = 'end',
  overwrite = true,
}: Props) => {
  const {company} = useCompany();
  const queryClient = useQueryClient();

  const handleAddFolder = (newItem: DoxleFolder) => {
    const qKey = getFolderQKey(
      {
        projectId: newItem.project ?? undefined,
        docketId: newItem.docket ?? undefined,
      },
      company,
    );
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
        queryClient.setQueryData<DefiniteAxiosQueryData<DoxleFolder[]>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draft => {
                if (appendPos === 'start') draft.data.unshift(newItem);
                else (draft.data as DoxleFolder[]).push(newItem);

                return draft;
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

  const handleEditFolder = (newItem: DoxleFolder) => {
    const qKey = getFolderQKey(
      {
        projectId: newItem.project ?? undefined,
        docketId: newItem.docket ?? undefined,
      },
      company,
    );
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
        queryClient.setQueryData<DefiniteAxiosQueryData<DoxleFolder[]>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draft => {
                const item = draft.data.find(
                  item => item.folderId === newItem.folderId,
                );
                if (item) Object.assign(item, newItem);
                return draft;
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
  const handleDeleteMultipleFolders = (deletedFolders: DoxleFolder[]) => {
    const qKey = getFolderQKey(
      {
        projectId: deletedFolders[0].project ?? undefined,
        docketId: deletedFolders[0].docket ?? undefined,
      },
      company,
    );
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
        queryClient.setQueryData<DefiniteAxiosQueryData<DoxleFolder[]>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draft => {
                draft.data = draft.data.filter(
                  oriItem =>
                    !deletedFolders.some(
                      deletedFolder =>
                        deletedFolder.folderId === oriItem.folderId,
                    ),
                );
                return draft;
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

  const removeFolderQueryDataWithSearch = () => {
    const qKey = getFolderQKey({}, company);
    const data = queryClient.getQueryCache().findAll({
      predicate: query =>
        query.queryKey.includes('search-') && qKey[0] === query.queryKey[0],
    });
    data.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };
  return {
    handleAddFolder,
    handleEditFolder,
    handleDeleteMultipleFolders,
    removeFolderQueryDataWithSearch,
  };
};

export default useSetRootFolderQueryData;
