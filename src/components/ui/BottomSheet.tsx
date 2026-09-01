import { type ReactNode, useEffect } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[440px] bg-white border-t-2 border-x-2 border-[#171717] rounded-t-3xl shadow-offset-lg animate-slide-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
          {title && <h3 className="text-lg font-bold text-[#171717] mt-2">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-full bg-pinkfanta-50 border-2 border-[#171717] flex items-center justify-center active:scale-90 transition mt-2"
            aria-label="Tutup"
          >
            <span className="text-[#171717] font-bold">✕</span>
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-6 no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
