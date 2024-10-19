import {useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useCompany} from '../../Providers/CompanyProvider';
import {DoxleFile} from '../../Models/files';
import {getFileQKey} from '../../API/fileQueryAPI';
import {InfiniteAxiosQueryData} from '../../Models/axiosReturn';

type Props = {
  appendPos?: 'start' | 'end';
  overwrite?: boolean;
};

const useSetFileQueryData = ({appendPos = 'end', overwrite = true}: Props) => {
  const {company} = useCompany();

  const queryClient = useQueryClient();
  const handleRemoveFile = (deletedFile: DoxleFile) => {
    const qKey = getFileQKey(
      {
        projectId: deletedFile.project ?? undefined,
        docketId: deletedFile.docket ?? undefined,
        folderId: deletedFile.folder ?? undefined,
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
        queryClient.setQueryData<InfiniteAxiosQueryData<DoxleFile>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draftOld => {
                const pageContainItem = draftOld.pages.find(page =>
                  page.data.results.find(
                    file => file.fileId === deletedFile.fileId,
                  ),
                );
                if (pageContainItem) {
                  pageContainItem.data.results = produce(
                    pageContainItem.data.results,
                    draftTargetPageData => {
                      draftTargetPageData = draftTargetPageData.filter(
                        file => file.fileId !== deletedFile.fileId,
                      );
                      return draftTargetPageData;
                    },
                  );
                }

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

  const handleUpdateFile = (updatedDoxleFile: DoxleFile) => {
    const qKey = getFileQKey(
      {
        projectId: updatedDoxleFile.project ?? undefined,
        docketId: updatedDoxleFile.docket ?? undefined,
        folderId: updatedDoxleFile.folder ?? undefined,
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
        queryClient.setQueryData<InfiniteAxiosQueryData<DoxleFile>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draftOld => {
                const pageContainItem = draftOld.pages.find(page =>
                  page.data.results.find(
                    file => file.fileId === updatedDoxleFile.fileId,
                  ),
                );
                if (pageContainItem) {
                  pageContainItem.data.results = produce(
                    pageContainItem.data.results,
                    draftTargetPageData => {
                      const foundItem = draftTargetPageData.find(
                        file => file.fileId === updatedDoxleFile.fileId,
                      );
                      if (foundItem) Object.assign(foundItem, updatedDoxleFile);
                      return draftTargetPageData;
                    },
                  );
                }

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

  const handleAddMultipleFile = (newFiles: DoxleFile[]) => {
    const qKey = getFileQKey(
      {
        projectId: newFiles[0].project ?? undefined,
        docketId: newFiles[0].docket ?? undefined,
        folderId: newFiles[0].folder ?? undefined,
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
        queryClient.setQueryData<InfiniteAxiosQueryData<DoxleFile>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draftOld => {
                if (appendPos === 'start') {
                  draftOld.pages[0].data.results.unshift(...newFiles);
                } else {
                  draftOld.pages[draftOld.pages.length - 1].data.results.push(
                    ...newFiles,
                  );
                }

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

  const handleRemoveMultipleFile = (deletedFiles: DoxleFile[]) => {
    const qKey = getFileQKey(
      {
        projectId: deletedFiles[0].project ?? undefined,
        docketId: deletedFiles[0].docket ?? undefined,
        folderId: deletedFiles[0].folder ?? undefined,
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
        queryClient.setQueryData<InfiniteAxiosQueryData<DoxleFile>>(
          query.queryKey,
          old => {
            if (old) {
              return produce(old, draftOld => {
                draftOld.pages.forEach(page => {
                  page.data.results = page.data.results.filter(
                    file =>
                      !deletedFiles.some(
                        deletedFile => deletedFile.fileId === file.fileId,
                      ),
                  );
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

  const removeFileQueryDataWithSearch = () => {
    const qKey = getFileQKey({}, company);
    const qKeyFileFolder = getFileQKey({folderId: '11'}, company);
    const data = queryClient.getQueryCache().findAll({
      predicate: query =>
        query.queryKey.includes('search-') &&
        (query.queryKey[0] === qKey[0] ||
          query.queryKey[0] === qKeyFileFolder[0]),
    });
    data.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };
  return {
    handleRemoveFile,
    handleUpdateFile,
    handleAddMultipleFile,
    handleRemoveMultipleFile,
    removeFileQueryDataWithSearch,
  };
};

export default useSetFileQueryData;
