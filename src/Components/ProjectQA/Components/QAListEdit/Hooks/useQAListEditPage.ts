import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {shallow, useShallow} from 'zustand/shallow';

import {produce} from 'immer';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {QAList} from '../../../../../Models/qa';
import {TDateISODate} from '../../../../../Models/dateFormat';
import {useAppModalHeaderStore} from '../../../../../GeneralStore/useAppModalHeaderStore';

type Props = {qaList: QAList};

const useQAListEditPage = ({qaList}: Props) => {
  const [edittedQAList, setEdittedQAList] = useState<QAList>({...qaList});
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );
  const navigation = useNavigation();
  const handleQAListTitleChange = (value: string) => {
    setEdittedQAList(prev =>
      produce(prev, draft => {
        draft.defectListTitle = value;

        return draft;
      }),
    );
  };

  const handleQAListDueDateChange = (newDate: TDateISODate | null) => {
    setEdittedQAList(prev =>
      produce(prev, draft => {
        draft.dueDate = newDate;

        return draft;
      }),
    );
  };

  const handleQAListAssigneeChange = (props: {
    assignee: string | null;
    assigneeName: string;
  }) => {
    setEdittedQAList(prev =>
      produce(prev, draft => {
        draft.assignee = props.assignee;
        draft.assigneeName = props.assigneeName;
        return draft;
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      setCustomisedPopupMenu(null);
      setOveridenRouteName(edittedQAList.defectListTitle);
      setBackBtn({
        onPress: () => navigation.goBack(),
      });
      return () => {};
    }, []),
  );

  return {
    handleQAListTitleChange,
    edittedQAList,
    handleQAListDueDateChange,
    handleQAListAssigneeChange,
  };
};

export default useQAListEditPage;

const styles = StyleSheet.create({});
