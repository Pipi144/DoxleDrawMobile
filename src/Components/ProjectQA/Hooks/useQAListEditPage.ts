import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {shallow} from 'zustand/shallow';

import {produce} from 'immer';
import {QAList} from '../../../../../../Models/qa';
import {TDateISODate} from '../../../../../../Models/dateFormat';
import {useProjectQAStore} from '../Store/useProjectQAStore';

type Props = {qaList: QAList};
interface QAListEditPage {
  handleQAListTitleChange: (value: string) => void;
  edittedQAList: QAList;
  handleQAListDueDateChange: (newDate: TDateISODate | null) => void;
  handleQAListAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;
}
const useQAListEditPage = ({qaList}: Props): QAListEditPage => {
  const [edittedQAList, setEdittedQAList] = useState<QAList>({...qaList});

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
  const {addQANavItem} = useProjectQAStore(
    state => ({addQANavItem: state.addQANavItem}),
    shallow,
  );
  useFocusEffect(
    useCallback(() => {
      addQANavItem({
        routeKey: 'projectQaListEditScreen',
        routeName: 'Edit QA List',
        routeParams: {qaList},
      });
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
