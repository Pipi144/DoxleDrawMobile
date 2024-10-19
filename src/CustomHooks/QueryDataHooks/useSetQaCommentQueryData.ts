import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useCompany} from '../../Providers/CompanyProvider';
import {QAComment} from '../../Models/qa';
import {formQACommentQKey, PatchQAComment} from '../../API/qaQueryAPI';
import {
  AxiosInfiniteReturn,
  DefiniteAxiosQueryData,
} from '../../Models/axiosReturn';

type Props = {
  appendPos?: 'start' | 'end';
};

const useSetQaCommentQueryData = ({appendPos = 'start'}: Props) => {
  const queryClient = useQueryClient();
  const {company} = useCompany();

  const handleAddQAList = (addedComment: QAComment) => {
    const qKey = formQACommentQKey(addedComment.defect, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    dataActive.forEach(query => {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<QAComment>>
      >(query.queryKey, old => {
        if (old) {
          return produce(old, draftOld => {
            if (appendPos === 'end') draftOld.data.results.push(addedComment);
            else draftOld.data.results.unshift(addedComment);

            return draftOld;
          });
        } else queryClient.refetchQueries({queryKey: query.queryKey});
      });
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const handlePatchQAComment = ({
    commentId,
    commentText,
    isOfficial,
    qaId,
  }: PatchQAComment) => {
    const qKey = formQACommentQKey(qaId, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    dataActive.forEach(query => {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<QAComment>>
      >(query.queryKey, old => {
        if (old) {
          return produce(old, draftOld => {
            const foundItem = draftOld.data.results.find(
              item => item.commentId === commentId,
            );
            if (foundItem) {
              if (commentText) foundItem.commentText = commentText;
              if (isOfficial !== undefined) foundItem.isOfficial = isOfficial;
            }

            return draftOld;
          });
        } else queryClient.refetchQueries({queryKey: query.queryKey});
      });
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };
  return {
    handleAddQAList,
    handlePatchQAComment,
  };
};

export default useSetQaCommentQueryData;

const styles = StyleSheet.create({});
