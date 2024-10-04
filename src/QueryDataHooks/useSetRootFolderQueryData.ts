import React from 'react';

import {useQueryClient} from '@tanstack/react-query';
import {DoxleFolder} from '../../Models/files';
import {produce} from 'immer';
import {
  getFolderQKey,
  IFilterGetFolderQueryFilter,
} from '../../service/DoxleAPI/QueryHookAPI/fileQueryAPI';
import {useCompany} from '../../Providers/CompanyProvider';

type Props = {
  filter: IFilterGetFolderQueryFilter;
  appendPos?: 'start' | 'end';
  overwrite?: boolean;
};
interface SetRootFolderQueryData {
  handleAddFolder: (newItem: DoxleFolder) => void;
  handleEditFolder: (newItem: DoxleFolder) => void;
  handleDeleteMultipleFolders: (deletedIds: string[]) => void;
}
const useSetRootFolderQueryData = ({
  filter,
  appendPos = 'end',
  overwrite = true,
}: Props): SetRootFolderQueryData => {
  const {company} = useCompany();
  const queryClient = useQueryClient();
  const qKey = getFolderQKey(filter, company);

  const handleAddFolder = (newItem: DoxleFolder) => {
    const queryData = queryClient.getQueryData(qKey);
    if (queryData && overwrite) {
      queryClient.setQueryData(qKey, (old: any) =>
        produce(old, (draft: any) => {
          if (appendPos === 'start')
            (draft.data as DoxleFolder[]).unshift(newItem);
          else (draft.data as DoxleFolder[]).push(newItem);

          return draft;
        }),
      );
    } else queryClient.invalidateQueries(qKey);
  };

  const handleEditFolder = (newItem: DoxleFolder) => {
    const queryData = queryClient.getQueryData(qKey);
    if (queryData && overwrite) {
      queryClient.setQueryData(qKey, (old: any) => {
        return produce(old, (draft: any) => {
          const item = (draft.data as DoxleFolder[]).find(
            item => item.folderId === newItem.folderId,
          );
          if (item) Object.assign(item, newItem);
          return draft;
        });
      });
    } else queryClient.invalidateQueries(qKey);
  };
  const handleDeleteMultipleFolders = (deletedIds: string[]) => {
    const queryData = queryClient.getQueryData(qKey);
    if (queryData && overwrite) {
      queryClient.setQueryData(qKey, (old: any) => {
        return produce(old, (draft: any) => {
          draft.data = (draft.data as DoxleFolder[]).filter(
            oriItem =>
              !deletedIds.some(deletedId => deletedId === oriItem.folderId),
          );
          return draft;
        });
      });
    } else queryClient.invalidateQueries(qKey);
  };
  return {handleAddFolder, handleEditFolder, handleDeleteMultipleFolders};
};

export default useSetRootFolderQueryData;
