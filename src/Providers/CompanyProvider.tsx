import {Alert} from 'react-native';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Company} from '../Models/company';
import {useNotification} from './NotificationProvider';
import CompanyQueryAPI from '../service/DoxleAPI/QueryHookAPI/companyQueryAPI';
import {useAuth} from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppState from '../CustomHooks/useAppState';

type Props = {};

export interface ICompanyProviderContextValue {
  company: Company | undefined;
  setcompany: React.Dispatch<React.SetStateAction<Company | undefined>>;
  companyList: Company[];
  isLoadingCompany: boolean;
  handleSetCompany: (company: Company) => void;
  isRefetchingCompanyList: boolean;
  refetchCompanyList: () => void;
}

const CompanyContext = createContext({});
const CompanyProvider = (children: any) => {
  const [company, setcompany] = useState<Company | undefined>(undefined);

  const {showNotification} = useNotification();

  const {accessToken, logOut, loggedIn} = useAuth();

  const handleFailedGetCompany = () => {
    Alert.alert('Unable to find company!', 'Retry 1 more time', [
      {
        text: 'Retry',
        onPress: () => {
          retrieveCompanyQuery.refetch();
        },
      },
      {
        text: 'Log out',
        onPress: () => {
          logOut();
        },
      },
    ]);
  };
  const onSuccessFetchingCompany = async (companyList: Company[]) => {
    if (companyList.length > 0) {
      if (!company) {
        const lastSelectedCompanyId: string | null = await AsyncStorage.getItem(
          'lastSelectedCompanyId',
        );

        if (!lastSelectedCompanyId) {
          setcompany(companyList[0]);
          AsyncStorage.setItem(
            'lastSelectedCompanyId',
            companyList[0].companyId,
          );
        } else {
          const matchedCompany = companyList.find(
            company => company.companyId === lastSelectedCompanyId,
          );
          if (matchedCompany) setcompany(matchedCompany);
          else {
            setcompany(companyList[0]);
            AsyncStorage.setItem(
              'lastSelectedCompanyId',
              companyList[0].companyId,
            );
          }
        }
      }
    }
  };

  const retrieveCompanyQuery = CompanyQueryAPI.useRetrieveCompanyList({
    showNotification,
    accessToken,
    // onErrorCb: handleFailedGetCompany,
    onSuccessCb: onSuccessFetchingCompany,
    enable: Boolean(loggedIn && accessToken),
  });

  const companyList = useMemo(
    () =>
      retrieveCompanyQuery.isSuccess
        ? (retrieveCompanyQuery.data.data.results as Company[])
        : [],
    [retrieveCompanyQuery.data],
  );

  // console.log('COMPANY LIST: ', companyList);
  // useEffect(() => {
  //   if (company) console.log('COMPANY:', company.companyId);
  // }, [company]);

  const handleSetCompany = (companyItem: Company) => {
    setcompany(companyItem);

    AsyncStorage.setItem('lastSelectedCompanyId', companyItem.companyId);
  };
  const refetchCompanyList = () => {
    retrieveCompanyQuery.refetch();
  };

  const {appState} = useAppState();

  useEffect(() => {
    if (appState === 'active') {
      const timeout = setTimeout(() => {
        if (retrieveCompanyQuery.isStale && accessToken) refetchCompanyList();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [appState]);

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
    }),
    [company, companyList, handleSetCompany, retrieveCompanyQuery.isRefetching],
  );
  return (
    <CompanyContext.Provider {...children} value={companyContextProvider} />
  );
};
const useCompany = () =>
  useContext(CompanyContext) as ICompanyProviderContextValue;
export {CompanyProvider, useCompany};
