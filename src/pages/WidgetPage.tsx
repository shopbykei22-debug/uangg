import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/format';
import { getWidgetData } from '@/lib/calc';
import type { WidgetConfig } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Smartphone, Check } from 'lucide-react';

export function WidgetPage() {
  const { data, addWidgetConfig, updateWidgetConfig, deleteWidgetConfig } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const configs = data.preferences.widgetConfigs;
  const expenseCategories = data.categories.filter((c) => c.type === 'expense' || c.type === 'both');

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Widget Keuangan Rieke</h1>
          <p className="text-sm text-[#6B6B6B]">Pilih info untuk home screen widget</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-pink px-3 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Widget
        </button>
      </div>

      <div className="card-pink p-3 bg-pinkfanta-50 flex items-start gap-2">
        <Smartphone size={18} className="text-pinkfanta-500 shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B6B6B]">
          Konfigurasi widget ini akan dipakai saat Keuangan Rieke dipasang sebagai Android home screen widget via Capacitor. Data widget berasal dari lapisan data yang sama dengan aplikasi.
        </p>
      </div>

      {configs.map((config) => {
        const widgetData = getWidgetData(data, config.id);
        return (
          <div key={config.id} className="card-pink p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-[#171717]">{config.name}</p>
                <p className="text-xs text-[#6B6B6B] capitalize">{config.size} widget</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingId(config.id)}
                  className="px-3 py-1.5 text-xs btn-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(config.id)}
                  className="px-2.5 py-1.5 text-xs bg-red-50 text-red-500 border-2 border-[#171717] rounded-xl font-bold active:scale-95 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <WidgetPreview config={config} widgetData={widgetData} />
          </div>
        );
      })}

      {configs.length === 0 && (
        <div className="card-pink p-6 text-center">
          <p className="text-sm text-[#6B6B6B]">Belum ada widget. Yuk buat! 💗</p>
        </div>
      )}

      {(editingId || showForm) && (
        <WidgetForm
          config={editingId ? configs.find((c) => c.id === editingId) ?? null : null}
          categories={expenseCategories}
          onClose={() => { setEditingId(null); setShowForm(false); }}
          onSave={(c) => {
            if (editingId) {
              updateWidgetConfig(editingId, c);
            } else {
              addWidgetConfig(c);
            }
            setEditingId(null);
            setShowForm(false);
          }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Hapus widget?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDeleteId(null)} className="btn-white flex-1 py-2.5 text-sm">Batal</button>
              <button
                onClick={() => { deleteWidgetConfig(deleteId); setDeleteId(null); }}
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

interface WidgetPreviewProps {
  config: WidgetConfig;
  widgetData: ReturnType<typeof getWidgetData>;
}

export function WidgetPreview({ config, widgetData }: WidgetPreviewProps) {
  const isSmall = config.size === 'small';
  const isLarge = config.size === 'large';

  return (
    <div
      className="bg-[#FFF5F9] border-2 border-[#171717] rounded-2xl p-4 shadow-offset-sm"
      style={{ maxWidth: isSmall ? '180px' : isLarge ? '360px' : '280px' }}
    >
      {/* Widget header */}
      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-pinkfanta-200">
        <div className="w-5 h-5 bg-pinkfanta-500 rounded-md border border-[#171717] flex items-center justify-center text-[8px] text-white font-bold">
          K
        </div>
        <span className="text-xs font-bold text-pinkfanta-500">Keuangan Rieke</span>
      </div>

      {/* Today expense */}
      {config.showTodayExpense && (
        <div className="mb-2">
          <p className="text-[10px] font-semibold text-[#6B6B6B]">Pengeluaran Hari Ini</p>
          <p className="text-xl font-extrabold text-[#171717]">{formatRupiah(widgetData.todayExpense)}</p>
        </div>
      )}

      {/* Category totals */}
      {widgetData.categoryTotals.length > 0 && (
        <div className={`space-y-1 ${isSmall ? '' : 'mb-2'}`}>
          {widgetData.categoryTotals.slice(0, isLarge ? 6 : isSmall ? 0 : 3).map((cat) => (
            <div key={cat.categoryId} className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#171717]">
                {cat.icon} {cat.categoryName}
              </span>
              <span className="text-xs font-bold text-pinkfanta-500">{formatRupiah(cat.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Budget remaining */}
      {config.showBudgetRemaining && !isSmall && (
        <div className="pt-2 border-t border-pinkfanta-200">
          <p className="text-[10px] font-semibold text-[#6B6B6B]">Sisa Budget Hari Ini</p>
          <p className={`font-extrabold ${widgetData.budgetExceeded ? 'text-red-500' : 'text-pinkfanta-500'}`}>
            {formatRupiah(widgetData.todayRemaining)}
          </p>
        </div>
      )}
    </div>
  );
}

function WidgetForm({
  config,
  categories,
  onClose,
  onSave,
}: {
  config: WidgetConfig | null;
  categories: { id: string; name: string; icon: string }[];
  onClose: () => void;
  onSave: (c: Omit<WidgetConfig, 'id'>) => void;
}) {
  const [name, setName] = useState(config?.name ?? 'Widget Baru');
  const [size, setSize] = useState<WidgetConfig['size']>(config?.size ?? 'medium');
  const [showTodayExpense, setShowTodayExpense] = useState(config?.showTodayExpense ?? true);
  const [showBudgetRemaining, setShowBudgetRemaining] = useState(config?.showBudgetRemaining ?? true);
  const [categoryIds, setCategoryIds] = useState<string[]>(config?.categoryIds ?? []);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <Modal open onClose={onClose} title={config ? 'Edit Widget' : 'Buat Widget'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Nama Widget</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-pink" />
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Ukuran</label>
          <div className="grid grid-cols-3 gap-2">
            {(['small', 'medium', 'large'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`py-2 rounded-lg border-2 border-[#171717] text-xs font-bold transition ${
                  size === s ? 'bg-pinkfanta-500 text-white' : 'bg-white text-[#6B6B6B]'
                }`}
              >
                {s === 'small' ? 'Small' : s === 'medium' ? 'Medium' : 'Large'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => setShowTodayExpense(!showTodayExpense)}
              className={`w-6 h-6 rounded-md border-2 border-[#171717] flex items-center justify-center transition ${
                showTodayExpense ? 'bg-pinkfanta-500 text-white' : 'bg-white'
              }`}
            >
              {showTodayExpense && <Check size={14} />}
            </button>
            <span className="text-sm font-bold text-[#171717]">Pengeluaran Hari Ini</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => setShowBudgetRemaining(!showBudgetRemaining)}
              className={`w-6 h-6 rounded-md border-2 border-[#171717] flex items-center justify-center transition ${
                showBudgetRemaining ? 'bg-pinkfanta-500 text-white' : 'bg-white'
              }`}
            >
              {showBudgetRemaining && <Check size={14} />}
            </button>
            <span className="text-sm font-bold text-[#171717]">Sisa Budget Hari Ini</span>
          </label>
        </div>

        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Pilih Kategori</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border-2 border-[#171717] text-xs font-semibold transition ${
                  categoryIds.includes(c.id) ? 'bg-pinkfanta-500 text-white' : 'bg-white text-[#6B6B6B]'
                }`}
              >
                <span>{c.icon}</span>
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => name && onSave({ name, size, showTodayExpense, showBudgetRemaining, categoryIds })}
          disabled={!name}
          className={`w-full py-3 rounded-xl border-2 border-[#171717] font-bold transition-all ${
            name
              ? 'bg-pinkfanta-500 text-white shadow-offset active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Simpan Widget
        </button>
      </div>
    </Modal>
  );
}
