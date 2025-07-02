
export type RootTabsParamList = {
  Home: undefined;
  History : undefined;
  Profile: undefined;
};

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

