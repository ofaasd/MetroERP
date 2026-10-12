import React from 'react';
import { useErp } from '../context/ErpContext';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertOctagon, 
  TrendingUp, 
  Boxes, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  FileSpreadsheet, 
  QrCode, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Warehouse
} from 'lucide-react';

interface ExecutiveHubProps {
  onOpenNewJob: () => void;
  onOpenRestock: () => void;
  onOpenScanner: () => void;
}

export const ExecutiveHub: React.FC<ExecutiveHubProps> = ({
  onOpenNewJob,
  onOpenRestock,
  onOpenScanner,
}) => {
  const { 
    jobOrders, 
    inventory, 
    movements, 
    getKpiSummary, 
    setActiveTab, 
    setSelectedJobId,
    advanceJobStage 
  } = useErp();

  const kpis = getKpiSummary();

  const urgentJobs = jobOrders
    .filter((j) => j.status !== 'COMPLETED' && j.status !== 'DISPATCHED')
    .sort((a, b) => {
      const pOrder = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    })
    .slice(0, 4);

  const criticalItems = inventory.filter((item) => item.stock <= item.safetyMin);

  return (
    <div className="space-y-4">
      {/* Quick Action Toolbar - Elegant White & Slate */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#f59e0b] rounded-xs" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Aksi Cepat Operasional
          </span>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            • Akses alur kerja pabrik & gudang Cikarang
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-3 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat SPK Baru</span>
          </button>

          <button
            onClick={onOpenRestock}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Penerimaan Stok</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>Laporan Harian PM</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 bg-[#1e293b] hover:bg-black text-white px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan SPK</span>
          </button>
        </div>
      </div>

      {/* ELEGANT GRAY & WHITE METRICS TILES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Job Orders */}
        <div
          onClick={() => setActiveTab('jobs')}
          className="bg-white border border-[#cbd5e1] hover:border-emerald-600 rounded-sm p-3.5 cursor-pointer shadow-xs transition-all flex flex-col justify-between h-32"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              SPK Aktif
            </span>
            <div className="p-1 rounded-sm bg-blue-50 text-blue-700">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
              {kpis.activeOrdersInFlight} <span className="text-xs font-normal text-neutral-500">SPK</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
              <span>Total antrean: {jobOrders.length}</span>
              <ChevronRight className="w-3 h-3 text-neutral-400 inline" />
            </div>
          </div>
        </div>

        {/* Card 2: Units Completed Today */}
        <div
          onClick={() => setActiveTab('report')}
          className="bg-white border border-[#cbd5e1] hover:border-emerald-600 rounded-sm p-3.5 cursor-pointer shadow-xs transition-all flex flex-col justify-between h-32"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Output Hari Ini
            </span>
            <div className="p-1 rounded-sm bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-800 tabular-nums">
              {kpis.totalUnitsProduced} <span className="text-xs font-normal text-neutral-500">Unit</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Target: 12 Unit ({Math.round((kpis.totalUnitsProduced / 12) * 100)}%)
            </div>
          </div>
        </div>

        {/* Card 3: Critical Low Stock Items */}
        <div
          onClick={() => setActiveTab('inventory')}
          className={`border rounded-sm p-3.5 cursor-pointer shadow-xs transition-all flex flex-col justify-between h-32 ${
            criticalItems.length > 0 ? 'bg-red-50/40 border-red-300' : 'bg-white border-[#cbd5e1]'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase text-red-700">
              Stok Kritis
            </span>
            <div className="p-1 rounded-sm bg-red-100 text-red-700">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-red-700 tabular-nums">
              {criticalItems.length} <span className="text-xs font-normal text-neutral-500">Item</span>
            </div>
            <div className="text-[10px] text-red-600 mt-1 truncate">
              {criticalItems.length > 0 ? 'Di bawah safety stock' : 'Semua stok aman'}
            </div>
          </div>
        </div>

        {/* Card 4: Operational Efficiency (OEE) */}
        <div
          onClick={() => setActiveTab('team')}
          className="bg-white border border-[#cbd5e1] hover:border-emerald-600 rounded-sm p-3.5 cursor-pointer shadow-xs transition-all flex flex-col justify-between h-32"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Efisiensi (OEE)
            </span>
            <div className="p-1 rounded-sm bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
              {kpis.efficiencyRate}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Target SLA: &ge; 90.0%
            </div>
          </div>
        </div>

        {/* Card 5: Inventory Asset Valuation */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="bg-white border border-[#cbd5e1] hover:border-emerald-600 rounded-sm p-3.5 cursor-pointer shadow-xs transition-all flex flex-col justify-between h-32"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Valuasi Gudang
            </span>
            <div className="p-1 rounded-sm bg-teal-50 text-teal-700">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black font-mono text-neutral-900 tabular-nums truncate">
              Rp {(kpis.totalStockValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              {inventory.length} SKU terdaftar
            </div>
          </div>
        </div>

        {/* Card 6: On-Time Delivery */}
        <div
          onClick={() => setActiveTab('report')}
          className="bg-white border border-[#cbd5e1] hover:border-emerald-600 rounded-sm p-3.5 cursor-pointer shadow-xs transition-all flex flex-col justify-between h-32"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-500">
              Ketepatan (OTD)
            </span>
            <div className="p-1 rounded-sm bg-purple-50 text-purple-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
              {kpis.onTimeDeliveryRate}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Scrap defect: {kpis.scrapRate}%
            </div>
          </div>
        </div>
      </div>

      {/* TWO PANEL WORKSPACE: Urgent Pipeline & Real-Time Stock Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Job Orders Pipeline (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#cbd5e1] rounded-sm shadow-xs flex flex-col">
          <div className="p-3 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Job Order Prioritas (Urgent Pipeline)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Buka Master-Detail SPK ({jobOrders.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#f1f5f9] flex-1">
            {urgentJobs.map((job) => {
              return (
                <div 
                  key={job.id} 
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setActiveTab('jobs');
                  }}
                  className="p-3.5 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 px-1.5 py-0.2 rounded-xs">
                        {job.orderNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                        job.priority === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {job.priority}
                      </span>
                      <span className="text-xs font-medium text-neutral-600">
                        {job.clientName}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-700 uppercase">
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-neutral-900 mb-2">
                    {job.productName} ({job.targetQty} Unit)
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Tim: <strong className="text-neutral-800">{job.assignedTeam}</strong></span>
                      <span className="font-mono font-bold text-neutral-900">{job.progressPercent}%</span>
                    </div>

                    <div className="w-full bg-neutral-100 h-1.5 rounded-xs overflow-hidden">
                      <div
                        className="h-1.5 bg-[#16a34a] transition-all"
                        style={{ width: `${job.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>Target: {job.dueDate}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        advanceJobStage(job.id);
                      }}
                      className="bg-[#1e293b] hover:bg-black text-white px-2.5 py-1 text-[10px] font-bold uppercase rounded-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lanjut Tahap</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Stock Ledger Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#cbd5e1] rounded-sm shadow-xs flex flex-col">
          <div className="p-3 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Mutasi Inventaris Real-Time
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Gudang
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#f1f5f9] flex-1 overflow-y-auto max-h-[380px]">
            {movements.map((mov) => {
              const isOut = mov.type === 'OUT';
              const isIn = mov.type === 'IN';

              return (
                <div key={mov.id} className="p-3 hover:bg-[#f8fafc] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div
                        className={`p-1 rounded-sm font-mono font-bold text-xs shrink-0 ${
                          isOut ? 'bg-amber-100 text-amber-800' : isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isOut ? <ArrowDownRight className="w-3.5 h-3.5" /> : isIn ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-neutral-900 leading-tight">
                          {mov.itemName}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {mov.sku} • Ref: {mov.reference}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-xs font-black font-mono tabular-nums ${
                          isOut ? 'text-amber-700' : isIn ? 'text-emerald-700' : 'text-blue-700'
                        }`}
                      >
                        {isOut ? `-${mov.qty}` : isIn ? `+${mov.qty}` : `~${mov.qty}`}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {mov.timestamp.split(' ')[1] || mov.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
