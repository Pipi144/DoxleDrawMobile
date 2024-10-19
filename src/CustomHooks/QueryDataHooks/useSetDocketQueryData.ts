import {StyleSheet} from 'react-native';
import {useCompany} from '../../Providers/CompanyProvider';
import {
  Docket,
  IFullDocketDetailQueryFilterProp,
  LightDocket,
} from '../../Models/docket';
import {useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {InfiniteAxiosQueryData} from '../../Models/axiosReturn';
import {formDocketListQueryKey} from '../../API/docketQueryAPI';

type Props = {
  appendPos?: 'start' | 'end';
  overwrite?: boolean;
};

const useSetDocketQueryData = ({appendPos, overwrite = true}: Props) => {
  const {company} = useCompany();

  const queryClient = useQueryClient();
  // const handleRemoveDocket = (deletedDocketId: string) => {
  //   const queryData = queryClient.getQueryData(qKey);
  //   if (overwrite && queryData) {
  //     queryClient.setQueryData<InfiniteAxiosQueryData<Docket | LightDocket>>(
  //       qKey,
  //       old => {
  //         if (old)
  //           return produce(old, draft => {
  //             let pageIndexContainItem: number = old.pages.findIndex(
  //               (page: any) =>
  //                 Boolean(
  //                   page.data.results.find(
  //                     (docket: Docket | LightDocket) =>
  //                       docket.docketPk === deletedDocketId,
  //                   ) !== undefined,
  //                 ),
  //             );
  //             if (pageIndexContainItem !== -1)
  //               draft.pages[pageIndexContainItem].data.results = draft.pages[
  //                 pageIndexContainItem
  //               ].data.results.filter(
  //                 (docket: Docket | LightDocket) =>
  //                   docket.docketPk !== deletedDocketId,
  //               );
  //           });
  //         else queryClient.invalidateQueries({queryKey:qKey});
  //       },
  //     );
  //   } else queryClient.invalidateQueries({queryKey:qKey});
  // };
  // const handleUpdateDocket = (edittedItem: Docket | LightDocket) => {
  //   const docketQueryData = queryClient.getQueryData(qKey);

  //   if (docketQueryData && overwrite) {
  //     queryClient.setQueryData<InfiniteAxiosQueryData<Docket | LightDocket>>(
  //       qKey,
  //       old => {
  //         if (old) {
  //           //find page contain deleted item
  //           let pageIndexContainItem: number = old.pages.findIndex(page =>
  //             Boolean(
  //               page.data.results.find(
  //                 docket => docket.docketPk === edittedItem.docketPk,
  //               ),
  //             ),
  //           );
  //           if (pageIndexContainItem !== -1) {
  //             return produce(old, draftOld => {
  //               const targetItem = draftOld.pages[
  //                 pageIndexContainItem
  //               ].data.results.find(
  //                 docket => docket.docketPk === edittedItem.docketPk,
  //               );
  //               if (targetItem) Object.assign(targetItem, edittedItem);

  //               return draftOld;
  //             });
  //           } else queryClient.invalidateQueries({queryKey:qKey});
  //         } else queryClient.invalidateQueries({queryKey:qKey});
  //       },
  //     );
  //   } else queryClient.invalidateQueries({queryKey:qKey});
  // };
  // const handleAddDocket = (addedItem: Docket | LightDocket) => {
  //   const docketQueryData = queryClient.getQueryData(qKey);
  //   if (docketQueryData && overwrite) {
  //     queryClient.setQueryData<InfiniteAxiosQueryData<Docket | LightDocket>>(
  //       qKey,
  //       old => {
  //         if (old) {
  //           const totalNumOfPages = old.pages.length;
  //           return produce(old, (draftOld: any) => {
  //             if (!isDocketExist(addedItem.docketPk)) {
  //               if (appendPos === 'start') {
  //                 (
  //                   draftOld.pages[0].data.results as Array<
  //                     Docket | LightDocket
  //                   >
  //                 ).unshift(addedItem);
  //               } else {
  //                 (
  //                   draftOld.pages[totalNumOfPages - 1].data.results as Array<
  //                     Docket | LightDocket
  //                   >
  //                 ).push(addedItem);
  //               }
  //             }
  //             return draftOld;
  //           });
  //         } else queryClient.invalidateQueries({queryKey:qKey});
  //       },
  //     );
  //   } else queryClient.invalidateQueries({queryKey:qKey});
  // };

  // const handleRemoveDocketWithProjectId = (projectId: string) => {
  //   const queryData = queryClient.getQueryData(qKey);
  //   if (overwrite && queryData) {
  //     queryClient.setQueryData<InfiniteAxiosQueryData<Docket | LightDocket>>(
  //       qKey,
  //       old => {
  //         if (old) {
  //           let deletedData: Array<{
  //             pageIndex: number;
  //             deletedDocketId: Array<string>;
  //           }> = [];

  //           old.pages.forEach((page, pageIndex) => {
  //             const deletedIds = page.data.results.reduce((acc, docket) => {
  //               if (docket.project === projectId)
  //                 return acc.concat(docket.docketPk);
  //               else return acc;
  //             }, [] as string[]);

  //             if (deletedIds.length > 0)
  //               deletedData.push({
  //                 pageIndex,
  //                 deletedDocketId: deletedIds,
  //               });
  //           });

  //           return produce(old, draft => {
  //             deletedData.forEach(deletedItem => {
  //               draft.pages[deletedItem.pageIndex].data.results = draft.pages[
  //                 deletedItem.pageIndex
  //               ].data.results.filter(
  //                 docket =>
  //                   !deletedItem.deletedDocketId.some(
  //                     deletedId => deletedId === docket.docketPk,
  //                   ),
  //               );
  //             });

  //             return draft;
  //           });
  //         } else queryClient.invalidateQueries({queryKey:qKey});
  //       },
  //     );
  //   } else queryClient.invalidateQueries({queryKey:qKey});
  // };

  // const handleUpdateProjectAddress = (
  //   projectId: string,
  //   newAddress: string,
  // ) => {
  //   const queryData = queryClient.getQueryData(qKey);
  //   if (overwrite && queryData) {
  //     queryClient.setQueryData<InfiniteAxiosQueryData<Docket | LightDocket>>(
  //       qKey,
  //       old => {
  //         if (old) {
  //           let deletedData: Array<{
  //             pageIndex: number;
  //             updatedDocketIds: Array<string>;
  //           }> = [];

  //           old.pages.forEach((page, pageIndex) => {
  //             const matchedIds = page.data.results.reduce((acc, docket) => {
  //               if (docket.project === projectId)
  //                 return acc.concat(docket.docketPk);
  //               else return acc;
  //             }, [] as string[]);

  //             if (matchedIds.length > 0)
  //               deletedData.push({
  //                 pageIndex,
  //                 updatedDocketIds: matchedIds,
  //               });
  //           });

  //           return produce(old, draft => {
  //             deletedData.forEach(deletedItem => {
  //               draft.pages[deletedItem.pageIndex].data.results = produce(
  //                 draft.pages[deletedItem.pageIndex].data.results,
  //                 draftDocketList => {
  //                   deletedItem.updatedDocketIds.forEach(updatedId => {
  //                     const updatedDocket = draftDocketList.find(
  //                       docket => updatedId === docket.docketPk,
  //                     );
  //                     if (updatedDocket)
  //                       updatedDocket.projectSiteAddress = newAddress;
  //                   });

  //                   return draftDocketList;
  //                 },
  //               );
  //             });

  //             return draft;
  //           });
  //         } else queryClient.invalidateQueries({queryKey:qKey});
  //       },
  //     );
  //   } else queryClient.invalidateQueries({queryKey:qKey});
  // };

  // const isDocketExist = (checkedItemId: string) => {
  //   const docketQueryData = queryClient.getQueryData(qKey);
  //   if (docketQueryData) {
  //     let matchedItem: number = (
  //       (docketQueryData as any).pages as Array<any>
  //     ).find(page =>
  //       Boolean(
  //         (page.data.results as Docket[]).find(
  //           docket => docket.docketPk === checkedItemId,
  //         ),
  //       ),
  //     );

  //     return Boolean(matchedItem);
  //   } else return false;
  // };

  const removeDocketQueryDataWithSearch = () => {
    const qKey = formDocketListQueryKey({filter: {}, company});
    const data = queryClient.getQueryCache().findAll({
      predicate: query =>
        query.queryKey.includes('searchText-') &&
        query.queryKey.includes(company?.companyId ?? ''),
    });
    data.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };
  return {
    // handleRemoveDocket,
    // handleAddDocket,
    // handleUpdateDocket,
    // handleRemoveDocketWithProjectId,
    // handleUpdateProjectAddress,
    // isDocketExist,
    removeDocketQueryDataWithSearch,
  };
};

export default useSetDocketQueryData;

const styles = StyleSheet.create({});
