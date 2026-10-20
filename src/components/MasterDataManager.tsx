import React, { useState, useEffect } from 'react';
import { useErp } from '../context/ErpContext';
import { 
  MasterItem, 
  MasterUom,
  MasterWarehouse,
  MasterLocation, 
  MasterWorkCenter, 
  MasterResource,
  MasterCustomer,
  MasterVendor,
  RelationItemWarehouse,
  RelationItemUom,
  RelationWorkCenterResource,
  RelationItemVendor,
  ItemCategory,
  LocationType,
  UomCategory,
  WorkCenterDepartment,
  ResourceType,
  MasterModuleTab
} from '../types/masterData';
import { 
  Search, 
  Plus, 
  Save, 
  RotateCcw, 
  Trash2, 
  Package, 
  Scale, 
  Warehouse, 
  MapPin, 
  Factory, 
  HardHat, 
  Building2, 
  Truck, 
  GitMerge, 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  Boxes
} from 'lucide-react';

export const MasterDataManager: React.FC = () => {
  const {
    masterSubTab,
    setMasterSubTab,

    // 8 Master Collections
    masterItems,
    masterUoms,
    masterWarehouses,
    masterLocations,
    masterWorkCenters,
    masterResources,
    masterCustomers,
    masterVendors,

    // 8 Master CRUD
    saveMasterItem,
    deleteMasterItem,
    saveMasterUom,
    deleteMasterUom,
    saveMasterWarehouse,
    deleteMasterWarehouse,
    saveMasterLocation,
    deleteMasterLocation,
    saveMasterWorkCenter,
    deleteMasterWorkCenter,
    saveMasterResource,
    deleteMasterResource,
    saveMasterCustomer,
    deleteMasterCustomer,
    saveMasterVendor,
    deleteMasterVendor,

    // 4 Relations Collections
    relItemWarehouses,
    relItemUoms,
    relWcResources,
    relItemVendors,

    // 4 Relations CRUD
    saveRelItemWarehouse,
    deleteRelItemWarehouse,
    saveRelItemUom,
    deleteRelItemUom,
    saveRelWcResource,
    deleteRelWcResource,
    saveRelItemVendor,
    deleteRelItemVendor,

    showToast,
  } = useErp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isNewMode, setIsNewMode] = useState<boolean>(false);

  // Form states for each of the 12 tabs
  const [itemForm, setItemForm] = useState<Partial<MasterItem>>({});
  const [uomForm, setUomForm] = useState<Partial<MasterUom>>({});
  const [whForm, setWhForm] = useState<Partial<MasterWarehouse>>({});
  const [locForm, setLocForm] = useState<Partial<MasterLocation>>({});
  const [wcForm, setWcForm] = useState<Partial<MasterWorkCenter>>({});
  const [resForm, setResForm] = useState<Partial<MasterResource>>({});
  const [custForm, setCustForm] = useState<Partial<MasterCustomer>>({});
  const [venForm, setVenForm] = useState<Partial<MasterVendor>>({});
  
  // Relations Forms
  const [relIwForm, setRelIwForm] = useState<Partial<RelationItemWarehouse>>({});
  const [relIuForm, setRelIuForm] = useState<Partial<RelationItemUom>>({});
  const [relWcrForm, setRelWcrForm] = useState<Partial<RelationWorkCenterResource>>({});
  const [relIvForm, setRelIvForm] = useState<Partial<RelationItemVendor>>({});

  // Reset search and selection on subtab switch
  useEffect(() => {
    setSearchTerm('');
    setIsNewMode(false);

    // Default select first item of current tab
    if (masterSubTab === 'items') {
      const first = masterItems[0];
      setSelectedRecordId(first?.id || null);
      if (first) setItemForm({ ...first });
    } else if (masterSubTab === 'uom') {
      const first = masterUoms[0];
      setSelectedRecordId(first?.id || null);
      if (first) setUomForm({ ...first });
    } else if (masterSubTab === 'warehouse') {
      const first = masterWarehouses[0];
      setSelectedRecordId(first?.id || null);
      if (first) setWhForm({ ...first });
    } else if (masterSubTab === 'location') {
      const first = masterLocations[0];
      setSelectedRecordId(first?.id || null);
      if (first) setLocForm({ ...first });
    } else if (masterSubTab === 'workcenter') {
      const first = masterWorkCenters[0];
      setSelectedRecordId(first?.id || null);
      if (first) setWcForm({ ...first });
    } else if (masterSubTab === 'resources') {
      const first = masterResources[0];
      setSelectedRecordId(first?.id || null);
      if (first) setResForm({ ...first });
    } else if (masterSubTab === 'customer') {
      const first = masterCustomers[0];
      setSelectedRecordId(first?.id || null);
      if (first) setCustForm({ ...first });
    } else if (masterSubTab === 'vendors') {
      const first = masterVendors[0];
      setSelectedRecordId(first?.id || null);
      if (first) setVenForm({ ...first });
    } else if (masterSubTab === 'rel_item_warehouse') {
      const first = relItemWarehouses[0];
      setSelectedRecordId(first?.id || null);
      if (first) setRelIwForm({ ...first });
    } else if (masterSubTab === 'rel_item_uom') {
      const first = relItemUoms[0];
      setSelectedRecordId(first?.id || null);
      if (first) setRelIuForm({ ...first });
    } else if (masterSubTab === 'rel_wc_resource') {
      const first = relWcResources[0];
      setSelectedRecordId(first?.id || null);
      if (first) setRelWcrForm({ ...first });
    } else if (masterSubTab === 'rel_item_vendor') {
      const first = relItemVendors[0];
      setSelectedRecordId(first?.id || null);
      if (first) setRelIvForm({ ...first });
    }
  }, [masterSubTab]);

  // Sync selected record into form
  const handleSelectRecord = (id: string) => {
    setIsNewMode(false);
    setSelectedRecordId(id);

    switch (masterSubTab) {
      case 'items': {
        const item = masterItems.find((i) => i.id === id);
        if (item) setItemForm({ ...item });
        break;
      }
      case 'uom': {
        const uom = masterUoms.find((u) => u.id === id);
        if (uom) setUomForm({ ...uom });
        break;
      }
      case 'warehouse': {
        const wh = masterWarehouses.find((w) => w.id === id);
        if (wh) setWhForm({ ...wh });
        break;
      }
      case 'location': {
        const loc = masterLocations.find((l) => l.id === id);
        if (loc) setLocForm({ ...loc });
        break;
      }
      case 'workcenter': {
        const wc = masterWorkCenters.find((w) => w.id === id);
        if (wc) setWcForm({ ...wc });
        break;
      }
      case 'resources': {
        const res = masterResources.find((r) => r.id === id);
        if (res) setResForm({ ...res });
        break;
      }
      case 'customer': {
        const cust = masterCustomers.find((c) => c.id === id);
        if (cust) setCustForm({ ...cust });
        break;
      }
      case 'vendors': {
        const ven = masterVendors.find((v) => v.id === id);
        if (ven) setVenForm({ ...ven });
        break;
      }
      case 'rel_item_warehouse': {
        const rel = relItemWarehouses.find((r) => r.id === id);
        if (rel) setRelIwForm({ ...rel });
        break;
      }
      case 'rel_item_uom': {
        const rel = relItemUoms.find((r) => r.id === id);
        if (rel) setRelIuForm({ ...rel });
        break;
      }
      case 'rel_wc_resource': {
        const rel = relWcResources.find((r) => r.id === id);
        if (rel) setRelWcrForm({ ...rel });
        break;
      }
      case 'rel_item_vendor': {
        const rel = relItemVendors.find((r) => r.id === id);
        if (rel) setRelIvForm({ ...rel });
        break;
      }
    }
  };

  // Handler: Start New Record
  const handleAddNew = () => {
    setIsNewMode(true);
    const newId = `new-${Date.now()}`;
    setSelectedRecordId(newId);

    if (masterSubTab === 'items') {
      setItemForm({
        id: newId,
        code: `ITM-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        category: 'RAW_MATERIAL',
        baseUom: 'PCS',
        standardCost: 50000,
        salesPrice: 75000,
        isMesTracked: true,
        barcode: `899${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'ACTIVE',
        description: '',
      });
    } else if (masterSubTab === 'uom') {
      setUomForm({
        id: newId,
        code: 'NEW',
        name: '',
        category: 'QUANTITY',
        symbol: 'u',
        isBase: false,
        status: 'ACTIVE',
        description: '',
      });
    } else if (masterSubTab === 'warehouse') {
      setWhForm({
        id: newId,
        code: `WH-${Math.floor(10 + Math.random() * 90)}`,
        name: '',
        branch: 'Plant 2 Cikarang Pusat',
        managerPic: '',
        phone: '+62 21 ',
        capacity: '500 Pallet',
        address: 'Kawasan Industri',
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'location') {
      setLocForm({
        id: newId,
        code: `LOC-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        warehouseCode: masterWarehouses[0]?.code || 'WH-RAW-01',
        zone: 'Lantai 1',
        type: 'STAGING_MES',
        capacity: '50 Pallet',
        currentOccupancyPercent: 0,
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'workcenter') {
      setWcForm({
        id: newId,
        code: `WC-${Math.floor(10 + Math.random() * 90)}`,
        name: '',
        department: 'MACHINING',
        workCenterType: 'MACHINE',
        capacityPerHour: 10,
        capacityUom: 'Part/Jam',
        efficiencyTargetPercent: 92,
        standardHourlyRate: 200000,
        status: 'AVAILABLE',
        description: '',
      });
    } else if (masterSubTab === 'resources') {
      setResForm({
        id: newId,
        code: `RES-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        resourceType: 'MACHINE',
        identifierNo: 'SN-001',
        specification: '',
        hourlyCost: 150000,
        leadOperatorPic: '',
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'customer') {
      setCustForm({
        id: newId,
        code: `CUST-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        industry: 'Manufaktur Komponen',
        contactPerson: '',
        phone: '+62 ',
        email: '',
        city: 'Bekasi',
        address: '',
        npwp: '01.000.000.0-000.000',
        paymentTerms: 'NET_30',
        creditLimit: 300000000,
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'vendors') {
      setVenForm({
        id: newId,
        code: `VEN-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        supplyCategory: 'Bahan Baku & Logam',
        contactPerson: '',
        phone: '+62 ',
        email: '',
        city: 'Jakarta',
        address: '',
        npwp: '01.000.000.0-000.000',
        paymentTerms: 'NET_30',
        bankAccount: 'BCA 123-456-7890',
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'rel_item_warehouse') {
      setRelIwForm({
        id: newId,
        itemCode: masterItems[0]?.code || '',
        itemName: masterItems[0]?.name || '',
        warehouseCode: masterWarehouses[0]?.code || '',
        warehouseName: masterWarehouses[0]?.name || '',
        defaultLocationCode: masterLocations[0]?.code || '',
        stockOnHand: 10,
        minSafetyStock: 5,
        maxStock: 100,
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'rel_item_uom') {
      setRelIuForm({
        id: newId,
        itemCode: masterItems[0]?.code || '',
        itemName: masterItems[0]?.name || '',
        uomCode: 'BOX',
        uomName: 'Box',
        isBaseUom: false,
        conversionFactor: 24,
        uomType: 'PURCHASE',
        barcode: '',
        status: 'ACTIVE',
      });
    } else if (masterSubTab === 'rel_wc_resource') {
      setRelWcrForm({
        id: newId,
        workCenterCode: masterWorkCenters[0]?.code || '',
        workCenterName: masterWorkCenters[0]?.name || '',
        resourceCode: masterResources[0]?.code || '',
        resourceName: masterResources[0]?.name || '',
        resourceType: 'MACHINE',
        isPrimary: true,
        allocationPercent: 100,
        status: 'ACTIVE',
        notes: '',
      });
    } else if (masterSubTab === 'rel_item_vendor') {
      setRelIvForm({
        id: newId,
        itemCode: masterItems[0]?.code || '',
        itemName: masterItems[0]?.name || '',
        vendorCode: masterVendors[0]?.code || '',
        vendorName: masterVendors[0]?.name || '',
        vendorItemCode: 'SUP-01',
        leadTimeDays: 7,
        lastPurchasePrice: 100000,
        isPreferredVendor: true,
        status: 'ACTIVE',
      });
    }
  };

  // Handler: Save Record
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    switch (masterSubTab) {
      case 'items':
        if (!itemForm.code || !itemForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Item wajib diisi.');
          return;
        }
        saveMasterItem(itemForm as MasterItem, isNewMode);
        break;
      case 'uom':
        if (!uomForm.code || !uomForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama UOM wajib diisi.');
          return;
        }
        saveMasterUom(uomForm as MasterUom, isNewMode);
        break;
      case 'warehouse':
        if (!whForm.code || !whForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Gudang wajib diisi.');
          return;
        }
        saveMasterWarehouse(whForm as MasterWarehouse, isNewMode);
        break;
      case 'location':
        if (!locForm.code || !locForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Lokasi wajib diisi.');
          return;
        }
        saveMasterLocation(locForm as MasterLocation, isNewMode);
        break;
      case 'workcenter':
        if (!wcForm.code || !wcForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Work Center wajib diisi.');
          return;
        }
        saveMasterWorkCenter(wcForm as MasterWorkCenter, isNewMode);
        break;
      case 'resources':
        if (!resForm.code || !resForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Resource wajib diisi.');
          return;
        }
        saveMasterResource(resForm as MasterResource, isNewMode);
        break;
      case 'customer':
        if (!custForm.code || !custForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Customer wajib diisi.');
          return;
        }
        saveMasterCustomer(custForm as MasterCustomer, isNewMode);
        break;
      case 'vendors':
        if (!venForm.code || !venForm.name) {
          showToast('error', 'Validasi Gagal', 'Kode dan Nama Vendor wajib diisi.');
          return;
        }
        saveMasterVendor(venForm as MasterVendor, isNewMode);
        break;
      case 'rel_item_warehouse':
        saveRelItemWarehouse(relIwForm as RelationItemWarehouse, isNewMode);
        break;
      case 'rel_item_uom':
        saveRelItemUom(relIuForm as RelationItemUom, isNewMode);
        break;
      case 'rel_wc_resource':
        saveRelWcResource(relWcrForm as RelationWorkCenterResource, isNewMode);
        break;
      case 'rel_item_vendor':
        saveRelItemVendor(relIvForm as RelationItemVendor, isNewMode);
        break;
    }

    setIsNewMode(false);
  };

  // Handler: Delete Record
  const handleDelete = () => {
    if (isNewMode) {
      setIsNewMode(false);
      return;
    }
    if (!selectedRecordId) return;

    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      switch (masterSubTab) {
        case 'items': deleteMasterItem(selectedRecordId); break;
        case 'uom': deleteMasterUom(selectedRecordId); break;
        case 'warehouse': deleteMasterWarehouse(selectedRecordId); break;
        case 'location': deleteMasterLocation(selectedRecordId); break;
        case 'workcenter': deleteMasterWorkCenter(selectedRecordId); break;
        case 'resources': deleteMasterResource(selectedRecordId); break;
        case 'customer': deleteMasterCustomer(selectedRecordId); break;
        case 'vendors': deleteMasterVendor(selectedRecordId); break;
        case 'rel_item_warehouse': deleteRelItemWarehouse(selectedRecordId); break;
        case 'rel_item_uom': deleteRelItemUom(selectedRecordId); break;
        case 'rel_wc_resource': deleteRelWcResource(selectedRecordId); break;
        case 'rel_item_vendor': deleteRelItemVendor(selectedRecordId); break;
      }
    }
  };

  // Handler: Cancel / Revert
  const handleCancel = () => {
    setIsNewMode(false);
    if (selectedRecordId) handleSelectRecord(selectedRecordId);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* =========================================================================
          TOP NAVIGATION TABS: 8 MASTER DATA + 4 MASTER RELATIONS
          ========================================================================= */}
      <div className="bg-[#1e293b] text-neutral-300 p-2 rounded-sm border border-[#334155] shadow-xs flex flex-col gap-2 shrink-0">
        {/* Row 1: 8 Atomic Master Data */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-800/80 px-2 py-1 rounded-xs shrink-0 font-mono">
            Master Data
          </span>

          <button
            onClick={() => setMasterSubTab('items')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'items' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Items</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterItems.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('uom')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'uom' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>UOM</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterUoms.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('warehouse')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'warehouse' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Warehouse</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterWarehouses.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('location')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'location' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Location</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterLocations.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('workcenter')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'workcenter' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Work Center</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterWorkCenters.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('resources')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'resources' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Resources</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterResources.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'customer' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Customer</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterCustomers.length}</span>
          </button>

          <button
            onClick={() => setMasterSubTab('vendors')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              masterSubTab === 'vendors' ? 'bg-[#10b981] text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Vendors</span>
            <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{masterVendors.length}</span>
          </button>
        </div>

        {/* Row 2: 4 Relations / Mapping Modules + Create Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#334155] pt-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-xs shrink-0 font-mono border border-purple-800/80">
              Relations (Mapping)
            </span>

            <button
              onClick={() => setMasterSubTab('rel_item_warehouse')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                masterSubTab === 'rel_item_warehouse' ? 'bg-purple-600 text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
              }`}
              title="ItemsWarehouse: Memetakan Item ke Warehouse mana saja"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>ItemsWarehouse</span>
              <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{relItemWarehouses.length}</span>
            </button>

            <button
              onClick={() => setMasterSubTab('rel_item_uom')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                masterSubTab === 'rel_item_uom' ? 'bg-purple-600 text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
              }`}
              title="ItemUOM: Daftar UOM & Konversi per Item"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>ItemUOM</span>
              <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{relItemUoms.length}</span>
            </button>

            <button
              onClick={() => setMasterSubTab('rel_wc_resource')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                masterSubTab === 'rel_wc_resource' ? 'bg-purple-600 text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
              }`}
              title="WorkCenterResource: Alokasi Mesin & Operator ke Work Center"
            >
              <Factory className="w-3.5 h-3.5" />
              <span>WorkCenterResource</span>
              <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{relWcResources.length}</span>
            </button>

            <button
              onClick={() => setMasterSubTab('rel_item_vendor')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                masterSubTab === 'rel_item_vendor' ? 'bg-purple-600 text-white shadow-xs' : 'text-neutral-300 hover:text-white hover:bg-[#334155]'
              }`}
              title="ItemVendor: Pemasok Vendor untuk Item"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>ItemVendor</span>
              <span className="text-[10px] font-mono px-1 rounded-xs bg-black/20">{relItemVendors.length}</span>
            </button>
          </div>

          {/* "+ Tambah Record Baru" Action */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xs transition-colors shadow-xs cursor-pointer ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Record Baru</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN MASTER-DETAIL SPLIT CONTAINER
          Left: Table Record | Right: Form Editor
          ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-[580px] overflow-hidden">
        {/* =========================================================================
            LEFT PANEL: TABLE RECORD LIST
            ========================================================================= */}
        <div className="w-full lg:w-[460px] xl:w-[490px] bg-white border border-[#cbd5e1] rounded-sm flex flex-col shrink-0 shadow-xs overflow-hidden">
          {/* Search Bar */}
          <div className="p-2 border-b border-[#e2e8f0] flex items-center gap-2 bg-[#f8fafc] shrink-0">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama, atau keterangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-[#cbd5e1] rounded-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Table Header Bar */}
          <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-3 py-1.5 text-[11px] font-bold text-neutral-600 flex items-center justify-between shrink-0">
            <span className="uppercase tracking-wider">
              {masterSubTab.startsWith('rel_') ? 'Daftar Relasi (Mapping)' : 'Daftar Record Master'}
            </span>
            <span className="font-mono text-[10px] text-neutral-500 font-normal">
              Klik baris untuk edit form
            </span>
          </div>

          {/* Table Rows Body (Dense & Clickable) */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
            {/* 1. Items */}
            {masterSubTab === 'items' && masterItems
              .filter(i => i.code.toLowerCase().includes(searchTerm.toLowerCase()) || i.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(item => {
                const isSelected = !isNewMode && selectedRecordId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectRecord(item.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                            {item.code}
                          </span>
                          {item.isMesTracked && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-xs font-semibold border border-emerald-300">
                              MES
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-500">{item.category}</span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{item.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-800 shrink-0">{item.baseUom}</span>
                    </div>
                  </div>
                );
              })}

            {/* 2. UOM */}
            {masterSubTab === 'uom' && masterUoms
              .filter(u => u.code.toLowerCase().includes(searchTerm.toLowerCase()) || u.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(uom => {
                const isSelected = !isNewMode && selectedRecordId === uom.id;
                return (
                  <div
                    key={uom.id}
                    onClick={() => handleSelectRecord(uom.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-xs border border-neutral-300">
                            {uom.code}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-medium">({uom.symbol})</span>
                          {uom.isBase && (
                            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-xs font-semibold">
                              Base UOM
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold mt-1 text-neutral-800 truncate">{uom.name}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500">{uom.category}</span>
                    </div>
                  </div>
                );
              })}

            {/* 3. Warehouse */}
            {masterSubTab === 'warehouse' && masterWarehouses
              .filter(w => w.code.toLowerCase().includes(searchTerm.toLowerCase()) || w.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(wh => {
                const isSelected = !isNewMode && selectedRecordId === wh.id;
                return (
                  <div
                    key={wh.id}
                    onClick={() => handleSelectRecord(wh.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                          {wh.code}
                        </span>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{wh.name}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">PIC: {wh.managerPic} · {wh.phone}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                        {wh.status}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* 4. Location */}
            {masterSubTab === 'location' && masterLocations
              .filter(l => l.code.toLowerCase().includes(searchTerm.toLowerCase()) || l.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(loc => {
                const isSelected = !isNewMode && selectedRecordId === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectRecord(loc.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                            {loc.code}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">{loc.warehouseCode}</span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{loc.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                        {loc.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* 5. Work Center */}
            {masterSubTab === 'workcenter' && masterWorkCenters
              .filter(w => w.code.toLowerCase().includes(searchTerm.toLowerCase()) || w.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(wc => {
                const isSelected = !isNewMode && selectedRecordId === wc.id;
                return (
                  <div
                    key={wc.id}
                    onClick={() => handleSelectRecord(wc.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                            {wc.code}
                          </span>
                          <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded-xs font-semibold">
                            {wc.department}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{wc.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-800">{wc.capacityPerHour} {wc.capacityUom}</span>
                    </div>
                  </div>
                );
              })}

            {/* 6. Resources */}
            {masterSubTab === 'resources' && masterResources
              .filter(r => r.code.toLowerCase().includes(searchTerm.toLowerCase()) || r.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(res => {
                const isSelected = !isNewMode && selectedRecordId === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => handleSelectRecord(res.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                            {res.code}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-xs border border-blue-200">
                            {res.resourceType}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{res.name}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">PIC: {res.leadOperatorPic}</p>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-700">Rp {res.hourlyCost.toLocaleString('id-ID')}/jam</span>
                    </div>
                  </div>
                );
              })}

            {/* 7. Customer */}
            {masterSubTab === 'customer' && masterCustomers
              .filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(cust => {
                const isSelected = !isNewMode && selectedRecordId === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => handleSelectRecord(cust.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                          {cust.code}
                        </span>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{cust.name}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{cust.city} · PIC: {cust.contactPerson}</p>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                        {cust.paymentTerms}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* 8. Vendors */}
            {masterSubTab === 'vendors' && masterVendors
              .filter(v => v.code.toLowerCase().includes(searchTerm.toLowerCase()) || v.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(ven => {
                const isSelected = !isNewMode && selectedRecordId === ven.id;
                return (
                  <div
                    key={ven.id}
                    onClick={() => handleSelectRecord(ven.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-[#ecfdf5] border-l-[#10b981] text-emerald-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
                          {ven.code}
                        </span>
                        <h4 className="text-xs font-bold mt-1 text-neutral-900 truncate">{ven.name}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{ven.city} · {ven.supplyCategory}</p>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                        {ven.paymentTerms}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Relations 1: ItemsWarehouse */}
            {masterSubTab === 'rel_item_warehouse' && relItemWarehouses
              .filter(r => r.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) || r.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(rel => {
                const isSelected = !isNewMode && selectedRecordId === rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => handleSelectRecord(rel.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-purple-50 border-l-purple-500 text-purple-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className="font-mono text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded-xs border border-purple-300">
                            {rel.itemCode}
                          </span>
                          <span>→</span>
                          <span className="font-mono text-neutral-800 bg-neutral-100 px-1.5 py-0.2 rounded-xs border border-neutral-300">
                            {rel.warehouseCode}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold mt-1 text-neutral-800 truncate">{rel.itemName}</h4>
                        <p className="text-[10px] text-neutral-500">Gudang: {rel.warehouseName}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-800 shrink-0">{rel.stockOnHand} Unit</span>
                    </div>
                  </div>
                );
              })}

            {/* Relations 2: ItemUOM */}
            {masterSubTab === 'rel_item_uom' && relItemUoms
              .filter(r => r.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) || r.uomCode.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(rel => {
                const isSelected = !isNewMode && selectedRecordId === rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => handleSelectRecord(rel.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-purple-50 border-l-purple-500 text-purple-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className="font-mono text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded-xs border border-purple-300">
                            {rel.itemCode}
                          </span>
                          <span>:</span>
                          <span className="font-mono text-neutral-800 bg-neutral-100 px-1.5 py-0.2 rounded-xs border border-neutral-300">
                            {rel.uomCode}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold mt-1 text-neutral-800 truncate">{rel.itemName}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-800 shrink-0">1 {rel.uomCode} = {rel.conversionFactor} Base</span>
                    </div>
                  </div>
                );
              })}

            {/* Relations 3: WorkCenterResource */}
            {masterSubTab === 'rel_wc_resource' && relWcResources
              .filter(r => r.workCenterCode.toLowerCase().includes(searchTerm.toLowerCase()) || r.resourceCode.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(rel => {
                const isSelected = !isNewMode && selectedRecordId === rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => handleSelectRecord(rel.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-purple-50 border-l-purple-500 text-purple-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className="font-mono text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded-xs border border-purple-300">
                            {rel.workCenterCode}
                          </span>
                          <span>↔</span>
                          <span className="font-mono text-neutral-800 bg-neutral-100 px-1.5 py-0.2 rounded-xs border border-neutral-300">
                            {rel.resourceCode}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold mt-1 text-neutral-800 truncate">{rel.resourceName}</h4>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-xs">
                        {rel.allocationPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Relations 4: ItemVendor */}
            {masterSubTab === 'rel_item_vendor' && relItemVendors
              .filter(r => r.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) || r.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(rel => {
                const isSelected = !isNewMode && selectedRecordId === rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => handleSelectRecord(rel.id)}
                    className={`p-3 cursor-pointer transition-colors border-l-3 ${
                      isSelected ? 'bg-purple-50 border-l-purple-500 text-purple-950' : 'border-l-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className="font-mono text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded-xs border border-purple-300">
                            {rel.itemCode}
                          </span>
                          <span>←</span>
                          <span className="font-mono text-neutral-800 bg-neutral-100 px-1.5 py-0.2 rounded-xs border border-neutral-300">
                            {rel.vendorCode}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold mt-1 text-neutral-800 truncate">{rel.vendorName}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-700">Rp {rel.lastPurchasePrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: LIVE FORM EDITOR
            When user clicks left record, this form updates immediately!
            ========================================================================= */}
        <div className="flex-1 bg-white border border-[#cbd5e1] rounded-sm flex flex-col shadow-xs overflow-hidden">
          {/* Header Bar of Form */}
          <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isNewMode ? 'bg-blue-500 animate-pulse' : 'bg-[#10b981]'}`} />
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  {isNewMode ? `+ Tambah Record Baru (${masterSubTab.toUpperCase()})` : `Edit Record: ${selectedRecordId || ''}`}
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {isNewMode ? 'Lengkapi formulir lalu klik Simpan Data' : 'Perubahan langsung tersimpan tanpa reload halaman'}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 bg-white border border-[#cbd5e1] rounded-xs hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {!isNewMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 hover:text-red-800 bg-white border border-red-200 rounded-xs hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#10b981] hover:bg-[#059669] rounded-xs transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>

          {/* Form Scroll Area */}
          <form onSubmit={handleSave} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {/* 1. Items Form */}
            {masterSubTab === 'items' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    Spesifikasi Master Item
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Item (SKU) *</label>
                      <input
                        type="text"
                        value={itemForm.code || ''}
                        onChange={(e) => setItemForm({ ...itemForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold text-neutral-800"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Barang / Material *</label>
                      <input
                        type="text"
                        value={itemForm.name || ''}
                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold text-neutral-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kategori Material</label>
                      <select
                        value={itemForm.category || 'RAW_MATERIAL'}
                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as ItemCategory })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="RAW_MATERIAL">Bahan Baku (Raw Material)</option>
                        <option value="COMPONENT">Komponen (Component Part)</option>
                        <option value="FINISHED_GOOD">Barang Jadi (Finished Good)</option>
                        <option value="SUB_ASSEMBLY">Sub-Assembly WIP</option>
                        <option value="CONSUMABLE">Bahan Pembantu (Consumable)</option>
                        <option value="PACKAGING">Kemasan (Packaging)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Base UOM Utama *</label>
                      <select
                        value={itemForm.baseUom || 'PCS'}
                        onChange={(e) => setItemForm({ ...itemForm, baseUom: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterUoms.map(u => (
                          <option key={u.code} value={u.code}>{u.code} - {u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Barcode / Serial</label>
                      <input
                        type="text"
                        value={itemForm.barcode || ''}
                        onChange={(e) => setItemForm({ ...itemForm, barcode: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Biaya Standar HPP (IDR)</label>
                      <input
                        type="number"
                        value={itemForm.standardCost || 0}
                        onChange={(e) => setItemForm({ ...itemForm, standardCost: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Harga Jual (IDR)</label>
                      <input
                        type="number"
                        value={itemForm.salesPrice || 0}
                        onChange={(e) => setItemForm({ ...itemForm, salesPrice: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xs">
                      <input
                        type="checkbox"
                        id="mesTracked"
                        checked={itemForm.isMesTracked ?? true}
                        onChange={(e) => setItemForm({ ...itemForm, isMesTracked: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded-xs cursor-pointer"
                      />
                      <label htmlFor="mesTracked" className="cursor-pointer text-xs font-semibold text-emerald-950">
                        Aktifkan di Modul MES (Alokasi SPK)
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Deskripsi & Catatan Spesifikasi</label>
                  <textarea
                    rows={2}
                    value={itemForm.description || ''}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#cbd5e1] rounded-xs"
                  />
                </div>
              </div>
            )}

            {/* 2. UOM Form */}
            {masterSubTab === 'uom' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    Master Satuan Ukur (UOM)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Satuan *</label>
                      <input
                        type="text"
                        value={uomForm.code || ''}
                        onChange={(e) => setUomForm({ ...uomForm, code: e.target.value.toUpperCase() })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        placeholder="Contoh: PCS / BOX"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Satuan Lengkap *</label>
                      <input
                        type="text"
                        value={uomForm.name || ''}
                        onChange={(e) => setUomForm({ ...uomForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        placeholder="Pieces (Unit)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kategori Satuan</label>
                      <select
                        value={uomForm.category || 'QUANTITY'}
                        onChange={(e) => setUomForm({ ...uomForm, category: e.target.value as UomCategory })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="QUANTITY">Quantity (Hitungan Part Diskrit)</option>
                        <option value="WEIGHT">Weight (Berat: Kg, Gram)</option>
                        <option value="LENGTH">Length (Panjang: Meter, Batang)</option>
                        <option value="AREA">Area (Luas: Lembar / m²)</option>
                        <option value="VOLUME">Volume (Liter / m³)</option>
                        <option value="PACKAGING">Packaging (Box / Pallet)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Simbol</label>
                      <input
                        type="text"
                        value={uomForm.symbol || ''}
                        onChange={(e) => setUomForm({ ...uomForm, symbol: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                        placeholder="pcs / bx"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-xs">
                      <input
                        type="checkbox"
                        id="isBase"
                        checked={uomForm.isBase ?? false}
                        onChange={(e) => setUomForm({ ...uomForm, isBase: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded-xs cursor-pointer"
                      />
                      <label htmlFor="isBase" className="cursor-pointer text-xs font-semibold text-blue-950">
                        Satuan Dasar (Base Unit)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Warehouse Form */}
            {masterSubTab === 'warehouse' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                    Master Fasilitas Gudang Fisik (Warehouse)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Gudang *</label>
                      <input
                        type="text"
                        value={whForm.code || ''}
                        onChange={(e) => setWhForm({ ...whForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Gudang *</label>
                      <input
                        type="text"
                        value={whForm.name || ''}
                        onChange={(e) => setWhForm({ ...whForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Cabang / Pabrik (Branch)</label>
                      <input
                        type="text"
                        value={whForm.branch || ''}
                        onChange={(e) => setWhForm({ ...whForm, branch: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kepala Gudang (PIC)</label>
                      <input
                        type="text"
                        value={whForm.managerPic || ''}
                        onChange={(e) => setWhForm({ ...whForm, managerPic: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kapasitas Maksimal</label>
                      <input
                        type="text"
                        value={whForm.capacity || ''}
                        onChange={(e) => setWhForm({ ...whForm, capacity: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Alamat Fisik Gudang</label>
                      <input
                        type="text"
                        value={whForm.address || ''}
                        onChange={(e) => setWhForm({ ...whForm, address: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Location Form */}
            {masterSubTab === 'location' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Master Lokasi Spesifik / Bin / Staging
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Lokasi *</label>
                      <input
                        type="text"
                        value={locForm.code || ''}
                        onChange={(e) => setLocForm({ ...locForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Area Lokasi *</label>
                      <input
                        type="text"
                        value={locForm.name || ''}
                        onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Berada di Gudang (Warehouse)</label>
                      <select
                        value={locForm.warehouseCode || ''}
                        onChange={(e) => setLocForm({ ...locForm, warehouseCode: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterWarehouses.map(w => (
                          <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Tipe Lokasi</label>
                      <select
                        value={locForm.type || 'STAGING_MES'}
                        onChange={(e) => setLocForm({ ...locForm, type: e.target.value as LocationType })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="STAGING_MES">Staging Produksi MES (Buffer Mesin)</option>
                        <option value="STORAGE_BIN">Rak / Storage Bin Penyimpanan</option>
                        <option value="RECEIVING">Area Penerimaan (Inbound)</option>
                        <option value="DISPATCH">Area Pengiriman (Outbound)</option>
                        <option value="QUARANTINE">Karantina Reject / Scrap</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Zona / Lorong</label>
                      <input
                        type="text"
                        value={locForm.zone || ''}
                        onChange={(e) => setLocForm({ ...locForm, zone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                        placeholder="Lantai 1 Sektor Barat"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Work Center Form */}
            {masterSubTab === 'workcenter' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-purple-600" />
                    Master Work Center (Pusat Kerja Produksi MES)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Work Center *</label>
                      <input
                        type="text"
                        value={wcForm.code || ''}
                        onChange={(e) => setWcForm({ ...wcForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Work Center *</label>
                      <input
                        type="text"
                        value={wcForm.name || ''}
                        onChange={(e) => setWcForm({ ...wcForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Departemen Produksi</label>
                      <select
                        value={wcForm.department || 'MACHINING'}
                        onChange={(e) => setWcForm({ ...wcForm, department: e.target.value as WorkCenterDepartment })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="MACHINING">Machining (CNC, Milling, Bubut)</option>
                        <option value="FABRICATION">Fabrikasi (Laser Cutting, Bending)</option>
                        <option value="WELDING">Welding & Spotting (Pengelasan)</option>
                        <option value="ASSEMBLY">Assembly & Wiring (Perakitan)</option>
                        <option value="FINISHING">Finishing & Coating</option>
                        <option value="QUALITY_CONTROL">Quality Control & FAT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kapasitas Output Standar</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={wcForm.capacityPerHour || 10}
                          onChange={(e) => setWcForm({ ...wcForm, capacityPerHour: Number(e.target.value) })}
                          className="w-24 px-2 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        />
                        <input
                          type="text"
                          value={wcForm.capacityUom || 'Part/Jam'}
                          onChange={(e) => setWcForm({ ...wcForm, capacityUom: e.target.value })}
                          className="flex-1 px-2 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Tarif Mesin / Jam (IDR)</label>
                      <input
                        type="number"
                        value={wcForm.standardHourlyRate || 150000}
                        onChange={(e) => setWcForm({ ...wcForm, standardHourlyRate: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Resources Form */}
            {masterSubTab === 'resources' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-blue-600" />
                    Master Resources (Mesin, Operator, Terminal MES)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Resource *</label>
                      <input
                        type="text"
                        value={resForm.code || ''}
                        onChange={(e) => setResForm({ ...resForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Mesin / Personel / Tool *</label>
                      <input
                        type="text"
                        value={resForm.name || ''}
                        onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Tipe Resource</label>
                      <select
                        value={resForm.resourceType || 'MACHINE'}
                        onChange={(e) => setResForm({ ...resForm, resourceType: e.target.value as ResourceType })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="MACHINE">Mesin / Peralatan Pabrik</option>
                        <option value="OPERATOR">Operator / Teknisi</option>
                        <option value="MES_TERMINAL">Terminal Touchscreen MES</option>
                        <option value="TOOL_EQUIPMENT">Perkakas / Jig / Fixture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">No Seri / NIK / IP Address</label>
                      <input
                        type="text"
                        value={resForm.identifierNo || ''}
                        onChange={(e) => setResForm({ ...resForm, identifierNo: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Biaya Standar / Jam (IDR)</label>
                      <input
                        type="number"
                        value={resForm.hourlyCost || 50000}
                        onChange={(e) => setResForm({ ...resForm, hourlyCost: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Spesifikasi Teknis</label>
                      <input
                        type="text"
                        value={resForm.specification || ''}
                        onChange={(e) => setResForm({ ...resForm, specification: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                        placeholder="Contoh: 12000 RPM, 3-Phase, Fanuc Controller"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Customer Form */}
            {masterSubTab === 'customer' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    Master Pelanggan (Customer / Pemesan SPK)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Customer *</label>
                      <input
                        type="text"
                        value={custForm.code || ''}
                        onChange={(e) => setCustForm({ ...custForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Perusahaan Klien *</label>
                      <input
                        type="text"
                        value={custForm.name || ''}
                        onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kontak Person (PIC)</label>
                      <input
                        type="text"
                        value={custForm.contactPerson || ''}
                        onChange={(e) => setCustForm({ ...custForm, contactPerson: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Telepon / WhatsApp</label>
                      <input
                        type="text"
                        value={custForm.phone || ''}
                        onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Syarat Pembayaran</label>
                      <select
                        value={custForm.paymentTerms || 'NET_30'}
                        onChange={(e) => setCustForm({ ...custForm, paymentTerms: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="COD">Cash On Delivery (COD)</option>
                        <option value="NET_14">Net 14 Hari</option>
                        <option value="NET_30">Net 30 Hari</option>
                        <option value="NET_45">Net 45 Hari</option>
                        <option value="NET_60">Net 60 Hari</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Vendors Form */}
            {masterSubTab === 'vendors' && (
              <div className="space-y-4">
                <div className="bg-[#f8fafc] p-3 rounded-xs border border-[#e2e8f0]">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-600" />
                    Master Pemasok (Vendors / Supplier Bahan)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kode Vendor *</label>
                      <input
                        type="text"
                        value={venForm.code || ''}
                        onChange={(e) => setVenForm({ ...venForm, code: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nama Perusahaan Vendor *</label>
                      <input
                        type="text"
                        value={venForm.name || ''}
                        onChange={(e) => setVenForm({ ...venForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kategori Pasokan</label>
                      <input
                        type="text"
                        value={venForm.supplyCategory || ''}
                        onChange={(e) => setVenForm({ ...venForm, supplyCategory: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Kontak Person</label>
                      <input
                        type="text"
                        value={venForm.contactPerson || ''}
                        onChange={(e) => setVenForm({ ...venForm, contactPerson: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nomor Rekening Bank</label>
                      <input
                        type="text"
                        value={venForm.bankAccount || ''}
                        onChange={(e) => setVenForm({ ...venForm, bankAccount: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relations 1: ItemsWarehouse Form */}
            {masterSubTab === 'rel_item_warehouse' && (
              <div className="space-y-4">
                <div className="bg-[#faf5ff] p-3 rounded-xs border border-[#e9d5ff]">
                  <h4 className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <GitMerge className="w-3.5 h-3.5 text-purple-600" />
                    ItemsWarehouse: Memasukkan Item ke Gudang Fisik
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Item *</label>
                      <select
                        value={relIwForm.itemCode || ''}
                        onChange={(e) => {
                          const item = masterItems.find(i => i.code === e.target.value);
                          setRelIwForm({ ...relIwForm, itemCode: e.target.value, itemName: item?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterItems.map(i => (
                          <option key={i.code} value={i.code}>{i.code} - {i.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Warehouse (Gudang) *</label>
                      <select
                        value={relIwForm.warehouseCode || ''}
                        onChange={(e) => {
                          const wh = masterWarehouses.find(w => w.code === e.target.value);
                          setRelIwForm({ ...relIwForm, warehouseCode: e.target.value, warehouseName: wh?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterWarehouses.map(w => (
                          <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Stok Fisik Tersedia (On Hand)</label>
                      <input
                        type="number"
                        value={relIwForm.stockOnHand || 0}
                        onChange={(e) => setRelIwForm({ ...relIwForm, stockOnHand: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Batas Minimum Safety Stock</label>
                      <input
                        type="number"
                        value={relIwForm.minSafetyStock || 0}
                        onChange={(e) => setRelIwForm({ ...relIwForm, minSafetyStock: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relations 2: ItemUOM Form */}
            {masterSubTab === 'rel_item_uom' && (
              <div className="space-y-4">
                <div className="bg-[#faf5ff] p-3 rounded-xs border border-[#e9d5ff]">
                  <h4 className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-purple-600" />
                    ItemUOM: Memetakan Item Memiliki List Satuan Apa Saja
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Item *</label>
                      <select
                        value={relIuForm.itemCode || ''}
                        onChange={(e) => {
                          const item = masterItems.find(i => i.code === e.target.value);
                          setRelIuForm({ ...relIuForm, itemCode: e.target.value, itemName: item?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterItems.map(i => (
                          <option key={i.code} value={i.code}>{i.code} - {i.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Satuan UOM *</label>
                      <select
                        value={relIuForm.uomCode || ''}
                        onChange={(e) => {
                          const uom = masterUoms.find(u => u.code === e.target.value);
                          setRelIuForm({ ...relIuForm, uomCode: e.target.value, uomName: uom?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterUoms.map(u => (
                          <option key={u.code} value={u.code}>{u.code} - {u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Rasio Konversi (1 UOM ini = X Base UOM)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={relIuForm.conversionFactor || 1}
                        onChange={(e) => setRelIuForm({ ...relIuForm, conversionFactor: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                      />
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Contoh: 1 {relIuForm.uomCode || 'BOX'} = {relIuForm.conversionFactor || 24} Unit Base
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Peruntukan Penggunaan</label>
                      <select
                        value={relIuForm.uomType || 'PURCHASE'}
                        onChange={(e) => setRelIuForm({ ...relIuForm, uomType: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs"
                      >
                        <option value="BASE">Base UOM (BOM Produksi)</option>
                        <option value="PURCHASE">Purchase UOM (Pembelian Supplier)</option>
                        <option value="SALES">Sales UOM (Penjualan Klien)</option>
                        <option value="PACKAGING">Packaging UOM (Peti / Pallet)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relations 3: WorkCenterResource Form */}
            {masterSubTab === 'rel_wc_resource' && (
              <div className="space-y-4">
                <div className="bg-[#faf5ff] p-3 rounded-xs border border-[#e9d5ff]">
                  <h4 className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-purple-600" />
                    WorkCenterResource: Alokasi Mesin & Operator ke Pusat Kerja MES
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Work Center *</label>
                      <select
                        value={relWcrForm.workCenterCode || ''}
                        onChange={(e) => {
                          const wc = masterWorkCenters.find(w => w.code === e.target.value);
                          setRelWcrForm({ ...relWcrForm, workCenterCode: e.target.value, workCenterName: wc?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterWorkCenters.map(w => (
                          <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Resource (Mesin / Operator) *</label>
                      <select
                        value={relWcrForm.resourceCode || ''}
                        onChange={(e) => {
                          const res = masterResources.find(r => r.code === e.target.value);
                          setRelWcrForm({ ...relWcrForm, resourceCode: e.target.value, resourceName: res?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterResources.map(r => (
                          <option key={r.code} value={r.code}>{r.code} - {r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Persentase Alokasi (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={relWcrForm.allocationPercent || 100}
                        onChange={(e) => setRelWcrForm({ ...relWcrForm, allocationPercent: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relations 4: ItemVendor Form */}
            {masterSubTab === 'rel_item_vendor' && (
              <div className="space-y-4">
                <div className="bg-[#faf5ff] p-3 rounded-xs border border-[#e9d5ff]">
                  <h4 className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-purple-600" />
                    ItemVendor: Pemetaan Vendor Supplier untuk Bahan Baku
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Item *</label>
                      <select
                        value={relIvForm.itemCode || ''}
                        onChange={(e) => {
                          const item = masterItems.find(i => i.code === e.target.value);
                          setRelIvForm({ ...relIvForm, itemCode: e.target.value, itemName: item?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterItems.map(i => (
                          <option key={i.code} value={i.code}>{i.code} - {i.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Pilih Vendor Supplier *</label>
                      <select
                        value={relIvForm.vendorCode || ''}
                        onChange={(e) => {
                          const ven = masterVendors.find(v => v.code === e.target.value);
                          setRelIvForm({ ...relIvForm, vendorCode: e.target.value, vendorName: ven?.name || '' });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-semibold"
                      >
                        {masterVendors.map(v => (
                          <option key={v.code} value={v.code}>{v.code} - {v.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Harga Beli Terakhir (IDR)</label>
                      <input
                        type="number"
                        value={relIvForm.lastPurchasePrice || 0}
                        onChange={(e) => setRelIvForm({ ...relIvForm, lastPurchasePrice: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Lead Time Pengadaan (Hari)</label>
                      <input
                        type="number"
                        value={relIvForm.leadTimeDays || 3}
                        onChange={(e) => setRelIvForm({ ...relIvForm, leadTimeDays: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
