import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AppData, Transaction, Category, Account, Budget, SavingsGoal, WidgetConfig } from './types';
import { defaultData } from './defaults';

const STORAGE_KEY = 'keuangan-rieke-v1';

interface StoreContextValue {
  data: AppData;
  // transactions
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  // categories
  addCategory: (c: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // accounts
  addAccount: (a: Omit<Account, 'id' | 'order'>) => void;
  updateAccount: (id: string, a: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  // budgets
  addBudget: (b: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  // savings goals
  addSavingsGoal: (g: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, g: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeSavings: (id: string, amount: number) => void;
  // widget
  setWidgetConfigs: (configs: WidgetConfig[]) => void;
  updateWidgetConfig: (id: string, config: Partial<WidgetConfig>) => void;
  addWidgetConfig: (config: Omit<WidgetConfig, 'id'>) => void;
  deleteWidgetConfig: (id: string) => void;
  // preferences
  setDailyBudget: (amount: number) => void;
  // utility
  resetData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as AppData;
    const base = defaultData();
    return {
      ...base,
      ...parsed,
      preferences: { ...base.preferences, ...parsed.preferences },
    };
  } catch {
    return defaultData();
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    setData((d) => ({
      ...d,
      transactions: [{ ...t, id: uid('txn'), createdAt: new Date().toISOString() }, ...d.transactions],
    }));
  }, []);

  const updateTransaction = useCallback((id: string, t: Partial<Transaction>) => {
    setData((d) => ({
      ...d,
      transactions: d.transactions.map((x) => (x.id === id ? { ...x, ...t } : x)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      transactions: d.transactions.filter((x) => x.id !== id),
    }));
  }, []);

  const addCategory = useCallback((c: Omit<Category, 'id' | 'order'>) => {
    setData((d) => ({
      ...d,
      categories: [...d.categories, { ...c, id: uid('cat'), order: d.categories.length }],
    }));
  }, []);

  const updateCategory = useCallback((id: string, c: Partial<Category>) => {
    setData((d) => ({
      ...d,
      categories: d.categories.map((x) => (x.id === id ? { ...x, ...c } : x)),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((x) => x.id !== id),
    }));
  }, []);

  const addAccount = useCallback((a: Omit<Account, 'id' | 'order'>) => {
    setData((d) => ({
      ...d,
      accounts: [...d.accounts, { ...a, id: uid('acc'), order: d.accounts.length }],
    }));
  }, []);

  const updateAccount = useCallback((id: string, a: Partial<Account>) => {
    setData((d) => ({
      ...d,
      accounts: d.accounts.map((x) => (x.id === id ? { ...x, ...a } : x)),
    }));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      accounts: d.accounts.filter((x) => x.id !== id),
    }));
  }, []);

  const addBudget = useCallback((b: Omit<Budget, 'id'>) => {
    setData((d) => ({ ...d, budgets: [...d.budgets, { ...b, id: uid('bud') }] }));
  }, []);

  const updateBudget = useCallback((id: string, b: Partial<Budget>) => {
    setData((d) => ({
      ...d,
      budgets: d.budgets.map((x) => (x.id === id ? { ...x, ...b } : x)),
    }));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setData((d) => ({ ...d, budgets: d.budgets.filter((x) => x.id !== id) }));
  }, []);

  const addSavingsGoal = useCallback((g: Omit<SavingsGoal, 'id'>) => {
    setData((d) => ({ ...d, savingsGoals: [...d.savingsGoals, { ...g, id: uid('goal') }] }));
  }, []);

  const updateSavingsGoal = useCallback((id: string, g: Partial<SavingsGoal>) => {
    setData((d) => ({
      ...d,
      savingsGoals: d.savingsGoals.map((x) => (x.id === id ? { ...x, ...g } : x)),
    }));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, savingsGoals: d.savingsGoals.filter((x) => x.id !== id) }));
  }, []);

  const contributeSavings = useCallback((id: string, amount: number) => {
    setData((d) => ({
      ...d,
      savingsGoals: d.savingsGoals.map((x) =>
        x.id === id ? { ...x, current: Math.max(0, x.current + amount) } : x
      ),
    }));
  }, []);

  const setWidgetConfigs = useCallback((configs: WidgetConfig[]) => {
    setData((d) => ({ ...d, preferences: { ...d.preferences, widgetConfigs: configs } }));
  }, []);

  const updateWidgetConfig = useCallback((id: string, config: Partial<WidgetConfig>) => {
    setData((d) => ({
      ...d,
      preferences: {
        ...d.preferences,
        widgetConfigs: d.preferences.widgetConfigs.map((x) => (x.id === id ? { ...x, ...config } : x)),
      },
    }));
  }, []);

  const addWidgetConfig = useCallback((config: Omit<WidgetConfig, 'id'>) => {
    setData((d) => ({
      ...d,
      preferences: {
        ...d.preferences,
        widgetConfigs: [...d.preferences.widgetConfigs, { ...config, id: uid('widget') }],
      },
    }));
  }, []);

  const deleteWidgetConfig = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      preferences: {
        ...d.preferences,
        widgetConfigs: d.preferences.widgetConfigs.filter((x) => x.id !== id),
      },
    }));
  }, []);

  const setDailyBudget = useCallback((amount: number) => {
    setData((d) => ({ ...d, preferences: { ...d.preferences, dailyBudget: amount } }));
  }, []);

  const resetData = useCallback(() => {
    setData(defaultData());
  }, []);

  const value: StoreContextValue = {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    addBudget,
    updateBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeSavings,
    setWidgetConfigs,
    updateWidgetConfig,
    addWidgetConfig,
    deleteWidgetConfig,
    setDailyBudget,
    resetData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
