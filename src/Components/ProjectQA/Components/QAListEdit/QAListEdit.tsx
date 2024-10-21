import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {LinearTransition} from 'react-native-reanimated';
import useQAListEditPage from './Hooks/useQAListEditPage';
import {StyledQAListEditPage} from './StyledComponentQAListEdit';
import QAListEditTitle from './QAListEditTitle';
import QAListEditDueDate from './QAListEditDueDate';
import QAListEditAssignee from './QAListEditAssignee';
import {TQATabStack} from '../../Routes/QARouteType';
import {
  IDOXLEThemeColor,
  useDOXLETheme,
} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {QAEditListBanner} from '../QAIcons';

type Props = {
  navigation: any;
};

const QAListEdit = ({navigation}: Props) => {
  const route = useRoute();
  const {qaList} = route.params as TQATabStack['QAListEdit'];
  const {THEME_COLOR} = useDOXLETheme();
  const {
    handleQAListTitleChange,
    edittedQAList,
    handleQAListDueDateChange,
    handleQAListAssigneeChange,
  } = useQAListEditPage({qaList});

  return (
    <StyledQAListEditPage
      layout={LinearTransition.springify().damping(16)}
      automaticallyAdjustKeyboardInsets
      automaticallyAdjustsScrollIndicatorInsets
      automaticallyAdjustContentInsets
      keyboardDismissMode="on-drag">
      <QAListEditTitle
        handleQAListTitleChange={handleQAListTitleChange}
        edittedQAList={edittedQAList}
      />

      <QAListEditDueDate
        handleQAListDueDateChange={handleQAListDueDateChange}
        edittedQAList={edittedQAList}
      />

      <QAListEditAssignee
        edittedQAList={edittedQAList}
        handleQAListAssigneeChange={handleQAListAssigneeChange}
      />
      <QAEditListBanner
        themeColor={THEME_COLOR}
        containerStyle={{
          maxWidth: 500,
          maxHeight: 500,
          width: '50%',
          alignSelf: 'center',
          marginTop: 30,
          flex: 1,
        }}
      />
    </StyledQAListEditPage>
  );
};

export default QAListEdit;

const styles = (themeColor: IDOXLEThemeColor) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      display: 'flex',
      paddingHorizontal: 14,
      backgroundColor: themeColor.primaryContainerColor,
    },
  });
