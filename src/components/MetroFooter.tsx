import React from 'react';
import { useErp } from '../context/ErpContext';
import { ShieldCheck, HardDrive, Cpu, ArrowUpRight } from 'lucide-react';

export const MetroFooter: React.FC = () => {
  const { projectManager, setActiveTab } = useErp();

  return (
    <footer className="bg-[#1f1f1f] text-neutral-400 border-t border-neutral-700 py-6 mt-12 text-xs select-none no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Plant & Facility Info */}
        <div className="space-y-1">
          <div className="text-neutral-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#107c41] inline-block" />
            PT Mitra Teknik Rekayasa · MetroERP
          </div>
          <div className="text-neutral-400 text-[11px]">
            {projectManager.plantLocation}
          </div>
        </div>

        {/* Center: Clean Quick Links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('hub')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Ringkasan Utama
          </button>
          <span className="text-neutral-600">·</span>
          <button
            onClick={() => setActiveTab('jobs')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Job Order
          </button>
          <span className="text-neutral-600">·</span>
          <button
            onClick={() => setActiveTab('inventory')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Gudang Inventaris
          </button>
          <span className="text-neutral-600">·</span>
          <button
            onClick={() => setActiveTab('team')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Lini Kerja
          </button>
          <span className="text-neutral-600">·</span>
          <button
            onClick={() => setActiveTab('report')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Laporan Tutup Harian
          </button>
        </div>

        {/* Right: Operational Signoff */}
        <div className="text-right text-[11px] text-neutral-400">
          <div>Supervisor Operasional: {projectManager.name}</div>
          <div className="text-neutral-500 font-mono">Metro UI Industrial Standard</div>
        </div>
      </div>
    </footer>
  );
};
