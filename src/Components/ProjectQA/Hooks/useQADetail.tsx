import {StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

import {produce} from 'immer';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {QA, TQAStatus} from '../../../../../../Models/qa';
import {TDateISODate} from '../../../../../../Models/dateFormat';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {useNavigationMenuStore} from '../../../../../../GeneralStore/useNavigationMenuStore';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {QASelectedAssignee} from './useEditAssigneeModal';
import {useShallow} from 'zustand/react/shallow';
import {useAppModalHeaderStore} from '../../../../../../GeneralStore/useAppModalHeaderStore';

type Props = {qaItem: QA};

const useQADetail = ({qaItem}: Props) => {
  const [edittedQA, setEdittedQA] = useState<QA>({...qaItem});
  const {handleCachingQA} = useCacheQAContext();
  const {setShowEditAssigneeQAModal} = useProjectQAStore(
    useShallow(state => ({
      setShowEditAssigneeQAModal: state.setShowEditAssigneeQAModal,
    })),
  );
  const navigation = useNavigation();
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );
  const {company} = useCompany();
  const {accessToken} = useAuth();
  const {showNotification} = useNotification();

  const handleQADescriptionChange = useCallback((value: string) => {
    setEdittedQA(prev =>
      produce(prev, draft => {
        draft.description = value;
      }),
    );
  }, []);
  const handleDueDateChange = useCallback((newDate: TDateISODate | null) => {
    setEdittedQA(prev =>
      produce(prev, draft => {
        draft.dueDate = newDate;
      }),
    );
  }, []);

  const handleStatusChange = useCallback((status: TQAStatus) => {
    setEdittedQA(prev =>
      produce(prev, draft => {
        draft.status = status;
      }),
    );
  }, []);
  const handleAssigneeChange = useCallback(
    (props: {assignee: string | null; assigneeName: string}) => {
      setEdittedQA(prev =>
        produce(prev, draft => {
          draft.assignee = props.assignee;
          draft.assigneeName = props.assigneeName;
        }),
      );
    },
    [],
  );
  const onUpdateSuccessCb = (edittedQA: QA) => {
    handleAssigneeChange({
      assignee: edittedQA.assignee,
      assigneeName: edittedQA.assigneeName,
    });
  };
  const updateQAQuery = QAQueryAPI.useUpdateQAQuery({
    company,
    accessToken,
    showNotification,
    onSuccessCB: onUpdateSuccessCb,
  });

  const handleUpdateAssignee = (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => {
    if (selectedAssignee)
      updateQAQuery.mutate({
        defectId: edittedQA.defectId,
        assignee: selectedAssignee.assigneeId,
        assigneeName: selectedAssignee.assigneeName,
      });
    else
      updateQAQuery.mutate({
        defectId: edittedQA.defectId,
        assignee: null,
        assigneeName: '',
      });
  };
  const handleCloseAddAssigneeModal = () => {
    setShowEditAssigneeQAModal(false);
  };
  const handleNavBack = () => {
    navigation.goBack();
  };
  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(null);
      setOveridenRouteName('Checklist Detail');
      setBackBtn({
        onPress: handleNavBack,
      });

      return () => {};
    }, []),
  );

  useEffect(() => {
    handleCachingQA({...edittedQA, isNew: false});

    return () => {};
  }, []);

  return {
    edittedQA,
    handleQADescriptionChange,
    handleDueDateChange,
    handleAssigneeChange,
    handleStatusChange,
    handleUpdateAssignee,
    handleCloseAddAssigneeModal,
    setEdittedQA,
  };
};

export default useQADetail;

const styles = StyleSheet.create({});
