import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { InventoryCategory, InventoryItem, MovementType } from '../types/erp';
import { 
  Warehouse, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileSpreadsheet, 
  Boxes, 
  History,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface InventoryManagerProps {
  onOpenRestock: () => void;
  onOpenStockOut: () => void;
  onOpenNewItem: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  onOpenRestock,
  onOpenStockOut,
  onOpenNewItem,
}) => {
  const { inventory, movements, adjustStock } = useErp();

  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'movements'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showOnlyCritical, setShowOnlyCritical] = useState<boolean>(false);

  // State for quick inline Opname modal
  const [opnameItem, setOpnameItem] = useState<InventoryItem | null>(null);
  const [opnameNewQty, setOpnameNewQty] = useState<number>(0);
  const [opnameNotes, setOpnameNotes] = useState<string>('');

  // Filtering
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.binLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesCritical = !showOnlyCritical || item.stock <= item.safetyMin;

    return matchesSearch && matchesCategory && matchesCritical;
  });

  const totalAssetValue = inventory.reduce((acc, curr) => acc + curr.stock * curr.unitPrice, 0);
  const criticalCount = inventory.filter((i) => i.stock <= i.safetyMin).length;

  const handleOpenOpname = (item: InventoryItem) => {
    setOpnameItem(item);
    setOpnameNewQty(item.stock);
    setOpnameNotes('Hasil stock opname fisik gudang');
  };

  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opnameItem) return;
    adjustStock(opnameItem.sku, Number(opnameNewQty), 'Petugas Gudang', opnameNotes);
    setOpnameItem(null);
  };

  const exportMovementsCSV = () => {
    const headers = ['ID,Waktu,SKU,Nama Barang,Jenis,Jumlah,Referensi,Operator,Catatan'];
    const rows = movements.map((m) => 
      `"${m.id}","${m.timestamp}","${m.sku}","${m.itemName.replace(/"/g, '""')}","${m.type}","${m.qty}","${m.reference}","${m.operator}","${(m.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buku_mutasi_stok_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Metro Command & KPI Header Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#107c41] text-white p-3 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
            Total Item Terdaftar
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">
            {inventory.length} <span className="text-xs font-normal">SKU</span>
          </div>
        </div>

        <div className="bg-[#0050ef] text-white p-3 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
            Total Valuasi Nilai Aset
          </div>
          <div className="text-xl font-extrabold font-mono tabular-nums truncate">
            Rp {totalAssetValue.toLocaleString('id-ID')}
          </div>
        </div>

        <div className={`${criticalCount > 0 ? 'bg-[#ce352c]' : 'bg-neutral-700'} text-white p-3 shadow-xs`}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">
            Peringatan Stok Di Bawah Minimum
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">
            {criticalCount} <span className="text-xs font-normal">Item</span>
          </div>
        </div>

        <div className="bg-neutral-800 text-white p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
              Mutasi Transaksi Hari Ini
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-400">
              {movements.length} <span className="text-xs text-neutral-300 font-normal">Log</span>
            </div>
          </div>
          <button
            onClick={exportMovementsCSV}
            title="Download CSV Mutasi"
            className="p-2 bg-neutral-700 hover:bg-neutral-600 text-white cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metro Subtabs & Action Buttons */}
      <div className="bg-white border border-neutral-300 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Subtab Toggle */}
          <div className="flex items-center bg-neutral-100 p-0.5 border border-neutral-300">
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeSubTab === 'inventory' ? 'bg-[#107c41] text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Daftar Stok Inventaris</span>
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeSubTab === 'movements' ? 'bg-[#107c41] text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Buku Mutasi Stok (Real-Time)</span>
            </button>
          </div>

          {activeSubTab === 'inventory' && (
            <div className="relative ml-2">
              <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU, Nama Barang, Lokasi Bin..."
                className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 focus:bg-white focus:outline-none focus:border-[#107c41] w-56 sm:w-64"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenRestock}
            className="flex items-center gap-1 bg-[#107c41] hover:bg-[#0e6b37] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Penerimaan Stok</span>
          </button>

          <button
            onClick={onOpenStockOut}
            className="flex items-center gap-1 bg-[#fa6800] hover:bg-[#e05d00] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>- Pengeluaran Manual</span>
          </button>

          <button
            onClick={onOpenNewItem}
            className="flex items-center gap-1 bg-[#0050ef] hover:bg-[#0040c0] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Item Baru</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: INVENTORY TABLE */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              onClick={() => { setSelectedCategory('ALL'); setShowOnlyCritical(false); }}
              className={`px-3 py-1 font-semibold uppercase tracking-wider cursor-pointer border ${
                selectedCategory === 'ALL' && !showOnlyCritical
                  ? 'bg-neutral-800 text-white border-neutral-800'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Semua Kategori ({inventory.length})
            </button>

            <button
              onClick={() => { setSelectedCategory('RAW_MATERIAL'); setShowOnlyCritical(false); }}
              className={`px-3 py-1 font-semibold uppercase tracking-wider cursor-pointer border ${
                selectedCategory === 'RAW_MATERIAL' && !showOnlyCritical
                  ? 'bg-[#107c41] text-white border-[#107c41]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Bahan Baku (Raw)
            </button>

            <button
              onClick={() => { setSelectedCategory('COMPONENT'); setShowOnlyCritical(false); }}
              className={`px-3 py-1 font-semibold uppercase tracking-wider cursor-pointer border ${
                selectedCategory === 'COMPONENT' && !showOnlyCritical
                  ? 'bg-[#0050ef] text-white border-[#0050ef]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Komponen Elektrikal
            </button>

            <button
              onClick={() => { setSelectedCategory('FINISHED_GOOD'); setShowOnlyCritical(false); }}
              className={`px-3 py-1 font-semibold uppercase tracking-wider cursor-pointer border ${
                selectedCategory === 'FINISHED_GOOD' && !showOnlyCritical
                  ? 'bg-[#7133c9] text-white border-[#7133c9]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Barang Jadi (Finished)
            </button>

            <button
              onClick={() => { setSelectedCategory('PACKAGING'); setShowOnlyCritical(false); }}
              className={`px-3 py-1 font-semibold uppercase tracking-wider cursor-pointer border ${
                selectedCategory === 'PACKAGING' && !showOnlyCritical
                  ? 'bg-neutral-700 text-white border-neutral-700'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Kemasan
            </button>

            <button
              onClick={() => setShowOnlyCritical(!showOnlyCritical)}
              className={`px-3 py-1 font-bold uppercase tracking-wider cursor-pointer border flex items-center gap-1 ${
                showOnlyCritical
                  ? 'bg-[#ce352c] text-white border-[#ce352c]'
                  : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Stok Kritis Saja ({criticalCount})</span>
            </button>
          </div>

          {/* Metro Table */}
          <div className="bg-white border border-neutral-300 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-800 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-2.5 border-r border-neutral-700">SKU Barang</th>
                  <th className="p-2.5 border-r border-neutral-700">Nama Barang & Spesifikasi</th>
                  <th className="p-2.5 border-r border-neutral-700">Kategori</th>
                  <th className="p-2.5 border-r border-neutral-700">Lokasi Bin / Gudang</th>
                  <th className="p-2.5 border-r border-neutral-700 text-right">Stok Fisik</th>
                  <th className="p-2.5 border-r border-neutral-700 text-right">Safety Min</th>
                  <th className="p-2.5 border-r border-neutral-700 text-right">Harga Satuan</th>
                  <th className="p-2.5 border-r border-neutral-700 text-right">Total Nilai</th>
                  <th className="p-2.5 border-r border-neutral-700 text-center">Status Stok</th>
                  <th className="p-2.5 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-neutral-400">
                      Tidak ada data inventaris yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const isBelowSafety = item.stock <= item.safetyMin;
                    const isZero = item.stock === 0;

                    return (
                      <tr key={item.sku} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-neutral-900 border-r border-neutral-200 whitespace-nowrap">
                          {item.sku}
                        </td>
                        <td className="p-2.5 font-semibold text-neutral-900 border-r border-neutral-200">
                          {item.name}
                        </td>
                        <td className="p-2.5 border-r border-neutral-200 whitespace-nowrap">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-700">
                            {item.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-neutral-600 border-r border-neutral-200 whitespace-nowrap">
                          {item.binLocation}
                        </td>
                        <td className="p-2.5 font-mono tabular-nums font-bold text-right border-r border-neutral-200">
                          <span className={isBelowSafety ? 'text-red-700 font-extrabold' : 'text-neutral-900'}>
                            {item.stock} {item.unit}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono tabular-nums text-neutral-500 text-right border-r border-neutral-200">
                          {item.safetyMin} {item.unit}
                        </td>
                        <td className="p-2.5 font-mono tabular-nums text-neutral-700 text-right border-r border-neutral-200 whitespace-nowrap">
                          Rp {item.unitPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2.5 font-mono tabular-nums font-bold text-neutral-900 text-right border-r border-neutral-200 whitespace-nowrap">
                          Rp {(item.stock * item.unitPrice).toLocaleString('id-ID')}
                        </td>
                        <td className="p-2.5 border-r border-neutral-200 text-center whitespace-nowrap">
                          {isZero ? (
                            <span className="bg-[#ce352c] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                              Habis
                            </span>
                          ) : isBelowSafety ? (
                            <span className="bg-[#fa6800] text-white px-2 py-0.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1">
                              <AlertTriangle className="w-3 h-3 inline" />
                              Menipis
                            </span>
                          ) : (
                            <span className="bg-[#107c41] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                              Aman
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleOpenOpname(item)}
                            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-2 py-1 text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Opname Fisik
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STOCK MOVEMENTS LEDGER */}
      {activeSubTab === 'movements' && (
        <div className="bg-white border border-neutral-300 shadow-xs">
          <div className="p-3 bg-neutral-100 border-b border-neutral-300 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#107c41]" />
                Kartu Mutasi & Log Transaksi Stok Real-Time
              </h3>
              <p className="text-[11px] text-neutral-500">
                Setiap pemotongan bahan baku dari SPK dicatat secara real-time dan transparan.
              </p>
            </div>
            <button
              onClick={exportMovementsCSV}
              className="bg-neutral-800 hover:bg-neutral-900 text-white px-3 py-1 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor ke CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-800 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-2.5 border-r border-neutral-700">Waktu</th>
                  <th className="p-2.5 border-r border-neutral-700">Jenis Mutasi</th>
                  <th className="p-2.5 border-r border-neutral-700">SKU & Nama Barang</th>
                  <th className="p-2.5 border-r border-neutral-700 text-right">Jumlah</th>
                  <th className="p-2.5 border-r border-neutral-700">Nomor Referensi (SPK/PO)</th>
                  <th className="p-2.5 border-r border-neutral-700">Operator / Penanggungjawab</th>
                  <th className="p-2.5">Catatan / Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {movements.map((mov) => {
                  const isOut = mov.type === 'OUT';
                  const isIn = mov.type === 'IN';

                  return (
                    <tr key={mov.id} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-mono text-neutral-600 border-r border-neutral-200 whitespace-nowrap">
                        {mov.timestamp}
                      </td>
                      <td className="p-2.5 border-r border-neutral-200 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isOut
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isIn
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {isOut ? 'KELUAR (SPK)' : isIn ? 'MASUK (RESTOCK)' : 'PENYESUAIAN'}
                        </span>
                      </td>
                      <td className="p-2.5 border-r border-neutral-200">
                        <div className="font-semibold text-neutral-900">{mov.itemName}</div>
                        <div className="font-mono text-[10px] text-neutral-500">{mov.sku}</div>
                      </td>
                      <td className="p-2.5 font-mono tabular-nums font-bold text-right border-r border-neutral-200 whitespace-nowrap">
                        <span className={isOut ? 'text-amber-700' : isIn ? 'text-emerald-700' : 'text-blue-700'}>
                          {isOut ? `-${mov.qty}` : isIn ? `+${mov.qty}` : `~${mov.qty}`}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-neutral-800 border-r border-neutral-200 whitespace-nowrap">
                        {mov.reference}
                      </td>
                      <td className="p-2.5 text-neutral-700 border-r border-neutral-200 whitespace-nowrap">
                        {mov.operator}
                      </td>
                      <td className="p-2.5 text-neutral-600 italic">
                        {mov.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK INLINE OPNAME MODAL */}
      {opnameItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-700 w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Stock Opname Fisik: {opnameItem.sku}
              </h3>
              <button onClick={() => setOpnameItem(null)} className="cursor-pointer text-neutral-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOpname} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600">Nama Barang:</label>
                <div className="text-sm font-bold text-neutral-900">{opnameItem.name}</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Stok saat ini di sistem: <strong className="font-mono">{opnameItem.stock} {opnameItem.unit}</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Hasil Hitung Fisik Sebenarnya ({opnameItem.unit}):
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={opnameNewQty}
                  onChange={(e) => setOpnameNewQty(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 text-sm font-mono font-bold focus:border-[#107c41] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Alasan / Keterangan Penyesuaian:
                </label>
                <input
                  type="text"
                  required
                  value={opnameNotes}
                  onChange={(e) => setOpnameNotes(e.target.value)}
                  className="w-full p-2 border border-neutral-300 text-xs focus:border-[#107c41] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpnameItem(null)}
                  className="px-3 py-1.5 text-xs font-bold uppercase bg-neutral-200 hover:bg-neutral-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold uppercase bg-[#107c41] hover:bg-[#0e6b37] text-white cursor-pointer"
                >
                  Simpan Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
