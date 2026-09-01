import { useState, useEffect, type ReactNode } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah, parseRupiah, todayISO, nowTime } from '@/lib/format';
import { PAYMENT_METHODS } from '@/lib/defaults';
import type { TransactionType, Transaction } from '@/lib/types';
import { BottomSheet } from './ui/BottomSheet';
import { Camera } from 'lucide-react';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  presetCategoryId?: string;
  editTransaction?: Transaction | null;
}

export function TransactionModal({
  open,
  onClose,
  defaultType = 'expense',
  presetCategoryId,
  editTransaction,
}: TransactionModalProps) {
  const { data, addTransaction, updateTransaction } = useStore();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(nowTime());
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (open) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmount(String(editTransaction.amount));
        setCategoryId(editTransaction.categoryId ?? '');
        setAccountId(editTransaction.accountId ?? '');
        setToAccountId(editTransaction.toAccountId ?? '');
        setDate(editTransaction.date);
        setTime(editTransaction.time);
        setPaymentMethod(editTransaction.paymentMethod);
        setDescription(editTransaction.description);
        setNotes(editTransaction.notes ?? '');
        setReceipt(editTransaction.receipt);
      } else {
        setType(defaultType);
        setAmount('');
        setCategoryId(presetCategoryId ?? '');
        setAccountId(data.accounts[0]?.id ?? '');
        setToAccountId(data.accounts[1]?.id ?? '');
        setDate(todayISO());
        setTime(nowTime());
        setPaymentMethod('Cash');
        setDescription('');
        setNotes('');
        setReceipt(undefined);
      }
    }
  }, [open, editTransaction, defaultType, presetCategoryId, data.accounts]);

  const availableCategories = data.categories.filter((c) => {
    if (c.hidden) return false;
    if (type === 'income') return c.type === 'income' || c.type === 'both';
    if (type === 'expense') return c.type === 'expense' || c.type === 'both';
    return false;
  });

  const handleSubmit = () => {
    const amt = parseRupiah(amount);
    if (amt <= 0) return;
    if (type !== 'transfer' && !categoryId) return;
    if (type === 'transfer' && (!accountId || !toAccountId || accountId === toAccountId)) return;

    const payload = {
      type,
      amount: amt,
      categoryId: type === 'transfer' ? undefined : categoryId,
      accountId,
      toAccountId: type === 'transfer' ? toAccountId : undefined,
      date,
      time,
      paymentMethod,
      description: description || (type === 'transfer' ? 'Transfer' : ''),
      notes: notes || undefined,
      receipt,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  const canSubmit = () => {
    const amt = parseRupiah(amount);
    if (amt <= 0) return false;
    if (type === 'transfer') return accountId && toAccountId && accountId !== toAccountId;
    return !!categoryId;
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceipt(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={editTransaction ? 'Edit Transaksi' : 'Catat Transaksi'}>
      <div className="space-y-4 pt-2">
        {/* Type selector */}
        <div className="grid grid-cols-3 gap-2">
          {(['income', 'expense', 'transfer'] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`py-2.5 rounded-xl border-2 border-[#171717] font-bold text-sm transition-all ${
                type === t
                  ? 'bg-pinkfanta-500 text-white shadow-offset-sm'
                  : 'bg-white text-[#171717]'
              }`}
            >
              {t === 'income' ? 'Pemasukan' : t === 'expense' ? 'Pengeluaran' : 'Transfer'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Nominal</label>
          <input
            type="text"
            inputMode="numeric"
            value={amount ? formatRupiah(parseRupiah(amount)) : ''}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Rp 0"
            className="input-pink text-2xl text-center font-bold"
          />
        </div>

        {/* Transfer-specific: from/to accounts */}
        {type === 'transfer' ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Dari Akun</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="input-pink"
              >
                <option value="">Pilih akun</option>
                {data.accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Ke Akun</label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="input-pink"
              >
                <option value="">Pilih akun</option>
                {data.accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            {/* Category */}
            <div>
              <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Kategori</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar">
                {availableCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryId(c.id)}
                    className={`px-3 py-2 rounded-xl border-2 border-[#171717] text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      categoryId === c.id ? 'bg-pinkfanta-500 text-white shadow-offset-sm' : 'bg-white'
                    }`}
                  >
                    <span>{c.icon}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Akun</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="input-pink"
              >
                <option value="">Pilih akun</option>
                {data.accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-pink"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Waktu</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-pink"
            />
          </div>
        </div>

        {/* Payment Method */}
        {type !== 'transfer' && (
          <div>
            <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Metode Pembayaran</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-pink"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Deskripsi</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === 'transfer' ? 'Transfer antar akun' : 'Contoh: Beli makan siang'}
            className="input-pink"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Catatan (opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan tambahan..."
            rows={2}
            className="input-pink resize-none"
          />
        </div>

        {/* Receipt */}
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Struk (opsional)</label>
          {receipt ? (
            <div className="relative">
              <img src={receipt} alt="Receipt" className="w-full rounded-xl border-2 border-[#171717] max-h-48 object-contain" />
              <button
                onClick={() => setReceipt(undefined)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full border-2 border-[#171717] flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 py-6 bg-pinkfanta-50 border-2 border-dashed border-[#171717] rounded-xl cursor-pointer active:scale-95 transition">
              <Camera size={24} className="text-pinkfanta-500" />
              <span className="text-sm font-semibold text-[#6B6B6B]">Upload struk</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleReceiptUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className={`w-full py-3.5 rounded-xl border-2 border-[#171717] font-bold text-base transition-all ${
            canSubmit()
              ? 'bg-pinkfanta-500 text-white shadow-offset active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {editTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}
        </button>
      </div>
    </BottomSheet>
  );
}

export function QuickAddSheet({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: TransactionType) => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Catat Transaksi">
      <div className="space-y-3 pt-2 pb-2">
        <AddOption icon="💰" label="Pemasukan" desc="Catat uang masuk" onClick={() => onSelect('income')} />
        <AddOption icon="💸" label="Pengeluaran" desc="Catat pengeluaran" onClick={() => onSelect('expense')} />
        <AddOption icon="🔄" label="Transfer" desc="Pindah antar akun" onClick={() => onSelect('transfer')} />
      </div>
    </BottomSheet>
  );
}

function AddOption({ icon, label, desc, onClick }: { icon: string; label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-white border-2 border-[#171717] rounded-xl shadow-offset-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
    >
      <div className="w-12 h-12 bg-pinkfanta-100 rounded-xl border-2 border-[#171717] flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-bold text-[#171717]">{label}</p>
        <p className="text-sm text-[#6B6B6B]">{desc}</p>
      </div>
      <span className="ml-auto text-pinkfanta-500 font-bold text-xl">→</span>
    </button>
  );
}

export function SheetWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
