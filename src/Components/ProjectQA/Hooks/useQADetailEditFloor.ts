import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useProjectStore} from '../../../Store/useProjectStore';
import {useShallow} from 'zustand/react/shallow';
import useThrottlingSearch from '../../../../../../CustomHooks/useThrottlingSearch';
import useGetFloorList from '../../../../../../CustomHooks/GetQueryDataHooks/useGetFloorList';
import {useDisclose} from 'native-base';
import {useQADetailContext} from '../Components/QADetail/QADetail';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import {produce} from 'immer';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {IProjectFloor} from '../../../../../../Models/location';

type Props = {};

const useQADetailEditFloor = () => {
  const [searchFloorInput, setSearchFloorInput] = useState('');

  const selectedProject = useProjectStore(
    useShallow(state => state.selectedProject),
  );

  const {searchThrottleValue} = useThrottlingSearch({
    controlledValue: searchFloorInput,
    delayTime: 400,
  });
  const roomQuery = useGetFloorList({
    filter: {
      project: selectedProject?.projectId,
      search: searchThrottleValue,
    },
  });
  const {isOpen, onClose, onOpen} = useDisclose(false);
  const {setEdittedQA, edittedQA} = useQADetailContext();
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,
    showNotification,
    onSuccessCB: qa =>
      setEdittedQA(
        produce(draft => {
          draft.floor = qa.floor;
          draft.floorName = qa.floorName;
        }),
      ),
  });

  const handleUpdateQAFloor = useCallback((floor: IProjectFloor) => {
    updateQAQuery.mutate({
      floor: floor.floorId,
      defectId: edittedQA.defectId,
    });
    onClose();
  }, []);
  return {
    ...roomQuery,
    handleUpdateQAFloor,
    searchFloorInput,
    setSearchFloorInput,
    edittedQA,
    isUpdatingFloor: updateQAQuery.isLoading,
    isOpen,
    onClose,
    onOpen,
  };
};

export default useQADetailEditFloor;

const styles = StyleSheet.create({});
