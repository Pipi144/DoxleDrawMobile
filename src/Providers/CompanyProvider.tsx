import {Alert} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Company} from '../Models/company';
import {useNotification} from './NotificationProvider';
import {useAuth} from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppState from '../CustomHooks/useAppState';
import CompanyQueryAPI from '../API/companyQueryAPI';
import {IFullProject, Project} from '../Models/project';
import useEffectAfterMount from '../CustomHooks/useEffectAfterMount';
import useGetProjectList from '../GetQueryDataHooks/useGetProjectList';
import ProjectQueryAPI from '../API/projectQueryAPI';
import {produce} from 'immer';

const prevSessionStorageKey = 'prevCompanySession';
export type TPrevCompanySession = {
  lastCompany?: Company;
  lastProject?: Project;
};

export interface ICompanyProviderContextValue {
  company: Company | undefined;
  setcompany: React.Dispatch<React.SetStateAction<Company | undefined>>;
  companyList: Company[];
  selectedProject: Project | undefined;
  handleSelectProject: (project: Project | undefined) => void;
  isLoadingCompany: boolean;
  handleSetCompany: (company: Company) => void;
  isRefetchingCompanyList: boolean;
  refetchCompanyList: () => void;
}

const CompanyContext = createContext({});
const CompanyProvider = (children: any) => {
  const [company, setcompany] = useState<Company | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined,
  );
  const [prevSession, setPrevSession] = useState<TPrevCompanySession>({});

  const getStoragePrevSession = useCallback(async (): Promise<
    TPrevCompanySession | undefined
  > => {
    try {
      const prevSession = await AsyncStorage.getItem(prevSessionStorageKey);
      if (prevSession) {
        const parsedPrevSession = JSON.parse(
          prevSession,
        ) as TPrevCompanySession;
        setPrevSession(parsedPrevSession);
        if (parsedPrevSession.lastCompany) {
          setcompany(parsedPrevSession.lastCompany);
        }
        if (parsedPrevSession.lastProject) {
          setSelectedProject(parsedPrevSession.lastProject);
        }
      }
      return prevSession
        ? (JSON.parse(prevSession) as TPrevCompanySession)
        : undefined;
    } catch (error) {
      console.log('Error getting prev session', error);
    }
  }, []);
  const {accessToken, logOut, loggedIn} = useAuth();

  const onSuccessFetchingCompany = useCallback(
    (companyList: Company[]) => {
      if (companyList.length > 0) {
        let prevSessionStorage = {...prevSession};
        if (!company) {
          setcompany(companyList[0]);
          prevSessionStorage.lastCompany = companyList[0];
        } else {
          const matchedCompany = companyList.find(
            company =>
              company.companyId === prevSessionStorage.lastCompany?.companyId,
          );
          if (matchedCompany) {
            setcompany(matchedCompany);

            prevSession.lastCompany = matchedCompany;
          } else {
            setcompany(companyList[0]);
            prevSessionStorage.lastCompany = companyList[0];
          }
        }
        AsyncStorage.setItem(
          prevSessionStorageKey,
          JSON.stringify(prevSessionStorage),
        );
        setPrevSession(
          produce(draft => {
            draft.lastCompany = prevSessionStorage.lastCompany;
          }),
        );
      }
    },
    [prevSession, company],
  );

  const retrieveCompanyQuery = CompanyQueryAPI.useRetrieveCompanyList({
    accessToken,
    onSuccessCb: onSuccessFetchingCompany,
    enable: Boolean(loggedIn && accessToken),
  });

  const companyList = useMemo(
    () =>
      retrieveCompanyQuery.isSuccess
        ? retrieveCompanyQuery.data?.data.results ?? []
        : [],
    [retrieveCompanyQuery.data],
  );

  const handleSetCompany = useCallback(
    (companyItem: Company) => {
      setcompany(companyItem);

      setPrevSession(prev => ({...prev, lastCompany: companyItem}));
      AsyncStorage.setItem(
        prevSessionStorageKey,
        JSON.stringify({...prevSession, lastCompany: companyItem}),
      );
    },
    [prevSession],
  );
  const refetchCompanyList = () => {
    retrieveCompanyQuery.refetch();
  };
  const handleSelectProject = useCallback(
    (project: Project | undefined) => {
      setSelectedProject(project);
      setPrevSession(prev => ({...prev, lastProject: project}));
      const prevSessionStorage = {...prevSession, lastProject: project};
      AsyncStorage.setItem(
        prevSessionStorageKey,
        JSON.stringify(prevSessionStorage),
      );
    },
    [prevSession],
  );

  const onSuccessFetchingProjectList = useCallback(
    (data: IFullProject[]) => {
      let prevSessionStorage = {...prevSession};
      console.log('SET PROJECT:', data.length);
      if (data.length > 0) {
        if (!selectedProject) {
          setSelectedProject(data[0]);
          setPrevSession(prev => ({...prev, lastProject: data[0]}));
          prevSessionStorage.lastProject = data[0];
        } else {
          const matchProject = data.find(
            project => project.projectId === selectedProject?.projectId,
          );

          setSelectedProject(matchProject ?? data[0]);
          prevSessionStorage.lastProject = matchProject ?? data[0];
        }
        setPrevSession(prev => ({
          ...prev,
          lastProject: prevSessionStorage.lastProject,
        }));
        AsyncStorage.setItem(
          prevSessionStorageKey,
          JSON.stringify(prevSessionStorage),
        );
      }
    },
    [prevSession, selectedProject],
  );
  const projectQuery = ProjectQueryAPI.useRetrieveFullProjectListQuery({
    company,
    accessToken,

    filter: {
      view: 'budget',
    },
    // onSuccessCb: onSuccessFetchingProjectList,
  });
  useEffect(() => {
    onSuccessFetchingProjectList(
      projectQuery.data?.pages.flatMap(p => p?.data.results ?? []) ?? [],
    );
  }, [projectQuery.isSuccess]);

  const {appState} = useAppState();

  useEffect(() => {
    if (appState === 'active') {
      const timeout = setTimeout(() => {
        if (retrieveCompanyQuery.isStale && accessToken) refetchCompanyList();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [appState]);

  useEffectAfterMount(() => {
    getStoragePrevSession();
  }, []);

  const companyContextProvider: ICompanyProviderContextValue = useMemo(
    () => ({
      company,
      setcompany,
      companyList,
      isLoadingCompany: Boolean(
        retrieveCompanyQuery.isLoading || retrieveCompanyQuery.isRefetching,
      ),
      handleSetCompany,
      isRefetchingCompanyList: retrieveCompanyQuery.isRefetching,
      refetchCompanyList,
      selectedProject,
      handleSelectProject,
    }),
    [
      company,
      companyList,
      handleSetCompany,
      retrieveCompanyQuery.isRefetching,
      selectedProject,
      handleSelectProject,
    ],
  );
  return (
    <CompanyContext.Provider {...children} value={companyContextProvider} />
  );
};
const useCompany = () =>
  useContext(CompanyContext) as ICompanyProviderContextValue;
export {CompanyProvider, useCompany};
