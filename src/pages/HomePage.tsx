import { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  getTotalBalance,
  getTotals,
  filterByPeriod,
  getTodayExpense,
  getCategorySpending,
  getBudgetProgress,
  getMonthlySummary,
  getDailyMessage,
} from '@/lib/calc';
import { formatRupiah } from '@/lib/format';
import type { TransactionType } from '@/lib/types';
import { BalanceCard } from '@/components/cards/BalanceCard';
import { QuickActionButtons } from '@/components/cards/QuickActionButtons';
import { TodayExpenseCard } from '@/components/cards/TodayExpenseCard';
import { DailyMessageCard } from '@/components/cards/DailyMessageCard';
import { ExpenseCategoryCard } from '@/components/cards/ExpenseCategoryCard';
import { BudgetCard } from '@/components/cards/BudgetCard';
import { SavingsGoalCard } from '@/components/cards/SavingsGoalCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChevronRight, Settings, Sparkles } from 'lucide-react';
import type { Page } from '@/components/BottomNavigation';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onAddTransaction: (type: TransactionType, categoryId?: string) => void;
  onOpenSettings: () => void;
}

export function HomePage({ onNavigate, onAddTransaction, onOpenSettings }: HomePageProps) {
  const { data } = useStore();
  const [categoryPeriod, setCategoryPeriod] = useState<'today' | 'week' | 'month'>('month');

  const totalBalance = getTotalBalance(data);
  const monthTxns = filterByPeriod(data.transactions, 'month');
  const monthTotals = getTotals(monthTxns);
  const todayExpense = getTodayExpense(data);
  const categorySpendings = getCategorySpending(data, categoryPeriod).filter((s) => s.spent > 0 || s.budget > 0);
  const budgetProgress = getBudgetProgress(data);
  const monthlySummary = getMonthlySummary(data);

  const topCategories = categorySpendings.slice(0, 4);
  const topBudgets = budgetProgress.slice(0, 2);
  const topGoals = data.savingsGoals.slice(0, 2);

  const topSpendingCat = categorySpendings.sort((a, b) => b.spent - a.spent)[0];

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Hai, Rieke! 👋</h1>
          <p className="text-sm text-[#6B6B6B] font-medium">Yuk catat keuanganmu hari ini ✨</p>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 bg-white border-2 border-[#171717] rounded-xl shadow-offset-sm flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          aria-label="Pengaturan"
        >
          <Settings size={18} className="text-pinkfanta-500" />
        </button>
      </div>

      {/* Balance Summary */}
      <BalanceCard
        totalBalance={totalBalance}
        income={monthTotals.income}
        expense={monthTotals.expense}
        transfer={monthTotals.transfer}
      />

      {/* Quick Actions */}
      <QuickActionButtons onAction={(t) => onAddTransaction(t)} />

      {/* Today's Expense */}
      <TodayExpenseCard todayExpense={todayExpense} dailyBudget={data.preferences.dailyBudget} />

      {/* Daily Message */}
      <DailyMessageCard />

      {/* Expense Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-[#171717]">Pengeluaran Saya</h2>
          <button
            onClick={() => onNavigate('categories')}
            className="text-sm font-bold text-pinkfanta-500 flex items-center gap-1 active:scale-95 transition"
          >
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>

        {/* Period selector */}
        <div className="flex gap-2 mb-3">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setCategoryPeriod(p)}
              className={`px-3 py-1.5 rounded-lg border-2 border-[#171717] text-xs font-bold transition-all ${
                categoryPeriod === p ? 'bg-pinkfanta-500 text-white' : 'bg-white text-[#6B6B6B]'
              }`}
            >
              {p === 'today' ? 'Hari Ini' : p === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
            </button>
          ))}
        </div>

        {topCategories.length === 0 ? (
          <div className="card-pink p-4">
            <p className="text-sm text-[#6B6B6B] text-center">
              Belum ada pengeluaran 🌸
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topCategories.map((s) => (
              <ExpenseCategoryCard
                key={s.category.id}
                spending={s}
                onClick={() => onAddTransaction('expense', s.category.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Budgeting Challenge */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-[#171717]">Budgeting Challenge</h2>
          <button
            onClick={() => onNavigate('budgets')}
            className="text-sm font-bold text-pinkfanta-500 flex items-center gap-1 active:scale-95 transition"
          >
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>
        {topBudgets.length === 0 ? (
          <div className="card-pink p-4">
            <p className="text-sm text-[#6B6B6B] text-center">
              Belum ada budget challenge. Yuk buat! 💪
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {topBudgets.map((bp) => (
              <BudgetCard key={bp.budget.id} progress={bp} onClick={() => onNavigate('budgets')} />
            ))}
          </div>
        )}
      </div>

      {/* Savings Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-[#171717]">Target Tabungan</h2>
          <button
            onClick={() => onNavigate('savings')}
            className="text-sm font-bold text-pinkfanta-500 flex items-center gap-1 active:scale-95 transition"
          >
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>
        {topGoals.length === 0 ? (
          <div className="card-pink p-4">
            <p className="text-sm text-[#6B6B6B] text-center">
              Belum ada target tabungan 🐷
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topGoals.map((g) => (
              <SavingsGoalCard key={g.id} goal={g} compact onClick={() => onNavigate('savings')} />
            ))}
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      <div className="card-pink p-4">
        <h2 className="text-lg font-extrabold text-[#171717] mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-pinkfanta-500" />
          Ringkasan Bulan Ini
        </h2>
        <div className="space-y-2">
          <SummaryRow label="Pemasukan" value={monthlySummary.income} color="text-green-600" />
          <SummaryRow label="Pengeluaran" value={monthlySummary.expense} color="text-red-500" />
          <SummaryRow label="Ditabung" value={monthlySummary.income - monthlySummary.expense} color="text-pinkfanta-500" />
          {topSpendingCat && (
            <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-pinkfanta-200">
              <span className="text-sm font-semibold text-[#6B6B6B]">Top spending</span>
              <span className="text-sm font-bold text-[#171717]">
                {topSpendingCat.category.icon} {topSpendingCat.category.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Empty state CTA */}
      {data.transactions.length === 0 && (
        <EmptyState
          emoji="🌸"
          title="Belum ada transaksi"
          subtitle="Yuk mulai catat keuanganmu hari ini."
          action={
            <button
              onClick={() => onAddTransaction('expense')}
              className="btn-pink px-5 py-2.5"
            >
              + Catat Transaksi
            </button>
          }
        />
      )}
    </div>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-[#6B6B6B]">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{formatRupiah(value)}</span>
    </div>
  );
}
