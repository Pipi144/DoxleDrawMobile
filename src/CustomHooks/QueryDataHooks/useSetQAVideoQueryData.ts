import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {QA, QAVideo} from '../../Models/qa';
import {useQueryClient} from '@tanstack/react-query';
import {useCompany} from '../../Providers/CompanyProvider';
import {
  AxiosInfiniteReturn,
  DefiniteAxiosQueryData,
} from '../../Models/axiosReturn';
import {produce} from 'immer';
import {formQAVideoQKey} from '../../API/qaQueryAPI';

type Props = {
  appendPos?: 'start' | 'end';
  overwrite?: boolean;
};

interface ISetQAVideoQueryData {
  handleAddQAVideo: (addedVideo: QAVideo) => void;
  handleDeleteQAVideo: (deletedVideo: QAVideo) => void;
}
const useSetQAVideoQueryData = ({
  appendPos = 'start',
  overwrite = true,
}: Props): ISetQAVideoQueryData => {
  const queryClient = useQueryClient();
  const {company} = useCompany();

  const handleAddQAVideo = (addedVideo: QAVideo) => {
    const qKey = formQAVideoQKey(addedVideo.defect, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    if (dataActive.length > 0) {
      for (let i = 0; i < dataActive.length; i++) {
        const query = dataActive[i];
        if (overwrite) {
          queryClient.setQueryData<
            DefiniteAxiosQueryData<AxiosInfiniteReturn<QAVideo>>
          >(qKey, old =>
            old
              ? produce(old, draftOld => {
                  if (appendPos === 'end')
                    draftOld.data.results.push(addedVideo);
                  else draftOld.data.results.unshift(addedVideo);

                  return draftOld;
                })
              : old,
          );
        } else queryClient.refetchQueries({queryKey: query.queryKey});
      }
    }

    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const handleDeleteQAVideo = (deletedVideo: QAVideo) => {
    const qKey = formQAVideoQKey(deletedVideo.defect, company);
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    const dataInactive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
    });
    if (dataActive.length > 0) {
      for (let i = 0; i < dataActive.length; i++) {
        const query = dataActive[i];
        if (overwrite) {
          queryClient.setQueryData<
            DefiniteAxiosQueryData<AxiosInfiniteReturn<QAVideo>>
          >(qKey, old =>
            old
              ? produce(old, draftOld => {
                  draftOld.data.results = draftOld.data.results.filter(
                    item => item.fileId !== deletedVideo.fileId,
                  );

                  return draftOld;
                })
              : old,
          );
        } else queryClient.refetchQueries({queryKey: query.queryKey});
      }
    }

    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };
  return {
    handleAddQAVideo,
    handleDeleteQAVideo,
  };
};

export default useSetQAVideoQueryData;

const styles = StyleSheet.create({});
