// import {StyleSheet, Text, View} from 'react-native';

// import {produce} from 'immer';
// import { QAVideo } from '../Models/qa';
// import { useQueryClient } from '@tanstack/react-query';

// type Props = {
//   appendPos?: 'start' | 'end';
//   overwrite?: boolean;
// };

// interface ISetQAVideoQueryData {
//   handleAddQAVideo: (addedComment: QAVideo) => void;
//   handleDeleteQAVideo: (deletedVideo: QAVideo) => void;
// }
// const useSetQAVideoQueryData = ({
//   appendPos = 'start',
//   overwrite = true,
// }: Props): ISetQAVideoQueryData => {
//   const queryClient = useQueryClient();
//   const {company} = useCompany();

//   const handleAddQAVideo = (addedComment: QAVideo) => {
//     const qKey = formQAVideoQKey(addedComment.defect, company);
//     const oldServerData = queryClient.getQueryData(qKey);
//     if (oldServerData && overwrite) {
//       queryClient.setQueryData<
//         DefiniteAxiosQueryData<AxiosInfiniteReturn<QAVideo>>
//       >(qKey, old =>
//         old
//           ? produce(old, draftOld => {
//               if (appendPos === 'end') draftOld.data.results.push(addedComment);
//               else draftOld.data.results.unshift(addedComment);

//               return draftOld;
//             })
//           : old,
//       );
//     } else queryClient.invalidateQueries(qKey);
//   };

//   const handleDeleteQAVideo = (deletedVideo: QAVideo) => {
//     const qKey = formQAVideoQKey(deletedVideo.defect, company);
//     const oldServerData = queryClient.getQueryData(qKey);

//     if (oldServerData && overwrite) {
//       queryClient.setQueryData<
//         DefiniteAxiosQueryData<AxiosInfiniteReturn<QAVideo>>
//       >(qKey, old =>
//         old
//           ? produce(old, draftOld => {
//               draftOld.data.results = draftOld.data.results.filter(
//                 item => item.fileId !== deletedVideo.fileId,
//               );

//               return draftOld;
//             })
//           : old,
//       );
//     } else queryClient.invalidateQueries(qKey);
//   };
//   return {
//     handleAddQAVideo,
//     handleDeleteQAVideo,
//   };
// };

// export default useSetQAVideoQueryData;

// const styles = StyleSheet.create({});
