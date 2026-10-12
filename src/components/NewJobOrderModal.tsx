import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { BOMItem, JobPriority } from '../types/erp';
import { ClipboardList, Plus, Trash2, X, Check, Boxes } from 'lucide-react';

interface NewJobOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewJobOrderModal: React.FC<NewJobOrderModalProps> = ({ isOpen, onClose }) => {
  const { inventory, workstations, createJobOrder, showToast } = useErp();

  const [clientName, setClientName] = useState('');
  const [productName, setProductName] = useState('');
  const [productSku, setProductSku] = useState('FG-CUSTOM-01');
  const [targetQty, setTargetQty] = useState<number>(1);
  const [priority, setPriority] = useState<JobPriority>('NORMAL');
  const [assignedTeam, setAssignedTeam] = useState(workstations[0]?.name || 'Tim Fabrikasi & Perakitan');
  const [leadTechnician, setLeadTechnician] = useState(workstations[0]?.lead || 'Hendra Saputra');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0] + ' 17:00';
  });
  const [notes, setNotes] = useState('');

  // Bill of Materials state
  const [bomList, setBomList] = useState<BOMItem[]>([
    { sku: 'RAW-STL-002', requiredQty: 2 },
    { sku: 'ELC-MCB-063', requiredQty: 2 },
  ]);

  const [selectedBomSku, setSelectedBomSku] = useState(inventory[0]?.sku || '');
  const [bomQty, setBomQty] = useState<number>(1);

  if (!isOpen) return null;

  const handleAddBomItem = () => {
    if (!selectedBomSku) return;
    const exists = bomList.some((b) => b.sku === selectedBomSku);
    if (exists) {
      setBomList(bomList.map((b) => b.sku === selectedBomSku ? { ...b, requiredQty: b.requiredQty + bomQty } : b));
    } else {
      setBomList([...bomList, { sku: selectedBomSku, requiredQty: bomQty }]);
    }
  };

  const handleRemoveBomItem = (sku: string) => {
    setBomList(bomList.filter((b) => b.sku !== sku));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !productName.trim()) {
      showToast('error', 'Form Tidak Lengkap', 'Nama klien dan nama produk wajib diisi.');
      return;
    }

    if (bomList.length === 0) {
      showToast('error', 'BOM Kosong', 'Tambahkan minimal 1 item bahan baku ke dalam struktur BOM.');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    createJobOrder({
      clientName,
      productName,
      productSku,
      targetQty: Number(targetQty),
      priority,
      status: 'QUEUE',
      assignedTeam,
      leadTechnician,
      startDate: nowStr,
      dueDate,
      bom: bomList,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-[#1a2332] text-white p-3.5 flex items-center justify-between border-b border-[#2d3748]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#f59e0b] rounded-xs" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Buat Surat Perintah Kerja (Job Order Baru)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#253247] rounded-sm text-neutral-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Row 1: Client & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase text-neutral-700 block mb-1">
                Nama Klien / Perusahaan Pemesan *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PT Maju Bersama Motor"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 border border-neutral-300 text-xs focus:border-[#0050ef] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-neutral-700 block mb-1">
                Tingkat Prioritas *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
                className="w-full p-2 border border-neutral-300 text-xs focus:border-[#0050ef] focus:outline-none"
              >
                <option value="URGENT">URGENT (Jalur Kilat - Segera)</option>
                <option value="HIGH">TINGGI (High Priority)</option>
                <option value="NORMAL">NORMAL (Jadwal Reguler)</option>
                <option value="LOW">RENDAH (Flexible)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Product Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold uppercase text-neutral-700 block mb-1">
                Nama Produk / Pesanan Fabrikasi *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Control Panel ATS Genset 50kVA"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-neutral-300 text-xs focus:border-[#0050ef] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-neutral-700 block mb-1">
                Target Kuantitas (Unit) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={targetQty}
                onChange={(e) => setTargetQty(Number(e.target.value))}
                className="w-full p-2 border border-neutral-300 text-xs font-mono font-bold focus:border-[#0050ef] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Workstation & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase text-neutral-700 block mb-1">
                Alokasi Lini & Teknisi Lead *
              </label>
              <select
                value={assignedTeam}
                onChange={(e) => {
                  const ws = workstations.find((w) => w.name === e.target.value);
                  setAssignedTeam(e.target.value);
                  if (ws) setLeadTechnician(ws.lead);
                }}
                className="w-full p-2 border border-neutral-300 text-xs focus:border-[#0050ef] focus:outline-none"
              >
                {workstations.map((ws) => (
                  <option key={ws.id} value={ws.name}>
                    {ws.name} ({ws.lead})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold uppercase text-neutral-700 block mb-1">
                Target Deadline Pengiriman *
              </label>
              <input
                type="text"
                required
                placeholder="YYYY-MM-DD HH:MM"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-neutral-300 text-xs font-mono focus:border-[#0050ef] focus:outline-none"
              />
            </div>
          </div>

          {/* BOM BUILDER SECTION */}
          <div className="border border-neutral-300 p-3 bg-neutral-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-[#107c41]" />
                Struktur Bahan Baku (BOM / Bill of Materials)
              </span>
              <span className="text-[10px] text-neutral-500">
                Stok akan dipotong otomatis saat SPK masuk ke tahap produksi
              </span>
            </div>

            {/* Selector row */}
            <div className="flex items-center gap-2">
              <select
                value={selectedBomSku}
                onChange={(e) => setSelectedBomSku(e.target.value)}
                className="flex-1 p-1.5 border border-neutral-300 text-xs bg-white focus:outline-none"
              >
                {inventory.map((inv) => (
                  <option key={inv.sku} value={inv.sku}>
                    {inv.sku} - {inv.name} (Stok: {inv.stock} {inv.unit})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={bomQty}
                onChange={(e) => setBomQty(Number(e.target.value))}
                className="w-20 p-1.5 border border-neutral-300 text-xs font-mono font-bold bg-white text-center"
                placeholder="Qty"
              />

              <button
                type="button"
                onClick={handleAddBomItem}
                className="bg-[#107c41] hover:bg-[#0e6b37] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Selected BOM List */}
            <div className="border border-neutral-300 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="p-1.5 border-r border-neutral-300">SKU Bahan</th>
                    <th className="p-1.5 border-r border-neutral-300">Deskripsi</th>
                    <th className="p-1.5 border-r border-neutral-300 text-right">Qty Dibutuhkan</th>
                    <th className="p-1.5 text-center w-12">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {bomList.map((item) => {
                    const inv = inventory.find((i) => i.sku === item.sku);
                    return (
                      <tr key={item.sku}>
                        <td className="p-1.5 font-mono font-bold text-neutral-900 border-r border-neutral-200">
                          {item.sku}
                        </td>
                        <td className="p-1.5 text-neutral-800 border-r border-neutral-200">
                          {inv?.name || item.sku}
                        </td>
                        <td className="p-1.5 font-mono tabular-nums font-bold text-right border-r border-neutral-200">
                          {item.requiredQty} {inv?.unit || 'Unit'}
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveBomItem(item.sku)}
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
            <label className="font-bold uppercase text-neutral-700 block mb-1">
              Catatan Instruksi Teknis Khusus
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi toleransi dimensi, standar pengujian, atau permintaan klien..."
              className="w-full p-2 border border-neutral-300 text-xs focus:border-[#0050ef] focus:outline-none"
            />
          </div>

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
              className="px-5 py-2 text-xs font-bold uppercase bg-[#16a34a] hover:bg-[#15803d] text-white rounded-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Terbitkan SPK</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
