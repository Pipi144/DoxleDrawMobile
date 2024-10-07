import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {usePrevSessionStore} from '../GeneralStore/usePrevSessionStore';
import {TDoxleBottomTabStack, TDoxleRootStack} from './RouteTypes';
import {useDOXLETheme} from '../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Inbox from '../components/content/Inbox/Inbox';
import AddCompanyScreen from '../components/content/AddCompanyScreen/AddCompanyScreen';
import EditCompanyScreen from '../components/content/EditCompanyScreen/EditCompanyScreen';
import Inventory from '../components/content/Inventory/Inventory';
import {useOrientation} from '../Providers/OrientationContext';
import {
  BookingTabIcon,
  BudgetTabIcon,
  ChecklistTabIcon,
  DrawingTabIcon,
  PricebookTabIcon,
} from './RouteIcons';
import DoxleCustomTabBar from './DoxleCustomTabBar';
import DrawingRouteStack from '../components/content/Projects/Components/ProjectDrawings/Routes/DrawingRoute';
import QARouteStack from '../components/content/Projects/Components/ProjectQA/Routes/ProjectQARoutes';
import BudgetRoutes from '../components/content/Projects/Components/ProjectBudget/Routes/BudgetRoutes';
import {DoxleFolderIcon} from '../RootAppIcons';
import ProjectFilesRoute from '../components/content/Projects/Components/ProjectFile/Routes/ProjectFilesRoute';
import PricebookRoutes from '../components/content/Projects/Components/ProjectPricebook/PricebookRoute/PricebookRoutes';
import NoteRoutes from '../components/content/Projects/Components/ProjectNote/Routes/NoteRoutes';
import IonIcon from 'react-native-vector-icons/Ionicons';
import QRLogRoute from '../components/content/QRLog/QRLogRoutes/QRLogRoute';
import DoxleVideoViewer from '../components/DesignPattern/DoxleVideoViewer/DoxleVideoViewer';
import ProjectBookingCalendarRoutes from '../components/content/Projects/Components/ProjectBookingCalendar/ProjectBookingCalendarRoutes/ProjectBookingCalendarRoutes';
import ContactRoutes from '../components/content/Projects/Components/ProjectContacts/Routes/ContactRoutes';
import CompanyFileRoute from '../components/content/Files/Routes/CompanyFileRoute';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../components/content/Home/Home';
import DoxleTopMenu from '../components/content/DoxleTopMenu/DoxleTopMenu';
import AppModalHeader from '../components/content/AppModalHeader/AppModalHeader';
const Tab = createBottomTabNavigator<TDoxleBottomTabStack>();
const RootStack = createNativeStackNavigator<TDoxleRootStack>();
type Props = {};

const RootAppRouting = (props: Props) => {
  const {THEME_COLOR, staticMenuColor} = useDOXLETheme();
  const {deviceSize} = useOrientation();
  const {prevSession} = usePrevSessionStore(state => ({
    prevSession: state.prevSession,
  }));

  return (
    // <Tab.Navigator
    //   initialRouteName={prevSession?.lastAppTab ?? 'Drawings'}
    //   tabBar={props => <DoxleCustomTabBar {...props} />}
    //   screenOptions={({route, navigation}) => ({
    //     headerShown: false,
    //     tabBarStyle: {
    //       backgroundColor: staticMenuColor.staticBg,
    //       paddingBottom: deviceSize.insetBottom + 30,
    //     },
    //     freezeOnBlur: true,
    //     unmountOnBlur: true,
    //   })}>
    //   {DOXLE_BOTTOM_TAB_STACK_LIST.map((tabItem, idx) => (
    //     <Tab.Screen
    //       name={tabItem}
    //       key={idx}
    //       component={
    //         tabItem === 'Drawings'
    //           ? DrawingRouteStack
    //           : tabItem === 'Bookings'
    //           ? ProjectBookingCalendarRoutes
    //           : tabItem === 'Actions'
    //           ? Inbox
    //           : tabItem === 'Inventory'
    //           ? Inventory
    //           : tabItem === 'AddCompany'
    //           ? AddCompanyScreen
    //           : tabItem === 'EditCompany'
    //           ? EditCompanyScreen
    //           : tabItem === 'Pricebook'
    //           ? PricebookRoutes
    //           : tabItem === 'Notes'
    //           ? NoteRoutes
    //           : tabItem === 'QR'
    //           ? QRLogRoute
    //           : tabItem === 'CompanyVideoViewer'
    //           ? DoxleVideoViewer
    //           : tabItem === 'Contacts'
    //           ? ContactRoutes
    //           : tabItem === 'FilesCompany'
    //           ? CompanyFileRoute
    //           : tabItem === 'Checklist'
    //           ? QARouteStack
    //           : () => null
    //       }
    //     />
    //   ))}
    // </Tab.Navigator>

    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{
          freezeOnBlur: true,
          header: DoxleTopMenu,
        }}
      />

      <RootStack.Group
        screenOptions={{
          presentation: 'containedModal',
          header: AppModalHeader,
        }}>
        <RootStack.Screen name="BudgetRoute" component={BudgetRoutes} />
        <RootStack.Screen name="FileRoute" component={ProjectFilesRoute} />
        <RootStack.Screen name="ActionRoute" component={QARouteStack} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default RootAppRouting;

const styles = StyleSheet.create({});

export const getTabIcon = (
  routeName: keyof TDoxleBottomTabStack,
  selected: boolean,
) => {
  const {staticMenuColor, THEME_COLOR} = useDOXLETheme();
  switch (routeName) {
    case 'Drawings':
      return (
        <DrawingTabIcon
          staticColor={
            selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'
          }
          themeColor={THEME_COLOR}
        />
      );
    case 'Budgets':
      return (
        <BudgetTabIcon
          staticColor={
            selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'
          }
          themeColor={THEME_COLOR}
        />
      );
    case 'Bookings':
      return (
        <BookingTabIcon
          staticColor={
            selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'
          }
          themeColor={THEME_COLOR}
        />
      );
    case 'Checklist':
      return (
        <ChecklistTabIcon
          staticColor={
            selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'
          }
          themeColor={THEME_COLOR}
        />
      );
    case 'Files':
      return (
        <DoxleFolderIcon
          staticColor={
            selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'
          }
          containerStyle={{
            width: 30,
          }}
        />
      );
    case 'Pricebook':
      return (
        <PricebookTabIcon
          staticColor={
            selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'
          }
          containerStyle={{
            width: 20,
          }}
          themeColor={THEME_COLOR}
        />
      );
    case 'Notes':
      return (
        <IonIcon
          name="document-text-outline"
          size={24}
          color={selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'}
        />
      );
    case 'QR':
      return (
        <IonIcon
          name="qr-code-outline"
          size={24}
          color={selected ? staticMenuColor.staticWhiteFontColor : '#9EA6D7'}
        />
      );
    default:
      return <></>;
  }
};
