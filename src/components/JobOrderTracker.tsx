import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { JobOrder, JobPriority, JobStatus } from '../types/erp';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Kanban, 
  Table as TableIcon, 
  ChevronRight, 
  ChevronLeft, 
  Boxes, 
  CheckCircle2, 
  Clock, 
  X, 
  Printer,
  ChevronDown
} from 'lucide-react';

interface JobOrderTrackerProps {
  onOpenNewJob: () => void;
}

export const JobOrderTracker: React.FC<JobOrderTrackerProps> = ({ onOpenNewJob }) => {
  const { 
    jobOrders, 
    inventory, 
    advanceJobStage, 
    rollbackJobStage, 
    updateJobOrderProgress,
    selectedJobId, 
    setSelectedJobId 
  } = useErp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filtered list
  const filteredJobs = jobOrders.filter((job) => {
    const matchesSearch = 
      job.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.assignedTeam.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || job.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const selectedJob = jobOrders.find((j) => j.id === selectedJobId) || null;

  const KANBAN_STAGES: Array<{ status: JobStatus; title: string; subtitle: string; color: string; border: string }> = [
    {
      status: 'QUEUE',
      title: '1. Antrean SPK',
      subtitle: 'Draft & Penjadwalan',
      color: 'bg-neutral-700',
      border: 'border-neutral-400',
    },
    {
      status: 'MATERIAL_PREP',
      title: '2. Persiapan Bahan',
      subtitle: 'Kitting & Cek BOM Gudang',
      color: 'bg-[#fa6800]',
      border: 'border-amber-400',
    },
    {
      status: 'IN_PRODUCTION',
      title: '3. Proses Produksi',
      subtitle: 'Bahan Terpotong Otomatis',
      color: 'bg-[#0050ef]',
      border: 'border-blue-400',
    },
    {
      status: 'QC_CHECK',
      title: '4. Inspeksi QC',
      subtitle: 'Uji Fungsi & Defect',
      color: 'bg-[#7133c9]',
      border: 'border-purple-400',
    },
    {
      status: 'COMPLETED',
      title: '5. Selesai (Masuk Stok)',
      subtitle: 'Barang Jadi Siap Kirim',
      color: 'bg-[#107c41]',
      border: 'border-emerald-400',
    },
  ];

  const getPriorityBadge = (p: JobPriority) => {
    switch (p) {
      case 'URGENT':
        return <span className="bg-[#ce352c] text-white text-[10px] font-bold px-1.5 py-0.5">URGENT</span>;
      case 'HIGH':
        return <span className="bg-[#fa6800] text-white text-[10px] font-bold px-1.5 py-0.5">TINGGI</span>;
      case 'NORMAL':
        return <span className="bg-[#0050ef] text-white text-[10px] font-bold px-1.5 py-0.5">NORMAL</span>;
      case 'LOW':
        return <span className="bg-neutral-600 text-white text-[10px] font-bold px-1.5 py-0.5">RENDAH</span>;
    }
  };

  // Check if materials are sufficient for a job
  const checkMaterialAvailability = (job: JobOrder) => {
    let sufficient = true;
    for (const b of job.bom) {
      const inv = inventory.find((i) => i.sku === b.sku);
      if (!inv || inv.stock < b.requiredQty) {
        sufficient = false;
        break;
      }
    }
    return sufficient;
  };

  return (
    <div className="space-y-4">
      {/* Metro Command Bar & Filter Ribbon */}
      <div className="bg-white border border-neutral-300 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari SPK, Klien, Produk..."
              className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 focus:bg-white focus:outline-none focus:border-[#0050ef] w-56 sm:w-64"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-neutral-500 font-semibold text-[11px] uppercase">Prioritas:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="py-1.5 px-2 text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="URGENT">Mendesak (Urgent)</option>
              <option value="HIGH">Tinggi</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Rendah</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-neutral-500 font-semibold text-[11px] uppercase">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-2 text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
            >
              <option value="ALL">Semua Tahap</option>
              <option value="QUEUE">Antrean</option>
              <option value="MATERIAL_PREP">Persiapan Bahan</option>
              <option value="IN_PRODUCTION">Dalam Produksi</option>
              <option value="QC_CHECK">Inspeksi QC</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </div>
        </div>

        {/* View Switcher and Add Job Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-neutral-300 bg-neutral-100 p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'kanban' ? 'bg-[#0050ef] text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-[#0050ef] text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 bg-[#0050ef] hover:bg-[#0040c0] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ SPK Baru</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: METRO KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
          {KANBAN_STAGES.map((col) => {
            const columnJobs = filteredJobs.filter((j) => j.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-neutral-100 border border-neutral-300 flex flex-col min-h-[550px]"
              >
                {/* Column Header */}
                <div className={`${col.color} text-white p-2.5 shadow-xs`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      {col.title}
                    </h3>
                    <span className="bg-black/30 font-mono text-[11px] px-1.5 py-0.2 font-bold">
                      {columnJobs.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/80">
                    {col.subtitle}
                  </div>
                </div>

                {/* Column Cards */}
                <div className="p-2 space-y-2.5 flex-1 overflow-y-auto">
                  {columnJobs.length === 0 ? (
                    <div className="text-center py-10 text-neutral-400 text-xs border border-dashed border-neutral-300">
                      Tidak ada SPK pada tahap ini
                    </div>
                  ) : (
                    columnJobs.map((job) => {
                      const materialsReady = checkMaterialAvailability(job);

                      return (
                        <div
                          key={job.id}
                          className="bg-white border border-neutral-300 hover:border-[#0050ef] shadow-xs p-3 transition-all cursor-pointer relative group"
                          onClick={() => setSelectedJobId(job.id)}
                        >
                          {/* Top Tag Row */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">
                              {job.orderNumber}
                            </span>
                            {getPriorityBadge(job.priority)}
                          </div>

                          {/* Client & Product */}
                          <div className="text-xs font-semibold text-neutral-500 truncate">
                            {job.clientName}
                          </div>
                          <div className="text-xs font-bold text-neutral-900 line-clamp-2 mt-0.5 mb-2">
                            {job.productName}
                          </div>

                          {/* BOM Fulfillment Tag */}
                          <div className="mb-2 text-[10px] flex items-center justify-between">
                            <span className="text-neutral-500 font-mono">
                              Target: <strong className="text-neutral-800">{job.targetQty} Unit</strong>
                            </span>
                            {job.status === 'MATERIAL_PREP' && (
                              <span
                                className={`px-1 py-0.2 font-semibold ${
                                  materialsReady 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {materialsReady ? 'BOM Cukup' : 'BOM Kurang!'}
                              </span>
                            )}
                            {job.materialsDeducted && (
                              <span className="text-emerald-700 font-semibold">
                                ✓ Bahan Terpotong
                              </span>
                            )}
                          </div>

                          {/* Progress Indicator */}
                          <div className="space-y-1 mb-3">
                            <div className="flex justify-between text-[10px] text-neutral-500">
                              <span>Progress</span>
                              <span className="font-mono font-bold text-neutral-800">{job.progressPercent}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 h-1.5">
                              <div
                                className="bg-[#0050ef] h-1.5 transition-all"
                                style={{ width: `${job.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Team Info */}
                          <div className="text-[10px] text-neutral-500 border-t border-neutral-100 pt-1.5 mb-2.5 flex items-center justify-between">
                            <span className="truncate max-w-[120px]">{job.assignedTeam}</span>
                            <span className="font-semibold text-neutral-700">{job.leadTechnician}</span>
                          </div>

                          {/* Metro Stage Action Buttons */}
                          <div className="flex items-center gap-1 pt-1 border-t border-dashed border-neutral-200">
                            {job.status !== 'QUEUE' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rollbackJobStage(job.id);
                                }}
                                title="Kembalikan ke tahap sebelumnya"
                                className="p-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceJobStage(job.id);
                              }}
                              className={`flex-1 text-center py-1 text-[11px] font-bold uppercase tracking-wider text-white transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                                job.status === 'MATERIAL_PREP'
                                  ? 'bg-[#0050ef] hover:bg-blue-700'
                                  : job.status === 'QC_CHECK'
                                  ? 'bg-[#107c41] hover:bg-emerald-700'
                                  : 'bg-neutral-800 hover:bg-neutral-900'
                              }`}
                            >
                              <span>
                                {job.status === 'MATERIAL_PREP'
                                  ? 'Mulai Produksi'
                                  : job.status === 'QC_CHECK'
                                  ? 'Lolos QC & Selesai'
                                  : job.status === 'COMPLETED'
                                  ? 'Kirim ke Klien'
                                  : 'Lanjut Tahap'}
                              </span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: METRO DENSE TABLE VIEW */
        <div className="bg-white border border-neutral-300 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-800 text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="p-2.5 border-r border-neutral-700">No. SPK</th>
                <th className="p-2.5 border-r border-neutral-700">Prioritas</th>
                <th className="p-2.5 border-r border-neutral-700">Klien</th>
                <th className="p-2.5 border-r border-neutral-700">Nama Produk</th>
                <th className="p-2.5 border-r border-neutral-700 text-right">Target Qty</th>
                <th className="p-2.5 border-r border-neutral-700">Status Tahap</th>
                <th className="p-2.5 border-r border-neutral-700">Progress</th>
                <th className="p-2.5 border-r border-neutral-700">Tim & Teknisi</th>
                <th className="p-2.5 border-r border-neutral-700">Batas Waktu</th>
                <th className="p-2.5 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-neutral-400">
                    Tidak ada SPK yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="p-2.5 font-mono font-bold text-neutral-900 border-r border-neutral-200 whitespace-nowrap">
                      {job.orderNumber}
                    </td>
                    <td className="p-2.5 border-r border-neutral-200 whitespace-nowrap">
                      {getPriorityBadge(job.priority)}
                    </td>
                    <td className="p-2.5 font-semibold text-neutral-800 border-r border-neutral-200">
                      {job.clientName}
                    </td>
                    <td className="p-2.5 font-medium text-neutral-900 border-r border-neutral-200">
                      {job.productName}
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-bold text-right border-r border-neutral-200">
                      {job.targetQty} Unit
                    </td>
                    <td className="p-2.5 border-r border-neutral-200 whitespace-nowrap">
                      <span className="bg-neutral-100 text-neutral-800 border border-neutral-300 px-2 py-0.5 text-[10px] font-bold uppercase">
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-neutral-200 w-28">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-neutral-200 h-2">
                          <div
                            className="bg-[#0050ef] h-2"
                            style={{ width: `${job.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] tabular-nums font-bold">
                          {job.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2.5 text-neutral-600 border-r border-neutral-200 whitespace-nowrap">
                      <div className="font-medium text-neutral-900">{job.leadTechnician}</div>
                      <div className="text-[10px] text-neutral-500">{job.assignedTeam}</div>
                    </td>
                    <td className="p-2.5 font-mono text-neutral-600 border-r border-neutral-200 whitespace-nowrap">
                      {job.dueDate}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceJobStage(job.id);
                        }}
                        className="bg-[#0050ef] hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Lanjut
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL / DRAWER: DETAIL SPK & BILL OF MATERIALS (BOM) */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-700 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#0050ef] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-200" />
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider">
                    Detail Surat Perintah Kerja ({selectedJob.orderNumber})
                  </h3>
                  <div className="text-xs text-blue-100">
                    Klien: {selectedJob.clientName} · Status: {selectedJob.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedJobId(null)}
                className="text-white hover:bg-blue-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-100 p-3 border border-neutral-300">
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Nama Produk</div>
                  <div className="text-xs font-bold text-neutral-900 truncate">{selectedJob.productName}</div>
                  <div className="text-[10px] font-mono text-neutral-600">{selectedJob.productSku}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Target & Reject</div>
                  <div className="text-xs font-bold text-neutral-900 font-mono">
                    Target: {selectedJob.targetQty} Unit
                  </div>
                  <div className="text-[10px] text-red-600 font-bold font-mono">
                    Defect/Scrap: {selectedJob.scrapQty} Unit
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Tim Pelaksana</div>
                  <div className="text-xs font-bold text-neutral-900">{selectedJob.leadTechnician}</div>
                  <div className="text-[10px] text-neutral-600">{selectedJob.assignedTeam}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Jadwal Deadline</div>
                  <div className="text-xs font-bold text-neutral-900 font-mono">{selectedJob.dueDate}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Mulai: {selectedJob.startDate}</div>
                </div>
              </div>

              {/* Progress Slider Controller */}
              <div className="bg-neutral-50 p-4 border border-neutral-300 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-neutral-700">Kontrol Kemajuan Produksi Real-Time</span>
                  <span className="font-mono text-[#0050ef] text-sm">{selectedJob.progressPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedJob.progressPercent}
                  onChange={(e) => updateJobOrderProgress(selectedJob.id, parseInt(e.target.value, 10))}
                  className="w-full accent-[#0050ef] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Geser untuk memperbarui persentase pengerjaan di lini pabrik.</span>
                  <button
                    onClick={() => updateJobOrderProgress(selectedJob.id, selectedJob.progressPercent, 1)}
                    className="text-red-700 hover:underline font-semibold cursor-pointer"
                  >
                    + Catat 1 Reject/Scrap
                  </button>
                </div>
              </div>

              {/* Bill of Materials (BOM) Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-[#107c41]" />
                    Struktur Bahan Baku / Bill of Materials (BOM)
                  </h4>
                  <span className="text-[11px] text-neutral-500">
                    {selectedJob.materialsDeducted 
                      ? '✓ Bahan baku telah dipotong dari stok gudang' 
                      : 'Bahan baku akan dipotong saat status masuk Produksi'}
                  </span>
                </div>

                <div className="border border-neutral-300 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-200 text-neutral-800 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border-r border-neutral-300">SKU Bahan</th>
                        <th className="p-2 border-r border-neutral-300">Deskripsi Bahan</th>
                        <th className="p-2 border-r border-neutral-300 text-right">Kebutuhan SPK</th>
                        <th className="p-2 border-r border-neutral-300 text-right">Stok Fisik Gudang</th>
                        <th className="p-2 text-center">Status Kesiapan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedJob.bom.map((b) => {
                        const inv = inventory.find((i) => i.sku === b.sku);
                        const isStockEnough = inv ? inv.stock >= b.requiredQty : false;

                        return (
                          <tr key={b.sku} className="hover:bg-neutral-50">
                            <td className="p-2 font-mono font-bold text-neutral-900 border-r border-neutral-200">
                              {b.sku}
                            </td>
                            <td className="p-2 text-neutral-800 border-r border-neutral-200">
                              {inv ? inv.name : 'Item tidak terdaftar'}
                            </td>
                            <td className="p-2 font-mono tabular-nums font-bold text-right border-r border-neutral-200">
                              {b.requiredQty} {inv?.unit || 'Unit'}
                            </td>
                            <td className="p-2 font-mono tabular-nums text-right border-r border-neutral-200">
                              {inv ? `${inv.stock} ${inv.unit}` : '0'}
                            </td>
                            <td className="p-2 text-center">
                              {selectedJob.materialsDeducted ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                  Sudah Teralokasi
                                </span>
                              ) : isStockEnough ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                  Tersedia
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                                  Stok Kurang!
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Catatan Khusus Instruksi Kerja:
                </label>
                <div className="p-3 bg-neutral-100 border border-neutral-300 text-xs text-neutral-800 italic">
                  {selectedJob.notes || 'Tidak ada catatan tambahan.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-100 p-3.5 border-t border-neutral-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-white border border-neutral-300 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Surat Jalan / SPK</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJobId(null)}
                  className="bg-neutral-300 hover:bg-neutral-400 text-neutral-800 px-4 py-1.5 text-xs font-bold uppercase cursor-pointer"
                >
                  Tutup
                </button>

                <button
                  onClick={() => {
                    advanceJobStage(selectedJob.id);
                  }}
                  className="bg-[#0050ef] hover:bg-[#0040c0] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjutkan Tahap Operasional</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
