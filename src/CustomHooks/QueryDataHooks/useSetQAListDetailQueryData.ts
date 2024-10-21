import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useCompany} from '../../Providers/CompanyProvider';
import {useQueryClient} from '@tanstack/react-query';
import {QAList} from '../../Models/qa';
import {produce} from 'immer';
import {formDefectListDetailQKey} from '../../API/qaQueryAPI';
import {DefiniteAxiosQueryData} from '../../Models/axiosReturn';

type Props = {};

const useSetQAListDetailQueryData = ({}: Props) => {
  const {company} = useCompany();
  const queryClient = useQueryClient();

  const handleUpdateQAListDetailQueryData = (
    updateData: Partial<
      Pick<
        QAList,
        'completedCount' | 'unattendedCount' | 'defectListTitle' | 'project'
      >
    > &
      Pick<QAList, 'defectListId'>,
  ) => {
    const qKey = formDefectListDetailQKey(updateData.defectListId, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    dataActive.forEach(query => {
      queryClient.setQueryData<DefiniteAxiosQueryData<QAList>>(
        query.queryKey,
        old => {
          if (old) {
            return produce(old, draftOld => {
              draftOld.data = produce(draftOld.data, (draftQA: QAList) => {
                Object.assign(draftQA, updateData);
                return draftQA;
              });
            });
          } else queryClient.refetchQueries({queryKey: query.queryKey});
        },
      );
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const getQAListDetailQueryData = (qaListId: string) => {
    const qKey = formDefectListDetailQKey(qaListId, company);
    const qaListDetailQueryData: QAList | undefined = queryClient.getQueryData(
      qKey,
    )
      ? (queryClient.getQueryData(qKey) as any).data
      : undefined;
    return qaListDetailQueryData;
  };

  const refetchQAListDetailQueryData = (qaListId: string) => {
    const qKey = formDefectListDetailQKey(qaListId, company);
    queryClient.invalidateQueries({queryKey: qKey});
  };
  return {
    handleUpdateQAListDetailQueryData,
    getQAListDetailQueryData,
    refetchQAListDetailQueryData,
  };
};

export default useSetQAListDetailQueryData;

const styles = StyleSheet.create({});
