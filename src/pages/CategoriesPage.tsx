import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/format';
import { CATEGORY_ICONS } from '@/lib/defaults';
import { getCategorySpending } from '@/lib/calc';
import type { Category } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2, EyeOff, Eye } from 'lucide-react';

export function CategoriesPage() {
  const { data, addCategory, updateCategory, deleteCategory } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  const spendings = getCategorySpending(data, period);
  const expenseCategories = data.categories.filter((c) => c.type === 'expense' || c.type === 'both');

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Kategori</h1>
          <p className="text-sm text-[#6B6B6B]">Kelola kategori pengeluaranmu</p>
        </div>
        <button
          onClick={() => { setEditCat(null); setShowForm(true); }}
          className="btn-pink px-3 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {(['today', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg border-2 border-[#171717] text-xs font-bold transition-all ${
              period === p ? 'bg-pinkfanta-500 text-white' : 'bg-white text-[#6B6B6B]'
            }`}
          >
            {p === 'today' ? 'Hari Ini' : p === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
          </button>
        ))}
      </div>

      {expenseCategories.length === 0 ? (
        <EmptyState emoji="📂" title="Belum ada kategori" subtitle="Tambah kategori untuk mulai tracking." />
      ) : (
        <div className="space-y-2">
          {expenseCategories.map((cat) => {
            const spending = spendings.find((s) => s.category.id === cat.id);
            const spent = spending?.spent ?? 0;
            const budget = cat.budget ?? 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const remaining = budget - spent;

            return (
              <div
                key={cat.id}
                className={`card-pink p-3 ${cat.hidden ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-xl shrink-0">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#171717]">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-[#6B6B6B] truncate">{cat.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-pinkfanta-500">{formatRupiah(spent)}</p>
                    {budget > 0 && <p className="text-xs text-[#6B6B6B]">Budget {formatRupiah(budget)}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateCategory(cat.id, { hidden: !cat.hidden })}
                      className="w-7 h-7 rounded-lg bg-pinkfanta-50 border border-[#171717] flex items-center justify-center active:scale-90 transition"
                      aria-label={cat.hidden ? 'Tampilkan' : 'Sembunyikan'}
                    >
                      {cat.hidden ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button
                      onClick={() => { setEditCat(cat); setShowForm(true); }}
                      className="w-7 h-7 rounded-lg bg-pinkfanta-50 border border-[#171717] flex items-center justify-center active:scale-90 transition"
                      aria-label="Edit"
                    >
                      <Pencil size={12} className="text-pinkfanta-500" />
                    </button>
                    {cat.custom && (
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 border border-[#171717] flex items-center justify-center active:scale-90 transition"
                        aria-label="Hapus"
                      >
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
                {budget > 0 && (
                  <div className="mt-2">
                    <ProgressBar percentage={percentage} exceeded={remaining < 0} height="h-2" />
                    <p className="text-xs text-[#6B6B6B] mt-1">
                      {remaining >= 0 ? `Sisa ${formatRupiah(remaining)}` : 'Lebih dari budget'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editCat}
          onClose={() => setShowForm(false)}
          onSave={(cat) => {
            if (editCat) {
              updateCategory(editCat.id, cat);
            } else {
              addCategory({ ...cat, type: 'expense', custom: true });
            }
            setShowForm(false);
          }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Hapus kategori?</p>
            <p className="text-sm text-[#6B6B6B] mb-4">Transaksi dengan kategori ini tetap ada.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="btn-white flex-1 py-2.5 text-sm">Batal</button>
              <button
                onClick={() => { deleteCategory(deleteId); setDeleteId(null); }}
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

function CategoryForm({
  category,
  onClose,
  onSave,
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (cat: Omit<Category, 'id' | 'order' | 'type' | 'custom'> & Partial<Pick<Category, 'type' | 'custom'>>) => void;
}) {
  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '🍜');
  const [budget, setBudget] = useState(category?.budget ? String(category.budget) : '');
  const [description, setDescription] = useState(category?.description ?? '');

  return (
    <Modal open onClose={onClose} title={category ? 'Edit Kategori' : 'Tambah Kategori'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Nama Kategori</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Uang Kos"
            className="input-pink"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Ikon</label>
          <div className="grid grid-cols-10 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
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
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Budget Bulanan (opsional)</label>
          <input
            type="text"
            inputMode="numeric"
            value={budget ? formatRupiah(parseInt(budget) || 0) : ''}
            onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Rp 0"
            className="input-pink"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Deskripsi (opsional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Catatan kategori..."
            rows={2}
            className="input-pink resize-none"
          />
        </div>

        <button
          onClick={() => name && onSave({ name, icon, budget: budget ? parseInt(budget) : undefined, description: description || undefined })}
          disabled={!name}
          className={`w-full py-3 rounded-xl border-2 border-[#171717] font-bold transition-all ${
            name
              ? 'bg-pinkfanta-500 text-white shadow-offset active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}
