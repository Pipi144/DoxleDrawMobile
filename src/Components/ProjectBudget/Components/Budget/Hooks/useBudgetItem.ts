// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {LightDocket} from '../../../../../Models/docket';
import {useDOXLETheme} from '../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../../Providers/OrientationContext';
import {areColorsSimilar} from '../../../../../Utilities/FunctionUtilities';

type Props = {budgetItem: LightDocket};

const useBudgetItem = ({budgetItem}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const textSizeWidth: Record<
    keyof Pick<
      LightDocket,
      'docketName' | 'costBudget' | 'costActual' | 'costXero' | 'costRunning'
    >,
    number
  > = {
    docketName: deviceType === 'Tablet' ? 380 : 290,
    costBudget: deviceType === 'Tablet' ? 260 : 180,
    costActual: deviceType === 'Tablet' ? 260 : 180,
    costXero: deviceType === 'Tablet' ? 260 : 180,
    costRunning: deviceType === 'Tablet' ? 260 : 180,
  };
  const convertedStatusColor = areColorsSimilar(
    budgetItem.statusColor,
    THEME_COLOR.primaryContainerColor,
  )
    ? THEME_COLOR.primaryFontColor
    : budgetItem.statusColor;
  const isOverBudget = Boolean(
    !budgetItem.costActual ||
      !budgetItem.costBudget ||
      (budgetItem.costActual &&
        budgetItem.costBudget &&
        parseFloat(budgetItem.costActual) >= parseFloat(budgetItem.costBudget)),
  );
  return {convertedStatusColor, textSizeWidth, isOverBudget};
};

export default useBudgetItem;
