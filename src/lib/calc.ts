import type { AppData, Transaction, Category, Account, Budget } from './types';
import { isSameDay, isThisMonth, isThisWeek, daysRemaining } from './format';

export interface AccountBalance {
  account: Account;
  balance: number;
}

export interface CategorySpending {
  category: Category;
  spent: number;
  budget: number;
  remaining: number;
  percentage: number;
}

export interface BudgetProgress {
  budget: Budget;
  category?: Category;
  used: number;
  remaining: number;
  percentage: number;
  daysLeft: number;
  recommendedDaily: number;
}

export interface PeriodTotals {
  income: number;
  expense: number;
  transfer: number;
  balance: number;
}

export function filterByPeriod(transactions: Transaction[], period: 'today' | 'week' | 'month'): Transaction[] {
  return transactions.filter((t) => {
    if (period === 'today') return isSameDay(t.date);
    if (period === 'week') return isThisWeek(t.date);
    return isThisMonth(t.date);
  });
}

export function getTotals(transactions: Transaction[]): PeriodTotals {
  let income = 0, expense = 0, transfer = 0;
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount;
    else if (t.type === 'expense') expense += t.amount;
    else transfer += t.amount;
  }
  return { income, expense, transfer, balance: income - expense };
}

export function getTotalBalance(data: AppData): number {
  const totals = getTotals(data.transactions);
  const initialSum = data.accounts.reduce((s, a) => s + a.initialBalance, 0);
  return initialSum + totals.balance;
}

export function getAccountBalances(data: AppData): AccountBalance[] {
  return data.accounts.map((account) => {
    let balance = account.initialBalance;
    for (const t of data.transactions) {
      if (t.type === 'income' && t.accountId === account.id) balance += t.amount;
      if (t.type === 'expense' && t.accountId === account.id) balance -= t.amount;
      if (t.type === 'transfer') {
        if (t.accountId === account.id) balance -= t.amount;
        if (t.toAccountId === account.id) balance += t.amount;
      }
    }
    return { account, balance };
  });
}

export function getCategorySpending(
  data: AppData,
  period: 'today' | 'week' | 'month' = 'month'
): CategorySpending[] {
  const periodTxns = filterByPeriod(data.transactions, period);
  const expenseCategories = data.categories.filter(
    (c) => c.type === 'expense' || c.type === 'both'
  );

  return expenseCategories
    .filter((c) => !c.hidden)
    .map((category) => {
      const spent = periodTxns
        .filter((t) => t.type === 'expense' && t.categoryId === category.id)
        .reduce((s, t) => s + t.amount, 0);
      const budget = category.budget ?? 0;
      const remaining = budget - spent;
      const percentage = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
      return { category, spent, budget, remaining, percentage };
    })
    .sort((a, b) => a.category.order - b.category.order);
}

export function getBudgetProgress(data: AppData): BudgetProgress[] {
  return data.budgets.map((budget) => {
    const category = data.categories.find((c) => c.id === budget.categoryId);
    const used = data.transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.categoryId === budget.categoryId &&
          t.date >= budget.startDate &&
          t.date <= budget.endDate
      )
      .reduce((s, t) => s + t.amount, 0);
    const remaining = budget.amount - used;
    const percentage = budget.amount > 0 ? Math.min(100, (used / budget.amount) * 100) : 0;
    const daysLeft = daysRemaining(budget.endDate);
    const recommendedDaily = daysLeft > 0 ? remaining / daysLeft : 0;
    return { budget, category, used, remaining, percentage, daysLeft, recommendedDaily };
  });
}

export function getTodayExpense(data: AppData): number {
  return data.transactions
    .filter((t) => t.type === 'expense' && isSameDay(t.date))
    .reduce((s, t) => s + t.amount, 0);
}

export function getTodayExpenseByCategory(data: AppData): Record<string, number> {
  const result: Record<string, number> = {};
  for (const t of data.transactions) {
    if (t.type === 'expense' && isSameDay(t.date) && t.categoryId) {
      result[t.categoryId] = (result[t.categoryId] ?? 0) + t.amount;
    }
  }
  return result;
}

export function getMonthlySummary(data: AppData): PeriodTotals {
  return getTotals(filterByPeriod(data.transactions, 'month'));
}

export function getExpenseBreakdown(data: AppData, period: 'today' | 'week' | 'month' | 'year' = 'month') {
  const txns = period === 'year'
    ? data.transactions.filter((t) => {
        const now = new Date();
        const d = new Date(t.date);
        return d.getFullYear() === now.getFullYear();
      })
    : filterByPeriod(data.transactions, period as 'today' | 'week' | 'month');

  const breakdown: Record<string, number> = {};
  for (const t of txns) {
    if (t.type === 'expense' && t.categoryId) {
      breakdown[t.categoryId] = (breakdown[t.categoryId] ?? 0) + t.amount;
    }
  }
  return Object.entries(breakdown)
    .map(([categoryId, amount]) => ({
      categoryId,
      category: data.categories.find((c) => c.id === categoryId),
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getInsights(data: AppData): string[] {
  const insights: string[] = [];
  const breakdown = getExpenseBreakdown(data, 'month');
  if (breakdown.length > 0) {
    const top = breakdown[0];
    if (top.category) {
      insights.push(`Pengeluaran terbesar bulan ini adalah ${top.category.name}.`);
    }
  }
  const todayExp = getTodayExpense(data);
  if (todayExp > 0) {
    insights.push(`Hari ini kamu mengeluarkan ${formatRupiahInline(todayExp)}.`);
  }
  const budgets = getBudgetProgress(data);
  for (const b of budgets) {
    if (b.remaining > 0 && b.category) {
      insights.push(`Kamu masih punya ${formatRupiahInline(b.remaining)} untuk budget ${b.budget.name}.`);
    }
  }
  if (insights.length === 0) {
    insights.push('Mulai catat transaksimu untuk dapat insight keuangan.');
  }
  return insights.slice(0, 4);
}

function formatRupiahInline(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(Math.abs(amount))}`;
}

export function getDailyMessage(): string {
  return 'Semangat Rieke Cantik Kelola Keuangannya!';
}

// --- Widget Data Layer ---
// This is the clean data layer that a native Android widget would consume.
// When packaged with Capacitor, expose this via a bridge/plugin so the
// native widget can read the same computed values.

export interface WidgetData {
  todayExpense: number;
  todayBudget: number;
  todayRemaining: number;
  budgetExceeded: boolean;
  categoryTotals: { categoryId: string; categoryName: string; icon: string; amount: number }[];
  budgetRemaining: number;
  configName: string;
  size: 'small' | 'medium' | 'large';
}

export function getWidgetData(data: AppData, configId?: string): WidgetData {
  const config = configId
    ? data.preferences.widgetConfigs.find((w) => w.id === configId)
    : data.preferences.widgetConfigs[0];

  const todayExpense = getTodayExpense(data);
  const todayBudget = data.preferences.dailyBudget;
  const todayRemaining = todayBudget - todayExpense;

  const catTotalsToday = getTodayExpenseByCategory(data);
  const selectedCategoryIds = config?.categoryIds ?? [];

  const categoryTotals = selectedCategoryIds.map((id) => {
    const cat = data.categories.find((c) => c.id === id);
    return {
      categoryId: id,
      categoryName: cat?.name ?? id,
      icon: cat?.icon ?? '📦',
      amount: catTotalsToday[id] ?? 0,
    };
  });

  return {
    todayExpense,
    todayBudget,
    todayRemaining,
    budgetExceeded: todayRemaining < 0,
    categoryTotals,
    budgetRemaining: todayRemaining,
    configName: config?.name ?? 'Widget Utama',
    size: config?.size ?? 'medium',
  };
}

export function getAllWidgetData(data: AppData): WidgetData[] {
  return data.preferences.widgetConfigs.map((w) => getWidgetData(data, w.id));
}
