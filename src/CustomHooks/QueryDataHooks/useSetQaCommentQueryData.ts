// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {useQueryClient} from '@tanstack/react-query';
// import {produce} from 'immer';
// import {formQACommentQKey, PatchQAComment} from '../API/qaQueryAPI';
// import {useCompany} from '../Providers/CompanyProvider';
// import {QAComment} from '../Models/qa';
// import {
//   DefiniteAxiosQueryData,
//   AxiosInfiniteReturn,
// } from '../Models/axiosReturn';

// type Props = {
//   appendPos?: 'start' | 'end';
// };

// const useSetQaCommentQueryData = ({appendPos = 'start'}: Props) => {
//   const queryClient = useQueryClient();
//   const {company} = useCompany();

//   const handleAddQAList = (addedComment: QAComment) => {
//     const qKey = formQACommentQKey(addedComment.defect, company);
//     const dataActive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
//     });
//     const dataInactive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
//     });
//     dataActive.forEach(query => {
//       queryClient.setQueryData<
//         DefiniteAxiosQueryData<AxiosInfiniteReturn<QAComment>>
//       >(query.queryKey, old => {
//         if (old) {
//           return produce(old, draftOld => {
//             if (appendPos === 'end') draftOld.data.results.push(addedComment);
//             else draftOld.data.results.unshift(addedComment);

//             return draftOld;
//           });
//         } else queryClient.refetchQueries({queryKey: query.queryKey});
//       });
//     });
//     dataInactive.forEach(query => {
//       queryClient.removeQueries({queryKey: query.queryKey});
//     });
//   };

//   const handlePatchQAComment = ({
//     commentId,
//     commentText,
//     isOfficial,
//   }: PatchQAComment) => {
//     const qKey = formQACommentQKey(addedComment.defect, company);
//     const dataActive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
//     });
//     const dataInactive = queryClient.getQueryCache().findAll({
//       predicate: query =>
//         qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
//     });
//     dataActive.forEach(query => {
//       queryClient.setQueryData<
//         DefiniteAxiosQueryData<AxiosInfiniteReturn<QAComment>>
//       >(query.queryKey, old => {
//         if (old) {
//           return produce(old, draftOld => {
//             if (appendPos === 'end') draftOld.data.results.push(addedComment);
//             else draftOld.data.results.unshift(addedComment);

//             return draftOld;
//           });
//         } else queryClient.refetchQueries({queryKey: query.queryKey});
//       });
//     });
//     dataInactive.forEach(query => {
//       queryClient.removeQueries({queryKey: query.queryKey});
//     });
//     const oldServerData = queryClient.getQueryData(qKey);
//     if (oldServerData) {
//       queryClient.setQueryData<
//         DefiniteAxiosQueryData<AxiosInfiniteReturn<QAComment>>
//       >(qKey, old =>
//         old
//           ? produce(old, draftOld => {
//               const item = draftOld.data.results.find(
//                 item => item.commentId === commentId,
//               );

//               if (item) {
//                 if (commentText !== undefined) item.commentText = commentText;
//                 if (isOfficial !== undefined) item.isOfficial = isOfficial;
//               }
//             })
//           : old,
//       );
//     } else queryClient.invalidateQueries(qKey);
//   };
//   return {
//     handleAddQAList,
//     handlePatchQAComment,
//   };
// };

// export default useSetQaCommentQueryData;

// const styles = StyleSheet.create({});
