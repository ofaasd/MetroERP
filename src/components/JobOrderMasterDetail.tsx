import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { JobOrder, JobPriority, JobStatus } from '../types/erp';
import { 
  Search, 
  Plus, 
  Trash2, 
  SlidersHorizontal, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Boxes, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Play, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface JobOrderMasterDetailProps {
  onOpenNewJob: () => void;
}

export const JobOrderMasterDetail: React.FC<JobOrderMasterDetailProps> = ({ onOpenNewJob }) => {
  const { 
    jobOrders, 
    inventory, 
    selectedJobId, 
    setSelectedJobId, 
    advanceJobStage, 
    rollbackJobStage, 
    updateJobOrderProgress 
  } = useErp();

  const [listSearch, setListSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [primaryTab, setPrimaryTab] = useState<'basisdaten' | 'bom' | 'progress' | 'qc'>('basisdaten');
  const [subTab, setSubTab] = useState<'allgemein' | 'kore' | 'kontogruppen' | 'bemerkungen'>('allgemein');

  // Filter jobs
  const filteredJobs = jobOrders.filter((job) => {
    const matchesSearch = 
      job.orderNumber.toLowerCase().includes(listSearch.toLowerCase()) ||
      job.clientName.toLowerCase().includes(listSearch.toLowerCase()) ||
      job.productName.toLowerCase().includes(listSearch.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || job.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Selected job
  const currentIndex = filteredJobs.findIndex((j) => j.id === selectedJobId);
  const selectedJob = (currentIndex >= 0 ? filteredJobs[currentIndex] : filteredJobs[0]) || jobOrders[0];

  // Pagination navigation (< 2 / 5 > matching screenshot)
  const handlePrevJob = () => {
    if (currentIndex > 0) {
      setSelectedJobId(filteredJobs[currentIndex - 1].id);
    }
  };

  const handleNextJob = () => {
    if (currentIndex < filteredJobs.length - 1) {
      setSelectedJobId(filteredJobs[currentIndex + 1].id);
    }
  };

  // Check BOM stock availability
  const checkStockAvailability = (job: JobOrder) => {
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

  const isBomSufficient = selectedJob ? checkStockAvailability(selectedJob) : false;

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-6.5rem)] gap-3 select-none">
      {/* =========================================================================
          LEFT PANEL: MASTER LIST / TABEL DAFTAR SPK (matching screenshot left panel)
          ========================================================================= */}
      <div className="w-full lg:w-96 bg-white border border-[#cbd5e1] rounded-sm flex flex-col shrink-0 shadow-xs">
        {/* Search & Actions Bar (exact toolbar from screenshot) */}
        <div className="p-2 border-b border-[#e2e8f0] flex items-center justify-between gap-1.5 bg-[#f8fafc]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari SPK / Klien..."
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs bg-white border border-[#cbd5e1] rounded-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-[11px] bg-white border border-[#cbd5e1] rounded-sm px-1.5 py-1 text-neutral-600 focus:outline-none"
            title="Filter Prioritas"
          >
            <option value="ALL">Semua</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">Tinggi</option>
            <option value="NORMAL">Normal</option>
          </select>

          {/* Green '+' button matching screenshot */}
          <button
            onClick={onOpenNewJob}
            title="Tambah SPK Baru"
            className="w-6 h-6 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Trash button matching screenshot */}
          <button
            onClick={() => {
              if (selectedJob) rollbackJobStage(selectedJob.id);
            }}
            title="Kembalikan Tahap SPK Sebelumnya"
            className="w-6 h-6 rounded-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* More options button */}
          <button 
            title="Opsi Lainnya"
            className="w-6 h-6 rounded-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Master Table Header (matching screenshot columns: Objektgruppe | Nummer | Bezeichnung) */}
        <div className="grid grid-cols-12 text-[11px] font-semibold text-neutral-500 bg-[#f1f5f9] border-b border-[#e2e8f0] py-1.5 px-3">
          <div className="col-span-3">Prioritas</div>
          <div className="col-span-4">No. SPK</div>
          <div className="col-span-5">Klien / Produk</div>
        </div>

        {/* Dense List Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
          {filteredJobs.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-400">
              Tidak ada data SPK yang sesuai.
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`grid grid-cols-12 text-xs py-2 px-3 items-center cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#dff5c4] text-neutral-900 font-medium' // Exact soft lime highlight from screenshot!
                      : 'hover:bg-[#f8fafc] text-neutral-700'
                  }`}
                >
                  {/* Prioritas (Objektgruppe equivalent) */}
                  <div className="col-span-3 text-[11px] font-mono">
                    <span
                      className={`px-1 py-0.2 rounded-xs text-[10px] font-bold ${
                        job.priority === 'URGENT'
                          ? 'text-red-700 bg-red-100'
                          : job.priority === 'HIGH'
                          ? 'text-amber-700 bg-amber-100'
                          : 'text-neutral-600 bg-neutral-200'
                      }`}
                    >
                      {job.priority === 'URGENT' ? 'URG' : job.priority === 'HIGH' ? 'HIG' : 'NOR'}
                    </span>
                  </div>

                  {/* No. SPK (Nummer equivalent) */}
                  <div className="col-span-4 font-mono text-[11px] font-bold text-neutral-900 truncate">
                    {job.orderNumber.replace('SPK-2026-', '')}
                  </div>

                  {/* Klien / Produk (Bezeichnung equivalent) */}
                  <div className="col-span-5 truncate text-[11px] text-neutral-700">
                    <div className="truncate font-medium">{job.productName}</div>
                    <div className="truncate text-[10px] text-neutral-500">{job.clientName}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Left Panel Footer Summary */}
        <div className="p-2 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-neutral-500 flex justify-between items-center">
          <span>Total: {filteredJobs.length} SPK</span>
          <span className="font-mono text-[10px]">Filter Aktif</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: DETAIL & WORK AREA FORM (matching screenshot right panel)
          ========================================================================= */}
      {selectedJob ? (
        <div className="flex-1 bg-white border border-[#cbd5e1] rounded-sm flex flex-col shadow-xs overflow-y-auto">
          {/* Header Row: Title & Pager (< 1 / 21 > matching screenshot) */}
          <div className="p-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm font-bold text-neutral-900 truncate font-sans">
                {selectedJob.orderNumber} - {selectedJob.productName}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs shrink-0 ${
                  selectedJob.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedJob.status === 'IN_PRODUCTION'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedJob.status === 'QC_CHECK'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedJob.status.replace('_', ' ')}
              </span>
            </div>

            {/* Pager Navigator matching screenshot: < 1 / 21 > */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 shrink-0">
              <button
                onClick={handlePrevJob}
                disabled={currentIndex <= 0}
                className="w-6 h-6 rounded-sm border border-[#cbd5e1] hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-semibold px-1">
                {currentIndex + 1} / {filteredJobs.length}
              </span>
              <button
                onClick={handleNextJob}
                disabled={currentIndex >= filteredJobs.length - 1}
                className="w-6 h-6 rounded-sm border border-[#cbd5e1] hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Tabs Bar (matching screenshot: Basisdaten Kontoblatt Belege Historie) */}
          <div className="px-4 pt-2 border-b border-[#e2e8f0] flex items-center gap-1 text-xs bg-[#fafbfc]">
            <button
              onClick={() => setPrimaryTab('basisdaten')}
              className={`px-3 py-1.5 font-medium rounded-t-sm transition-colors cursor-pointer ${
                primaryTab === 'basisdaten'
                  ? 'bg-[#dcfce7] text-[#166534] font-bold border-t-2 border-[#16a34a]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Basisdaten (Info SPK)
            </button>
            <button
              onClick={() => setPrimaryTab('bom')}
              className={`px-3 py-1.5 font-medium rounded-t-sm transition-colors cursor-pointer ${
                primaryTab === 'bom'
                  ? 'bg-[#dcfce7] text-[#166534] font-bold border-t-2 border-[#16a34a]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Struktur Bahan (BOM)
            </button>
            <button
              onClick={() => setPrimaryTab('progress')}
              className={`px-3 py-1.5 font-medium rounded-t-sm transition-colors cursor-pointer ${
                primaryTab === 'progress'
                  ? 'bg-[#dcfce7] text-[#166534] font-bold border-t-2 border-[#16a34a]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Riwayat Produksi ({selectedJob.progressPercent}%)
            </button>
            <button
              onClick={() => setPrimaryTab('qc')}
              className={`px-3 py-1.5 font-medium rounded-t-sm transition-colors cursor-pointer ${
                primaryTab === 'qc'
                  ? 'bg-[#dcfce7] text-[#166534] font-bold border-t-2 border-[#16a34a]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Inspeksi Kontrol QC
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-5 flex-1">
            {/* Top Form Fields Grid (matching screenshot OrgUnit, Kontonummer, Bezeichnung) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  OrgUnit (Plant) *
                </label>
                <input
                  type="text"
                  readOnly
                  value="100 - Plant Cikarang"
                  className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono px-2.5 py-1.5 rounded-sm text-neutral-800"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Nomor SPK *
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedJob.orderNumber}
                  className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono font-bold px-2.5 py-1.5 rounded-sm text-neutral-900"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Bezeichnung / Nama Produk Pesanan *
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedJob.productName}
                  className="w-full bg-white border border-[#cbd5e1] text-xs font-semibold px-2.5 py-1.5 rounded-sm text-neutral-900"
                />
              </div>
            </div>

            {/* Secondary Subtabs (matching screenshot: Allgemein Kore/Anla Kontogruppen ...) */}
            <div className="flex items-center gap-1 border-b border-[#e2e8f0] pb-1 text-xs">
              <button
                onClick={() => setSubTab('allgemein')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'allgemein'
                    ? 'bg-[#dcfce7] text-[#166534]'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Allgemein (Umum)
              </button>
              <button
                onClick={() => setSubTab('kore')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'kore'
                    ? 'bg-[#dcfce7] text-[#166534]'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Alokasi Material BOM
              </button>
              <button
                onClick={() => setSubTab('kontogruppen')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'kontogruppen'
                    ? 'bg-[#dcfce7] text-[#166534]'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Lini & Workstation
              </button>
              <button
                onClick={() => setSubTab('bemerkungen')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'bemerkungen'
                    ? 'bg-[#dcfce7] text-[#166534]'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Catatan Teknis
              </button>
            </div>

            {/* SUBTAB CONTENT: ALLGEMEIN */}
            {subTab === 'allgemein' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Detail Parameter Pengerjaan
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Klien / Pemesan *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedJob.clientName}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs px-2.5 py-1.5 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Target Kuantitas *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${selectedJob.targetQty} Unit (Selesai: ${selectedJob.completedQty} Unit)`}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono font-bold px-2.5 py-1.5 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Tanggal Mulai Pengerjaan *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedJob.startDate}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono px-2.5 py-1.5 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Batas Waktu Pengiriman (Deadline) *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedJob.dueDate}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono font-bold text-neutral-900 px-2.5 py-1.5 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Status Pemotongan Bahan Baku (BOM) *
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          selectedJob.materialsDeducted ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-xs font-medium text-neutral-800">
                        {selectedJob.materialsDeducted
                          ? 'Bahan Telah Dipotong Otomatis Dari Gudang'
                          : 'Menunggu Eksekusi Mulai Produksi'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Status Produk Jadi Masuk Stok *
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          selectedJob.finishedProductAdded ? 'bg-emerald-500' : 'bg-neutral-400'
                        }`}
                      />
                      <span className="text-xs font-medium text-neutral-800">
                        {selectedJob.finishedProductAdded
                          ? 'Produk Jadi Telah Masuk ke Master Stok'
                          : 'Belum Masuk Stok (Masih Dalam Proses)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Workflow Progress Controller */}
                <div className="mt-4 p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-900 uppercase">
                        Kontrol Kemajuan Tahap Produksi Real-Time
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Geser slider untuk simulasi kemajuan lini atau klik tombol alur di bawah.
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-xs">
                      {selectedJob.progressPercent}% Selesai
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedJob.progressPercent}
                    onChange={(e) => updateJobOrderProgress(selectedJob.id, parseInt(e.target.value, 10))}
                    className="w-full accent-[#16a34a] cursor-pointer"
                  />

                  {/* Stage Advance Action Button */}
                  <div className="pt-2 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 text-xs font-medium border border-[#cbd5e1] bg-white hover:bg-neutral-50 rounded-sm text-neutral-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Surat Perintah Kerja (SPK)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rollbackJobStage(selectedJob.id)}
                        disabled={selectedJob.status === 'QUEUE'}
                        className="px-3 py-1.5 text-xs font-medium border border-[#cbd5e1] bg-white hover:bg-neutral-50 disabled:opacity-40 rounded-sm text-neutral-700 cursor-pointer"
                      >
                        Tahap Sebelumnya
                      </button>

                      <button
                        onClick={() => advanceJobStage(selectedJob.id)}
                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                          selectedJob.status === 'MATERIAL_PREP'
                            ? 'bg-[#16a34a] hover:bg-[#15803d]'
                            : selectedJob.status === 'QC_CHECK'
                            ? 'bg-[#10b981] hover:bg-[#059669]'
                            : 'bg-[#1e293b] hover:bg-black'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>
                          {selectedJob.status === 'MATERIAL_PREP'
                            ? 'Mulai Produksi (Potong Bahan Otomatis)'
                            : selectedJob.status === 'QC_CHECK'
                            ? 'Lolos QC & Selesai (Masuk Stok)'
                            : selectedJob.status === 'COMPLETED'
                            ? 'Kirim ke Klien'
                            : 'Lanjutkan Tahap'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: KORE (BOM STRUCTURE) */}
            {subTab === 'kore' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 uppercase">
                      Struktur Bahan Baku (Bill of Materials - BOM)
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Sistem memeriksa ketersediaan material di gudang secara otomatis sebelum produksi dimulai.
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                      isBomSufficient ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isBomSufficient ? '✓ Stok Bahan Cukup' : '⚠ Stok Bahan Kurang!'}
                  </span>
                </div>

                <div className="border border-[#cbd5e1] rounded-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f1f5f9] text-neutral-700 font-semibold text-[11px]">
                      <tr>
                        <th className="p-2 border-r border-[#e2e8f0]">Kode SKU Bahan</th>
                        <th className="p-2 border-r border-[#e2e8f0]">Nama Bahan Baku</th>
                        <th className="p-2 border-r border-[#e2e8f0] text-right">Kebutuhan SPK</th>
                        <th className="p-2 border-r border-[#e2e8f0] text-right">Stok Fisik Gudang</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {selectedJob.bom.map((b) => {
                        const inv = inventory.find((i) => i.sku === b.sku);
                        const isStockEnough = inv ? inv.stock >= b.requiredQty : false;

                        return (
                          <tr key={b.sku} className="hover:bg-neutral-50">
                            <td className="p-2 font-mono font-bold text-neutral-900 border-r border-[#e2e8f0]">
                              {b.sku}
                            </td>
                            <td className="p-2 text-neutral-800 border-r border-[#e2e8f0]">
                              {inv?.name || b.sku}
                            </td>
                            <td className="p-2 font-mono text-right border-r border-[#e2e8f0] font-bold">
                              {b.requiredQty} {inv?.unit || 'Unit'}
                            </td>
                            <td className="p-2 font-mono text-right border-r border-[#e2e8f0]">
                              {inv ? `${inv.stock} ${inv.unit}` : '0'}
                            </td>
                            <td className="p-2 text-center">
                              {selectedJob.materialsDeducted ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                                  Terpotong
                                </span>
                              ) : isStockEnough ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                                  Tersedia
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-xs border border-red-200">
                                  Kurang
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
            )}

            {/* SUBTAB CONTENT: KONTOGRUPPEN (WORKSTATION) */}
            {subTab === 'kontogruppen' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-neutral-900 uppercase">
                  Alokasi Lini Kerja & Lead Operator
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Workstation / Lini Produksi
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedJob.assignedTeam}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs px-2.5 py-1.5 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Teknisi Penanggungjawab (Lead Operator)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedJob.leadTechnician}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-bold px-2.5 py-1.5 rounded-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: BEMERKUNGEN (NOTES & QC) */}
            {subTab === 'bemerkungen' && (
              <div className="space-y-3 text-xs">
                <div className="text-xs font-bold text-neutral-900 uppercase">
                  Catatan Khusus Instruksi Pengerjaan & Mutu QC
                </div>
                <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm text-neutral-700 italic">
                  {selectedJob.notes || 'Tidak ada catatan khusus untuk order ini.'}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Defect / Reject tercatat: <strong className="font-mono text-red-700">{selectedJob.scrapQty} Unit</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-[#cbd5e1] rounded-sm flex items-center justify-center p-8 text-neutral-400 text-xs">
          Pilih salah satu SPK di panel kiri untuk melihat detail.
        </div>
      )}
    </div>
  );
};
