import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useQADetailContext} from '../QADetail';
import {produce} from 'immer';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import useThrottlingSearch from '../../../../../CustomHooks/useThrottlingSearch';
import useGetRoomList from '../../../../../CustomHooks/GetQueryDataHooks/useGetRoomList';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {IProjectRoom} from '../../../../../Models/location';

type Props = {};

const useQADetailEditRoom = () => {
  const [searchRoomInput, setSearchRoomInput] = useState('');
  const [openRoomPopover, setOpenRoomPopover] = useState(false);
  const {company, selectedProject} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();
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
  const {setEdittedQA, edittedQA} = useQADetailContext();

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
    setOpenRoomPopover(false);
  }, []);
  return {
    ...roomQuery,
    handleUpdateQARoom,
    searchRoomInput,
    setSearchRoomInput,
    edittedQA,
    isUpdatingRoom: updateQAQuery.isPending,
    openRoomPopover,
    setOpenRoomPopover,
  };
};

export default useQADetailEditRoom;

const styles = StyleSheet.create({});
