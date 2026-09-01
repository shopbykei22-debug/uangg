import { useState } from 'react';
import { StoreProvider } from '@/lib/store';
import { BottomNavigation, type Page } from '@/components/BottomNavigation';
import { TransactionModal, QuickAddSheet } from '@/components/TransactionModal';
import { Modal } from '@/components/ui/Modal';
import { HomePage } from '@/pages/HomePage';
import { ScanPage } from '@/pages/ScanPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { ReportPage } from '@/pages/ReportPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { BudgetsPage } from '@/pages/BudgetsPage';
import { SavingsPage } from '@/pages/SavingsPage';
import { AccountsPage } from '@/pages/AccountsPage';
import { WidgetPage } from '@/pages/WidgetPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ArrowLeft } from 'lucide-react';
import type { TransactionType, Transaction } from '@/lib/types';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [presetCategoryId, setPresetCategoryId] = useState<string | undefined>(undefined);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const openAdd = (type: TransactionType, categoryId?: string) => {
    setTransactionType(type);
    setPresetCategoryId(categoryId);
    setEditTransaction(null);
    setShowTransactionModal(true);
    setShowQuickAdd(false);
  };

  const openEdit = (t: Transaction) => {
    setEditTransaction(t);
    setTransactionType(t.type);
    setPresetCategoryId(undefined);
    setShowTransactionModal(true);
  };

  const isSubPage = ['categories', 'budgets', 'savings', 'accounts', 'widget'].includes(page);

  return (
    <div className="min-h-screen bg-pinkfanta-50 flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-pinkfanta-50 relative flex flex-col">
        {/* Sub-page header with back button */}
        {isSubPage && (
          <div className="sticky top-0 z-30 bg-pinkfanta-50 px-4 pt-3 pb-1 flex items-center gap-2">
            <button
              onClick={() => setPage('home')}
              className="w-9 h-9 bg-white border-2 border-[#171717] rounded-xl shadow-offset-sm flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              aria-label="Kembali"
            >
              <ArrowLeft size={18} className="text-pinkfanta-500" />
            </button>
            <span className="text-sm font-bold text-[#6B6B6B]">Kembali ke Home</span>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 pt-4 pb-28">
          {page === 'home' && (
            <HomePage
              onNavigate={setPage}
              onAddTransaction={openAdd}
              onOpenSettings={() => setShowSettings(true)}
            />
          )}
          {page === 'scan' && <ScanPage onSaved={() => setPage('transactions')} />}
          {page === 'transactions' && (
            <TransactionsPage
              onEditTransaction={openEdit}
              onAddTransaction={() => setShowQuickAdd(true)}
            />
          )}
          {page === 'report' && <ReportPage />}
          {page === 'categories' && <CategoriesPage />}
          {page === 'budgets' && <BudgetsPage />}
          {page === 'savings' && <SavingsPage />}
          {page === 'accounts' && <AccountsPage />}
          {page === 'widget' && <WidgetPage />}
        </main>

        {/* Bottom navigation */}
        <BottomNavigation
          current={page}
          onNavigate={setPage}
          onAdd={() => setShowQuickAdd(true)}
        />

        {/* Quick add sheet */}
        <QuickAddSheet
          open={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          onSelect={(type) => openAdd(type)}
        />

        {/* Transaction modal */}
        <TransactionModal
          open={showTransactionModal}
          onClose={() => { setShowTransactionModal(false); setEditTransaction(null); }}
          defaultType={transactionType}
          presetCategoryId={presetCategoryId}
          editTransaction={editTransaction}
        />

        {/* Settings modal */}
        <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Pengaturan" maxWidth="max-w-md">
          <SettingsPage onNavigate={setPage} onClose={() => setShowSettings(false)} />
        </Modal>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
