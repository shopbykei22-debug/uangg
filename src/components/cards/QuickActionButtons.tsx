import type { TransactionType } from '@/lib/types';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';

interface QuickActionButtonsProps {
  onAction: (type: TransactionType) => void;
}

export function QuickActionButtons({ onAction }: QuickActionButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <ActionButton
        icon={<ArrowDownLeft size={20} />}
        label="Pemasukan"
        onClick={() => onAction('income')}
      />
      <ActionButton
        icon={<ArrowUpRight size={20} />}
        label="Pengeluaran"
        onClick={() => onAction('expense')}
      />
      <ActionButton
        icon={<ArrowLeftRight size={20} />}
        label="Transfer"
        onClick={() => onAction('transfer')}
      />
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 py-3 bg-white border-2 border-[#171717] rounded-2xl shadow-offset-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
    >
      <div className="w-10 h-10 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-pinkfanta-500">
        {icon}
      </div>
      <span className="text-xs font-bold text-[#171717]">{label}</span>
    </button>
  );
}
