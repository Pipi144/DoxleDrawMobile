import {TQATabStack} from './QARouteType';
import ProjectQAList from '../Components/ProjectQAList/ProjectQAList';
import QAListDetail from '../Components/QAListDetail/QAListDetail';
import QADetail from '../Components/QADetail/QADetail';
import QAEditSignature from '../Components/QAListEditSignature/QAEditSignature';
import QAListEdit from '../Components/QAListEdit/QAListEdit';
import QAViewPDF from '../Components/QAViewPdf/QAViewPDF';
import QAImageMarkup from '../Components/QAImage/QAImageMarkup';
import QAViewImage from '../Components/QAViewImage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {memo, useCallback} from 'react';

import {useShallow} from 'zustand/react/shallow';
import {useFocusEffect} from '@react-navigation/native';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';
import DoxleVideoViewer from '../../DesignPattern/DoxleVideoViewer/DoxleVideoViewer';

const QAStack = createNativeStackNavigator<TQATabStack>();
const QARouteStack: React.FC = () => {
  const {THEME_COLOR, staticMenuColor} = useDOXLETheme();
  const {setOveridenRouteName, setBackBtn} = useAppModalHeaderStore(
    useShallow(state => ({
      setOveridenRouteName: state.setOveridenRouteName,

      setBackBtn: state.setBackBtn,
    })),
  );
  const {resetGeneralQAStore} = useProjectQAStore(
    useShallow(state => ({resetGeneralQAStore: state.resetGeneralQAStore})),
  );
  useFocusEffect(
    useCallback(() => {
      return () => {
        setOveridenRouteName(undefined);
        setBackBtn(null);
        resetGeneralQAStore();
      };
    }, []),
  );
  return (
    <QAStack.Navigator
      initialRouteName={'RootQA'}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME_COLOR.primaryContainerColor,
        },
      }}>
      <QAStack.Screen name="RootQA" component={ProjectQAList} />

      <QAStack.Screen name="QAListDetails" component={QAListDetail} />

      <QAStack.Screen name="QAItemDetails" component={QADetail} />
      <QAStack.Screen
        name="QAViewImage"
        component={QAViewImage}
        options={{
          headerShown: false,
          presentation: 'containedModal',
          gestureEnabled: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: staticMenuColor.staticBackdrop,
          },
        }}
      />
      <QAStack.Screen
        name="QAEditSignature"
        options={{
          gestureEnabled: true,
        }}
        component={QAEditSignature}
      />

      <QAStack.Screen name="QAListEdit" component={QAListEdit} />

      <QAStack.Screen name="QAExportPDF" component={QAViewPDF} />

      <QAStack.Screen
        name="QAMarkup"
        component={QAImageMarkup}
        options={{
          headerShown: false,
          presentation: 'containedModal',
          gestureEnabled: false,
          animation: 'fade',
        }}
      />
      <QAStack.Screen
        name="QAViewVideo"
        component={DoxleVideoViewer}
        options={{
          headerShown: false,
          presentation: 'containedModal',
          gestureEnabled: false,
          animation: 'fade',
        }}
      />
    </QAStack.Navigator>
  );
};
export default memo(QARouteStack);
