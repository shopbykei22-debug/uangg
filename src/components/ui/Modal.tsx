import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg animate-pop max-h-[85vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#171717] shrink-0">
            <h3 className="text-lg font-bold text-[#171717]">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-pinkfanta-50 border-2 border-[#171717] flex items-center justify-center active:scale-90 transition"
              aria-label="Tutup"
            >
              <span className="text-[#171717] font-bold text-sm">✕</span>
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-5 py-4 no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
