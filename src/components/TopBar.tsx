import React from 'react';
import { useErp } from '../context/ErpContext';
import { 
  Bell, 
  Clock, 
  QrCode, 
  Play, 
  Pause, 
  RotateCcw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface TopBarProps {
  onOpenScanner: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenScanner }) => {
  const { 
    currentTime, 
    activeTab, 
    selectedJobId, 
    jobOrders, 
    selectedSkuId, 
    inventory,
    isSimulating, 
    toggleSimulation, 
    resetToSampleData, 
    projectManager 
  } = useErp();

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const selectedJob = jobOrders.find((j) => j.id === selectedJobId);
  const selectedItem = inventory.find((i) => i.sku === selectedSkuId);

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'jobs':
        return {
          title: selectedJob ? `${selectedJob.orderNumber} - ${selectedJob.productName}` : 'Pelacakan Job Order (SPK)',
          path: `100 • M200805 • Divisi Fabrikasi & Perakitan > Pelacakan SPK > ${selectedJob ? selectedJob.orderNumber : 'Daftar'}`
        };
      case 'inventory':
        return {
          title: selectedItem ? `${selectedItem.sku} - ${selectedItem.name}` : 'Manajemen Inventaris & Gudang',
          path: `100 • M200805 • Logistik & Pergudangan > Master Katalog SKU > ${selectedItem ? selectedItem.sku : 'Daftar'}`
        };
      case 'team':
        return {
          title: 'Workstation & Performa Tim Harian',
          path: '100 • M200805 • Monitoring Lini Produksi > Status Mesin & Operator'
        };
      case 'report':
        return {
          title: 'Laporan Tutup Harian Otomatis',
          path: '100 • M200805 • Executive Management > Laporan Harian Project Manager'
        };
      case 'hub':
      default:
        return {
          title: 'Dashboard Utama & Ringkasan Eksekutif',
          path: '100 • M200805 • Executive Management > Ringkasan Live Tiles'
        };
    }
  };

  const sectionInfo = getSectionTitle();

  return (
    <header className="bg-[#1a2332] text-white border-b border-[#2d3748] h-12 flex items-center justify-between px-3 sm:px-4 select-none shrink-0 no-print z-20">
      {/* Left: Section Header with Orange Accent Bar (exact match to screenshot) */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* Orange Accent Bar from screenshot */}
          <div className="w-[3px] h-7 bg-[#f59e0b] shrink-0" />
          
          <div className="truncate">
            <h1 className="text-sm font-bold text-white tracking-wide truncate leading-tight">
              {sectionInfo.title}
            </h1>
            <div className="text-[10px] text-neutral-400 font-mono tracking-tight truncate flex items-center gap-1">
              <span className="bg-neutral-800 px-1 text-[9px] text-neutral-300 rounded-xs border border-neutral-700">100</span>
              <span>•</span>
              <span>{sectionInfo.path}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Shift, Clock, Scanner, Notification & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live WIB Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-300 font-mono bg-[#141b27] px-2.5 py-1 rounded-sm border border-[#2d3748]">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="tabular-nums font-semibold">{formattedTime} WIB</span>
          <span className="text-neutral-600">|</span>
          <span className="text-[11px] text-neutral-400">Shift 1 (Pagi)</span>
        </div>

        {/* Quick QR Scanner */}
        <button
          onClick={onOpenScanner}
          title="Pindai QR / Barcode SPK"
          className="flex items-center gap-1.5 bg-[#253247] hover:bg-[#2e3e57] text-neutral-200 hover:text-white px-2.5 py-1 text-xs font-medium rounded-sm border border-[#3b4c68] transition-colors cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline text-[11px]">Scan SPK</span>
        </button>

        {/* Real-time simulation toggle */}
        <button
          onClick={toggleSimulation}
          title={isSimulating ? 'Jeda Simulasi Real-Time' : 'Aktifkan Simulasi'}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer ${
            isSimulating
              ? 'bg-[#1b382b] text-emerald-300 border-emerald-700/60'
              : 'bg-[#253247] text-neutral-300 border-[#3b4c68]'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Simulasi: On</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-neutral-400" />
              <span className="hidden sm:inline">Simulasi: Jeda</span>
            </>
          )}
        </button>

        {/* Reset button */}
        <button
          onClick={resetToSampleData}
          title="Reset Data Bawaan"
          className="p-1 text-neutral-400 hover:text-white hover:bg-[#253247] rounded-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Icon (matching screenshot) */}
        <div className="relative p-1 text-neutral-400 hover:text-white cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </div>

        {/* User Monogram Avatar (matching screenshot style e.g. John-Maximilian Doe [JD]) */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#2d3748]">
          <span className="text-xs text-neutral-200 font-medium hidden lg:inline">
            {projectManager.name}
          </span>
          <div className="w-7 h-7 rounded-full bg-[#3b4c68] text-white flex items-center justify-center font-bold text-xs border border-neutral-400/30">
            SH
          </div>
        </div>
      </div>
    </header>
  );
};
