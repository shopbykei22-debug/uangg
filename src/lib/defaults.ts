import type { AppData, Category, Account } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-jajan', name: 'Uang Jajan', icon: '🍜', type: 'expense', order: 0 },
  { id: 'cat-dadakan', name: 'Uang Dadakan', icon: '🚨', type: 'expense', order: 1 },
  { id: 'cat-bisnis', name: 'Uang Bisnis', icon: '💼', type: 'expense', order: 2 },
  { id: 'cat-ortu', name: 'Uang untuk Ortu', icon: '👨‍👩‍👧', type: 'expense', order: 3 },
  { id: 'cat-rumah', name: 'Rumah', icon: '🏠', type: 'expense', order: 4 },
  { id: 'cat-belanja', name: 'Belanja', icon: '🛍️', type: 'expense', order: 5 },
  { id: 'cat-makan', name: 'Makan', icon: '🍽️', type: 'expense', order: 6 },
  { id: 'cat-ngopi', name: 'Ngopi & Milktea', icon: '☕', type: 'expense', order: 7 },
  { id: 'cat-transport', name: 'Transport', icon: '🚗', type: 'expense', order: 8 },
  { id: 'cat-kesehatan', name: 'Kesehatan', icon: '💊', type: 'expense', order: 9 },
  { id: 'cat-pendidikan', name: 'Pendidikan', icon: '📚', type: 'expense', order: 10 },
  { id: 'cat-selfcare', name: 'Self Care', icon: '🧖‍♀️', type: 'expense', order: 11 },
  { id: 'cat-hiburan', name: 'Hiburan', icon: '🎬', type: 'expense', order: 12 },
  { id: 'cat-liburan', name: 'Liburan', icon: '✈️', type: 'expense', order: 13 },
  { id: 'cat-hadiah', name: 'Hadiah', icon: '🎁', type: 'expense', order: 14 },
  { id: 'cat-tabungan', name: 'Tabungan', icon: '🐷', type: 'expense', order: 15 },
  { id: 'cat-lainnya', name: 'Lainnya', icon: '📦', type: 'expense', order: 16 },
  { id: 'cat-salary', name: 'Gaji', icon: '💰', type: 'income', order: 100 },
  { id: 'cat-business', name: 'Bisnis', icon: '📈', type: 'income', order: 101 },
  { id: 'cat-freelance', name: 'Freelance', icon: '💻', type: 'income', order: 102 },
  { id: 'cat-gift', name: 'Hadiah', icon: '🎁', type: 'income', order: 103 },
  { id: 'cat-refund', name: 'Refund', icon: '↩️', type: 'income', order: 104 },
  { id: 'cat-income-other', name: 'Lainnya', icon: '📦', type: 'income', order: 105 },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-cash', name: 'Cash', icon: '💵', initialBalance: 500000, order: 0 },
  { id: 'acc-bca', name: 'BCA', icon: '🏦', initialBalance: 5000000, order: 1 },
  { id: 'acc-mandiri', name: 'Mandiri', icon: '🏦', initialBalance: 0, order: 2 },
  { id: 'acc-bni', name: 'BNI', icon: '🏦', initialBalance: 0, order: 3 },
  { id: 'acc-dana', name: 'DANA', icon: '📱', initialBalance: 250000, order: 4 },
  { id: 'acc-ovo', name: 'OVO', icon: '📱', initialBalance: 0, order: 5 },
  { id: 'acc-gopay', name: 'GoPay', icon: '📱', initialBalance: 0, order: 6 },
  { id: 'acc-shopeepay', name: 'ShopeePay', icon: '📱', initialBalance: 0, order: 7 },
];

export const PAYMENT_METHODS = [
  'Cash', 'Bank', 'E-Wallet', 'QRIS', 'Debit Card', 'Credit Card', 'Lainnya',
];

export const CATEGORY_ICONS = [
  '🍜', '🚨', '💼', '👨‍👩‍👧', '🏠', '🛍️', '🍽️', '☕', '🚗', '💊',
  '📚', '🧖‍♀️', '🎬', '✈️', '🎁', '🐷', '📦', '💰', '📈', '💻',
  '↩️', '📱', '🏦', '💵', '💄', '👕', '🎮', '🎵', '🐾', '🌱',
];

export const SAVINGS_GOAL_ICONS = [
  '💻', '✈️', '🚨', '📱', '💍', '📚', '🏠', '🚗', '🎁', '🐷', '🌟', '🎯',
];

export const DAILY_MESSAGES = [
  'Semangat Rieke Cantik Kelola Keuangannya!',
];

export function defaultData(): AppData {
  return {
    transactions: [],
    categories: DEFAULT_CATEGORIES,
    accounts: DEFAULT_ACCOUNTS,
    budgets: [],
    savingsGoals: [
      { id: 'goal-laptop', name: 'Nabung Laptop', icon: '💻', target: 10000000, current: 3500000 },
      { id: 'goal-liburan', name: 'Liburan', icon: '✈️', target: 5000000, current: 1200000 },
    ],
    preferences: {
      dailyBudget: 150000,
      widgetConfigs: [
        {
          id: 'widget-1',
          name: 'Widget Utama',
          size: 'medium',
          showTodayExpense: true,
          categoryIds: ['cat-jajan', 'cat-dadakan', 'cat-bisnis', 'cat-ortu'],
          showBudgetRemaining: true,
        },
      ],
    },
    version: 1,
  };
}
