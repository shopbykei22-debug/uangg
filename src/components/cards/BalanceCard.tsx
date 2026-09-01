import { formatRupiah } from '@/lib/format';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
  income: number;
  expense: number;
  transfer: number;
}

export function BalanceCard({ totalBalance, income, expense, transfer }: BalanceCardProps) {
  return (
    <div className="bg-pinkfanta-500 border-2 border-[#171717] rounded-3xl shadow-offset-lg p-5 text-white relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-pinkfanta-400/30 rounded-full" />
      <div className="absolute -bottom-12 -left-4 w-24 h-24 bg-pinkfanta-600/30 rounded-full" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={18} />
          <span className="text-sm font-semibold text-white/90">Total Saldo</span>
        </div>
        <p className="text-3xl font-extrabold mb-4 tracking-tight">{formatRupiah(totalBalance)}</p>

        <div className="grid grid-cols-3 gap-2">
          <MiniStat icon={<TrendingUp size={14} />} label="Masuk" value={income} />
          <MiniStat icon={<TrendingDown size={14} />} label="Keluar" value={expense} />
          <MiniStat icon={<ArrowLeftRight size={14} />} label="Transfer" value={transfer} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-2 py-2 border border-white/20">
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <span className="text-[10px] font-semibold text-white/80">{label}</span>
      </div>
      <p className="text-xs font-bold truncate">{formatRupiah(value)}</p>
    </div>
  );
}
