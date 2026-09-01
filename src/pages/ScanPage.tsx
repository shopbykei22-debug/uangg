import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { formatRupiah, todayISO, nowTime, formatDateID } from '@/lib/format';
import type { Transaction } from '@/lib/types';
import { Camera, Upload, Check, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface ScanPageProps {
  onSaved: () => void;
}

export function ScanPage({ onSaved }: ScanPageProps) {
  const { data, addTransaction } = useStore();
  const [stage, setStage] = useState<'idle' | 'preview' | 'confirm'>('idle');
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scanned, setScanned] = useState({
    storeName: '',
    total: '',
    date: todayISO(),
    items: [] as { name: string; qty: string; price: string }[],
  });
  const [categoryId, setCategoryId] = useState('cat-belanja');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setStage('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    setProcessing(true);
    // Simulate OCR processing - in production this would call an OCR API
    setTimeout(() => {
      setScanned({
        storeName: 'ABC Mart',
        total: '85000',
        date: todayISO(),
        items: [
          { name: 'Indomie', qty: '2', price: '7000' },
          { name: 'Aqua Botol', qty: '1', price: '5000' },
          { name: 'Roti Tawar', qty: '1', price: '15000' },
        ],
      });
      setProcessing(false);
      setStage('confirm');
    }, 1500);
  };

  const handleSave = () => {
    const total = parseInt(scanned.total) || 0;
    if (total <= 0) return;
    addTransaction({
      type: 'expense',
      amount: total,
      categoryId,
      accountId: data.accounts[0]?.id,
      date: scanned.date,
      time: nowTime(),
      paymentMethod: 'Cash',
      description: scanned.storeName,
      receipt: image ?? undefined,
    });
    setStage('idle');
    setImage(null);
    onSaved();
  };

  if (stage === 'idle') {
    return (
      <div className="space-y-4 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717]">Scan Struk</h1>
          <p className="text-sm text-[#6B6B6B]">Foto struk, kami bantu catat 📸</p>
        </div>

        <div className="card-pink p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-pinkfanta-100 rounded-2xl border-2 border-[#171717] flex items-center justify-center">
              <Camera size={36} className="text-pinkfanta-500" />
            </div>
            <div className="text-center">
              <p className="font-bold text-[#171717]">Foto Struk Belanja</p>
              <p className="text-sm text-[#6B6B6B] max-w-xs">
                Ambil foto struk, kami akan extract informasi otomatis.
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full btn-pink py-3.5 flex items-center justify-center gap-2"
            >
              <Camera size={20} /> Ambil Foto
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full btn-white py-3 flex items-center justify-center gap-2 text-sm"
            >
              <Upload size={18} /> Upload dari Galeri
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        <div className="card-pink p-4 bg-pinkfanta-50">
          <div className="flex items-start gap-2">
            <Sparkles size={18} className="text-pinkfanta-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#171717]">Cara pakai</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                1. Foto struk dengan jelas<br />
                2. Tunggu proses extract<br />
                3. Cek dan simpan transaksi
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'preview') {
    return (
      <div className="space-y-4 pb-4">
        <h1 className="text-2xl font-extrabold text-[#171717]">Preview Struk</h1>
        {image && (
          <img src={image} alt="Struk" className="w-full rounded-xl border-2 border-[#171717] max-h-64 object-contain" />
        )}
        {processing ? (
          <div className="card-pink p-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-pinkfanta-200 border-t-pinkfanta-500 rounded-full animate-spin" />
            <p className="text-sm font-bold text-[#6B6B6B]">Membaca struk...</p>
          </div>
        ) : (
          <button onClick={handleScan} className="w-full btn-pink py-3.5 flex items-center justify-center gap-2">
            <Sparkles size={20} /> Proses Struk
          </button>
        )}
        <button onClick={() => { setStage('idle'); setImage(null); }} className="w-full btn-white py-2.5 text-sm">
          Batal
        </button>
      </div>
    );
  }

  // Confirm stage
  return (
    <div className="space-y-4 pb-4">
      <h1 className="text-2xl font-extrabold text-[#171717]">Cek Transaksi</h1>

      {image && (
        <img src={image} alt="Struk" className="w-full rounded-xl border-2 border-[#171717] max-h-32 object-contain" />
      )}

      <div className="card-pink p-4 space-y-3">
        <div>
          <p className="text-xs font-bold text-[#6B6B6B]">Toko</p>
          <p className="text-lg font-bold text-[#171717]">{scanned.storeName}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-[#6B6B6B]">Tanggal</p>
            <p className="text-sm font-bold text-[#171717]">{formatDateID(scanned.date)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B6B6B]">Total</p>
            <p className="text-lg font-extrabold text-pinkfanta-500">{formatRupiah(parseInt(scanned.total) || 0)}</p>
          </div>
        </div>
        {scanned.items.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#6B6B6B] mb-1.5">Items</p>
            <div className="space-y-1">
              {scanned.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#171717]">{item.qty}x {item.name}</span>
                  <span className="font-semibold text-[#6B6B6B]">{formatRupiah(parseInt(item.price) || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-[#6B6B6B] mb-1.5 block">Kategori</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-pink">
          {data.categories.filter((c) => c.type === 'expense' || c.type === 'both').map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={() => { setStage('idle'); setImage(null); }} className="btn-white flex-1 py-3 text-sm">
          Batal
        </button>
        <button onClick={handleSave} className="flex-1 btn-pink py-3 flex items-center justify-center gap-2">
          <Check size={20} /> Simpan
        </button>
      </div>
    </div>
  );
}
