import { formatRupiah } from '@/lib/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { SavingsGoal } from '@/lib/types';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onClick?: () => void;
  compact?: boolean;
}

export function SavingsGoalCard({ goal, onClick, compact }: SavingsGoalCardProps) {
  const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const remaining = goal.target - goal.current;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left card-pink p-3 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 bg-pinkfanta-100 rounded-lg border-2 border-[#171717] flex items-center justify-center text-lg">
            {goal.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#171717] truncate">{goal.name}</p>
            <p className="text-xs text-[#6B6B6B]">{Math.round(percentage)}% tercapai</p>
          </div>
        </div>
        <ProgressBar percentage={percentage} height="h-2" />
        <p className="text-xs font-bold text-pinkfanta-500 mt-1.5">
          {formatRupiah(goal.current)} / {formatRupiah(goal.target)}
        </p>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left card-pink p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-2xl">
          {goal.icon}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#171717]">{goal.name}</p>
          <p className="text-xs text-[#6B6B6B]">
            {goal.deadline ? `Target: ${new Date(goal.deadline).toLocaleDateString('id-ID')}` : 'Tanpa deadline'}
          </p>
        </div>
        <span className="text-lg font-extrabold text-pinkfanta-500">{Math.round(percentage)}%</span>
      </div>

      <ProgressBar percentage={percentage} />

      <div className="flex justify-between mt-2.5">
        <div>
          <p className="text-xs font-semibold text-[#6B6B6B]">Terkumpul</p>
          <p className="text-sm font-bold text-[#171717]">{formatRupiah(goal.current)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#6B6B6B]">Sisa</p>
          <p className="text-sm font-bold text-pinkfanta-500">{formatRupiah(remaining)}</p>
        </div>
      </div>
    </button>
  );
}
