import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah, relativeDateLabel } from '@/lib/format';
import type { TransactionType, Transaction } from '@/lib/types';
import { TransactionCard } from '@/components/TransactionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Filter, X } from 'lucide-react';

interface TransactionsPageProps {
  onEditTransaction: (t: Transaction) => void;
  onAddTransaction: () => void;
}

type FilterType = 'all' | TransactionType;

export function TransactionsPage({ onEditTransaction, onAddTransaction }: TransactionsPageProps) {
  const { data, deleteTransaction } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return data.transactions.filter((t) => {
      if (filter !== 'all' && t.type !== filter) return false;
      if (categoryFilter && t.categoryId !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const cat = data.categories.find((c) => c.id === t.categoryId);
        const matches =
          t.description.toLowerCase().includes(q) ||
          (cat?.name.toLowerCase().includes(q) ?? false) ||
          t.paymentMethod.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [data.transactions, data.categories, filter, categoryFilter, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    for (const t of filtered) {
      const label = relativeDateLabel(t.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    }
    return Object.entries(groups);
  }, [filtered]);

  const expenseCategories = data.categories.filter((c) => c.type === 'expense' || c.type === 'both');

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#171717]">Transaksi</h1>
        <p className="text-sm text-[#6B6B6B]">{filtered.length} transaksi ditemukan</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi..."
            className="input-pink pl-10 py-2.5 text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 rounded-xl border-2 border-[#171717] flex items-center justify-center transition-all ${
            showFilters || filter !== 'all' || categoryFilter
              ? 'bg-pinkfanta-500 text-white shadow-offset-sm'
              : 'bg-white text-[#171717]'
          }`}
          aria-label="Filter"
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card-pink p-3 space-y-3 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-[#6B6B6B] mb-1.5">Jenis</p>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'income', 'expense', 'transfer'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-[#171717] text-xs font-bold transition ${
                    filter === f ? 'bg-pinkfanta-500 text-white' : 'bg-white text-[#6B6B6B]'
                  }`}
                >
                  {f === 'all' ? 'Semua' : f === 'income' ? 'Pemasukan' : f === 'expense' ? 'Pengeluaran' : 'Transfer'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B6B6B] mb-1.5">Kategori</p>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-pink text-sm py-2"
            >
              <option value="">Semua kategori</option>
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          {(filter !== 'all' || categoryFilter || search) && (
            <button
              onClick={() => { setFilter('all'); setCategoryFilter(''); setSearch(''); }}
              className="text-xs font-bold text-pinkfanta-500 flex items-center gap-1"
            >
              <X size={12} /> Reset filter
            </button>
          )}
        </div>
      )}

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <EmptyState
          emoji="🌸"
          title="Belum ada transaksi"
          subtitle="Yuk mulai catat keuanganmu hari ini."
          action={
            <button onClick={onAddTransaction} className="btn-pink px-5 py-2.5">
              + Catat Transaksi
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {grouped.map(([label, txns]) => (
            <div key={label}>
              <p className="text-sm font-bold text-[#6B6B6B] mb-2 px-1">{label}</p>
              <div className="space-y-2">
                {txns.map((t) => {
                  const cat = data.categories.find((c) => c.id === t.categoryId);
                  const acc = data.accounts.find((a) => a.id === t.accountId);
                  const toAcc = data.accounts.find((a) => a.id === t.toAccountId);
                  return (
                    <TransactionCard
                      key={t.id}
                      transaction={t}
                      category={cat}
                      account={acc}
                      toAccount={toAcc}
                      onEdit={() => onEditTransaction(t)}
                      onDelete={() => setDeleteId(t.id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Hapus transaksi?</p>
            <p className="text-sm text-[#6B6B6B] mb-4">Transaksi yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="btn-white flex-1 py-2.5 text-sm">
                Batal
              </button>
              <button
                onClick={() => { deleteTransaction(deleteId); setDeleteId(null); }}
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
