import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { 
  QrCode, 
  Search, 
  X, 
  Barcode, 
  CheckCircle2, 
  ClipboardList, 
  Boxes, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    jobOrders, 
    inventory, 
    advanceJobStage, 
    setSelectedJobId, 
    setActiveTab 
  } = useErp();

  const [inputCode, setInputCode] = useState('');
  const [matchedJob, setMatchedJob] = useState<any | null>(null);
  const [matchedItem, setMatchedItem] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleScan = (code: string) => {
    const clean = code.trim().toUpperCase();
    setInputCode(clean);

    // Search Job Orders
    const job = jobOrders.find(
      (j) => j.orderNumber.toUpperCase() === clean || j.id.toUpperCase() === clean
    );

    // Search Inventory
    const item = inventory.find((i) => i.sku.toUpperCase() === clean);

    setMatchedJob(job || null);
    setMatchedItem(item || null);
  };

  const QUICK_SAMPLES = [
    { code: 'SPK-2026-0042', label: 'SPK Berjalan (Wiring)', type: 'JOB' },
    { code: 'SPK-2026-0043', label: 'SPK Material Prep', type: 'JOB' },
    { code: 'SPK-2026-0044', label: 'SPK QC Check', type: 'JOB' },
    { code: 'RAW-STL-002', label: 'Plat Baja SPCC 2.0mm', type: 'ITEM' },
    { code: 'ELC-MCB-063', label: 'MCB Schneider 63A', type: 'ITEM' },
    { code: 'HDW-BLT-M8', label: 'Baut Hex M8 (Kritis)', type: 'ITEM' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-sm w-full max-w-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#1a2332] text-white p-3.5 flex items-center justify-between border-b border-[#2d3748]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#f59e0b] rounded-xs" />
            <QrCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Simulator Pemindai Barcode / QR Code Lapangan
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#253247] rounded-sm text-neutral-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Scanner Viewport Simulation */}
          <div className="bg-neutral-950 p-6 border-2 border-dashed border-emerald-500/60 relative text-center flex flex-col items-center justify-center">
            <div className="w-48 h-32 border-2 border-emerald-400/80 relative flex items-center justify-center">
              {/* Scan laser line animation */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <Barcode className="w-20 h-20 text-neutral-600" />
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arahkan barcode SPK atau label rak material</span>
            </div>
          </div>

          {/* Quick Click Samples */}
          <div>
            <div className="text-[11px] font-bold uppercase text-neutral-600 mb-1.5">
              Pilih Contoh Tag / Barcode untuk Pengujian Cepat:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {QUICK_SAMPLES.map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => handleScan(sample.code)}
                  className="p-1.5 text-left border border-neutral-300 hover:border-black hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className="font-mono font-bold text-[11px] text-neutral-900">{sample.code}</div>
                  <div className="text-[10px] text-neutral-500 truncate">{sample.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Barcode */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ketik atau paste kode SPK / SKU..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 p-2 border border-neutral-300 font-mono text-xs focus:outline-none focus:border-black uppercase"
            />
            <button
              onClick={() => handleScan(inputCode)}
              className="bg-neutral-800 hover:bg-black text-white px-4 py-2 font-bold uppercase tracking-wider cursor-pointer"
            >
              Cari / Pindai
            </button>
          </div>

          {/* Matched Result */}
          {matchedJob && (
            <div className="p-3 bg-blue-50 border border-blue-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-blue-900 text-sm">
                  {matchedJob.orderNumber}
                </span>
                <span className="bg-[#0050ef] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                  {matchedJob.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs font-bold text-neutral-900">{matchedJob.productName} ({matchedJob.targetQty} Unit)</div>
              <div className="text-xs text-neutral-600">
                Klien: {matchedJob.clientName} | Lead: {matchedJob.leadTechnician} | Progress: {matchedJob.progressPercent}%
              </div>
              <div className="pt-2 border-t border-blue-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedJobId(matchedJob.id);
                    setActiveTab('jobs');
                    onClose();
                  }}
                  className="text-xs font-bold text-[#0050ef] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Buka di Papan SPK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    advanceJobStage(matchedJob.id);
                    onClose();
                  }}
                  className="bg-[#0050ef] hover:bg-blue-700 text-white px-3 py-1 font-bold uppercase text-[10px] cursor-pointer"
                >
                  Lanjutkan Tahap Langsung
                </button>
              </div>
            </div>
          )}

          {matchedItem && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-emerald-900 text-sm">
                  {matchedItem.sku}
                </span>
                <span className="bg-[#107c41] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                  {matchedItem.stock <= matchedItem.safetyMin ? 'STOK KRITIS' : 'STOK TERSEDIA'}
                </span>
              </div>
              <div className="text-xs font-bold text-neutral-900">{matchedItem.name}</div>
              <div className="text-xs text-neutral-600">
                Stok Fisik: <strong className="font-mono text-neutral-900">{matchedItem.stock} {matchedItem.unit}</strong> | Rak: {matchedItem.binLocation}
              </div>
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-end">
                <button
                  onClick={() => {
                    setActiveTab('inventory');
                    onClose();
                  }}
                  className="bg-[#107c41] hover:bg-emerald-700 text-white px-3 py-1 font-bold uppercase text-[10px] cursor-pointer flex items-center gap-1"
                >
                  <span>Buka di Gudang Inventaris</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {!matchedJob && !matchedItem && inputCode && (
            <div className="p-3 bg-neutral-100 border border-neutral-300 text-neutral-500 text-center">
              Kode "{inputCode}" tidak ditemukan di database SPK atau inventaris.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold uppercase bg-neutral-300 hover:bg-neutral-400 text-neutral-800 cursor-pointer"
          >
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
