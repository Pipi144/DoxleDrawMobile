import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import useThrottlingSearch from '../../../../../CustomHooks/useThrottlingSearch';
import useGetFloorList from '../../../../../CustomHooks/GetQueryDataHooks/useGetFloorList';
import {useQADetailContext} from '../QADetail';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {produce} from 'immer';
import {IProjectFloor} from '../../../../../Models/location';

type Props = {};

const useQADetailEditFloor = () => {
  const [searchFloorInput, setSearchFloorInput] = useState('');
  const [openFloorPopover, setOpenFloorPopover] = useState(false);
  const {selectedProject, company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();
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

  const {setEdittedQA, edittedQA} = useQADetailContext();
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
    setOpenFloorPopover(false);
  }, []);
  return {
    ...roomQuery,
    handleUpdateQAFloor,
    searchFloorInput,
    setSearchFloorInput,
    edittedQA,
    isUpdatingFloor: updateQAQuery.isPending,
    openFloorPopover,
    setOpenFloorPopover,
  };
};

export default useQADetailEditFloor;

const styles = StyleSheet.create({});
