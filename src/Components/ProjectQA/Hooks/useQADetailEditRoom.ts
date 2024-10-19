import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import useGetRoomList from '../../../../../../CustomHooks/GetQueryDataHooks/useGetRoomList';
import {useProjectStore} from '../../../Store/useProjectStore';
import {useShallow} from 'zustand/react/shallow';
import {useNavigationMenuStore} from '../../../../../../GeneralStore/useNavigationMenuStore';
import useThrottlingSearch from '../../../../../../CustomHooks/useThrottlingSearch';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import {useQADetailContext} from '../Components/QADetail/QADetail';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {produce} from 'immer';
import {IProjectRoom} from '../../../../../../Models/location';
import {useDisclose} from 'native-base';

type Props = {};

const useQADetailEditRoom = () => {
  const [searchRoomInput, setSearchRoomInput] = useState('');

  const selectedProject = useProjectStore(
    useShallow(state => state.selectedProject),
  );

  const {searchThrottleValue} = useThrottlingSearch({
    controlledValue: searchRoomInput,
    delayTime: 400,
  });
  const roomQuery = useGetRoomList({
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
          draft.room = qa.room;
          draft.roomName = qa.roomName;
        }),
      ),
  });

  const handleUpdateQARoom = useCallback((room: IProjectRoom) => {
    updateQAQuery.mutate({
      room: room.roomId,
      defectId: edittedQA.defectId,
    });
    onClose();
  }, []);
  return {
    ...roomQuery,
    handleUpdateQARoom,
    searchRoomInput,
    setSearchRoomInput,
    edittedQA,
    isUpdatingRoom: updateQAQuery.isLoading,
    isOpen,
    onClose,
    onOpen,
  };
};

export default useQADetailEditRoom;

const styles = StyleSheet.create({});
