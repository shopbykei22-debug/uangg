import { getDailyMessage } from '@/lib/calc';

export function DailyMessageCard() {
  const message = getDailyMessage();
  return (
    <div className="card-pink p-4 bg-gradient-to-br from-pinkfanta-50 to-white">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-2xl shrink-0">
          🌸
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-pinkfanta-500 mb-0.5">Kata-kata Mucuw hari ini</p>
          <p className="text-sm font-semibold text-[#171717] leading-relaxed">"{message}"</p>
        </div>
      </div>
    </div>
  );
}
