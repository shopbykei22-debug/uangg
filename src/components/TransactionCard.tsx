import { formatRupiah, relativeDateLabel } from '@/lib/format';
import type { Transaction, Category, Account } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  category?: Category;
  account?: Account;
  toAccount?: Account;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TransactionCard({
  transaction,
  category,
  account,
  toAccount,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  const isTransfer = transaction.type === 'transfer';
  const sign = isIncome ? '+' : isTransfer ? '↔' : '-';
  const colorClass = isIncome ? 'text-green-600' : isTransfer ? 'text-blue-500' : 'text-red-500';

  const icon = isTransfer ? '🔄' : category?.icon ?? '📦';
  const label = isTransfer
    ? `${account?.name ?? ''} → ${toAccount?.name ?? ''}`
    : category?.name ?? 'Lainnya';

  return (
    <div className="group flex items-center gap-3 p-3 bg-white border-2 border-[#171717] rounded-xl shadow-offset-sm">
      <div className="w-10 h-10 bg-pinkfanta-100 rounded-lg border-2 border-[#171717] flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-[#171717] truncate">
          {transaction.description || label}
        </p>
        <p className="text-xs text-[#6B6B6B] truncate">
          {label} · {transaction.time}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${colorClass}`}>
          {sign} {formatRupiah(transaction.amount)}
        </p>
        <p className="text-[10px] text-[#6B6B6B]">{transaction.paymentMethod}</p>
      </div>
      {onEdit && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-pinkfanta-50 border border-[#171717] flex items-center justify-center active:scale-90 transition"
            aria-label="Edit"
          >
            <Pencil size={12} className="text-pinkfanta-500" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg bg-red-50 border border-[#171717] flex items-center justify-center active:scale-90 transition"
            aria-label="Hapus"
          >
            <Trash2 size={12} className="text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
