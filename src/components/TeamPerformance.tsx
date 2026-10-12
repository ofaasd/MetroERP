import React from 'react';
import { useErp } from '../context/ErpContext';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  Printer
} from 'lucide-react';

export const TeamPerformance: React.FC = () => {
  const { 
    workstations, 
    updateWorkstationStatus, 
    jobOrders, 
    getKpiSummary, 
    setActiveTab 
  } = useErp();

  const kpis = getKpiSummary();

  const totalActual = workstations.reduce((acc, ws) => acc + ws.outputToday, 0);
  const totalTarget = workstations.reduce((acc, ws) => acc + ws.targetToday, 0);
  const overallTargetPercentage = Math.round((totalActual / totalTarget) * 100);

  return (
    <div className="space-y-4">
      {/* Command Bar */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#f59e0b] rounded-xs" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Monitoring Performa Harian Lini Produksi & Workstation
            </h2>
            <p className="text-[11px] text-neutral-500">
              Metrik akurat output per lini pengerjaan, tingkat efisiensi operator, dan status mesin pabrik Cikarang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white px-3 py-1.5 text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Buka Laporan Tutup Harian</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-neutral-50 border border-[#cbd5e1] text-neutral-800 px-3 py-1.5 text-xs font-semibold rounded-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dashboard</span>
          </button>
        </div>
      </div>

      {/* REFINED ELEGANT GRAY & WHITE KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Total Output Tim Hari Ini
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums leading-none mt-2 text-neutral-900">
              {totalActual} <span className="text-xs font-normal text-neutral-500">/ {totalTarget} Unit</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Pencapaian: {overallTargetPercentage}% dari target shift
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Rata-Rata Efisiensi (OEE)
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums leading-none mt-2 text-neutral-900">
              {kpis.efficiencyRate}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Target minimum SLA: 90.0%
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Quality Yield (Lolos Uji)
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums leading-none mt-2 text-emerald-800">
              {(100 - kpis.scrapRate).toFixed(1)}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Scrap defect rate: {kpis.scrapRate}%
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Shift Aktif
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-900 leading-none mt-2">
              Shift 1 (Pagi)
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 font-mono">
              08:00 - 16:00 WIB • 4 Lini Aktif
            </div>
          </div>
        </div>
      </div>

      {/* WORKSTATION TILES GRID */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-neutral-600" />
            Status Workstation & Operator Bertugas (Lini Produksi)
          </h3>
          <span className="text-xs text-neutral-400">
            Ubah status untuk mengupdate kondisi mesin secara real-time
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workstations.map((ws) => {
            const isRunning = ws.status === 'RUNNING';
            const isIdle = ws.status === 'IDLE';
            const percent = Math.round((ws.outputToday / ws.targetToday) * 100);
            const activeJob = jobOrders.find((j) => j.orderNumber === ws.currentJobNumber);

            return (
              <div
                key={ws.id}
                className="bg-white border border-[#cbd5e1] rounded-sm p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {ws.avatar ? (
                        <img
                          src={ws.avatar}
                          alt={ws.lead}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 object-cover rounded-sm border border-[#cbd5e1] shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-neutral-800 text-white flex items-center justify-center font-bold text-xs rounded-sm shrink-0">
                          {ws.code.split('-')[1]}
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] font-mono font-bold text-neutral-400">{ws.code}</div>
                        <h4 className="text-xs font-bold text-neutral-900 leading-tight">{ws.name}</h4>
                        <div className="text-xs text-neutral-600 mt-0.5">
                          Lead: <strong>{ws.lead}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <select
                        value={ws.status}
                        onChange={(e) => updateWorkstationStatus(ws.id, e.target.value as any)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border rounded-xs cursor-pointer ${
                          isRunning
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isIdle
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="RUNNING">BERJALAN (RUNNING)</option>
                        <option value="IDLE">STANDBY (IDLE)</option>
                        <option value="MAINTENANCE">PERAWATAN (MAINT)</option>
                      </select>
                      <span className="text-[10px] text-neutral-400 mt-1 font-mono">
                        {ws.activeShift}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0] rounded-sm mb-3 text-xs">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">
                      SPK Sedang Dikerjakan:
                    </div>
                    {activeJob ? (
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <span className="font-mono font-bold text-neutral-900 mr-2">
                            {activeJob.orderNumber}
                          </span>
                          <span className="text-neutral-700 font-medium truncate">
                            {activeJob.productName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">
                          {activeJob.progressPercent}%
                        </span>
                      </div>
                    ) : (
                      <div className="text-neutral-400 italic mt-0.5">
                        Menunggu penugasan SPK baru dari antrean
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>Pencapaian: {ws.outputToday} dari {ws.targetToday} Unit</span>
                      <span className="font-mono font-bold text-neutral-900">{percent}%</span>
                    </div>

                    <div className="w-full bg-neutral-100 h-1.5 rounded-xs overflow-hidden">
                      <div
                        className="h-1.5 bg-[#16a34a] transition-all"
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Efisiensi:</span>
                    <strong className="font-mono text-neutral-900">{ws.efficiencyRate}%</strong>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">Shift 1</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTLENECK ANALYSIS */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Analisis Hambatan (Bottleneck) & Rekomendasi Lini Hari Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-700">
          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm">
            <div className="font-bold text-neutral-900 mb-1">1. Lini Finishing & Powder Coating</div>
            <div className="text-neutral-600">
              Tingkat efisiensi (88.0%) sedikit di bawah ambang 90%. Waktu oven curing rata-rata memerlukan 45 menit per batch. Disarankan batching warna seragam RAL 7035 agar waktu setup hemat 20%.
            </div>
          </div>

          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm">
            <div className="font-bold text-neutral-900 mb-1">2. Alokasi Komponen Elektrikal</div>
            <div className="text-neutral-600">
              Komponen MCB Schneider dan kabel NYAF memerlukan verifikasi kitting 15 menit sebelum serah terima ke Workstation Perakitan agar teknisi tidak menunggu stok.
            </div>
          </div>

          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm">
            <div className="font-bold text-neutral-900 mb-1">3. Lini Quality Control & Sertifikasi</div>
            <div className="text-neutral-600">
              Tingkat inspeksi stabil di 98.4% efisiensi tanpa antrean menumpuk. Hasil pengujian Megger isolasi 1000V tercatat 100% lolos uji tanpa reject hari ini.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
