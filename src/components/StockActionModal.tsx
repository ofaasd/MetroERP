import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { InventoryCategory } from '../types/erp';
import { ArrowUpRight, ArrowDownRight, Plus, X, Check } from 'lucide-react';

interface StockActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'RESTOCK' | 'STOCK_OUT' | 'NEW_ITEM';
}

export const StockActionModal: React.FC<StockActionModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const { inventory, addStock, removeStock, createInventoryItem, showToast } = useErp();

  // State for Restock / Stock Out
  const [selectedSku, setSelectedSku] = useState(inventory[0]?.sku || '');
  const [qty, setQty] = useState<number>(5);
  const [reference, setReference] = useState('');
  const [operator, setOperator] = useState('Petugas Logistik Gudang');
  const [notes, setNotes] = useState('');

  // State for New Item
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<InventoryCategory>('RAW_MATERIAL');
  const [newStock, setNewStock] = useState<number>(10);
  const [newSafetyMin, setNewSafetyMin] = useState<number>(5);
  const [newUnit, setNewUnit] = useState('Pcs');
  const [newUnitPrice, setNewUnitPrice] = useState<number>(150000);
  const [newBinLocation, setNewBinLocation] = useState('Gudang Utama A-01');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'RESTOCK') {
      const refCode = reference.trim() || `PO-IN-${Date.now().toString().slice(-4)}`;
      addStock(selectedSku, Number(qty), refCode, operator, notes || 'Penerimaan barang masuk dari supplier');
      onClose();
    } else if (mode === 'STOCK_OUT') {
      const refCode = reference.trim() || `OUT-MANUAL-${Date.now().toString().slice(-4)}`;
      const result = removeStock(selectedSku, Number(qty), refCode, operator, notes || 'Pengeluaran bahan manual');
      if (result.success) {
        onClose();
      }
    } else if (mode === 'NEW_ITEM') {
      if (!newSku.trim() || !newName.trim()) {
        showToast('error', 'Form Belum Lengkap', 'SKU dan Nama Barang wajib diisi.');
        return;
      }

      // Check unique SKU
      if (inventory.some((i) => i.sku.toLowerCase() === newSku.trim().toLowerCase())) {
        showToast('error', 'SKU Duplikat', `SKU ${newSku} sudah terdaftar.`);
        return;
      }

      createInventoryItem({
        sku: newSku.toUpperCase().trim(),
        name: newName.trim(),
        category: newCategory,
        stock: Number(newStock),
        safetyMin: Number(newSafetyMin),
        unit: newUnit,
        unitPrice: Number(newUnitPrice),
        binLocation: newBinLocation.trim(),
      });
      onClose();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'RESTOCK':
        return {
          text: 'Penerimaan Stok Barang Masuk (Restock / PO)',
          color: 'bg-[#107c41]',
          icon: ArrowUpRight,
        };
      case 'STOCK_OUT':
        return {
          text: 'Pengeluaran Stok Manual (Bahan / Komponen)',
          color: 'bg-[#fa6800]',
          icon: ArrowDownRight,
        };
      case 'NEW_ITEM':
        return {
          text: 'Tambah Master SKU Barang Baru',
          color: 'bg-[#0050ef]',
          icon: Plus,
        };
    }
  };

  const config = getTitle();
  const Icon = config.icon;
  const currentItem = inventory.find((i) => i.sku === selectedSku);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-sm w-full max-w-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#1a2332] text-white p-3.5 flex items-center justify-between border-b border-[#2d3748]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#f59e0b] rounded-xs" />
            <Icon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              {config.text}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#253247] rounded-sm text-neutral-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {mode !== 'NEW_ITEM' ? (
            <>
              <div>
                <label className="font-bold uppercase text-neutral-700 block mb-1">
                  Pilih Item Barang / SKU *
                </label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full p-2 border border-neutral-300 text-xs bg-white focus:outline-none"
                >
                  {inventory.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.sku} - {item.name} (Stok: {item.stock} {item.unit})
                    </option>
                  ))}
                </select>
                {currentItem && (
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Stok gudang saat ini: <strong className="font-mono text-neutral-800">{currentItem.stock} {currentItem.unit}</strong> | Lokasi: {currentItem.binLocation}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Jumlah ({currentItem?.unit || 'Unit'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full p-2 border border-neutral-300 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Nomor Bukti / Referensi
                  </label>
                  <input
                    type="text"
                    placeholder={mode === 'RESTOCK' ? 'PO-2026-001' : 'REQ-DEPT-01'}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full p-2 border border-neutral-300 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-neutral-700 block mb-1">
                  Operator / Penerima *
                </label>
                <input
                  type="text"
                  required
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full p-2 border border-neutral-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-neutral-700 block mb-1">
                  Catatan Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Keterangan pengiriman supplier atau peruntukan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-neutral-300 text-xs focus:outline-none"
                />
              </div>
            </>
          ) : (
            /* NEW ITEM FORM */
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Kode SKU Unik *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAW-COP-010"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full p-2 border border-neutral-300 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Kategori Barang *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as InventoryCategory)}
                    className="w-full p-2 border border-neutral-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="RAW_MATERIAL">Bahan Baku (Raw)</option>
                    <option value="COMPONENT">Komponen Elektrikal</option>
                    <option value="FINISHED_GOOD">Barang Jadi (Finished)</option>
                    <option value="PACKAGING">Kemasan & Pallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-neutral-700 block mb-1">
                  Nama Barang & Spesifikasi Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tembaga Busbar Plat 30x5mm (4 Meter)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-neutral-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Stok Awal *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2 border border-neutral-300 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Safety Min *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSafetyMin}
                    onChange={(e) => setNewSafetyMin(Number(e.target.value))}
                    className="w-full p-2 border border-neutral-300 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Satuan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Batang / Roll / Pcs"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2 border border-neutral-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Harga Satuan (Rp) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    className="w-full p-2 border border-neutral-300 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-700 block mb-1">
                    Lokasi Bin / Rak Gudang *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rak Busbar C-04"
                    value={newBinLocation}
                    onChange={(e) => setNewBinLocation(e.target.value)}
                    className="w-full p-2 border border-neutral-300 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-neutral-300 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase bg-neutral-200 hover:bg-neutral-300 text-neutral-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold uppercase text-white flex items-center gap-1.5 cursor-pointer ${config.color}`}
            >
              <Check className="w-4 h-4" />
              <span>
                {mode === 'RESTOCK'
                  ? 'Konfirmasi Stok Masuk'
                  : mode === 'STOCK_OUT'
                  ? 'Konfirmasi Pengeluaran'
                  : 'Daftarkan Item Baru'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
