// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {useQueryClient} from '@tanstack/react-query';
// import {produce} from 'immer';
// import {useCompany} from '../Providers/CompanyProvider';
// import {QAList} from '../Models/qa';
// import {formQAListQueryKey} from '../API/qaQueryAPI';
// import {InfiniteAxiosQueryData} from '../Models/axiosReturn';

// type Props = {
//   addPos?: 'start' | 'end';
//   overwrite?: boolean; //this prop is to choose the set data behaviour, if true will overwrite on the existing cache data, otherwise it will refetch
// };

// const useSetQAListQueryData = ({addPos = 'start', overwrite = true}: Props) => {
//   const queryClient = useQueryClient();
//   const {company} = useCompany();

//   const handleAddQAList = (addedQAList: QAList) => {
//     const qKey = formQAListQueryKey(
//       {
//         projectId: addedQAList.project ?? undefined,
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
//         queryClient.setQueryData<InfiniteAxiosQueryData<QAList>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               const lengthOfPages = old.pages.length;
//               return produce(old, draftOld => {
//                 draftOld.pages = produce(draftOld.pages, draftPages => {
//                   if (addPos === 'start') {
//                     draftPages[0].data.results.unshift({
//                       ...addedQAList,
//                       isNew: true,
//                     });
//                   } else {
//                     draftPages[lengthOfPages - 1].data.results.push({
//                       ...addedQAList,
//                       isNew: true,
//                     });
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

//   const handleDeleteQAList = (deletedQAList: QAList) => {
//     const qKey = formQAListQueryKey(
//       {
//         projectId: deletedQAList.project ?? undefined,
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
//         queryClient.setQueryData<InfiniteAxiosQueryData<QAList>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               return produce(old, draftOld => {
//                 const pageContainItem = draftOld.pages.find(page =>
//                   page.data.results.find(
//                     qaList =>
//                       qaList.defectListId === deletedQAList.defectListId,
//                   ),
//                 );
//                 if (pageContainItem) {
//                   pageContainItem.data.results = produce(
//                     pageContainItem.data.results,
//                     draftTargetPageData => {
//                       draftTargetPageData = draftTargetPageData.filter(
//                         qaList =>
//                           qaList.defectListId !== deletedQAList.defectListId,
//                       );
//                       return draftTargetPageData;
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

//   const handleEditQAList = (edittedQAList: QAList) => {
//     const qKey = formQAListQueryKey(
//       {
//         projectId: edittedQAList.project ?? undefined,
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
//         queryClient.setQueryData<InfiniteAxiosQueryData<QAList>>(
//           query.queryKey,
//           old => {
//             if (old) {
//               return produce(old, draftOld => {
//                 const pageContainItem = draftOld.pages.find(page =>
//                   page.data.results.find(
//                     qaList =>
//                       qaList.defectListId === edittedQAList.defectListId,
//                   ),
//                 );
//                 if (pageContainItem) {
//                   pageContainItem.data.results = produce(
//                     pageContainItem.data.results,
//                     draftTargetPageData => {
//                       const foundItem = draftTargetPageData.find(
//                         qaList =>
//                           qaList.defectListId === edittedQAList.defectListId,
//                       );
//                       if (foundItem) {
//                         Object.assign(foundItem, edittedQAList);
//                       }
//                       return draftTargetPageData;
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

//   return {
//     handleAddQAList,
//     handleDeleteQAList,
//     handleEditQAList,
//   };
// };

// export default useSetQAListQueryData;

// const styles = StyleSheet.create({});
