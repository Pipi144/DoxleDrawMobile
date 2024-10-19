import {LightDocket} from '../../../../../../Models/docket';

export type TBudgetStackName = 'BudgetTable' | 'EditBudget';

export type TBudgetTabStack = {
  BudgetTable: undefined;
  EditBudget: {
    docketItem: LightDocket;
    initialTab?: 'order' | 'comment' | 'budget' | 'payment';
  };
};
