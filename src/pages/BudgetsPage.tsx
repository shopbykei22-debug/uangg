import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah, todayISO, daysBetween } from '@/lib/format';
import { CATEGORY_ICONS } from '@/lib/defaults';
import { getBudgetProgress } from '@/lib/calc';
import type { Budget } from '@/lib/types';
import { BudgetCard } from '@/components/cards/BudgetCard';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Trash2 } from 'lucide-react';

export function BudgetsPage() {
  const { data, addBudget, deleteBudget } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const progress = getBudgetProgress(data);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Budget Challenge</h1>
          <p className="text-sm text-[#6B6B6B]">Pantau budgetmu</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-pink px-3 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Buat Budget
        </button>
      </div>

      {progress.length === 0 ? (
        <EmptyState
          emoji="💪"
          title="Belum ada budget challenge"
          subtitle="Buat budget untuk mulai challenge!"
          action={
            <button onClick={() => setShowForm(true)} className="btn-pink px-5 py-2.5">
              + Buat Budget
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {progress.map((bp) => (
            <div key={bp.budget.id} className="relative group">
              <BudgetCard progress={bp} />
              <button
                onClick={() => setDeleteId(bp.budget.id)}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-red-50 border border-[#171717] flex items-center justify-center active:scale-90 transition opacity-0 group-hover:opacity-100"
                aria-label="Hapus"
              >
                <Trash2 size={12} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BudgetForm
          categories={data.categories.filter((c) => c.type === 'expense' || c.type === 'both')}
          onClose={() => setShowForm(false)}
          onSave={(b) => { addBudget(b); setShowForm(false); }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Hapus budget?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDeleteId(null)} className="btn-white flex-1 py-2.5 text-sm">Batal</button>
              <button
                onClick={() => { deleteBudget(deleteId); setDeleteId(null); }}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white border-2 border-[#171717] rounded-xl font-bold shadow-offset-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetForm({
  categories,
  onClose,
  onSave,
}: {
  categories: { id: string; name: string; icon: string }[];
  onClose: () => void;
  onSave: (b: Omit<Budget, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [period, setPeriod] = useState<Budget['period']>('monthly');
  const [icon, setIcon] = useState('💰');
  const [notes, setNotes] = useState('');

  const days = daysBetween(startDate, endDate);

  return (
    <Modal open onClose={onClose} title="Buat Budget Challenge">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Nama Budget</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Ngopi & Milktea" className="input-pink" />
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Kategori</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-pink">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Total Budget</label>
          <input
            type="text"
            inputMode="numeric"
            value={amount ? formatRupiah(parseInt(amount) || 0) : ''}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Rp 0"
            className="input-pink text-lg font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Mulai</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-pink" />
          </div>
          <div>
            <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Selesai</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-pink" />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Periode</label>
          <div className="grid grid-cols-4 gap-2">
            {(['daily', 'weekly', 'monthly', 'custom'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-2 rounded-lg border-2 border-[#171717] text-xs font-bold transition ${
                  period === p ? 'bg-pinkfanta-500 text-white' : 'bg-white text-[#6B6B6B]'
                }`}
              >
                {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Custom'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Ikon</label>
          <div className="grid grid-cols-10 gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {CATEGORY_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg transition ${
                  icon === ic ? 'bg-pinkfanta-500 border-[#171717] scale-110' : 'bg-pinkfanta-50 border-transparent'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Catatan (opsional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan budget..." rows={2} className="input-pink resize-none" />
        </div>

        {days > 0 && parseInt(amount) > 0 && (
          <div className="bg-pinkfanta-50 border-2 border-[#171717] rounded-xl p-3">
            <p className="text-sm font-bold text-[#171717]">
              Rekomendasi: {formatRupiah(parseInt(amount) / days)}/hari
            </p>
            <p className="text-xs text-[#6B6B6B]">Selama {days} hari</p>
          </div>
        )}

        <button
          onClick={() => name && categoryId && parseInt(amount) > 0 && onSave({ name, categoryId, amount: parseInt(amount), startDate, endDate, period, icon, notes: notes || undefined })}
          disabled={!name || !categoryId || !parseInt(amount)}
          className={`w-full py-3 rounded-xl border-2 border-[#171717] font-bold transition-all ${
            name && categoryId && parseInt(amount)
              ? 'bg-pinkfanta-500 text-white shadow-offset active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Buat Budget
        </button>
      </div>
    </Modal>
  );
}
