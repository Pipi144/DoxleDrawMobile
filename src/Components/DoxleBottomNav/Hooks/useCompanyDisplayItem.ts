import {Alert, GestureResponderEvent, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Company} from '../../../../Models/company';
import {useAuth} from '../../../../Providers/AuthProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../GeneralComponents/Notification/Notification';
import {useCompany} from '../../../../Providers/CompanyProvider';
import CompanyQueryAPI, {
  getMutateCompanyKey,
} from '../../../../service/DoxleAPI/QueryHookAPI/companyQueryAPI';
import {useIsMutating} from '@tanstack/react-query';
import {useSideMenuContextValue} from '../SideMenu/SideMenu';

import {StackNavigationProp} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';
import {TNavigationRootAppProps} from '../../../../Routes/RouteParams';
type Props = {
  companyItem: Company;
};

interface ICompanyDisplayItem {
  showToggleMenu: boolean;
  setShowToggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isDeletingCompany: boolean;
  handlePressExpandIcon: (e: GestureResponderEvent) => void;
  handlePressDeleteIcon: (e: GestureResponderEvent) => void;
  handlePressEditIcon: (e: GestureResponderEvent) => void;
}
const useCompanyDisplayItem = ({companyItem}: Props): ICompanyDisplayItem => {
  const [showToggleMenu, setShowToggleMenu] = useState(false);
  const {accessToken, user} = useAuth();
  const {notifierSideMenu} = useSideMenuContextValue();
  const navigation =
    useNavigation<StackNavigationProp<TNavigationRootAppProps>>();
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
      duration?: number,
    ) => {
      notifierSideMenu.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        duration: duration || 500,
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );
  const {company, companyList, handleSetCompany} = useCompany();
  const onSuccessDele = (deletedId?: string) => {
    if (deletedId && deletedId === company?.companyId && companyList[0]) {
      handleSetCompany(companyList[0]);
    }
  };
  const deleteCompanyQuery = CompanyQueryAPI.useDeleteCompany({
    showNotification,
    accessToken,
    company: company,
    onSuccessDeleteCb: onSuccessDele,
  });

  const isDeletingCompany =
    useIsMutating({
      mutationKey: getMutateCompanyKey('delete'),
      predicate: query => query.state.variables === companyItem.companyId,
      exact: true,
    }) > 0;

  const handlePressExpandIcon = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setShowToggleMenu(true);
  };

  const handlePressDeleteIcon = (e: GestureResponderEvent) => {
    e.stopPropagation();
    Alert.alert(
      'Confirm delete company!',
      `Your data belong to company *** ${companyItem.name} *** will be deleted permanently and will not be recoverable. Are you sure to delete?`,
      [
        {
          text: 'Delete',
          onPress: () => deleteCompanyQuery.mutate(companyItem.companyId),
        },
        {
          text: 'Cancel',
          style: 'destructive',
        },
      ],
    );
  };
  const handlePressEditIcon = (e: GestureResponderEvent) => {
    e.stopPropagation();
    navigation.navigate('EditCompany', {edittedCompany: companyItem});
  };
  return {
    showToggleMenu,
    setShowToggleMenu,
    isDeletingCompany,
    handlePressExpandIcon,
    handlePressDeleteIcon,
    handlePressEditIcon,
  };
};

export default useCompanyDisplayItem;

const styles = StyleSheet.create({});
