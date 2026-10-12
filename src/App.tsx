import React, { useState } from 'react';
import { ErpProvider, useErp } from './context/ErpContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { JobOrderMasterDetail } from './components/JobOrderMasterDetail';
import { InventoryMasterDetail } from './components/InventoryMasterDetail';
import { ExecutiveHub } from './components/ExecutiveHub';
import { TeamPerformance } from './components/TeamPerformance';
import { DailyReportView } from './components/DailyReportView';
import { NewJobOrderModal } from './components/NewJobOrderModal';
import { StockActionModal } from './components/StockActionModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { MetroToast } from './components/MetroToast';

function MainAppContent() {
  const { activeTab } = useErp();

  // Modals state
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [stockModalConfig, setStockModalConfig] = useState<{
    isOpen: boolean;
    mode: 'RESTOCK' | 'STOCK_OUT' | 'NEW_ITEM';
  }>({
    isOpen: false,
    mode: 'RESTOCK',
  });
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleOpenRestock = () => {
    setStockModalConfig({ isOpen: true, mode: 'RESTOCK' });
  };

  const handleOpenStockOut = () => {
    setStockModalConfig({ isOpen: true, mode: 'STOCK_OUT' });
  };

  const handleOpenNewItem = () => {
    setStockModalConfig({ isOpen: true, mode: 'NEW_ITEM' });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef2f6] text-neutral-900 font-sans">
      {/* Left Sidebar (Dark Charcoal with hierarchical tree & search ⌘K matching screenshot) */}
      <Sidebar
        onOpenNewJob={() => setIsNewJobOpen(true)}
        onOpenRestock={handleOpenRestock}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top App Bar (matching screenshot dark top bar with orange section line & breadcrumbs) */}
        <TopBar onOpenScanner={() => setIsScannerOpen(true)} />

        {/* Content Viewport */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto bg-[#eef2f6]">
          {activeTab === 'jobs' && (
            <JobOrderMasterDetail
              onOpenNewJob={() => setIsNewJobOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryMasterDetail
              onOpenRestock={handleOpenRestock}
              onOpenStockOut={handleOpenStockOut}
              onOpenNewItem={handleOpenNewItem}
            />
          )}

          {activeTab === 'hub' && (
            <ExecutiveHub
              onOpenNewJob={() => setIsNewJobOpen(true)}
              onOpenRestock={handleOpenRestock}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {activeTab === 'team' && (
            <TeamPerformance />
          )}

          {activeTab === 'report' && (
            <DailyReportView />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewJobOrderModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
      />

      <StockActionModal
        isOpen={stockModalConfig.isOpen}
        mode={stockModalConfig.mode}
        onClose={() => setStockModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* Metro Toast notification */}
      <MetroToast />
    </div>
  );
}

export default function App() {
  return (
    <ErpProvider>
      <MainAppContent />
    </ErpProvider>
  );
}
