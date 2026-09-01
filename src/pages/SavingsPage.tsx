import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/format';
import { SAVINGS_GOAL_ICONS } from '@/lib/defaults';
import type { SavingsGoal } from '@/lib/types';
import { SavingsGoalCard } from '@/components/cards/SavingsGoalCard';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export function SavingsPage() {
  const { data, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, contributeSavings } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [actionGoal, setActionGoal] = useState<SavingsGoal | null>(null);
  const [actionType, setActionType] = useState<'add' | 'withdraw'>('add');
  const [actionAmount, setActionAmount] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Target Tabungan</h1>
          <p className="text-sm text-[#6B6B6B]">Wujudkan impianmu 💗</p>
        </div>
        <button
          onClick={() => { setEditGoal(null); setShowForm(true); }}
          className="btn-pink px-3 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      {data.savingsGoals.length === 0 ? (
        <EmptyState
          emoji="🐷"
          title="Belum ada target tabungan"
          subtitle="Mulai nabung untuk impianmu!"
          action={<button onClick={() => setShowForm(true)} className="btn-pink px-5 py-2.5">+ Buat Target</button>}
        />
      ) : (
        <div className="space-y-3">
          {data.savingsGoals.map((goal) => (
            <div key={goal.id} className="relative group">
              <SavingsGoalCard
                goal={goal}
                onClick={() => { setActionGoal(goal); setActionType('add'); setActionAmount(''); }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => { setActionGoal(goal); setActionType('add'); setActionAmount(''); }}
                  className="flex-1 btn-white py-2 text-xs flex items-center justify-center gap-1"
                >
                  <ArrowDownLeft size={14} /> Tambah
                </button>
                <button
                  onClick={() => { setActionGoal(goal); setActionType('withdraw'); setActionAmount(''); }}
                  className="flex-1 btn-white py-2 text-xs flex items-center justify-center gap-1"
                >
                  <ArrowUpRight size={14} /> Tarik
                </button>
                <button
                  onClick={() => { setEditGoal(goal); setShowForm(true); }}
                  className="px-3 btn-white py-2 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(goal.id)}
                  className="px-3 py-2 text-xs bg-red-50 text-red-500 border-2 border-[#171717] rounded-xl font-bold active:scale-95 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <GoalForm
          goal={editGoal}
          onClose={() => setShowForm(false)}
          onSave={(g) => {
            if (editGoal) {
              updateSavingsGoal(editGoal.id, g);
            } else {
              addSavingsGoal(g);
            }
            setShowForm(false);
          }}
        />
      )}

      {actionGoal && (
        <Modal open onClose={() => setActionGoal(null)} title={actionType === 'add' ? `Tambah ke ${actionGoal.name}` : `Tarik dari ${actionGoal.name}`}>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-[#6B6B6B]">Saat ini</p>
              <p className="text-2xl font-extrabold text-pinkfanta-500">{formatRupiah(actionGoal.current)}</p>
            </div>
            <div>
              <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Jumlah</label>
              <input
                type="text"
                inputMode="numeric"
                value={actionAmount ? formatRupiah(parseInt(actionAmount) || 0) : ''}
                onChange={(e) => setActionAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Rp 0"
                className="input-pink text-lg text-center font-bold"
              />
            </div>
            <button
              onClick={() => {
                const amt = parseInt(actionAmount) || 0;
                if (amt > 0) {
                  contributeSavings(actionGoal.id, actionType === 'add' ? amt : -amt);
                  setActionGoal(null);
                }
              }}
              disabled={!parseInt(actionAmount)}
              className={`w-full py-3 rounded-xl border-2 border-[#171717] font-bold transition-all ${
                parseInt(actionAmount)
                  ? 'bg-pinkfanta-500 text-white shadow-offset active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {actionType === 'add' ? 'Tambah' : 'Tarik'}
            </button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg p-5 max-w-xs w-full animate-pop">
            <p className="text-lg font-bold text-[#171717] mb-1">Hapus target?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDeleteId(null)} className="btn-white flex-1 py-2.5 text-sm">Batal</button>
              <button
                onClick={() => { deleteSavingsGoal(deleteId); setDeleteId(null); }}
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

function GoalForm({
  goal,
  onClose,
  onSave,
}: {
  goal: SavingsGoal | null;
  onClose: () => void;
  onSave: (g: Omit<SavingsGoal, 'id'>) => void;
}) {
  const [name, setName] = useState(goal?.name ?? '');
  const [icon, setIcon] = useState(goal?.icon ?? '💻');
  const [target, setTarget] = useState(goal?.target ? String(goal.target) : '');
  const [current, setCurrent] = useState(goal?.current ? String(goal.current) : '');
  const [deadline, setDeadline] = useState(goal?.deadline ?? '');

  return (
    <Modal open onClose={onClose} title={goal ? 'Edit Target' : 'Buat Target Tabungan'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Nama Target</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Nabung Laptop" className="input-pink" />
        </div>
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Ikon</label>
          <div className="grid grid-cols-12 gap-1.5">
            {SAVINGS_GOAL_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-base transition ${
                  icon === ic ? 'bg-pinkfanta-500 border-[#171717] scale-110' : 'bg-pinkfanta-50 border-transparent'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Target</label>
          <input
            type="text"
            inputMode="numeric"
            value={target ? formatRupiah(parseInt(target) || 0) : ''}
            onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Rp 0"
            className="input-pink text-lg font-bold"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Saat Ini (opsional)</label>
          <input
            type="text"
            inputMode="numeric"
            value={current ? formatRupiah(parseInt(current) || 0) : ''}
            onChange={(e) => setCurrent(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Rp 0"
            className="input-pink"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Deadline (opsional)</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-pink" />
        </div>
        <button
          onClick={() => name && parseInt(target) > 0 && onSave({ name, icon, target: parseInt(target), current: parseInt(current) || 0, deadline: deadline || undefined })}
          disabled={!name || !parseInt(target)}
          className={`w-full py-3 rounded-xl border-2 border-[#171717] font-bold transition-all ${
            name && parseInt(target)
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
