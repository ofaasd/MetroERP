import React, { useState, useEffect } from 'react';
import { useErp } from '../context/ErpContext';
import { 
  MaterialTransaction, 
  MiscellaneousIssue, 
  MiscellaneousReceipt,
  InventorySubTab,
  TransactionType,
  MiscIssueReason,
  MiscReceiptReason
} from '../types/inventoryControl';
import { 
  Search, 
  Plus, 
  Save, 
  RotateCcw, 
  Trash2, 
  Printer, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Warehouse, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Tag, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Package, 
  Boxes, 
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';

export const BasicInventoryControl: React.FC = () => {
  const {
    inventorySubTab,
    setInventorySubTab,
    inventory,
    materialTransactions,
    miscIssues,
    miscReceipts,
    saveMaterialTransaction,
    deleteMaterialTransaction,
    saveMiscIssue,
    deleteMiscIssue,
    saveMiscReceipt,
    deleteMiscReceipt,
    masterWarehouses,
    masterLocations,
    masterItems,
    masterUoms,
    showToast,
    projectManager
  } = useErp();

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  // Form States
  const [txnForm, setTxnForm] = useState<MaterialTransaction | null>(null);
  const [issueForm, setIssueForm] = useState<MiscellaneousIssue | null>(null);
  const [receiptForm, setReceiptForm] = useState<MiscellaneousReceipt | null>(null);

  // Synchronize on tab switch or when list changes
  useEffect(() => {
    setIsNewMode(false);
    setSearchTerm('');
    setTypeFilter('ALL');
    setReasonFilter('ALL');

    if (inventorySubTab === 'material-engine') {
      const first = materialTransactions[0];
      setSelectedRecordId(first?.id || null);
      if (first) setTxnForm({ ...first });
    } else if (inventorySubTab === 'misc-issue') {
      const first = miscIssues[0];
      setSelectedRecordId(first?.id || null);
      if (first) setIssueForm({ ...first });
    } else if (inventorySubTab === 'misc-receipt') {
      const first = miscReceipts[0];
      setSelectedRecordId(first?.id || null);
      if (first) setReceiptForm({ ...first });
    }
  }, [inventorySubTab]);

  // Handle select row
  const handleSelectRecord = (id: string) => {
    setIsNewMode(false);
    setSelectedRecordId(id);

    if (inventorySubTab === 'material-engine') {
      const found = materialTransactions.find((t) => t.id === id);
      if (found) setTxnForm({ ...found });
    } else if (inventorySubTab === 'misc-issue') {
      const found = miscIssues.find((i) => i.id === id);
      if (found) setIssueForm({ ...found });
    } else if (inventorySubTab === 'misc-receipt') {
      const found = miscReceipts.find((r) => r.id === id);
      if (found) setReceiptForm({ ...found });
    }
  };

  // Handle Start New
  const handleAddNew = () => {
    setIsNewMode(true);
    setSelectedRecordId(null);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const rndNum = Math.floor(1000 + Math.random() * 9000);
    const defaultItem = masterItems[0] || { code: 'RAW-STL-002', name: 'Plat Baja SPCC 2.0mm', defaultUom: 'Lembar', standardCost: 420000 };
    const defaultWh = masterWarehouses[0] || { code: 'WH-RM01', name: 'Gudang Logam & Bahan Baku' };
    const defaultLoc = masterLocations[0] || { code: 'LOC-RM-A1', name: 'Rak Logam Baris A-1' };
    const defaultStock = inventory.find(i => i.sku === defaultItem.code)?.stock || 25;

    if (inventorySubTab === 'material-engine') {
      setTxnForm({
        id: `txn-new-${Date.now()}`,
        transactionNumber: `TXN-${new Date().getFullYear()}-${rndNum}`,
        timestamp: nowStr,
        type: 'INTER_WH_TRANSFER',
        typeLabel: 'Inter-Warehouse Transfer',
        itemCode: defaultItem.code,
        itemName: defaultItem.name,
        category: 'RAW_MATERIAL',
        warehouseCode: defaultWh.code,
        warehouseName: defaultWh.name,
        locationCode: defaultLoc.code,
        destWarehouseCode: masterWarehouses[1]?.code || 'WH-FG03',
        destLocationCode: masterLocations[1]?.code || 'LOC-FG-P1',
        direction: 'TRANSFER',
        qty: 1,
        uom: defaultItem.defaultUom || 'Pcs',
        unitCost: defaultItem.standardCost || 100000,
        totalCost: defaultItem.standardCost || 100000,
        reasonCode: 'INTERNAL_REBALANCE',
        referenceDoc: `TRF-MANUAL-${rndNum}`,
        operator: projectManager.name,
        department: 'Logistik Terpadu',
        costCenter: 'CC-LOG-501',
        status: 'POSTED',
        notes: 'Penyesuaian / relokasi fisik material via Transaction Engine.',
        lotBatchNo: `LOT-${rndNum}`,
      });
    } else if (inventorySubTab === 'misc-issue') {
      setIssueForm({
        id: `iss-new-${Date.now()}`,
        issueNumber: `MISC-ISS-${new Date().getFullYear()}-${rndNum}`,
        issueDate: nowStr,
        reasonCode: 'RND_TESTING',
        reasonLabel: 'Pengujian R&D / Prototipe',
        costCenter: 'CC-ENG-101',
        department: 'Engineering & R&D',
        itemCode: defaultItem.code,
        itemName: defaultItem.name,
        warehouseCode: defaultWh.code,
        warehouseName: defaultWh.name,
        locationCode: defaultLoc.code,
        availableStock: defaultStock,
        qty: 1,
        uom: defaultItem.defaultUom || 'Lembar',
        unitCost: defaultItem.standardCost || 420000,
        totalAmount: defaultItem.standardCost || 420000,
        requester: projectManager.name,
        approvedBy: 'Kepala Divisi Teknik',
        status: 'POSTED',
        notes: 'Pengeluaran material non-produksi untuk kebutuhan sampling & validasi teknis.',
      });
    } else if (inventorySubTab === 'misc-receipt') {
      setReceiptForm({
        id: `rec-new-${Date.now()}`,
        receiptNumber: `MISC-REC-${new Date().getFullYear()}-${rndNum}`,
        receiptDate: nowStr,
        reasonCode: 'SHOPFLOOR_RETURN',
        reasonLabel: 'Pengembalian Sisa Material Lini Pabrik',
        offsetAccount: 'ACC-5100-WIP-RET',
        itemCode: defaultItem.code,
        itemName: defaultItem.name,
        warehouseCode: defaultWh.code,
        warehouseName: defaultWh.name,
        locationCode: defaultLoc.code,
        qty: 1,
        uom: defaultItem.defaultUom || 'Lembar',
        unitCost: defaultItem.standardCost || 420000,
        totalAmount: defaultItem.standardCost || 420000,
        receivedBy: projectManager.name,
        inspectedBy: 'Siti Nurhaliza (Lead QC)',
        vendorSource: 'Pengembalian Internal Shopfloor',
        lotBatchNo: `LOT-RET-${rndNum}`,
        expiryDate: '',
        status: 'POSTED',
        notes: 'Penerimaan barang non-PO ke gudang penyimpanan fisik.',
      });
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (inventorySubTab === 'material-engine') {
      if (!txnForm) return;
      if (!txnForm.itemCode || txnForm.qty <= 0) {
        showToast('error', 'Validasi Gagal', 'Kode material dan kuantitas valid wajib diisi.');
        return;
      }
      saveMaterialTransaction({ ...txnForm, totalCost: txnForm.qty * txnForm.unitCost }, isNewMode);
      setIsNewMode(false);
      setSelectedRecordId(txnForm.id);
    } else if (inventorySubTab === 'misc-issue') {
      if (!issueForm) return;
      if (!issueForm.itemCode || issueForm.qty <= 0) {
        showToast('error', 'Validasi Gagal', 'Pilih item dan masukkan jumlah pengeluaran lebih dari 0.');
        return;
      }
      const invStock = inventory.find(i => i.sku === issueForm.itemCode)?.stock ?? 0;
      if (isNewMode && issueForm.qty > invStock) {
        showToast('error', 'Stok Tidak Cukup', `Stok tersedia hanya ${invStock} ${issueForm.uom}. Tidak bisa mengeluarkan ${issueForm.qty}.`);
        return;
      }
      saveMiscIssue({ ...issueForm, totalAmount: issueForm.qty * issueForm.unitCost }, isNewMode);
      setIsNewMode(false);
      setSelectedRecordId(issueForm.id);
    } else if (inventorySubTab === 'misc-receipt') {
      if (!receiptForm) return;
      if (!receiptForm.itemCode || receiptForm.qty <= 0) {
        showToast('error', 'Validasi Gagal', 'Pilih item dan masukkan jumlah penerimaan lebih dari 0.');
        return;
      }
      saveMiscReceipt({ ...receiptForm, totalAmount: receiptForm.qty * receiptForm.unitCost }, isNewMode);
      setIsNewMode(false);
      setSelectedRecordId(receiptForm.id);
    }
  };

  // Handle Delete
  const handleDelete = () => {
    if (!selectedRecordId) return;
    if (confirm('Apakah Anda yakin ingin menghapus record transaksi ini?')) {
      if (inventorySubTab === 'material-engine') {
        deleteMaterialTransaction(selectedRecordId);
      } else if (inventorySubTab === 'misc-issue') {
        deleteMiscIssue(selectedRecordId);
      } else if (inventorySubTab === 'misc-receipt') {
        deleteMiscReceipt(selectedRecordId);
      }
      setIsNewMode(false);
    }
  };

  // Handle Print Slip Simulation
  const handlePrintSlip = () => {
    const docNo = inventorySubTab === 'material-engine' 
      ? txnForm?.transactionNumber 
      : inventorySubTab === 'misc-issue' 
        ? issueForm?.issueNumber 
        : receiptForm?.receiptNumber;
    showToast('info', 'Mencetak Dokumen Bukti', `Slip Transaksi Resmi ${docNo} siap dikirim ke printer thermal / PDF.`);
  };

  // Helper when item changes in form
  const handleItemSelectChange = (itemCode: string) => {
    const item = masterItems.find(i => i.code === itemCode);
    const stock = inventory.find(i => i.sku === itemCode)?.stock || 0;
    if (!item) return;

    if (inventorySubTab === 'material-engine' && txnForm) {
      setTxnForm({
        ...txnForm,
        itemCode: item.code,
        itemName: item.name,
        uom: item.defaultUom,
        unitCost: item.standardCost,
        totalCost: txnForm.qty * item.standardCost,
      });
    } else if (inventorySubTab === 'misc-issue' && issueForm) {
      setIssueForm({
        ...issueForm,
        itemCode: item.code,
        itemName: item.name,
        uom: item.defaultUom,
        availableStock: stock,
        unitCost: item.standardCost,
        totalAmount: issueForm.qty * item.standardCost,
      });
    } else if (inventorySubTab === 'misc-receipt' && receiptForm) {
      setReceiptForm({
        ...receiptForm,
        itemCode: item.code,
        itemName: item.name,
        uom: item.defaultUom,
        unitCost: item.standardCost,
        totalAmount: receiptForm.qty * item.standardCost,
      });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* =========================================================================
          TOP NAVIGATION TABS: 3 SUB MENUS OF BASIC INVENTORY CONTROL
          ========================================================================= */}
      <div className="bg-[#1e293b] text-neutral-300 p-2 rounded-sm border border-[#334155] shadow-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xs border border-white/5 mr-1">
            <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 font-mono">
              Basic Inventory Control
            </span>
          </div>

          {/* SubMenu 1: Material Transaction Engine */}
          <button
            onClick={() => setInventorySubTab('material-engine')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              inventorySubTab === 'material-engine'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs border-b-2 border-emerald-300'
                : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-300" />
            <span>Material Transaction Engine</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-black/30 text-emerald-200">
              {materialTransactions.length}
            </span>
          </button>

          {/* SubMenu 2: Miscellaneous Issue */}
          <button
            onClick={() => setInventorySubTab('misc-issue')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              inventorySubTab === 'misc-issue'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xs border-b-2 border-amber-300'
                : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
            <span>Miscellaneous Issue</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-black/30 text-amber-200">
              {miscIssues.length}
            </span>
          </button>

          {/* SubMenu 3: Miscellaneous Receipt */}
          <button
            onClick={() => setInventorySubTab('misc-receipt')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              inventorySubTab === 'misc-receipt'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs border-b-2 border-blue-300'
                : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-blue-300" />
            <span>Miscellaneous Receipt</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-black/30 text-blue-200">
              {miscReceipts.length}
            </span>
          </button>
        </div>

        {/* Action Button: "+ Tambah Baru" */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>
            {inventorySubTab === 'material-engine' && '+ Eksekusi Transaksi'}
            {inventorySubTab === 'misc-issue' && '+ Buat Misc Issue'}
            {inventorySubTab === 'misc-receipt' && '+ Buat Misc Receipt'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          MAIN CONTAINER: SPLIT SCREEN (TABLE LEFT | FORM RIGHT)
          ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-[580px] overflow-hidden">
        
        {/* =========================================================================
            LEFT PANEL: DATA TABLE
            ========================================================================= */}
        <div className="w-full lg:w-[460px] xl:w-[500px] bg-white border border-[#cbd5e1] rounded-sm flex flex-col shrink-0 shadow-xs overflow-hidden">
          {/* Search & Filter Toolbar */}
          <div className="p-2 border-b border-[#e2e8f0] bg-[#f8fafc] space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  inventorySubTab === 'material-engine'
                    ? 'Cari No Transaksi, SKU, Ref, Dokumen...'
                    : inventorySubTab === 'misc-issue'
                    ? 'Cari No Issue, Item, Cost Center, Dept...'
                    : 'Cari No Receipt, Item, Sumber, Akun...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-[#cbd5e1] rounded-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-neutral-600 pb-0.5 scrollbar-none">
              <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono">Filter:</span>
              <button
                onClick={() => { setTypeFilter('ALL'); setReasonFilter('ALL'); }}
                className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                  typeFilter === 'ALL' && reasonFilter === 'ALL'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                Semua
              </button>

              {inventorySubTab === 'material-engine' && (
                <>
                  <button
                    onClick={() => setTypeFilter('MISC_ISSUE')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      typeFilter === 'MISC_ISSUE' ? 'bg-amber-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Issue (Keluar)
                  </button>
                  <button
                    onClick={() => setTypeFilter('MISC_RECEIPT')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      typeFilter === 'MISC_RECEIPT' ? 'bg-emerald-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Receipt (Masuk)
                  </button>
                  <button
                    onClick={() => setTypeFilter('INTER_WH_TRANSFER')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      typeFilter === 'INTER_WH_TRANSFER' ? 'bg-blue-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Transfer
                  </button>
                </>
              )}

              {inventorySubTab === 'misc-issue' && (
                <>
                  <button
                    onClick={() => setReasonFilter('RND_TESTING')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      reasonFilter === 'RND_TESTING' ? 'bg-amber-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    R&D Prototipe
                  </button>
                  <button
                    onClick={() => setReasonFilter('MAINTENANCE_MRO')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      reasonFilter === 'MAINTENANCE_MRO' ? 'bg-amber-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    MRO Mesin
                  </button>
                  <button
                    onClick={() => setReasonFilter('SCRAP_DAMAGE')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      reasonFilter === 'SCRAP_DAMAGE' ? 'bg-rose-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Scrap Rusak
                  </button>
                </>
              )}

              {inventorySubTab === 'misc-receipt' && (
                <>
                  <button
                    onClick={() => setReasonFilter('SHOPFLOOR_RETURN')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      reasonFilter === 'SHOPFLOOR_RETURN' ? 'bg-blue-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Retur Sisa
                  </button>
                  <button
                    onClick={() => setReasonFilter('VENDOR_SAMPLE')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      reasonFilter === 'VENDOR_SAMPLE' ? 'bg-blue-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Sampel Vendor
                  </button>
                  <button
                    onClick={() => setReasonFilter('PHYSICAL_SURPLUS')}
                    className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      reasonFilter === 'PHYSICAL_SURPLUS' ? 'bg-emerald-700 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Surplus Opname
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Table Header Row */}
          <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-3 py-1.5 text-[11px] font-bold text-neutral-600 flex items-center justify-between shrink-0">
            <span className="uppercase tracking-wider">
              {inventorySubTab === 'material-engine' && 'Material Transaction Ledger'}
              {inventorySubTab === 'misc-issue' && 'Daftar Miscellaneous Issue (Keluar)'}
              {inventorySubTab === 'misc-receipt' && 'Daftar Miscellaneous Receipt (Masuk)'}
            </span>
            <span className="font-mono text-[10px] text-neutral-500 font-normal">
              Pilih baris untuk edit form
            </span>
          </div>

          {/* Table Rows Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
            {/* 1. MATERIAL TRANSACTION ENGINE ROWS */}
            {inventorySubTab === 'material-engine' &&
              materialTransactions
                .filter((t) => {
                  const matchSearch =
                    t.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.referenceDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchType = typeFilter === 'ALL' || t.type === typeFilter;
                  return matchSearch && matchType;
                })
                .map((t) => {
                  const isSelected = !isNewMode && selectedRecordId === t.id;
                  const isOut = t.direction === 'OUT';
                  const isIn = t.direction === 'IN';
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectRecord(t.id)}
                      className={`p-3 cursor-pointer transition-colors border-l-3 ${
                        isSelected
                          ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950'
                          : 'border-l-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                              {t.transactionNumber}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs border flex items-center gap-0.5 ${
                                isOut
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : isIn
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}
                            >
                              {isOut ? <TrendingDown className="w-2.5 h-2.5" /> : isIn ? <TrendingUp className="w-2.5 h-2.5" /> : <RefreshCw className="w-2.5 h-2.5" />}
                              {t.direction}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">{t.timestamp.substring(5)}</span>
                          </div>
                          <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">
                            {t.itemCode} - {t.itemName}
                          </h4>
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                            {t.warehouseCode} ({t.locationCode}) · Ref: <span className="font-mono font-medium">{t.referenceDoc}</span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono text-xs font-black ${
                              isOut ? 'text-amber-700' : isIn ? 'text-emerald-700' : 'text-blue-700'
                            }`}
                          >
                            {isOut ? '-' : isIn ? '+' : '⇄'} {t.qty} {t.uom}
                          </span>
                          <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                            Rp {(t.totalCost || 0).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* 2. MISCELLANEOUS ISSUE ROWS */}
            {inventorySubTab === 'misc-issue' &&
              miscIssues
                .filter((i) => {
                  const matchSearch =
                    i.issueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.requester.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchReason = reasonFilter === 'ALL' || i.reasonCode === reasonFilter;
                  return matchSearch && matchReason;
                })
                .map((i) => {
                  const isSelected = !isNewMode && selectedRecordId === i.id;
                  return (
                    <div
                      key={i.id}
                      onClick={() => handleSelectRecord(i.id)}
                      className={`p-3 cursor-pointer transition-colors border-l-3 ${
                        isSelected
                          ? 'bg-[#fffbeb] border-l-amber-500 text-amber-950'
                          : 'border-l-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-xs border border-amber-300">
                              {i.issueNumber}
                            </span>
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-amber-300">
                              {i.reasonCode}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">{i.issueDate.substring(5, 10)}</span>
                          </div>
                          <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">
                            {i.itemCode} - {i.itemName}
                          </h4>
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                            Req: {i.requester} · {i.costCenter}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-black text-rose-700">
                            -{i.qty} {i.uom}
                          </span>
                          <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                            Rp {(i.totalAmount || 0).toLocaleString('id-ID')}
                          </div>
                          <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded-xs">
                            {i.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* 3. MISCELLANEOUS RECEIPT ROWS */}
            {inventorySubTab === 'misc-receipt' &&
              miscReceipts
                .filter((r) => {
                  const matchSearch =
                    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (r.vendorSource && r.vendorSource.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    r.receivedBy.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchReason = reasonFilter === 'ALL' || r.reasonCode === reasonFilter;
                  return matchSearch && matchReason;
                })
                .map((r) => {
                  const isSelected = !isNewMode && selectedRecordId === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRecord(r.id)}
                      className={`p-3 cursor-pointer transition-colors border-l-3 ${
                        isSelected
                          ? 'bg-[#eff6ff] border-l-blue-500 text-blue-950'
                          : 'border-l-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded-xs border border-blue-300">
                              {r.receiptNumber}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-blue-300">
                              {r.reasonCode}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">{r.receiptDate.substring(5, 10)}</span>
                          </div>
                          <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">
                            {r.itemCode} - {r.itemName}
                          </h4>
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                            Penerima: {r.receivedBy} · Akun: {r.offsetAccount}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-black text-emerald-700">
                            +{r.qty} {r.uom}
                          </span>
                          <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                            Rp {(r.totalAmount || 0).toLocaleString('id-ID')}
                          </div>
                          <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded-xs">
                            {r.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Table Footer Summary */}
          <div className="p-2 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-neutral-500 flex items-center justify-between shrink-0 font-mono">
            <span>
              Total Record:{' '}
              <strong className="text-neutral-800">
                {inventorySubTab === 'material-engine' && materialTransactions.length}
                {inventorySubTab === 'misc-issue' && miscIssues.length}
                {inventorySubTab === 'misc-receipt' && miscReceipts.length}
              </strong>
            </span>
            <span className="text-emerald-700 font-bold">● Ledger Realtime Active</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: FORM EDITOR (TABLE LEFT, FORM RIGHT)
            ========================================================================= */}
        <div className="flex-1 bg-white border border-[#cbd5e1] rounded-sm flex flex-col shadow-xs overflow-hidden">
          {/* Form Action Header Bar */}
          <div className="p-2.5 border-b border-[#e2e8f0] bg-[#f8fafc] flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold text-white text-xs ${
                  inventorySubTab === 'material-engine'
                    ? 'bg-emerald-600'
                    : inventorySubTab === 'misc-issue'
                    ? 'bg-amber-600'
                    : 'bg-blue-600'
                }`}
              >
                {inventorySubTab === 'material-engine' && <Layers className="w-4 h-4" />}
                {inventorySubTab === 'misc-issue' && <ArrowUpRight className="w-4 h-4" />}
                {inventorySubTab === 'misc-receipt' && <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 leading-tight">
                  {inventorySubTab === 'material-engine' && 'Material Transaction Engine - Ledger Inspector'}
                  {inventorySubTab === 'misc-issue' && 'Miscellaneous Issue - Pengeluaran Non-PO / WO'}
                  {inventorySubTab === 'misc-receipt' && 'Miscellaneous Receipt - Penerimaan Non-PO'}
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {isNewMode ? 'MODE BARU (DRAFT ENTRY)' : 'INSPEKSI RECORD · LEDGER PERGUDANGAN'}
                </span>
              </div>
            </div>

            {/* Actions: Save, Print, Reset, Delete */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                title="Cetak Bukti Fisik / Slip Transaksi"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">Cetak Slip</span>
              </button>

              <button
                type="button"
                onClick={handleAddNew}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                title="Reset dan Buat Record Baru"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">+ Baru</span>
              </button>

              {!isNewMode && selectedRecordId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                  title="Hapus Record Ini"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-xs transition-colors shadow-xs cursor-pointer ${
                  inventorySubTab === 'material-engine'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : inventorySubTab === 'misc-issue'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan & Posting</span>
              </button>
            </div>
          </div>

          {/* Form Fields Content Viewport */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#f8fafc]/50">
            <form onSubmit={handleSave} className="space-y-4 max-w-4xl">
              
              {/* =========================================================
                  SUB-FORM 1: MATERIAL TRANSACTION ENGINE
                  ========================================================= */}
              {inventorySubTab === 'material-engine' && txnForm && (
                <div className="space-y-3.5">
                  {/* Card 1: Informasi Dokumen & Ledger */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      1. Identitas Transaksi & Waktu Eksekusi
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Nomor Transaksi *</label>
                        <input
                          type="text"
                          value={txnForm.transactionNumber}
                          onChange={(e) => setTxnForm({ ...txnForm, transactionNumber: e.target.value })}
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-neutral-50 text-neutral-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Tipe Transaksi *</label>
                        <select
                          value={txnForm.type}
                          onChange={(e) => {
                            const val = e.target.value as TransactionType;
                            let dir: 'IN' | 'OUT' | 'TRANSFER' = 'TRANSFER';
                            if (val === 'MISC_ISSUE' || val === 'WIP_ISSUE') dir = 'OUT';
                            else if (val === 'MISC_RECEIPT' || val === 'PO_RECEIPT' || val === 'CYCLE_COUNT_ADJ') dir = 'IN';
                            setTxnForm({ ...txnForm, type: val, direction: dir });
                          }}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-neutral-800 font-semibold"
                        >
                          <option value="MISC_ISSUE">Miscellaneous Issue (Pengeluaran Non-PO)</option>
                          <option value="MISC_RECEIPT">Miscellaneous Receipt (Penerimaan Non-PO)</option>
                          <option value="WIP_ISSUE">WIP Issue (Job Order Produksi)</option>
                          <option value="INTER_WH_TRANSFER">Inter-Warehouse Transfer (Mutasi Antar Gudang)</option>
                          <option value="CYCLE_COUNT_ADJ">Cycle Count / Opname Adjustment</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Arah Ledger (Direction)</label>
                        <div className="flex items-center gap-2 pt-1 font-mono font-bold text-xs">
                          <span
                            className={`px-2 py-1 rounded-xs border ${
                              txnForm.direction === 'OUT'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : txnForm.direction === 'IN'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {txnForm.direction === 'OUT' && 'DEBET KELUAR (-OUT)'}
                            {txnForm.direction === 'IN' && 'KREDIT MASUK (+IN)'}
                            {txnForm.direction === 'TRANSFER' && 'RELOKASI / MUTASI (TRANSFER)'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Timestamp Transaksi</label>
                        <input
                          type="text"
                          value={txnForm.timestamp}
                          onChange={(e) => setTxnForm({ ...txnForm, timestamp: e.target.value })}
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Dokumen Referensi *</label>
                        <input
                          type="text"
                          value={txnForm.referenceDoc}
                          onChange={(e) => setTxnForm({ ...txnForm, referenceDoc: e.target.value })}
                          placeholder="e.g. SPK-2026-0042 / TRF-01"
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Operator Eksekusi</label>
                        <input
                          type="text"
                          value={txnForm.operator}
                          onChange={(e) => setTxnForm({ ...txnForm, operator: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Material & Kuantitas */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      2. Spesifikasi Material & Nilai Mutasi
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <label className="block text-neutral-600 font-semibold mb-1">Pilih Item / Material *</label>
                        <select
                          value={txnForm.itemCode}
                          onChange={(e) => handleItemSelectChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-semibold text-neutral-900"
                        >
                          {masterItems.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.code} - {item.name} ({item.defaultUom})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Lot / Batch Number</label>
                        <input
                          type="text"
                          value={txnForm.lotBatchNo || ''}
                          onChange={(e) => setTxnForm({ ...txnForm, lotBatchNo: e.target.value })}
                          placeholder="e.g. LOT-2610A"
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Jumlah Kuantitas *</label>
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={txnForm.qty}
                          onChange={(e) => {
                            const q = parseFloat(e.target.value) || 0;
                            setTxnForm({ ...txnForm, qty: q, totalCost: q * txnForm.unitCost });
                          }}
                          className="w-full font-mono font-bold text-sm px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Satuan UOM</label>
                        <input
                          type="text"
                          value={txnForm.uom}
                          onChange={(e) => setTxnForm({ ...txnForm, uom: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-neutral-50 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Harga Satuan (Rp)</label>
                        <input
                          type="number"
                          value={txnForm.unitCost}
                          onChange={(e) => {
                            const cost = parseFloat(e.target.value) || 0;
                            setTxnForm({ ...txnForm, unitCost: cost, totalCost: txnForm.qty * cost });
                          }}
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div className="md:col-span-3 bg-emerald-50/60 p-2.5 rounded-sm border border-emerald-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">Total Valuasi Nilai Transaksi:</span>
                        <span className="font-mono text-sm font-black text-emerald-800">
                          Rp {(txnForm.qty * txnForm.unitCost || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Lokasi Gudang Sumber & Tujuan */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <Warehouse className="w-3.5 h-3.5 text-emerald-600" />
                      3. Gudang Fisik & Lokasi Bin
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Gudang Sumber *</label>
                        <select
                          value={txnForm.warehouseCode}
                          onChange={(e) => {
                            const wh = masterWarehouses.find(w => w.code === e.target.value);
                            setTxnForm({ ...txnForm, warehouseCode: e.target.value, warehouseName: wh?.name || '' });
                          }}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        >
                          {masterWarehouses.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.code} - {w.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Lokasi / Bin Sumber</label>
                        <select
                          value={txnForm.locationCode}
                          onChange={(e) => setTxnForm({ ...txnForm, locationCode: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        >
                          {masterLocations.map((l) => (
                            <option key={l.code} value={l.code}>
                              {l.code} - {l.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {txnForm.direction === 'TRANSFER' && (
                        <>
                          <div>
                            <label className="block text-neutral-600 font-semibold mb-1 text-blue-700">
                              Gudang Tujuan (Transfer In) *
                            </label>
                            <select
                              value={txnForm.destWarehouseCode || ''}
                              onChange={(e) => setTxnForm({ ...txnForm, destWarehouseCode: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-blue-300 rounded-sm bg-blue-50/50 font-medium text-blue-950"
                            >
                              {masterWarehouses.map((w) => (
                                <option key={w.code} value={w.code}>
                                  {w.code} - {w.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-neutral-600 font-semibold mb-1 text-blue-700">
                              Lokasi / Bin Tujuan
                            </label>
                            <select
                              value={txnForm.destLocationCode || ''}
                              onChange={(e) => setTxnForm({ ...txnForm, destLocationCode: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-blue-300 rounded-sm bg-blue-50/50 font-medium text-blue-950"
                            >
                              {masterLocations.map((l) => (
                                <option key={l.code} value={l.code}>
                                  {l.code} - {l.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      <div className="md:col-span-2">
                        <label className="block text-neutral-600 font-semibold mb-1">Catatan Audit & Justifikasi</label>
                        <textarea
                          rows={2}
                          value={txnForm.notes || ''}
                          onChange={(e) => setTxnForm({ ...txnForm, notes: e.target.value })}
                          placeholder="Keterangan transaksi mutasi material..."
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  SUB-FORM 2: MISCELLANEOUS ISSUE (PENGELUARAN NON-PO)
                  ========================================================= */}
              {inventorySubTab === 'misc-issue' && issueForm && (
                <div className="space-y-3.5">
                  {/* Card 1: Identitas Issue & Alasan */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                      1. Dokumen Pengeluaran & Cost Center Pembebanan
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Nomor Issue *</label>
                        <input
                          type="text"
                          value={issueForm.issueNumber}
                          onChange={(e) => setIssueForm({ ...issueForm, issueNumber: e.target.value })}
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-amber-50/50 text-amber-900"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Tanggal Pengeluaran *</label>
                        <input
                          type="text"
                          value={issueForm.issueDate}
                          onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Alasan Pengeluaran (Reason Code) *</label>
                        <select
                          value={issueForm.reasonCode}
                          onChange={(e) => {
                            const val = e.target.value as MiscIssueReason;
                            const mapLabel: Record<MiscIssueReason, string> = {
                              RND_TESTING: 'Pengujian R&D / Prototipe',
                              MAINTENANCE_MRO: 'Pemeliharaan Mesin & Fasilitas MRO',
                              SCRAP_DAMAGE: 'Pemusnahan Barang Rusak / Scrap',
                              MARKETING_SAMPLE: 'Sampel Pemasaran & Demo Klien',
                              SHRINKAGE_ADJ: 'Penyesuaian Selisih / Shrinkage',
                              INTERNAL_USE: 'Pemakaian Operasional Departemen',
                              REWORK_EXPENSE: 'Beban Rework / Fabrikasi Ulang',
                            };
                            setIssueForm({ ...issueForm, reasonCode: val, reasonLabel: mapLabel[val] || val });
                          }}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-semibold text-neutral-800"
                        >
                          <option value="RND_TESTING">RND_TESTING (Pengujian R&D / Prototipe)</option>
                          <option value="MAINTENANCE_MRO">MAINTENANCE_MRO (Perawatan Mesin & MRO)</option>
                          <option value="SCRAP_DAMAGE">SCRAP_DAMAGE (Pemusnahan Scrap / Rusak)</option>
                          <option value="MARKETING_SAMPLE">MARKETING_SAMPLE (Sampel Klien / Demo)</option>
                          <option value="INTERNAL_USE">INTERNAL_USE (Pemakaian Internal Dept)</option>
                          <option value="SHRINKAGE_ADJ">SHRINKAGE_ADJ (Penyusutan Fisik)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Cost Center Pembebanan *</label>
                        <input
                          type="text"
                          value={issueForm.costCenter}
                          onChange={(e) => setIssueForm({ ...issueForm, costCenter: e.target.value })}
                          placeholder="e.g. CC-ENG-101"
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-neutral-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Departemen Pemohon *</label>
                        <input
                          type="text"
                          value={issueForm.department}
                          onChange={(e) => setIssueForm({ ...issueForm, department: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Status Dokumen</label>
                        <div className="pt-1">
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-xs border border-amber-300">
                            {issueForm.status} (POSTED KE BUKU BESAR)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Material & Validasi Stok */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <Boxes className="w-3.5 h-3.5 text-amber-600" />
                      2. Material & Validasi On-Hand Stock
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <label className="block text-neutral-600 font-semibold mb-1">Pilih Item yang Dikeluarkan *</label>
                        <select
                          value={issueForm.itemCode}
                          onChange={(e) => handleItemSelectChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-bold text-neutral-900"
                        >
                          {masterItems.map((item) => {
                            const curStock = inventory.find(i => i.sku === item.code)?.stock || 0;
                            return (
                              <option key={item.code} value={item.code}>
                                {item.code} - {item.name} (Stok: {curStock} {item.defaultUom})
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="bg-amber-50 p-2 rounded-sm border border-amber-200">
                        <span className="text-[10px] font-bold text-amber-800 uppercase block">Stok Tersedia Saat Ini:</span>
                        <span className="font-mono text-base font-black text-amber-900">
                          {inventory.find(i => i.sku === issueForm.itemCode)?.stock || 0} {issueForm.uom}
                        </span>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Jumlah Dikeluarkan *</label>
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={issueForm.qty}
                          onChange={(e) => {
                            const q = parseFloat(e.target.value) || 0;
                            setIssueForm({ ...issueForm, qty: q, totalAmount: q * issueForm.unitCost });
                          }}
                          className="w-full font-mono font-bold text-sm px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-rose-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Harga Satuan Standar (Rp)</label>
                        <input
                          type="number"
                          value={issueForm.unitCost}
                          onChange={(e) => {
                            const cost = parseFloat(e.target.value) || 0;
                            setIssueForm({ ...issueForm, unitCost: cost, totalAmount: issueForm.qty * cost });
                          }}
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Total Biaya Beban (Rp)</label>
                        <input
                          type="text"
                          readOnly
                          value={`Rp ${(issueForm.qty * issueForm.unitCost || 0).toLocaleString('id-ID')}`}
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-neutral-100 text-neutral-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Gudang Sumber *</label>
                        <select
                          value={issueForm.warehouseCode}
                          onChange={(e) => {
                            const wh = masterWarehouses.find(w => w.code === e.target.value);
                            setIssueForm({ ...issueForm, warehouseCode: e.target.value, warehouseName: wh?.name || '' });
                          }}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        >
                          {masterWarehouses.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.code} - {w.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Lokasi / Bin</label>
                        <select
                          value={issueForm.locationCode}
                          onChange={(e) => setIssueForm({ ...issueForm, locationCode: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        >
                          {masterLocations.map((l) => (
                            <option key={l.code} value={l.code}>
                              {l.code} - {l.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Penanggung Jawab / Pemohon</label>
                        <input
                          type="text"
                          value={issueForm.requester}
                          onChange={(e) => setIssueForm({ ...issueForm, requester: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-neutral-600 font-semibold mb-1">Catatan Justifikasi Pengeluaran</label>
                        <textarea
                          rows={2}
                          value={issueForm.notes}
                          onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
                          placeholder="Alasan teknis dan peruntukan barang..."
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  SUB-FORM 3: MISCELLANEOUS RECEIPT (PENERIMAAN NON-PO)
                  ========================================================= */}
              {inventorySubTab === 'misc-receipt' && receiptForm && (
                <div className="space-y-3.5">
                  {/* Card 1: Identitas Receipt & Akun Lawan */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <ArrowDownRight className="w-3.5 h-3.5 text-blue-600" />
                      1. Dokumen Penerimaan & Akun Lawan (Offsetting Account)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Nomor Receipt *</label>
                        <input
                          type="text"
                          value={receiptForm.receiptNumber}
                          onChange={(e) => setReceiptForm({ ...receiptForm, receiptNumber: e.target.value })}
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-blue-50/50 text-blue-900"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Tanggal Penerimaan *</label>
                        <input
                          type="text"
                          value={receiptForm.receiptDate}
                          onChange={(e) => setReceiptForm({ ...receiptForm, receiptDate: e.target.value })}
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Alasan Penerimaan (Reason Code) *</label>
                        <select
                          value={receiptForm.reasonCode}
                          onChange={(e) => {
                            const val = e.target.value as MiscReceiptReason;
                            const mapLabel: Record<MiscReceiptReason, string> = {
                              INITIAL_BALANCE: 'Saldo Awal Migrasi Sistem / Konversi',
                              SHOPFLOOR_RETURN: 'Pengembalian Sisa Material Lini Pabrik',
                              VENDOR_SAMPLE: 'Sampel / Bonus dari Pemasok (Tanpa PO)',
                              PHYSICAL_SURPLUS: 'Surplus Fisik Hasil Stock Opname',
                              RECLAIMED_MATERIAL: 'Reklamasi Bahan / Daur Ulang',
                              INTERPLANT_GIFT: 'Penerimaan Antar Pabrik / Hibah',
                            };
                            setReceiptForm({ ...receiptForm, reasonCode: val, reasonLabel: mapLabel[val] || val });
                          }}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-semibold text-neutral-800"
                        >
                          <option value="SHOPFLOOR_RETURN">SHOPFLOOR_RETURN (Pengembalian Sisa Lini)</option>
                          <option value="VENDOR_SAMPLE">VENDOR_SAMPLE (Sampel / Bonus Vendor)</option>
                          <option value="PHYSICAL_SURPLUS">PHYSICAL_SURPLUS (Surplus Stock Opname)</option>
                          <option value="INITIAL_BALANCE">INITIAL_BALANCE (Saldo Awal Migrasi)</option>
                          <option value="RECLAIMED_MATERIAL">RECLAIMED_MATERIAL (Reklamasi / Scrap)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Akun Lawan Kredit (Offset Account) *</label>
                        <input
                          type="text"
                          value={receiptForm.offsetAccount}
                          onChange={(e) => setReceiptForm({ ...receiptForm, offsetAccount: e.target.value })}
                          placeholder="e.g. ACC-5100-WIP-RET"
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-neutral-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Asal Material / Vendor</label>
                        <input
                          type="text"
                          value={receiptForm.vendorSource || ''}
                          onChange={(e) => setReceiptForm({ ...receiptForm, vendorSource: e.target.value })}
                          placeholder="e.g. PT Schneider Electric / Floor Return"
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Status Dokumen</label>
                        <div className="pt-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-xs border border-blue-300">
                            {receiptForm.status} (MASUK KE FISIK STOK)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Material & Valuasi Penerimaan */}
                  <div className="bg-white p-3.5 border border-[#e2e8f0] rounded-sm shadow-2xs space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 font-mono">
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      2. Material & Alokasi Gudang Masuk
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <label className="block text-neutral-600 font-semibold mb-1">Pilih Item yang Diterima *</label>
                        <select
                          value={receiptForm.itemCode}
                          onChange={(e) => handleItemSelectChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-bold text-neutral-900"
                        >
                          {masterItems.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.code} - {item.name} ({item.defaultUom})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Lot / Batch Number</label>
                        <input
                          type="text"
                          value={receiptForm.lotBatchNo || ''}
                          onChange={(e) => setReceiptForm({ ...receiptForm, lotBatchNo: e.target.value })}
                          placeholder="e.g. LOT-MCB-2609X"
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Jumlah Diterima *</label>
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={receiptForm.qty}
                          onChange={(e) => {
                            const q = parseFloat(e.target.value) || 0;
                            setReceiptForm({ ...receiptForm, qty: q, totalAmount: q * receiptForm.unitCost });
                          }}
                          className="w-full font-mono font-bold text-sm px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Harga Satuan Masuk (Rp)</label>
                        <input
                          type="number"
                          value={receiptForm.unitCost}
                          onChange={(e) => {
                            const cost = parseFloat(e.target.value) || 0;
                            setReceiptForm({ ...receiptForm, unitCost: cost, totalAmount: receiptForm.qty * cost });
                          }}
                          className="w-full font-mono px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Total Nilai Penambahan (Rp)</label>
                        <input
                          type="text"
                          readOnly
                          value={`Rp ${(receiptForm.qty * receiptForm.unitCost || 0).toLocaleString('id-ID')}`}
                          className="w-full font-mono font-bold px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-emerald-50 text-emerald-900 border-emerald-200"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Gudang Penyimpanan Masuk *</label>
                        <select
                          value={receiptForm.warehouseCode}
                          onChange={(e) => {
                            const wh = masterWarehouses.find(w => w.code === e.target.value);
                            setReceiptForm({ ...receiptForm, warehouseCode: e.target.value, warehouseName: wh?.name || '' });
                          }}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        >
                          {masterWarehouses.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.code} - {w.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Lokasi / Bin Masuk</label>
                        <select
                          value={receiptForm.locationCode}
                          onChange={(e) => setReceiptForm({ ...receiptForm, locationCode: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        >
                          {masterLocations.map((l) => (
                            <option key={l.code} value={l.code}>
                              {l.code} - {l.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1">Petugas Penerima Fisik</label>
                        <input
                          type="text"
                          value={receiptForm.receivedBy}
                          onChange={(e) => setReceiptForm({ ...receiptForm, receivedBy: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white font-medium"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-neutral-600 font-semibold mb-1">Catatan Kondisi Barang Saat Diterima</label>
                        <textarea
                          rows={2}
                          value={receiptForm.notes}
                          onChange={(e) => setReceiptForm({ ...receiptForm, notes: e.target.value })}
                          placeholder="Hasil inspeksi visual dan alasan penerimaan non-PO..."
                          className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded-sm bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsNewMode(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-xs hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Batal / Buka Terpilih
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 px-5 py-2 text-white text-xs font-bold rounded-xs transition-colors shadow-xs cursor-pointer ${
                    inventorySubTab === 'material-engine'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : inventorySubTab === 'misc-issue'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Posting Transaksi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
