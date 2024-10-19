import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TBudgetTabStack} from './BudgetRouteType';
import Budget from '../Components/Budget/Budget';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

const BudgetStack = createNativeStackNavigator<TBudgetTabStack>();
export default function BudgetRoutes() {
  const {THEME_COLOR} = useDOXLETheme();
  return (
    <BudgetStack.Navigator
      initialRouteName={'BudgetTable'}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME_COLOR.primaryContainerColor,
        },
      }}>
      <BudgetStack.Screen name="BudgetTable" component={Budget} />
      {/* <BudgetStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'fullScreenModal',
          gestureEnabled: false,
          animation: 'fade',
        }}>
        <BudgetStack.Screen
          name="EditBudget"
          component={EditBudgetDocketPage}
        />
      </BudgetStack.Group> */}
    </BudgetStack.Navigator>
  );
}
