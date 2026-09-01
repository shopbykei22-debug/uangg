import { Home, Receipt, BarChart3, Plus, ScanLine } from 'lucide-react';

export type Page = 'home' | 'scan' | 'transactions' | 'report' | 'categories' | 'budgets' | 'savings' | 'accounts' | 'widget';

interface BottomNavigationProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onAdd: () => void;
}

export function BottomNavigation({ current, onNavigate, onAdd }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40 safe-bottom">
      <div className="mx-2 mb-2 bg-white border-2 border-[#171717] rounded-2xl shadow-offset-lg flex items-center justify-around px-2 py-2">
        <NavButton
          icon={<Home size={22} />}
          label="Home"
          active={current === 'home'}
          onClick={() => onNavigate('home')}
        />
        <NavButton
          icon={<ScanLine size={22} />}
          label="Scan"
          active={current === 'scan'}
          onClick={() => onNavigate('scan')}
        />
        <button
          onClick={onAdd}
          className="w-14 h-14 -mt-6 bg-pinkfanta-500 text-white border-2 border-[#171717] rounded-2xl shadow-offset flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
          aria-label="Tambah Transaksi"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
        <NavButton
          icon={<Receipt size={22} />}
          label="Transaksi"
          active={current === 'transactions'}
          onClick={() => onNavigate('transactions')}
        />
        <NavButton
          icon={<BarChart3 size={22} />}
          label="Report"
          active={current === 'report'}
          onClick={() => onNavigate('report')}
        />
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="nav-item flex-1">
      <div
        className={`p-1.5 rounded-xl transition-all duration-150 ${
          active ? 'bg-pinkfanta-100 text-pinkfanta-500' : 'text-[#6B6B6B]'
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-[10px] font-semibold ${
          active ? 'text-pinkfanta-500' : 'text-[#6B6B6B]'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
