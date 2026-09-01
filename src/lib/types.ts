export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: string;
  name: string;
  icon: string; // emoji
  type: TransactionType | 'both';
  budget?: number; // optional monthly budget
  description?: string;
  hidden?: boolean;
  order: number;
  custom?: boolean;
}

export interface Account {
  id: string;
  name: string;
  icon: string;
  initialBalance: number;
  order: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId?: string;
  accountId?: string;
  toAccountId?: string; // for transfers
  date: string; // ISO date string
  time: string; // HH:mm
  paymentMethod: string;
  description: string;
  notes?: string;
  receipt?: string; // data URL
  createdAt: string;
}

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  startDate: string;
  endDate: string;
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
  icon: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
  deadline?: string;
  color?: string;
}

export interface WidgetConfig {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  showTodayExpense: boolean;
  categoryIds: string[];
  showBudgetRemaining: boolean;
}

export interface AppPreferences {
  dailyBudget: number;
  widgetConfigs: WidgetConfig[];
}

export interface AppData {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  preferences: AppPreferences;
  version: number;
}
