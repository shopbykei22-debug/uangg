import { formatRupiah } from '@/lib/format';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface TodayExpenseCardProps {
  todayExpense: number;
  dailyBudget: number;
}

export function TodayExpenseCard({ todayExpense, dailyBudget }: TodayExpenseCardProps) {
  const remaining = dailyBudget - todayExpense;
  const percentage = dailyBudget > 0 ? (todayExpense / dailyBudget) * 100 : 0;
  const exceeded = remaining < 0;

  return (
    <div className="card-pink p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-[#6B6B6B]">Pengeluaran Hari Ini</p>
          <p className="text-2xl font-extrabold text-[#171717] mt-0.5">{formatRupiah(todayExpense)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#6B6B6B]">Budget</p>
          <p className="text-sm font-bold text-[#171717]">{formatRupiah(dailyBudget)}</p>
        </div>
      </div>

      <ProgressBar percentage={percentage} exceeded={exceeded} />

      <div className="flex items-center justify-between mt-2.5">
        {exceeded ? (
          <p className="text-sm font-bold text-red-500">
            Budget hari ini terlewati 🙈
          </p>
        ) : (
          <p className="text-sm font-bold text-pinkfanta-500">
            Sisa {formatRupiah(remaining)}
          </p>
        )}
        <span className="text-xs font-semibold text-[#6B6B6B]">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
