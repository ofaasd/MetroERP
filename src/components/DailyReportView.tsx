import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  Boxes, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const DailyReportView: React.FC = () => {
  const { 
    jobOrders, 
    inventory, 
    movements, 
    workstations, 
    getKpiSummary, 
    currentTime, 
    projectManager 
  } = useErp();

  const [copied, setCopied] = useState(false);
  const kpis = getKpiSummary();

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const completedOrders = jobOrders.filter((j) => j.status === 'COMPLETED' || j.status === 'DISPATCHED');
  const inProgressOrders = jobOrders.filter((j) => j.status === 'IN_PRODUCTION' || j.status === 'QC_CHECK');
  const queuedOrders = jobOrders.filter((j) => j.status === 'QUEUE' || j.status === 'MATERIAL_PREP');

  // Materials consumed today (all 'OUT' movements)
  const consumedMovements = movements.filter((m) => m.type === 'OUT');

  // Total shift output
  const totalShiftOutput = workstations.reduce((acc, ws) => acc + ws.outputToday, 0);
  const totalShiftTarget = workstations.reduce((acc, ws) => acc + ws.targetToday, 0);

  const handleCopySummary = () => {
    const summaryText = `*LAPORAN TUTUP HARIAN OPERASIONAL ERP*
Tanggal: ${formattedDate}
Project Manager: ${projectManager.name}
Lokasi: ${projectManager.plantLocation}

=== RINGKASAN PERFORMA TIM ===
• Output Selesai: ${totalShiftOutput} / ${totalShiftTarget} Unit (${Math.round((totalShiftOutput / totalShiftTarget) * 100)}%)
• Efisiensi Tim (OEE): ${kpis.efficiencyRate}%
• Ketepatan Waktu (OTD): ${kpis.onTimeDeliveryRate}%
• Defect/Scrap Rate: ${kpis.scrapRate}%
• SPK Selesai Hari Ini: ${completedOrders.length} SPK
• SPK Dalam Pengerjaan: ${inProgressOrders.length} SPK

=== KONSUMSI MATERIAL HARI INI ===
${consumedMovements.slice(0, 5).map((m) => `• ${m.itemName} (${m.sku}): -${m.qty} [Ref: ${m.reference}]`).join('\n')}

=== STATUS INVENTARIS ===
• Total Item Terdaftar: ${inventory.length} SKU
• Total Valuasi: Rp ${(kpis.totalStockValue / 1000000).toFixed(1)} Juta
• Peringatan Stok Kritis: ${kpis.criticalStockItemsCount} Item

Status: Siap Ditutup untuk Verifikasi PM.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportCSV = () => {
    const lines = [
      'LAPORAN TUTUP OPERASIONAL HARIAN ERP',
      `Tanggal,${formattedDate}`,
      `Project Manager,${projectManager.name}`,
      `Lokasi,${projectManager.plantLocation}`,
      '',
      'RINGKASAN METRIK HARIAN',
      `Target Output Unit,${totalShiftTarget}`,
      `Realisasi Output Unit,${totalShiftOutput}`,
      `Persentase Pencapaian,${Math.round((totalShiftOutput / totalShiftTarget) * 100)}%`,
      `Rata-Rata Efisiensi OEE,${kpis.efficiencyRate}%`,
      `Ketepatan Waktu OTD,${kpis.onTimeDeliveryRate}%`,
      `Scrap Defect Rate,${kpis.scrapRate}%`,
      '',
      'DAFTAR SPK SELESAI HARI INI',
      'No SPK,Klien,Produk,Target Qty,Selesai Qty,Scrap Qty,Teknisi Lead,Waktu Selesai',
      ...completedOrders.map((j) => 
        `"${j.orderNumber}","${j.clientName}","${j.productName}",${j.targetQty},${j.completedQty},${j.scrapQty},"${j.leadTechnician}","${j.completedDate || '-'}"`
      ),
      '',
      'KONSUMSI BAHAN BAKU HARI INI',
      'Waktu,SKU,Nama Barang,Jumlah Keluar,Referensi SPK,Operator',
      ...consumedMovements.map((m) => 
        `"${m.timestamp}","${m.sku}","${m.itemName}",${m.qty},"${m.reference}","${m.operator}"`
      ),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Harian_ERP_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar for Report */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#f59e0b] rounded-xs" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Laporan Tutup Harian Otomatis
          </span>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            • Dihitung secara real-time dari data SPK & mutasi stok Cikarang
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-3 py-1.5 text-xs font-bold uppercase rounded-sm cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold rounded-sm cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold rounded-sm cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
            <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="print-page bg-white border border-[#cbd5e1] rounded-sm p-6 sm:p-8 shadow-xs text-neutral-900 space-y-6">
        {/* Document Header (Letterhead style) */}
        <div className="border-b-2 border-neutral-800 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center font-black text-xl font-mono">
              ERP
            </div>
            <div>
              <div className="text-xl font-black uppercase tracking-tight text-neutral-900 leading-none">
                PT MITRA TEKNIK REKAYASA
              </div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-0.5">
                Divisi Fabrikasi Logam & Perakitan Sistem Elektrikal Industri
              </div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                {projectManager.plantLocation}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-black uppercase tracking-wider text-[#7133c9]">
              LAPORAN TUTUP OPERASIONAL HARIAN
            </div>
            <div className="text-xs font-mono font-bold text-neutral-700 mt-0.5">
              Ref: LPH-{currentTime.toISOString().split('T')[0]}-01
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Tanggal: <strong>{formattedDate}</strong>
            </div>
            <div className="text-xs text-neutral-500">
              Shift 1 (08:00 - 16:00 WIB)
            </div>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="bg-neutral-50 p-4 border border-neutral-300 text-xs text-neutral-800 leading-relaxed">
          <strong className="uppercase font-bold text-neutral-900 block mb-1">
            Ringkasan Eksekutif Operasional:
          </strong>
          Pada hari operasional {formattedDate}, fasilitas produksi mencatat total realisasi output sebesar{' '}
          <strong className="font-mono font-bold text-neutral-900">{totalShiftOutput} Unit</strong> dari target{' '}
          <strong className="font-mono font-bold text-neutral-900">{totalShiftTarget} Unit</strong> (Pencapaian{' '}
          <strong className="font-mono text-emerald-800">{Math.round((totalShiftOutput / totalShiftTarget) * 100)}%</strong>). Rata-rata
          efisiensi kerja mesin dan operator berada di angka <strong className="font-mono text-blue-800">{kpis.efficiencyRate}%</strong> dengan
          tingkat ketepatan pengiriman (On-Time Delivery) mencapai <strong className="font-mono text-purple-800">{kpis.onTimeDeliveryRate}%</strong>.
          Tingkat reject produk tercatat rendah di angka <strong className="font-mono text-neutral-900">{kpis.scrapRate}%</strong>.
        </div>

        {/* 4-Column Metro Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-neutral-300 p-3 bg-neutral-50">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Output Selesai</div>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
              {totalShiftOutput} <span className="text-xs font-normal text-neutral-600">/ {totalShiftTarget} Unit</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Pencapaian {Math.round((totalShiftOutput / totalShiftTarget) * 100)}%
            </div>
          </div>

          <div className="border border-neutral-300 p-3 bg-neutral-50">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Efisiensi Rata-Rata Tim (OEE)</div>
            <div className="text-2xl font-black font-mono text-blue-700 mt-1">
              {kpis.efficiencyRate}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Target minimum: 90.0%
            </div>
          </div>

          <div className="border border-neutral-300 p-3 bg-neutral-50">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Ketepatan Waktu (OTD)</div>
            <div className="text-2xl font-black font-mono text-purple-700 mt-1">
              {kpis.onTimeDeliveryRate}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              SLA Terpenuhi
            </div>
          </div>

          <div className="border border-neutral-300 p-3 bg-neutral-50">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Tingkat Scrap / Defect</div>
            <div className="text-2xl font-black font-mono text-amber-700 mt-1">
              {kpis.scrapRate}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Standar toleransi: &le; 2.5%
            </div>
          </div>
        </div>

        {/* SECTION 1: SPK TUNTAS & SELESAI */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-300 pb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            1. Rincian Job Order (SPK) yang Selesai Hari Ini
          </h3>

          <div className="border border-neutral-300 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-200 text-neutral-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border-r border-neutral-300">No. SPK</th>
                  <th className="p-2 border-r border-neutral-300">Klien / Proyek</th>
                  <th className="p-2 border-r border-neutral-300">Nama Produk</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Target</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Hasil Jadi</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Scrap</th>
                  <th className="p-2 border-r border-neutral-300">Lead Teknisi</th>
                  <th className="p-2">Waktu Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {completedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-neutral-400">
                      Belum ada SPK yang diselesaikan pada hari ini.
                    </td>
                  </tr>
                ) : (
                  completedOrders.map((job) => (
                    <tr key={job.id}>
                      <td className="p-2 font-mono font-bold text-neutral-900 border-r border-neutral-200">
                        {job.orderNumber}
                      </td>
                      <td className="p-2 font-medium text-neutral-800 border-r border-neutral-200">
                        {job.clientName}
                      </td>
                      <td className="p-2 text-neutral-900 border-r border-neutral-200">
                        {job.productName}
                      </td>
                      <td className="p-2 font-mono tabular-nums text-right border-r border-neutral-200">
                        {job.targetQty}
                      </td>
                      <td className="p-2 font-mono tabular-nums font-bold text-emerald-700 text-right border-r border-neutral-200">
                        {job.completedQty || job.targetQty}
                      </td>
                      <td className="p-2 font-mono tabular-nums text-right text-red-600 border-r border-neutral-200">
                        {job.scrapQty}
                      </td>
                      <td className="p-2 text-neutral-700 border-r border-neutral-200">
                        {job.leadTechnician}
                      </td>
                      <td className="p-2 font-mono text-neutral-600">
                        {job.completedDate || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: KONSUMSI MATERIAL & MUTASI STOK */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-300 pb-1">
            <Boxes className="w-4 h-4 text-blue-600" />
            2. Rekapitulasi Bahan Baku Terpakai (Buku Mutasi Hari Ini)
          </h3>

          <div className="border border-neutral-300 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-200 text-neutral-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border-r border-neutral-300">Waktu</th>
                  <th className="p-2 border-r border-neutral-300">SKU Bahan</th>
                  <th className="p-2 border-r border-neutral-300">Deskripsi Bahan Baku</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Jumlah Keluar</th>
                  <th className="p-2 border-r border-neutral-300">Referensi SPK</th>
                  <th className="p-2">Penanggung Jawab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {consumedMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-neutral-400">
                      Belum ada pemotongan bahan baku tercatat.
                    </td>
                  </tr>
                ) : (
                  consumedMovements.map((m) => (
                    <tr key={m.id}>
                      <td className="p-2 font-mono text-neutral-600 border-r border-neutral-200">
                        {m.timestamp}
                      </td>
                      <td className="p-2 font-mono font-bold text-neutral-900 border-r border-neutral-200">
                        {m.sku}
                      </td>
                      <td className="p-2 text-neutral-800 border-r border-neutral-200">
                        {m.itemName}
                      </td>
                      <td className="p-2 font-mono tabular-nums font-bold text-amber-700 text-right border-r border-neutral-200">
                        -{m.qty}
                      </td>
                      <td className="p-2 font-mono font-semibold text-neutral-800 border-r border-neutral-200">
                        {m.reference}
                      </td>
                      <td className="p-2 text-neutral-700">
                        {m.operator}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: REKAPITULASI WORKSTATION & OPERATOR */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b border-neutral-300 pb-1">
            <Users className="w-4 h-4 text-[#fa6800]" />
            3. Rekapitulasi Efisiensi Workstation & Operator
          </h3>

          <div className="border border-neutral-300 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-200 text-neutral-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border-r border-neutral-300">Kode</th>
                  <th className="p-2 border-r border-neutral-300">Nama Lini / Workstation</th>
                  <th className="p-2 border-r border-neutral-300">Lead Operator</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Output Realisasi</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Target Shift</th>
                  <th className="p-2 border-r border-neutral-300 text-right">Pencapaian</th>
                  <th className="p-2 text-right">Tingkat Efisiensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {workstations.map((ws) => (
                  <tr key={ws.id}>
                    <td className="p-2 font-mono font-bold text-neutral-900 border-r border-neutral-200">
                      {ws.code}
                    </td>
                    <td className="p-2 text-neutral-800 border-r border-neutral-200">
                      {ws.name}
                    </td>
                    <td className="p-2 font-semibold text-neutral-900 border-r border-neutral-200">
                      {ws.lead}
                    </td>
                    <td className="p-2 font-mono tabular-nums text-right border-r border-neutral-200">
                      {ws.outputToday} Unit
                    </td>
                    <td className="p-2 font-mono tabular-nums text-right border-r border-neutral-200">
                      {ws.targetToday} Unit
                    </td>
                    <td className="p-2 font-mono tabular-nums font-bold text-right border-r border-neutral-200">
                      {Math.round((ws.outputToday / ws.targetToday) * 100)}%
                    </td>
                    <td className="p-2 font-mono tabular-nums font-bold text-right text-blue-700">
                      {ws.efficiencyRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: FORMAL SIGNATURE BLOCKS */}
        <div className="pt-8 grid grid-cols-2 gap-8 border-t border-neutral-400">
          <div className="text-center">
            <div className="text-xs font-semibold text-neutral-600">Disiapkan Oleh,</div>
            <div className="text-xs font-bold text-neutral-800 uppercase mt-0.5">
              Supervisor Lini Produksi
            </div>
            <div className="h-16 flex items-end justify-center">
              <span className="font-mono text-neutral-400 text-xs italic">[ Tanda Tangan Digital Terverifikasi ]</span>
            </div>
            <div className="text-xs font-bold text-neutral-900 underline mt-2">
              Hendra Saputra, A.Md.T.
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Lead Technician / Plant Supervisor
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs font-semibold text-neutral-600">Disetujui & Diverifikasi Oleh,</div>
            <div className="text-xs font-bold text-neutral-800 uppercase mt-0.5">
              Project Manager Operasional
            </div>
            <div className="h-16 flex items-end justify-center">
              <span className="font-mono text-neutral-400 text-xs italic">[ Approved & Closed in MetroERP ]</span>
            </div>
            <div className="text-xs font-bold text-neutral-900 underline mt-2">
              {projectManager.name}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Operations & Production Project Manager
            </div>
          </div>
        </div>

        {/* Footer print stamp */}
        <div className="text-[10px] text-neutral-400 font-mono pt-4 border-t border-dashed border-neutral-300 flex justify-between">
          <span>Dicetak otomatis via MetroERP Enterprise v2.4</span>
          <span>Waktu Sistem: {currentTime.toLocaleString('id-ID')} WIB</span>
        </div>
      </div>
    </div>
  );
};
