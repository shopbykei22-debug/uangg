import { formatRupiah } from '@/lib/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { BudgetProgress } from '@/lib/calc';

interface BudgetCardProps {
  progress: BudgetProgress;
  onClick?: () => void;
}

export function BudgetCard({ progress, onClick }: BudgetCardProps) {
  const { budget, category, used, remaining, percentage, daysLeft, recommendedDaily } = progress;

  return (
    <button
      onClick={onClick}
      className="w-full text-left card-pink p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-xl">
          {budget.icon}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#171717]">{budget.name}</p>
          <p className="text-xs text-[#6B6B6B]">Sisa {daysLeft} hari</p>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <p className="text-lg font-extrabold text-[#171717]">{formatRupiah(used)}</p>
        <p className="text-sm font-semibold text-[#6B6B6B]">/ {formatRupiah(budget.amount)}</p>
      </div>

      <ProgressBar percentage={percentage} exceeded={remaining < 0} />

      <div className="flex justify-between mt-2">
        <span className="text-xs font-semibold text-pinkfanta-500">
          Sisa budget {formatRupiah(remaining)}
        </span>
        {daysLeft > 0 && recommendedDaily > 0 && (
          <span className="text-xs font-semibold text-[#6B6B6B]">
            ~{formatRupiah(recommendedDaily)}/hari
          </span>
        )}
      </div>
    </button>
  );
}
