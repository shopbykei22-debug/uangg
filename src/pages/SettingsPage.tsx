import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/format';
import { Modal } from '@/components/ui/Modal';
import type { Page } from '@/components/BottomNavigation';
import { ChevronRight, Wallet, Grid3x3, Target, Smartphone, RotateCcw } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onClose: () => void;
}

export function SettingsPage({ onNavigate, onClose }: SettingsPageProps) {
  const { data, setDailyBudget, resetData } = useStore();
  const [budgetEdit, setBudgetEdit] = useState(false);
  const [budgetValue, setBudgetValue] = useState(String(data.preferences.dailyBudget));
  const [showReset, setShowReset] = useState(false);

  const menuItems = [
    { icon: <Wallet size={18} />, label: 'Akun & Dompet', page: 'accounts' as Page },
    { icon: <Grid3x3 size={18} />, label: 'Kategori', page: 'categories' as Page },
    { icon: <Target size={18} />, label: 'Budget Challenge', page: 'budgets' as Page },
    { icon: <Target size={18} />, label: 'Target Tabungan', page: 'savings' as Page },
    { icon: <Smartphone size={18} />, label: 'Widget Keuangan', page: 'widget' as Page },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#171717]">Pengaturan</h1>
        <button onClick={onClose} className="btn-white px-3 py-1.5 text-sm">Tutup</button>
      </div>

      {/* Daily budget */}
      <div className="card-pink p-4">
        <p className="text-sm font-bold text-[#6B6B6B] mb-1">Budget Harian</p>
        <p className="text-xl font-extrabold text-pinkfanta-500 mb-2">{formatRupiah(data.preferences.dailyBudget)}</p>
        <button onClick={() => setBudgetEdit(true)} className="btn-white px-3 py-1.5 text-xs">Edit Budget</button>
      </div>

      {/* Menu items */}
      <div className="card-pink p-2 divide-y-2 divide-pinkfanta-100">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => { onNavigate(item.page); onClose(); }}
            className="w-full flex items-center gap-3 p-3 active:bg-pinkfanta-50 rounded-lg transition"
          >
            <div className="w-9 h-9 bg-pinkfanta-100 rounded-lg border-2 border-[#171717] flex items-center justify-center text-pinkfanta-500">
              {item.icon}
            </div>
            <span className="flex-1 text-left font-bold text-sm text-[#171717]">{item.label}</span>
            <ChevronRight size={18} className="text-[#6B6B6B]" />
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={() => setShowReset(true)}
        className="w-full btn-white py-2.5 text-sm text-red-500 flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} /> Reset Data
      </button>

      <p className="text-center text-xs text-[#6B6B6B] pt-2">
        Keuangan Rieke 💗 v1.0
      </p>

      {budgetEdit && (
        <Modal open onClose={() => setBudgetEdit(false)} title="Edit Budget Harian">
          <div className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              value={budgetValue ? formatRupiah(parseInt(budgetValue) || 0) : ''}
              onChange={(e) => setBudgetValue(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Rp 0"
              className="input-pink text-lg text-center font-bold"
            />
            <button
              onClick={() => {
                setDailyBudget(parseInt(budgetValue) || 0);
                setBudgetEdit(false);
              }}
              className="w-full btn-pink py-3"
            >
              Simpan
            </button>
          </div>
        </Modal>
      )}

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReset(false)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Reset semua data?</p>
            <p className="text-sm text-[#6B6B6B] mb-4">Semua transaksi, kategori, dan budget akan dikembalikan ke awal.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowReset(false)} className="btn-white flex-1 py-2.5 text-sm">Batal</button>
              <button
                onClick={() => { resetData(); setShowReset(false); onClose(); }}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white border-2 border-[#171717] rounded-xl font-bold shadow-offset-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
