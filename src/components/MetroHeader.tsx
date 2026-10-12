import React from 'react';
import { useErp } from '../context/ErpContext';
import { 
  Boxes, 
  QrCode, 
  Play, 
  Pause, 
  Clock, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface MetroHeaderProps {
  onOpenScanner: () => void;
  onOpenNewJob: () => void;
}

export const MetroHeader: React.FC<MetroHeaderProps> = ({ onOpenScanner }) => {
  const { 
    currentTime, 
    isSimulating, 
    toggleSimulation, 
    resetToSampleData, 
    projectManager 
  } = useErp();

  // Format Indonesian date and time
  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="bg-[#107c41] text-white border-b-4 border-[#0e6b37] select-none no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Zone: Clean single-line wordmark */}
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#107c41] p-1.5 font-black text-lg tracking-wider flex items-center justify-center shadow-inner">
            <Boxes className="w-5 h-5 text-[#107c41]" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight leading-none uppercase font-sans">
              METRO·ERP
            </div>
            <div className="text-[11px] font-medium text-emerald-100 tracking-wide">
              SISTEM PELACAKAN SPK & INVENTARIS REAL-TIME
            </div>
          </div>
        </div>

        {/* Center / Plant Shift Info */}
        <div className="hidden lg:flex items-center gap-4 text-xs bg-[#0c5e31] px-3 py-1.5 border border-[#1b8e4e]">
          <div className="flex items-center gap-1.5 text-emerald-100 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span className="tabular-nums font-semibold">{formattedTime} WIB</span>
            <span className="text-emerald-400">·</span>
            <span>{formattedDate}</span>
          </div>
          <span className="text-emerald-400">|</span>
          <div className="flex items-center gap-1.5 text-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold text-white">Shift 1 (Pagi)</span>
            <span className="text-emerald-300">· Plant Cikarang Blok C</span>
          </div>
        </div>

        {/* Action Controls & User Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Barcode Scanner */}
          <button
            onClick={onOpenScanner}
            title="Pindai Barcode / QR SPK atau SKU"
            className="flex items-center gap-1.5 bg-[#0050ef] hover:bg-[#0040c0] text-white px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR / SPK</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            title={isSimulating ? 'Jeda Simulasi Real-Time' : 'Aktifkan Simulasi Real-Time'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              isSimulating
                ? 'bg-[#fa6800] hover:bg-[#e05d00] text-white'
                : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulasi: On</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulasi: Jeda</span>
              </>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetToSampleData}
            title="Reset ke Data Bawaan"
            className="p-1.5 bg-[#0c5e31] hover:bg-[#157a42] text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Project Manager Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-emerald-600">
            <img
              src={projectManager.avatar}
              alt={projectManager.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 object-cover border border-emerald-300"
            />
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-bold text-white truncate max-w-[130px]">
                {projectManager.name}
              </div>
              <div className="text-[10px] text-emerald-200">
                Project Manager
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
