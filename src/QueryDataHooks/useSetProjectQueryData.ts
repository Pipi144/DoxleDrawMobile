import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {
  ICompanyProviderContextValue,
  useCompany,
} from '../Providers/CompanyProvider';
import {IFullProject, Project} from '../Models/project';
import {produce} from 'immer';
import {formRetrieveSimpleProjectQKey} from '../API/projectQueryAPI';
import {
  AxiosInfiniteReturn,
  DefiniteAxiosQueryData,
  InfiniteAxiosQueryData,
} from '../Models/axiosReturn';

type Props = {
  addPos?: 'start' | 'end';
};
interface SetProjectQueryData {
  handleAddProjectQueryData: (newProject: Project) => void;
  handleDeleteProjectQueryData: (deletedProjectId: string) => void;
  handleUpdateProjectQueryData: (updatedProject: IFullProject) => void;
}
const useSetProjectQueryData = ({
  addPos = 'end',
}: Props): SetProjectQueryData => {
  const queryClient = useQueryClient();
  const {company} = useCompany() as ICompanyProviderContextValue;
  const qKey = formRetrieveSimpleProjectQKey(company);
  const dataActive = queryClient.getQueryCache().findAll({
    predicate: query =>
      qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
  });
  const dataInactive = queryClient.getQueryCache().findAll({
    predicate: query =>
      qKey.every(key => query.queryKey.includes(key)) && !query.isActive(),
  });
  const handleAddProjectQueryData = (newProject: Project) => {
    dataActive.forEach(query => {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<Project>>
      >(query.queryKey, old => {
        if (old) {
          return produce(old, draftOld => {
            draftOld.data.results = produce(
              draftOld.data.results,
              draftProjectList => {
                if (addPos && addPos === 'start')
                  draftProjectList.unshift(newProject);
                else draftProjectList.push(newProject);
              },
            );

            return draftOld;
          });
        } else queryClient.refetchQueries({queryKey: query.queryKey});
      });
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const handleDeleteProjectQueryData = (deletedProjectId: string) => {
    dataActive.forEach(query => {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<Project>>
      >(query.queryKey, old => {
        if (old) {
          return produce(old, draftOld => {
            draftOld.data.results = draftOld.data.results.filter(
              project => project.projectId !== deletedProjectId,
            );

            return draftOld;
          });
        } else queryClient.refetchQueries({queryKey: query.queryKey});
      });
    });
    dataInactive.forEach(query => {
      queryClient.removeQueries({queryKey: query.queryKey});
    });
  };

  const handleUpdateProjectQueryData = (updatedProject: IFullProject) => {
    dataActive.forEach(query => {
      queryClient.setQueryData<
        DefiniteAxiosQueryData<AxiosInfiniteReturn<Project>>
      >(query.queryKey, old => {
        if (old) {
          return produce(old, draftOld => {
            const updatedItem = draftOld.data.results.find(
              project => project.projectId === updatedProject.projectId,
            );
            if (updatedItem) Object.assign(updatedItem, updatedProject);

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
    handleAddProjectQueryData,
    handleDeleteProjectQueryData,
    handleUpdateProjectQueryData,
  };
};

export default useSetProjectQueryData;

const styles = StyleSheet.create({});
