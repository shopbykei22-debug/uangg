import { formatRupiah } from '@/lib/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { CategorySpending } from '@/lib/calc';

interface ExpenseCategoryCardProps {
  spending: CategorySpending;
  onClick?: () => void;
  compact?: boolean;
}

export function ExpenseCategoryCard({ spending, onClick, compact }: ExpenseCategoryCardProps) {
  const { category, spent, budget, remaining, percentage } = spending;
  const hasBudget = budget > 0;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 bg-white border-2 border-[#171717] rounded-xl shadow-offset-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-left"
      >
        <div className="w-10 h-10 bg-pinkfanta-100 rounded-lg border-2 border-[#171717] flex items-center justify-center text-xl shrink-0">
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#171717] truncate">{category.name}</p>
          {hasBudget && (
            <p className="text-xs text-[#6B6B6B]">Sisa {formatRupiah(remaining)}</p>
          )}
        </div>
        <p className="font-bold text-sm text-pinkfanta-500">{formatRupiah(spent)}</p>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left card-pink p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-xl">
          {category.icon}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#171717]">{category.name}</p>
          {hasBudget && (
            <p className="text-xs text-[#6B6B6B]">Budget {formatRupiah(budget)}</p>
          )}
        </div>
        <p className="font-extrabold text-[#171717]">{formatRupiah(spent)}</p>
      </div>

      {hasBudget && (
        <>
          <ProgressBar percentage={percentage} exceeded={remaining < 0} />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs font-semibold text-[#6B6B6B]">
              {remaining >= 0 ? `Sisa ${formatRupiah(remaining)}` : 'Lebih dari budget'}
            </span>
            <span className="text-xs font-semibold text-[#6B6B6B]">
              {Math.round(percentage)}%
            </span>
          </div>
        </>
      )}
    </button>
  );
}
