import {StyleSheet} from 'react-native';
import ProjectQueryAPI, {TProjectType} from '../../API/projectQueryAPI';
import {IFullProject} from '../../Models/project';
import {useAuth} from '../../Providers/AuthProvider';
import {useCompany} from '../../Providers/CompanyProvider';
import {useMemo} from 'react';
import {groupBy} from 'lodash';

type Props = {
  projectType?: TProjectType;
  searchText?: string;
  onSuccessFetchProjectCb?: (projects: IFullProject[]) => void;
};
export interface IProjectGroup {
  data: IFullProject[];
  projectStatusName: string;
  projectStatusId: string | null;
}

const useGetProjectList = ({
  projectType = 'budget',
  searchText,
  onSuccessFetchProjectCb,
}: Props) => {
  const {accessToken} = useAuth();

  const {company} = useCompany();

  const projectQuery = ProjectQueryAPI.useRetrieveFullProjectListQuery({
    company,
    accessToken,

    onSuccessCb: onSuccessFetchProjectCb,
    filter: {
      view: projectType,
      searchText,
    },
  });
  const projectList = useMemo(
    () =>
      projectQuery.isSuccess
        ? projectQuery.data.pages.flatMap(page => page?.data.results ?? [])
        : [],
    [projectQuery.data],
  );
  const groupedProjectByStatus: IProjectGroup[] = useMemo(() => {
    const groupProjectStatus = groupBy(projectList, pj => pj.projectStatus);
    const projectStatusGroupIds = Object.keys(groupProjectStatus);

    const finalData = projectStatusGroupIds.reduce((acc, projectStatusId) => {
      const statusName = groupProjectStatus[projectStatusId][0].statusName;
      return acc.concat({
        projectStatusId: projectStatusId,
        projectStatusName: statusName,
        data: groupProjectStatus[projectStatusId],
      });
    }, [] as IProjectGroup[]);
    return finalData.sort((a, b) => {
      if (a.projectStatusName.toLowerCase().includes('active')) return -1;
      else return 1;
    });
  }, [projectList]);

  const handleFetchNextPageProject = () => {
    if (projectQuery.hasNextPage) projectQuery.fetchNextPage();
  };

  return {
    projectList,
    isFetchingProject: projectQuery.isLoading,
    isSuccessFetchingProject: projectQuery.isSuccess,
    isErrorFetchingProject: projectQuery.isError,
    refetchProjectList: () => {
      projectQuery.refetch();
    },
    isRefetchingProjectList: projectQuery.isRefetching,
    groupedProjectByStatus,
    handleFetchNextPageProject,
  };
};

export default useGetProjectList;

const styles = StyleSheet.create({});
