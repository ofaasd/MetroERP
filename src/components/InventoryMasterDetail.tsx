import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { InventoryCategory, InventoryItem } from '../types/erp';
import { 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  SlidersHorizontal, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Warehouse, 
  AlertTriangle, 
  FileSpreadsheet, 
  History,
  RotateCcw,
  CheckCircle2,
  X
} from 'lucide-react';

interface InventoryMasterDetailProps {
  onOpenRestock: () => void;
  onOpenStockOut: () => void;
  onOpenNewItem: () => void;
}

export const InventoryMasterDetail: React.FC<InventoryMasterDetailProps> = ({
  onOpenRestock,
  onOpenStockOut,
  onOpenNewItem,
}) => {
  const { 
    inventory, 
    movements, 
    selectedSkuId, 
    setSelectedSkuId, 
    adjustStock 
  } = useErp();

  const [listSearch, setListSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [primaryTab, setPrimaryTab] = useState<'basisdaten' | 'mutasi' | 'opname'>('basisdaten');
  const [subTab, setSubTab] = useState<'allgemein' | 'kore' | 'kontogruppen'>('allgemein');

  // Inline opname modal state
  const [isOpnameOpen, setIsOpnameOpen] = useState(false);
  const [opnameNewQty, setOpnameNewQty] = useState<number>(0);
  const [opnameNotes, setOpnameNotes] = useState('');

  // Filtering
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(listSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(listSearch.toLowerCase()) ||
      item.binLocation.toLowerCase().includes(listSearch.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const currentIndex = filteredInventory.findIndex((i) => i.sku === selectedSkuId);
  const selectedItem = (currentIndex >= 0 ? filteredInventory[currentIndex] : filteredInventory[0]) || inventory[0];

  const handlePrevItem = () => {
    if (currentIndex > 0) {
      setSelectedSkuId(filteredInventory[currentIndex - 1].sku);
    }
  };

  const handleNextItem = () => {
    if (currentIndex < filteredInventory.length - 1) {
      setSelectedSkuId(filteredInventory[currentIndex + 1].sku);
    }
  };

  // Movements for this specific item
  const itemMovements = selectedItem 
    ? movements.filter((m) => m.sku === selectedItem.sku)
    : [];

  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    adjustStock(selectedItem.sku, Number(opnameNewQty), 'Petugas Logistik', opnameNotes || 'Penyesuaian Fisik Opname');
    setIsOpnameOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-6.5rem)] gap-3 select-none">
      {/* =========================================================================
          LEFT PANEL: MASTER LIST INVENTORY (matching screenshot left panel)
          ========================================================================= */}
      <div className="w-full lg:w-96 bg-white border border-[#cbd5e1] rounded-sm flex flex-col shrink-0 shadow-xs">
        {/* Search & Actions Bar */}
        <div className="p-2 border-b border-[#e2e8f0] flex items-center justify-between gap-1.5 bg-[#f8fafc]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari SKU / Barang..."
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs bg-white border border-[#cbd5e1] rounded-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-[11px] bg-white border border-[#cbd5e1] rounded-sm px-1.5 py-1 text-neutral-600 focus:outline-none"
            title="Filter Kategori"
          >
            <option value="ALL">Semua</option>
            <option value="RAW_MATERIAL">Bahan</option>
            <option value="COMPONENT">Komponen</option>
            <option value="FINISHED_GOOD">Produk</option>
          </select>

          {/* Green '+' button */}
          <button
            onClick={onOpenNewItem}
            title="Tambah SKU Baru"
            className="w-6 h-6 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Quick Restock button */}
          <button
            onClick={onOpenRestock}
            title="Penerimaan Stok Masuk"
            className="w-6 h-6 rounded-sm text-neutral-400 hover:text-emerald-700 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        {/* Master Table Header */}
        <div className="grid grid-cols-12 text-[11px] font-semibold text-neutral-500 bg-[#f1f5f9] border-b border-[#e2e8f0] py-1.5 px-3">
          <div className="col-span-3">Kategori</div>
          <div className="col-span-4">Kode SKU</div>
          <div className="col-span-5">Nama Barang & Stok</div>
        </div>

        {/* Dense List Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
          {filteredInventory.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-400">
              Tidak ada data barang yang sesuai.
            </div>
          ) : (
            filteredInventory.map((item) => {
              const isSelected = selectedItem?.sku === item.sku;
              const isLow = item.stock <= item.safetyMin;

              return (
                <div
                  key={item.sku}
                  onClick={() => setSelectedSkuId(item.sku)}
                  className={`grid grid-cols-12 text-xs py-2 px-3 items-center cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#dff5c4] text-neutral-900 font-medium' // Exact soft lime highlight from screenshot!
                      : 'hover:bg-[#f8fafc] text-neutral-700'
                  }`}
                >
                  <div className="col-span-3 text-[10px] font-mono">
                    <span className="px-1 py-0.2 rounded-xs bg-neutral-200 text-neutral-700">
                      {item.category === 'RAW_MATERIAL' ? 'RAW' : item.category === 'COMPONENT' ? 'ELC' : 'FG'}
                    </span>
                  </div>

                  <div className="col-span-4 font-mono text-[11px] font-bold text-neutral-900 truncate">
                    {item.sku}
                  </div>

                  <div className="col-span-5 truncate text-[11px]">
                    <div className="truncate font-medium">{item.name}</div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className={isLow ? 'text-red-700 font-bold' : 'text-neutral-500 font-mono'}>
                        {item.stock} {item.unit}
                      </span>
                      {isLow && <span className="text-[9px] bg-red-100 text-red-700 px-1 font-bold">KRITIS</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Left Panel Footer Summary */}
        <div className="p-2 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-neutral-500 flex justify-between items-center">
          <span>Total: {filteredInventory.length} SKU</span>
          <span className="font-mono text-[10px]">Gudang Cikarang</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: DETAIL & TRANSACTIONS (matching screenshot right panel)
          ========================================================================= */}
      {selectedItem ? (
        <div className="flex-1 bg-white border border-[#cbd5e1] rounded-sm flex flex-col shadow-xs overflow-y-auto">
          {/* Header Row: Title & Pager */}
          <div className="p-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm font-bold text-neutral-900 truncate font-sans">
                {selectedItem.sku} - {selectedItem.name}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs shrink-0 ${
                  selectedItem.stock <= selectedItem.safetyMin
                    ? 'bg-red-100 text-red-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {selectedItem.stock <= selectedItem.safetyMin ? 'STOK MENIPIS' : 'STOK AMAN'}
              </span>
            </div>

            {/* Pager Navigator */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 shrink-0">
              <button
                onClick={handlePrevItem}
                disabled={currentIndex <= 0}
                className="w-6 h-6 rounded-sm border border-[#cbd5e1] hover:bg-neutral-100 disabled:opacity-30 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-semibold px-1">
                {currentIndex + 1} / {filteredInventory.length}
              </span>
              <button
                onClick={handleNextItem}
                disabled={currentIndex >= filteredInventory.length - 1}
                className="w-6 h-6 rounded-sm border border-[#cbd5e1] hover:bg-neutral-100 disabled:opacity-30 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Tabs Bar */}
          <div className="px-4 pt-2 border-b border-[#e2e8f0] flex items-center gap-1 text-xs bg-[#fafbfc]">
            <button
              onClick={() => setPrimaryTab('basisdaten')}
              className={`px-3 py-1.5 font-medium rounded-t-sm transition-colors cursor-pointer ${
                primaryTab === 'basisdaten'
                  ? 'bg-[#dcfce7] text-[#166534] font-bold border-t-2 border-[#16a34a]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Basisdaten (Data Stok)
            </button>
            <button
              onClick={() => setPrimaryTab('mutasi')}
              className={`px-3 py-1.5 font-medium rounded-t-sm transition-colors cursor-pointer ${
                primaryTab === 'mutasi'
                  ? 'bg-[#dcfce7] text-[#166534] font-bold border-t-2 border-[#16a34a]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Kartu Mutasi Riwayat ({itemMovements.length})
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-5 flex-1">
            {/* Top Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  OrgUnit *
                </label>
                <input
                  type="text"
                  readOnly
                  value="100 - Gudang Material"
                  className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono px-2.5 py-1.5 rounded-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Kode SKU *
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedItem.sku}
                  className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono font-bold px-2.5 py-1.5 rounded-sm text-neutral-900"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Nama Barang & Spesifikasi *
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedItem.name}
                  className="w-full bg-white border border-[#cbd5e1] text-xs font-semibold px-2.5 py-1.5 rounded-sm text-neutral-900"
                />
              </div>
            </div>

            {/* Secondary Subtabs */}
            <div className="flex items-center gap-1 border-b border-[#e2e8f0] pb-1 text-xs">
              <button
                onClick={() => setSubTab('allgemein')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'allgemein' ? 'bg-[#dcfce7] text-[#166534]' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Allgemein (Stok & Satuan)
              </button>
              <button
                onClick={() => setSubTab('kore')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'kore' ? 'bg-[#dcfce7] text-[#166534]' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Valuasi & Harga
              </button>
              <button
                onClick={() => setSubTab('kontogruppen')}
                className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                  subTab === 'kontogruppen' ? 'bg-[#dcfce7] text-[#166534]' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Lokasi Bin & Rak
              </button>
            </div>

            {/* TAB CONTENT: BASISDATEN */}
            {primaryTab === 'basisdaten' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Stok Fisik Tersedia</div>
                    <div className="text-2xl font-black font-mono text-neutral-900 mt-1">
                      {selectedItem.stock} <span className="text-xs font-normal">{selectedItem.unit}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Pembaruan terakhir: {selectedItem.lastUpdated}
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Safety Stock Minimum</div>
                    <div className="text-2xl font-black font-mono text-neutral-700 mt-1">
                      {selectedItem.safetyMin} <span className="text-xs font-normal">{selectedItem.unit}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Ambang batas peringatan
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Total Valuasi Nilai Stok</div>
                    <div className="text-xl font-black font-mono text-emerald-800 mt-1 truncate">
                      Rp {(selectedItem.stock * selectedItem.unitPrice).toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      @ Rp {selectedItem.unitPrice.toLocaleString('id-ID')} / {selectedItem.unit}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Kategori Inventaris *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.category.replace('_', ' ')}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs px-2.5 py-1.5 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Lokasi Bin / Gudang *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.binLocation}
                      className="w-full bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-mono px-2.5 py-1.5 rounded-sm"
                    />
                  </div>
                </div>

                {/* Quick Action Ribbon for this item */}
                <div className="pt-3 border-t border-[#e2e8f0] flex flex-wrap items-center gap-2">
                  <button
                    onClick={onOpenRestock}
                    className="px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+ Restock Barang Masuk</span>
                  </button>

                  <button
                    onClick={onOpenStockOut}
                    className="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>- Pengeluaran Manual</span>
                  </button>

                  <button
                    onClick={() => {
                      setOpnameNewQty(selectedItem.stock);
                      setOpnameNotes('Hasil stock opname fisik gudang');
                      setIsOpnameOpen(true);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-black text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Penyesuaian Opname Fisik</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MUTASI HISTORIS */}
            {primaryTab === 'mutasi' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-neutral-900 uppercase">
                  Riwayat Mutasi Real-Time untuk SKU {selectedItem.sku}
                </div>

                <div className="border border-[#cbd5e1] rounded-sm overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f1f5f9] text-neutral-700 font-semibold text-[11px]">
                      <tr>
                        <th className="p-2 border-r border-[#e2e8f0]">Waktu</th>
                        <th className="p-2 border-r border-[#e2e8f0]">Jenis Mutasi</th>
                        <th className="p-2 border-r border-[#e2e8f0] text-right">Jumlah</th>
                        <th className="p-2 border-r border-[#e2e8f0]">Referensi</th>
                        <th className="p-2 border-r border-[#e2e8f0]">Operator</th>
                        <th className="p-2">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {itemMovements.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-neutral-400">
                            Belum ada riwayat mutasi untuk item ini.
                          </td>
                        </tr>
                      ) : (
                        itemMovements.map((m) => (
                          <tr key={m.id} className="hover:bg-neutral-50">
                            <td className="p-2 font-mono text-neutral-600 border-r border-[#e2e8f0]">
                              {m.timestamp}
                            </td>
                            <td className="p-2 border-r border-[#e2e8f0]">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                                  m.type === 'OUT'
                                    ? 'bg-amber-100 text-amber-800'
                                    : m.type === 'IN'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {m.type === 'OUT' ? 'KELUAR (SPK)' : m.type === 'IN' ? 'MASUK' : 'ADJUST'}
                              </span>
                            </td>
                            <td className="p-2 font-mono font-bold text-right border-r border-[#e2e8f0]">
                              {m.type === 'OUT' ? `-${m.qty}` : `+${m.qty}`}
                            </td>
                            <td className="p-2 font-mono font-semibold text-neutral-800 border-r border-[#e2e8f0]">
                              {m.reference}
                            </td>
                            <td className="p-2 text-neutral-700 border-r border-[#e2e8f0]">
                              {m.operator}
                            </td>
                            <td className="p-2 text-neutral-600 italic">
                              {m.notes || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-[#cbd5e1] rounded-sm flex items-center justify-center p-8 text-neutral-400 text-xs">
          Pilih salah satu item di panel kiri untuk melihat detail stok.
        </div>
      )}

      {/* INLINE OPNAME MODAL */}
      {isOpnameOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-700 w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Stock Opname Fisik: {selectedItem.sku}
              </h3>
              <button onClick={() => setIsOpnameOpen(false)} className="cursor-pointer text-neutral-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOpname} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-600">Nama Barang:</label>
                <div className="text-sm font-bold text-neutral-900">{selectedItem.name}</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Stok saat ini di sistem: <strong className="font-mono">{selectedItem.stock} {selectedItem.unit}</strong>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">
                  Hasil Hitung Fisik Sebenarnya ({selectedItem.unit}):
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={opnameNewQty}
                  onChange={(e) => setOpnameNewQty(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 text-sm font-mono font-bold focus:border-[#16a34a] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">
                  Alasan / Keterangan Penyesuaian:
                </label>
                <input
                  type="text"
                  required
                  value={opnameNotes}
                  onChange={(e) => setOpnameNotes(e.target.value)}
                  className="w-full p-2 border border-neutral-300 text-xs focus:border-[#16a34a] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpnameOpen(false)}
                  className="px-3 py-1.5 font-bold uppercase bg-neutral-200 hover:bg-neutral-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold uppercase bg-[#16a34a] hover:bg-[#15803d] text-white cursor-pointer"
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
