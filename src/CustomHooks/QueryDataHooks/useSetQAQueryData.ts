// import {StyleSheet} from 'react-native';
// import {useQueryClient} from '@tanstack/react-query';
// import {original, produce} from 'immer';
// import {useCompany} from '../Providers/CompanyProvider';
// import {QA, QAComment, QAWithFirstImg} from '../Models/qa';
// import {formQAItemListQKey} from '../API/qaQueryAPI';
// import {InfiniteAxiosQueryData} from '../Models/axiosReturn';

// type Props = {
//   appendPos?: 'start' | 'end';
//   overwrite?: boolean;
// };

// const useSetQAQueryData = ({appendPos = 'start', overwrite = true}: Props) => {
//   const queryClient = useQueryClient();
//   const {company} = useCompany();

//   const handleAddQAQueryData = (addedQA: QAWithFirstImg) => {
//     const qKey = formQAItemListQKey(
//       {
//         defectListId: addedQA.defectList,
//       },
//       company,
//     );
//     const dataActive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
//     });
//     const dataInactive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
//     });
//     dataActive.forEach(query => {
//       if (overwrite) {
//         queryClient.setQueryData<InfiniteAxiosQueryData<QA>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               const lengthOfPages = old.pages.length;
//               return produce(old, draftOld => {
//                 draftOld.pages = produce(draftOld.pages, draftPages => {
//                   if (appendPos === 'start') {
//                     (draftPages[0].data.results as QAWithFirstImg[]).unshift({
//                       ...addedQA,
//                       isNew: true,
//                     });
//                   } else {
//                     (
//                       draftPages[lengthOfPages - 1].data
//                         .results as QAWithFirstImg[]
//                     ).push({...addedQA, isNew: true});
//                   }

//                   return draftPages;
//                 });

//                 return draftOld;
//               });
//             } else queryClient.refetchQueries({queryKey: query.queryKey});
//           },
//         );
//       } else queryClient.refetchQueries({queryKey: query.queryKey});
//     });
//     dataInactive.forEach(query => {
//       queryClient.removeQueries({queryKey: query.queryKey});
//     });
//   };

//   const handleEditQAQueryData = (edittedQA: QA) => {
//     const qKey = formQAItemListQKey(
//       {
//         defectListId: edittedQA.defectList,
//       },
//       company,
//     );
//     const dataActive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
//     });
//     const dataInactive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
//     });
//     dataActive.forEach(query => {
//       if (overwrite) {
//         queryClient.setQueryData<InfiniteAxiosQueryData<QA>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               //find page contain deleted item
//               let pageContainGroup: number = old.pages.findIndex(page =>
//                 page.data.results.find(
//                   qa => qa.defectId === edittedQA.defectId,
//                 ),
//               );
//               if (pageContainGroup !== -1) {
//                 const targetOrderItemIndex = old.pages[
//                   pageContainGroup
//                 ].data.results.findIndex(
//                   qa => qa.defectId === edittedQA.defectId,
//                 );
//                 return produce(old, draftOld => {
//                   draftOld.pages = produce(draftOld.pages, draftPages => {
//                     draftPages[pageContainGroup].data.results = produce(
//                       draftPages[pageContainGroup].data.results,
//                       draftTargetPageData => {
//                         if (targetOrderItemIndex !== -1) {
//                           const updatedItem = original(
//                             draftTargetPageData[targetOrderItemIndex],
//                           );
//                           if (updatedItem)
//                             Object.assign(updatedItem, edittedQA);
//                         }

//                         return draftTargetPageData;
//                       },
//                     );
//                     return draftPages;
//                   });

//                   return draftOld;
//                 });
//               } else queryClient.refetchQueries({queryKey: query.queryKey});
//             } else queryClient.refetchQueries({queryKey: query.queryKey});
//           },
//         );
//       } else queryClient.refetchQueries({queryKey: query.queryKey});
//     });

//     dataInactive.forEach(query => {
//       queryClient.removeQueries({queryKey: query.queryKey});
//     });
//   };

//   const handleDeleteQAQueryData = (
//     deletedQAId: string,
//     defectListId: string,
//   ) => {
//     const qKey = formQAItemListQKey(
//       {
//         defectListId: defectListId,
//       },
//       company,
//     );
//     const dataActive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
//     });
//     const dataInactive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
//     });

//     dataActive.forEach(query => {
//       if (overwrite) {
//         queryClient.setQueryData<InfiniteAxiosQueryData<QA>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               return produce(old, draftOld => {
//                 const pageContainItem = draftOld.pages.find(page =>
//                   page.data.results.find(qa => qa.defectId === deletedQAId),
//                 );

//                 if (pageContainItem) {
//                   pageContainItem.data.results = produce(
//                     pageContainItem.data.results,
//                     draftPageData => {
//                       draftPageData = draftPageData.filter(
//                         qa => qa.defectId !== deletedQAId,
//                       );
//                       return draftPageData;
//                     },
//                   );
//                 }
//                 return draftOld;
//               });
//             } else queryClient.refetchQueries({queryKey: query.queryKey});
//           },
//         );
//       } else queryClient.refetchQueries({queryKey: query.queryKey});
//     });

//     dataInactive.forEach(query => {
//       queryClient.removeQueries({queryKey: query.queryKey});
//     });
//   };

//   const handleUpdateFirstImageQA = (
//     qaID: string,
//     qaListId: string,
//     firstImg: string | null,
//   ) => {
//     const qKey = formQAItemListQKey(
//       {
//         defectListId: qaListId,
//       },
//       company,
//     );
//     const data = queryClient.getQueryCache().findAll({
//       predicate: query => qKey.every(key => query.queryKey.includes(key)),
//     });

//     data.forEach(query => {
//       if (overwrite) {
//         queryClient.setQueryData<InfiniteAxiosQueryData<QAWithFirstImg>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               //find page contain deleted item
//               let pageContainGroup: number = old.pages.findIndex(page =>
//                 page.data.results.find(qa => qa.defectId === qaID),
//               );
//               if (pageContainGroup !== -1) {
//                 const targetOrderItemIndex = (
//                   old.pages[pageContainGroup].data.results as QAWithFirstImg[]
//                 ).findIndex(qa => qa.defectId === qaID);
//                 return produce(old, draftOld => {
//                   draftOld.pages = produce(draftOld.pages, draftPages => {
//                     draftPages[pageContainGroup].data.results = produce(
//                       draftPages[pageContainGroup].data.results,
//                       draftTargetPageData => {
//                         if (targetOrderItemIndex !== -1) {
//                           draftTargetPageData[targetOrderItemIndex].firstImage =
//                             firstImg;
//                         }

//                         return draftTargetPageData;
//                       },
//                     );
//                     return draftPages;
//                   });

//                   return draftOld;
//                 });
//               } else queryClient.refetchQueries({queryKey: query.queryKey});
//             }
//             queryClient.refetchQueries({queryKey: query.queryKey});
//           },
//         );
//       } else queryClient.refetchQueries({queryKey: query.queryKey});
//     });
//   };

//   const handleUpdateLatestCommentQA = (
//     qaID: string,
//     qaListId: string,
//     comment: QAComment | null,
//   ) => {
//     const qKey = formQAItemListQKey(
//       {
//         defectListId: qaListId,
//       },
//       company,
//     );
//     const data = queryClient.getQueryCache().findAll({
//       predicate: query => qKey.every(key => query.queryKey.includes(key)),
//     });

//     data.forEach(query => {
//       if (overwrite) {
//         queryClient.setQueryData<InfiniteAxiosQueryData<QAWithFirstImg>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               //find page contain deleted item
//               let pageContainGroup: number = old.pages.findIndex(page =>
//                 page.data.results.find(qa => qa.defectId === qaID),
//               );
//               if (pageContainGroup !== -1) {
//                 const targetOrderItemIndex = old.pages[
//                   pageContainGroup
//                 ].data.results.findIndex(qa => qa.defectId === qaID);
//                 return produce(old, draftOld => {
//                   draftOld.pages = produce(draftOld.pages, draftPages => {
//                     draftPages[pageContainGroup].data.results = produce(
//                       draftPages[pageContainGroup].data.results,
//                       draftTargetPageData => {
//                         if (targetOrderItemIndex !== -1) {
//                           draftTargetPageData[
//                             targetOrderItemIndex
//                           ].lastComment = comment;
//                         }

//                         return draftTargetPageData;
//                       },
//                     );
//                     return draftPages;
//                   });

//                   return draftOld;
//                 });
//               } else queryClient.refetchQueries({queryKey: query.queryKey});
//             } else queryClient.refetchQueries({queryKey: query.queryKey});
//           },
//         );
//       } else queryClient.refetchQueries({queryKey: query.queryKey});
//     });
//   };
//   return {
//     handleAddQAQueryData,
//     handleEditQAQueryData,
//     handleDeleteQAQueryData,
//     handleUpdateFirstImageQA,
//     handleUpdateLatestCommentQA,
//   };
// };

// export default useSetQAQueryData;

// const styles = StyleSheet.create({});
