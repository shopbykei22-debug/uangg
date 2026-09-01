import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/format';
import { getTotals, filterByPeriod, getExpenseBreakdown, getInsights } from '@/lib/calc';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Lightbulb } from 'lucide-react';

type ReportPeriod = 'week' | 'month' | 'year';

export function ReportPage() {
  const { data } = useStore();
  const [period, setPeriod] = useState<ReportPeriod>('month');

  const periodTxns =
    period === 'year'
      ? data.transactions.filter((t) => {
          const now = new Date();
          const d = new Date(t.date);
          return d.getFullYear() === now.getFullYear();
        })
      : filterByPeriod(data.transactions, period);

  const totals = getTotals(periodTxns);
  const savings = totals.income - totals.expense;
  const breakdown = getExpenseBreakdown(data, period);
  const insights = getInsights(data);
  const totalExpense = totals.expense;

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#171717]">Report</h1>
        <p className="text-sm text-[#6B6B6B]">Laporan keuanganmu</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {(['week', 'month', 'year'] as ReportPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl border-2 border-[#171717] text-sm font-bold transition-all ${
              period === p ? 'bg-pinkfanta-500 text-white shadow-offset-sm' : 'bg-white text-[#6B6B6B]'
            }`}
          >
            {p === 'week' ? 'Mingguan' : p === 'month' ? 'Bulanan' : 'Tahunan'}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard icon={<TrendingUp size={18} />} label="Pemasukan" value={totals.income} color="text-green-600" />
        <SummaryCard icon={<TrendingDown size={18} />} label="Pengeluaran" value={totals.expense} color="text-red-500" />
        <SummaryCard icon={<PiggyBank size={18} />} label="Tabungan" value={savings} color="text-pinkfanta-500" />
        <SummaryCard icon={<Wallet size={18} />} label="Saldo" value={totals.balance} color="text-[#171717]" />
      </div>

      {/* Expense breakdown */}
      <div>
        <h2 className="text-lg font-extrabold text-[#171717] mb-3">Pengeluaran per Kategori</h2>
        {breakdown.length === 0 ? (
          <div className="card-pink p-4">
            <p className="text-sm text-[#6B6B6B] text-center">Belum ada pengeluaran 🌸</p>
          </div>
        ) : (
          <div className="card-pink p-4 space-y-3">
            {breakdown.map((b) => {
              const percentage = totalExpense > 0 ? (b.amount / totalExpense) * 100 : 0;
              return (
                <div key={b.categoryId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#171717]">
                      {b.category?.icon} {b.category?.name ?? 'Lainnya'}
                    </span>
                    <span className="text-sm font-bold text-pinkfanta-500">{formatRupiah(b.amount)}</span>
                  </div>
                  <ProgressBar percentage={percentage} height="h-2" />
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{Math.round(percentage)}% dari total</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-lg font-extrabold text-[#171717] mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-pinkfanta-500" />
          Insight Keuangan
        </h2>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="card-pink p-3 bg-pinkfanta-50">
              <p className="text-sm font-semibold text-[#171717]">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {periodTxns.length === 0 && (
        <EmptyState emoji="📊" title="Belum ada data" subtitle={`Belum ada transaksi ${period === 'week' ? 'minggu' : period === 'month' ? 'bulan' : 'tahun'} ini.`} />
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="card-pink p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-pinkfanta-100 rounded-lg border-2 border-[#171717] flex items-center justify-center text-pinkfanta-500">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#6B6B6B]">{label}</span>
      </div>
      <p className={`text-lg font-extrabold ${color}`}>{formatRupiah(value)}</p>
    </div>
  );
}
