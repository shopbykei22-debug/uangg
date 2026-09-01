import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/format';
import { getAccountBalances } from '@/lib/calc';
import type { Account } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ACCOUNT_ICONS = ['💵', '🏦', '📱', '💳', '🏠', '💼', '🐷', '💰'];

export function AccountsPage() {
  const { data, addAccount, updateAccount, deleteAccount } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editAcc, setEditAcc] = useState<Account | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const balances = getAccountBalances(data);

  const totalBalance = balances.reduce((s, b) => s + b.balance, 0);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Akun & Dompet</h1>
          <p className="text-sm text-[#6B6B6B]">Total {formatRupiah(totalBalance)}</p>
        </div>
        <button
          onClick={() => { setEditAcc(null); setShowForm(true); }}
          className="btn-pink px-3 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      {balances.length === 0 ? (
        <EmptyState emoji="🏦" title="Belum ada akun" subtitle="Tambah akun untuk mulai tracking." />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {balances.map(({ account, balance }) => (
            <div key={account.id} className="card-pink p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-xl">
                  {account.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#171717] truncate">{account.name}</p>
                  <p className="text-xs text-[#6B6B6B]">Saldo awal {formatRupiah(account.initialBalance)}</p>
                </div>
              </div>
              <p className="text-lg font-extrabold text-pinkfanta-500">{formatRupiah(balance)}</p>
              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => { setEditAcc(account); setShowForm(true); }}
                  className="flex-1 btn-white py-1.5 text-xs flex items-center justify-center gap-1"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(account.id)}
                  className="px-2.5 py-1.5 text-xs bg-red-50 text-red-500 border-2 border-[#171717] rounded-xl font-bold active:scale-95 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AccountForm
          account={editAcc}
          onClose={() => setShowForm(false)}
          onSave={(a) => {
            if (editAcc) {
              updateAccount(editAcc.id, a);
            } else {
              addAccount(a);
            }
            setShowForm(false);
          }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Hapus akun?</p>
            <p className="text-sm text-[#6B6B6B] mb-4">Transaksi dengan akun ini tetap ada.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="btn-white flex-1 py-2.5 text-sm">Batal</button>
              <button
                onClick={() => { deleteAccount(deleteId); setDeleteId(null); }}
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

function AccountForm({
  account,
  onClose,
  onSave,
}: {
  account: Account | null;
  onClose: () => void;
  onSave: (a: Omit<Account, 'id' | 'order'>) => void;
}) {
  const [name, setName] = useState(account?.name ?? '');
  const [icon, setIcon] = useState(account?.icon ?? '💵');
  const [initialBalance, setInitialBalance] = useState(account?.initialBalance ? String(account.initialBalance) : '');

  return (
    <Modal open onClose={onClose} title={account ? 'Edit Akun' : 'Tambah Akun'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Nama Akun</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: BCA" className="input-pink" />
        </div>
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Ikon</label>
          <div className="grid grid-cols-8 gap-2">
            {ACCOUNT_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition ${
                  icon === ic ? 'bg-pinkfanta-500 border-[#171717] scale-110' : 'bg-pinkfanta-50 border-transparent'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Saldo Awal</label>
          <input
            type="text"
            inputMode="numeric"
            value={initialBalance ? formatRupiah(parseInt(initialBalance) || 0) : ''}
            onChange={(e) => setInitialBalance(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Rp 0"
            className="input-pink text-lg font-bold"
          />
        </div>
        <button
          onClick={() => name && onSave({ name, icon, initialBalance: parseInt(initialBalance) || 0 })}
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
