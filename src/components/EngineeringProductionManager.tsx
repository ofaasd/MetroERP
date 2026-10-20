import React, { useState, useEffect } from 'react';
import { useErp } from '../context/ErpContext';
import { 
  MasterBOM, 
  BomComponent, 
  BomRoutingStep, 
  ProductionJobOrder, 
  JobOperation, 
  ProductionModuleTab,
  BomStatus,
  OperationStatus
} from '../types/production';
import { JobPriority, JobStatus } from '../types/erp';
import { 
  Search, 
  Plus, 
  Save, 
  RotateCcw, 
  Trash2, 
  Cpu, 
  ClipboardList, 
  Sliders, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Factory, 
  Wrench, 
  FileText, 
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Pause,
  ChevronRight,
  Boxes
} from 'lucide-react';

export const EngineeringProductionManager: React.FC = () => {
  const {
    productionSubTab,
    setProductionSubTab,
    bomList,
    productionJobs,
    jobOperations,
    saveBom,
    deleteBom,
    saveProductionJob,
    deleteProductionJob,
    saveJobOperation,
    deleteJobOperation,
    startJobOperation,
    finishJobOperation,
    masterItems,
    masterUoms,
    masterWorkCenters,
    masterResources,
    masterCustomers
  } = useErp();

  // Selected IDs for each tab
  const [selectedBomId, setSelectedBomId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedOpId, setSelectedOpId] = useState<string>('');

  const [isNewMode, setIsNewMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Active edit states
  const [bomForm, setBomForm] = useState<MasterBOM | null>(null);
  const [jobForm, setJobForm] = useState<ProductionJobOrder | null>(null);
  const [opForm, setOpForm] = useState<JobOperation | null>(null);

  // Synchronize selection on tab or data change
  useEffect(() => {
    if (productionSubTab === 'bom') {
      if (!isNewMode) {
        const found = bomList.find((b) => b.id === selectedBomId) || bomList[0];
        if (found) {
          setSelectedBomId(found.id);
          setBomForm(JSON.parse(JSON.stringify(found)));
        } else {
          setBomForm(null);
        }
      }
    } else if (productionSubTab === 'jobs') {
      if (!isNewMode) {
        const found = productionJobs.find((j) => j.id === selectedJobId) || productionJobs[0];
        if (found) {
          setSelectedJobId(found.id);
          setJobForm(JSON.parse(JSON.stringify(found)));
        } else {
          setJobForm(null);
        }
      }
    } else if (productionSubTab === 'operations') {
      if (!isNewMode) {
        const found = jobOperations.find((o) => o.id === selectedOpId) || jobOperations[0];
        if (found) {
          setSelectedOpId(found.id);
          setOpForm(JSON.parse(JSON.stringify(found)));
        } else {
          setOpForm(null);
        }
      }
    }
  }, [productionSubTab, bomList, productionJobs, jobOperations]);

  // Handle Tab Switch
  const handleTabChange = (tab: ProductionModuleTab) => {
    setProductionSubTab(tab);
    setIsNewMode(false);
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  // --------------------------------------------------------------------------
  // CREATE NEW HANDLERS
  // --------------------------------------------------------------------------
  const handleAddNewBom = () => {
    setIsNewMode(true);
    const newBom: MasterBOM = {
      id: `bom-${Date.now()}`,
      bomCode: `BOM-NEW-${Math.floor(100 + Math.random() * 900)}`,
      productCode: masterItems[0]?.code || 'FG-NEW-01',
      productName: masterItems[0]?.name || 'Produk Manufaktur Baru',
      revision: 'Rev 1.0',
      status: 'DRAFT',
      leadEngineer: 'Ir. Dimas Satrio, MT',
      cadDrawingNumber: `DWG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      targetBatchSize: 1,
      baseUom: 'Unit',
      effectiveDate: new Date().toISOString().split('T')[0],
      estimatedLeadTimeDays: 7,
      components: [
        {
          id: `comp-${Date.now()}-1`,
          itemCode: masterItems.find((i) => i.category === 'RAW_MATERIAL')?.code || 'RM-STEEL-SPCC-20',
          itemName: masterItems.find((i) => i.category === 'RAW_MATERIAL')?.name || 'Plat Baja SPCC 2.0mm',
          requiredQty: 2,
          uom: 'Lembar',
          scrapAllowancePercent: 2,
          stagingLocation: 'LOC-STG-LASER',
          unitCost: 450000,
        }
      ],
      routings: [
        {
          stepNo: 10,
          operationName: 'Pemotongan Plat Laser CNC',
          workCenterCode: 'WC-LASER-01',
          standardMinutes: 45,
        },
        {
          stepNo: 20,
          operationName: 'Bending & Tekuk Presisi',
          workCenterCode: 'WC-BEND-01',
          standardMinutes: 60,
        }
      ],
      notes: 'BOM baru dirancang untuk lini perakitan.',
    };
    setSelectedBomId(newBom.id);
    setBomForm(newBom);
  };

  const handleAddNewJob = () => {
    setIsNewMode(true);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newJob: ProductionJobOrder = {
      id: `spk-${Date.now()}`,
      orderNumber: `SPK-${new Date().getFullYear()}-${randomNum}`,
      bomCode: bomList[0]?.bomCode || 'BOM-PNL-DIST3P',
      customerName: masterCustomers[0]?.name || 'PT Astra Otoparts Tbk',
      productCode: bomList[0]?.productCode || 'FG-PNL-DIST3P',
      productName: bomList[0]?.productName || 'Panel Distribusi Listrik 3 Phase 400A',
      targetQty: 10,
      completedQty: 0,
      scrapQty: 0,
      priority: 'NORMAL',
      status: 'QUEUE',
      progressPercent: 0,
      assignedTeam: 'Tim Fabrikasi Alpha',
      leadTechnician: 'Budi Santoso',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      materialsDeducted: false,
      notes: 'Perintah kerja baru dijadwalkan.',
    };
    setSelectedJobId(newJob.id);
    setJobForm(newJob);
  };

  const handleAddNewOperation = () => {
    setIsNewMode(true);
    const firstJob = productionJobs[0];
    const newOp: JobOperation = {
      id: `op-${Date.now()}`,
      operationCode: `OP-${firstJob ? firstJob.orderNumber.replace('SPK-', '') : 'NEW'}-${Math.floor(10 + Math.random() * 90)}0`,
      jobOrderNumber: firstJob?.orderNumber || 'SPK-2026-0042',
      sequenceNo: 10,
      operationName: 'Operasi Pemotongan / Persiapan Material',
      workCenterCode: masterWorkCenters[0]?.code || 'WC-LASER-01',
      workCenterName: masterWorkCenters[0]?.name || 'Pusat Kerja Laser Cutting CNC',
      resourceCode: masterResources[0]?.code || 'RES-TRUMPF-3030',
      resourceName: masterResources[0]?.name || 'Trumpf TruLaser 3030 Fiber 4kW',
      mesTerminalId: 'MES-TERM-01',
      assignedOperator: 'Heri Kurniawan',
      targetQty: firstJob?.targetQty || 25,
      goodQty: 0,
      scrapQty: 0,
      standardCycleMinutes: 30,
      actualDurationMinutes: 0,
      status: 'PENDING',
      notes: 'Siap untuk dialokasikan pada jadwal lini permesinan.',
    };
    setSelectedOpId(newOp.id);
    setOpForm(newOp);
  };

  // --------------------------------------------------------------------------
  // SAVE / DELETE ACTIONS
  // --------------------------------------------------------------------------
  const handleSaveCurrent = () => {
    if (productionSubTab === 'bom' && bomForm) {
      saveBom(bomForm, isNewMode);
      setIsNewMode(false);
      setSelectedBomId(bomForm.id);
    } else if (productionSubTab === 'jobs' && jobForm) {
      saveProductionJob(jobForm, isNewMode);
      setIsNewMode(false);
      setSelectedJobId(jobForm.id);
    } else if (productionSubTab === 'operations' && opForm) {
      saveJobOperation(opForm, isNewMode);
      setIsNewMode(false);
      setSelectedOpId(opForm.id);
    }
  };

  const handleDeleteCurrent = () => {
    if (productionSubTab === 'bom' && bomForm) {
      if (confirm(`Yakin ingin menghapus BOM ${bomForm.bomCode}?`)) {
        deleteBom(bomForm.id);
        setIsNewMode(false);
      }
    } else if (productionSubTab === 'jobs' && jobForm) {
      if (confirm(`Yakin ingin menghapus SPK ${jobForm.orderNumber}?`)) {
        deleteProductionJob(jobForm.id);
        setIsNewMode(false);
      }
    } else if (productionSubTab === 'operations' && opForm) {
      if (confirm(`Yakin ingin menghapus Operasi ${opForm.operationCode}?`)) {
        deleteJobOperation(opForm.id);
        setIsNewMode(false);
      }
    }
  };

  const handleResetForm = () => {
    setIsNewMode(false);
    if (productionSubTab === 'bom') {
      const b = bomList.find((item) => item.id === selectedBomId) || bomList[0];
      if (b) setBomForm(JSON.parse(JSON.stringify(b)));
    } else if (productionSubTab === 'jobs') {
      const j = productionJobs.find((item) => item.id === selectedJobId) || productionJobs[0];
      if (j) setJobForm(JSON.parse(JSON.stringify(j)));
    } else if (productionSubTab === 'operations') {
      const o = jobOperations.find((item) => item.id === selectedOpId) || jobOperations[0];
      if (o) setOpForm(JSON.parse(JSON.stringify(o)));
    }
  };

  // --------------------------------------------------------------------------
  // SUB-TABLE HELPERS FOR BOM
  // --------------------------------------------------------------------------
  const handleAddComponentRow = () => {
    if (!bomForm) return;
    const newComp: BomComponent = {
      id: `comp-${Date.now()}`,
      itemCode: masterItems[0]?.code || 'ITM-NEW',
      itemName: masterItems[0]?.name || 'Komponen Baru',
      requiredQty: 1,
      uom: 'Pcs',
      scrapAllowancePercent: 1.0,
      stagingLocation: 'LOC-STG-GEN',
      unitCost: 50000,
    };
    setBomForm({
      ...bomForm,
      components: [...bomForm.components, newComp],
    });
  };

  const handleRemoveComponentRow = (compId: string) => {
    if (!bomForm) return;
    setBomForm({
      ...bomForm,
      components: bomForm.components.filter((c) => c.id !== compId),
    });
  };

  const handleUpdateComponent = (compId: string, field: keyof BomComponent, value: any) => {
    if (!bomForm) return;
    setBomForm({
      ...bomForm,
      components: bomForm.components.map((c) => {
        if (c.id === compId) {
          const updated = { ...c, [field]: value };
          // If changing itemCode, autofill name
          if (field === 'itemCode') {
            const itm = masterItems.find((i) => i.code === value);
            if (itm) {
              updated.itemName = itm.name;
              updated.unitCost = itm.standardCost || 0;
            }
          }
          return updated;
        }
        return c;
      }),
    });
  };

  const handleAddRoutingRow = () => {
    if (!bomForm) return;
    const nextStep = (bomForm.routings.length + 1) * 10;
    const newRoute: BomRoutingStep = {
      stepNo: nextStep,
      operationName: 'Operasi Tambahan Perakitan',
      workCenterCode: masterWorkCenters[0]?.code || 'WC-ASSY-01',
      standardMinutes: 30,
    };
    setBomForm({
      ...bomForm,
      routings: [...bomForm.routings, newRoute],
    });
  };

  const handleRemoveRoutingRow = (stepNo: number) => {
    if (!bomForm) return;
    setBomForm({
      ...bomForm,
      routings: bomForm.routings.filter((r) => r.stepNo !== stepNo),
    });
  };

  const handleUpdateRouting = (index: number, field: keyof BomRoutingStep, value: any) => {
    if (!bomForm) return;
    const updatedRoutings = [...bomForm.routings];
    updatedRoutings[index] = { ...updatedRoutings[index], [field]: value };
    setBomForm({
      ...bomForm,
      routings: updatedRoutings,
    });
  };

  // Calculated totals for BOM
  const totalBomMaterialCost = bomForm?.components.reduce((sum, c) => sum + (c.requiredQty * c.unitCost), 0) || 0;
  const totalRoutingMinutes = bomForm?.routings.reduce((sum, r) => sum + r.standardMinutes, 0) || 0;

  // --------------------------------------------------------------------------
  // FILTERING LOGIC
  // --------------------------------------------------------------------------
  const filteredBoms = bomList.filter((b) => {
    const matchesSearch = 
      b.bomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.leadEngineer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = productionJobs.filter((j) => {
    const matchesSearch = 
      j.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.leadTechnician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOperations = jobOperations.filter((o) => {
    const matchesSearch = 
      o.operationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.jobOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.operationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.workCenterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.assignedOperator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Badge stylers
  const getBomStatusBadge = (status: BomStatus) => {
    switch (status) {
      case 'RELEASED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">RELEASED</span>;
      case 'DRAFT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">DRAFT</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">REVIEW</span>;
      case 'OBSOLETE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-600 border border-neutral-300">OBSOLETE</span>;
    }
  };

  const getJobStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'QUEUE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">ANTREAN</span>;
      case 'MATERIAL_PREP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">PREP BAHAN</span>;
      case 'IN_PRODUCTION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">PRODUKSI</span>;
      case 'QC_CHECK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">QC CHECK</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">SELESAI</span>;
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">DISPATCHED</span>;
    }
  };

  const getOpStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-300">PENDING</span>;
      case 'READY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">READY</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">RUNNING</span>;
      case 'PAUSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">PAUSED</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">DONE</span>;
    }
  };

  const getPriorityBadge = (priority: JobPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white">URGENT</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-500 text-white">HIGH</span>;
      case 'NORMAL':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-amber-500 text-white">NORMAL</span>;
      case 'LOW':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-400 text-white">LOW</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f1f5f9] rounded-sm border border-[#cbd5e1] overflow-hidden shadow-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & SUBMENU TABS                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#1e293b] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white uppercase">
                Engineering & Production
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-800">
                Manufacturing MES
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Pengelolaan Struktur BOM, Surat Perintah Kerja (SPK), dan Eksekusi Operasi Lantai Pabrik
            </p>
          </div>
        </div>

        {/* 3 Core Submenu Tabs */}
        <div className="flex items-center bg-[#0f172a] p-1 rounded-sm border border-[#334155] text-xs">
          <button
            onClick={() => handleTabChange('bom')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs font-semibold transition-all cursor-pointer ${
              productionSubTab === 'bom'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Engineering Board & BOM</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${productionSubTab === 'bom' ? 'bg-emerald-800 text-emerald-100' : 'bg-[#1e293b] text-neutral-400'}`}>
              {bomList.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('jobs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs font-semibold transition-all cursor-pointer ${
              productionSubTab === 'jobs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Job Orders / SPK</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${productionSubTab === 'jobs' ? 'bg-emerald-800 text-emerald-100' : 'bg-[#1e293b] text-neutral-400'}`}>
              {productionJobs.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('operations')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs font-semibold transition-all cursor-pointer ${
              productionSubTab === 'operations'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Job Operations</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${productionSubTab === 'operations' ? 'bg-emerald-800 text-emerald-100' : 'bg-[#1e293b] text-neutral-400'}`}>
              {jobOperations.length}
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SPLIT LAYOUT: RECORDS (LEFT) & FORM (RIGHT)                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* ======================= LEFT: RECORD LIST ======================= */}
        <div className="w-full md:w-[460px] lg:w-[490px] bg-white border-r border-[#cbd5e1] flex flex-col shrink-0 min-h-0">
          {/* Top Control Bar: Search & + Record Button */}
          <div className="p-3 border-b border-[#e2e8f0] bg-[#f8fafc] space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-emerald-600" />
                {productionSubTab === 'bom' && `Daftar Master BOM (${filteredBoms.length})`}
                {productionSubTab === 'jobs' && `Daftar SPK Produksi (${filteredJobs.length})`}
                {productionSubTab === 'operations' && `Lantai Pabrik MES (${filteredOperations.length})`}
              </span>

              {/* + Tambah Record Button */}
              <button
                onClick={() => {
                  if (productionSubTab === 'bom') handleAddNewBom();
                  else if (productionSubTab === 'jobs') handleAddNewJob();
                  else if (productionSubTab === 'operations') handleAddNewOperation();
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-sm text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {productionSubTab === 'bom' && 'BOM Baru'}
                  {productionSubTab === 'jobs' && 'SPK Baru'}
                  {productionSubTab === 'operations' && 'Operasi Baru'}
                </span>
              </button>
            </div>

            {/* Search Input & Status Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kode, nama, nomor, atau PIC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white text-xs pl-8 pr-3 py-1.5 rounded-sm border border-[#cbd5e1] focus:outline-none focus:border-emerald-500 text-neutral-800"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#cbd5e1] text-xs py-1.5 px-2 rounded-sm text-neutral-700 focus:outline-none focus:border-emerald-500 shrink-0 font-medium"
              >
                <option value="ALL">Semua Status</option>
                {productionSubTab === 'bom' && (
                  <>
                    <option value="RELEASED">Released</option>
                    <option value="DRAFT">Draft</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="OBSOLETE">Obsolete</option>
                  </>
                )}
                {productionSubTab === 'jobs' && (
                  <>
                    <option value="QUEUE">Antrean</option>
                    <option value="MATERIAL_PREP">Material Prep</option>
                    <option value="IN_PRODUCTION">In Production</option>
                    <option value="QC_CHECK">QC Check</option>
                    <option value="COMPLETED">Selesai</option>
                  </>
                )}
                {productionSubTab === 'operations' && (
                  <>
                    <option value="PENDING">Pending</option>
                    <option value="READY">Ready</option>
                    <option value="IN_PROGRESS">Running</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Record List / Table Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
            {/* 1. BOM TAB LIST */}
            {productionSubTab === 'bom' && (
              filteredBoms.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Tidak ada record BOM yang sesuai pencarian.
                </div>
              ) : (
                filteredBoms.map((bom) => {
                  const isSelected = !isNewMode && bom.id === selectedBomId;
                  return (
                    <div
                      key={bom.id}
                      onClick={() => {
                        setIsNewMode(false);
                        setSelectedBomId(bom.id);
                        setBomForm(JSON.parse(JSON.stringify(bom)));
                      }}
                      className={`p-3 cursor-pointer transition-all border-l-4 text-xs ${
                        isSelected
                          ? 'bg-[#ecfdf5] border-l-emerald-600 shadow-xs'
                          : 'bg-white border-l-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
                          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{bom.bomCode}</span>
                          <span className="text-[10px] text-neutral-500 font-normal">({bom.revision})</span>
                        </div>
                        {getBomStatusBadge(bom.status)}
                      </div>

                      <div className="text-neutral-800 font-medium mb-1 truncate">
                        {bom.productName}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="truncate">PIC: {bom.leadEngineer}</span>
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                            {bom.components.length} Komponen
                          </span>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                            {bom.routings.length} Operasi
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* 2. SPK TAB LIST */}
            {productionSubTab === 'jobs' && (
              filteredJobs.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Tidak ada record SPK yang sesuai pencarian.
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isSelected = !isNewMode && job.id === selectedJobId;
                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        setIsNewMode(false);
                        setSelectedJobId(job.id);
                        setJobForm(JSON.parse(JSON.stringify(job)));
                      }}
                      className={`p-3 cursor-pointer transition-all border-l-4 text-xs ${
                        isSelected
                          ? 'bg-[#ecfdf5] border-l-emerald-600 shadow-xs'
                          : 'bg-white border-l-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2 font-mono font-bold text-neutral-900">
                          <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                          <span>{job.orderNumber}</span>
                          {getPriorityBadge(job.priority)}
                        </div>
                        {getJobStatusBadge(job.status)}
                      </div>

                      <div className="text-neutral-800 font-semibold mb-0.5 truncate">
                        {job.productName}
                      </div>

                      <div className="text-neutral-500 text-[11px] mb-1.5 truncate">
                        Pelanggan: <span className="text-neutral-700 font-medium">{job.customerName}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                          <span>Target: {job.targetQty} unit</span>
                          <span>{job.progressPercent}% Selesai ({job.completedQty} unit)</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              job.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${job.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* 3. JOB OPERATIONS TAB LIST */}
            {productionSubTab === 'operations' && (
              filteredOperations.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Tidak ada record Operasi MES yang sesuai pencarian.
                </div>
              ) : (
                filteredOperations.map((op) => {
                  const isSelected = !isNewMode && op.id === selectedOpId;
                  return (
                    <div
                      key={op.id}
                      onClick={() => {
                        setIsNewMode(false);
                        setSelectedOpId(op.id);
                        setOpForm(JSON.parse(JSON.stringify(op)));
                      }}
                      className={`p-3 cursor-pointer transition-all border-l-4 text-xs ${
                        isSelected
                          ? 'bg-[#ecfdf5] border-l-emerald-600 shadow-xs'
                          : 'bg-white border-l-transparent hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
                          <span className="bg-slate-800 text-white text-[10px] px-1.5 py-0.2 rounded">
                            Op {op.sequenceNo}
                          </span>
                          <span>{op.operationCode}</span>
                        </div>
                        {getOpStatusBadge(op.status)}
                      </div>

                      <div className="text-neutral-800 font-semibold mb-1 truncate">
                        {op.operationName}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                        <span className="font-mono text-blue-700 font-semibold">{op.jobOrderNumber}</span>
                        <span className="truncate">{op.workCenterCode}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-600 pt-1 border-t border-neutral-100">
                        <span>Operator: <strong>{op.assignedOperator}</strong></span>
                        <span className="font-mono text-emerald-700">Good: {op.goodQty}/{op.targetQty}</span>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* ======================= RIGHT: FORM EDITOR ======================= */}
        <div className="flex-1 bg-[#f8fafc] flex flex-col min-h-0 overflow-y-auto">
          
          {/* Form Action Header */}
          <div className="p-3.5 bg-white border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider ${
                isNewMode ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-800 border border-slate-300'
              }`}>
                {isNewMode ? 'MODE: TAMBAH BARU' : 'MODE: EDIT RECORD'}
              </span>

              <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                {productionSubTab === 'bom' && (
                  <>
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    <span>{bomForm?.bomCode || 'Form Struktur BOM'}</span>
                  </>
                )}
                {productionSubTab === 'jobs' && (
                  <>
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    <span>{jobForm?.orderNumber || 'Form SPK Produksi'}</span>
                  </>
                )}
                {productionSubTab === 'operations' && (
                  <>
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>{opForm?.operationCode || 'Form Operasi MES'}</span>
                  </>
                )}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleResetForm}
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-sm border border-neutral-300 cursor-pointer transition-colors"
                title="Batal perubahan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {!isNewMode && (
                <button
                  onClick={handleDeleteCurrent}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-sm border border-rose-200 cursor-pointer transition-colors"
                  title="Hapus record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}

              <button
                onClick={handleSaveCurrent}
                className="flex items-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm shadow-xs cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Record</span>
              </button>
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-4 sm:p-5 space-y-6">

            {/* ------------------------------------------------------------- */}
            {/* A. FORM: BILL OF MATERIALS (BOM) & ENGINEERING               */}
            {/* ------------------------------------------------------------- */}
            {productionSubTab === 'bom' && bomForm && (
              <div className="space-y-6">
                {/* Header Information Grid */}
                <div className="bg-white p-4 rounded-sm border border-[#e2e8f0] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-emerald-600" />
                      Header Spesifikasi Engineering BOM
                    </span>
                    <span className="text-xs font-mono text-neutral-400">ID: {bomForm.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Kode BOM *</label>
                      <input
                        type="text"
                        value={bomForm.bomCode}
                        onChange={(e) => setBomForm({ ...bomForm, bomCode: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Status BOM *</label>
                      <select
                        value={bomForm.status}
                        onChange={(e) => setBomForm({ ...bomForm, status: e.target.value as BomStatus })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-semibold focus:outline-none focus:border-emerald-500"
                      >
                        <option value="RELEASED">RELEASED (Siap Produksi)</option>
                        <option value="DRAFT">DRAFT (Penyusunan Desain)</option>
                        <option value="UNDER_REVIEW">UNDER REVIEW (Pemeriksaan Teknis)</option>
                        <option value="OBSOLETE">OBSOLETE (Kadaluarsa)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Revisi Engineering</label>
                      <input
                        type="text"
                        value={bomForm.revision}
                        onChange={(e) => setBomForm({ ...bomForm, revision: e.target.value })}
                        placeholder="Contoh: Rev 2.1"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Kode Produk Jadi (FG) *</label>
                      <select
                        value={bomForm.productCode}
                        onChange={(e) => {
                          const itm = masterItems.find((i) => i.code === e.target.value);
                          setBomForm({
                            ...bomForm,
                            productCode: e.target.value,
                            productName: itm ? itm.name : bomForm.productName,
                          });
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-emerald-500"
                      >
                        {masterItems.map((itm) => (
                          <option key={itm.id} value={itm.code}>
                            {itm.code} - {itm.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-neutral-600 font-semibold mb-1">Nama Produk Jadi *</label>
                      <input
                        type="text"
                        value={bomForm.productName}
                        onChange={(e) => setBomForm({ ...bomForm, productName: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Lead Engineer / Designer</label>
                      <input
                        type="text"
                        value={bomForm.leadEngineer}
                        onChange={(e) => setBomForm({ ...bomForm, leadEngineer: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">No. Gambar CAD / Drawing</label>
                      <input
                        type="text"
                        value={bomForm.cadDrawingNumber}
                        onChange={(e) => setBomForm({ ...bomForm, cadDrawingNumber: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Satuan Dasar (Base UOM)</label>
                      <select
                        value={bomForm.baseUom}
                        onChange={(e) => setBomForm({ ...bomForm, baseUom: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      >
                        {masterUoms.map((u) => (
                          <option key={u.id} value={u.code}>
                            {u.code} - {u.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Ukuran Batch Standar (Target)</label>
                      <input
                        type="number"
                        min="1"
                        value={bomForm.targetBatchSize}
                        onChange={(e) => setBomForm({ ...bomForm, targetBatchSize: Number(e.target.value) || 1 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Estimasi Lead Time (Hari)</label>
                      <input
                        type="number"
                        min="1"
                        value={bomForm.estimatedLeadTimeDays}
                        onChange={(e) => setBomForm({ ...bomForm, estimatedLeadTimeDays: Number(e.target.value) || 1 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Tanggal Efektif</label>
                      <input
                        type="date"
                        value={bomForm.effectiveDate}
                        onChange={(e) => setBomForm({ ...bomForm, effectiveDate: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-neutral-600 font-semibold mb-1">Catatan Engineering / Spesifikasi Toleransi</label>
                      <textarea
                        rows={2}
                        value={bomForm.notes}
                        onChange={(e) => setBomForm({ ...bomForm, notes: e.target.value })}
                        placeholder="Contoh: Menggunakan powder coating 70-80 mikron, bending allowance K-Factor 0.42..."
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-Table 1: Bill of Materials (Komponen Bahan Baku & Sparepart) */}
                <div className="bg-white p-4 rounded-sm border border-[#e2e8f0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Boxes className="w-4 h-4 text-emerald-600" />
                        Struktur Komponen Bahan (Bill of Materials)
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Daftar material per 1 {bomForm.baseUom} produk jadi beserta toleransi scrap dan staging MES.
                      </p>
                    </div>

                    <button
                      onClick={handleAddComponentRow}
                      className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-sm text-xs font-bold cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Komponen</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-neutral-200 divide-y divide-neutral-200">
                      <thead className="bg-[#f8fafc] text-neutral-600 font-semibold">
                        <tr>
                          <th className="py-2 px-2.5 w-10">No</th>
                          <th className="py-2 px-2.5">Item Komponen *</th>
                          <th className="py-2 px-2.5 w-24">Qty Kebutuhan *</th>
                          <th className="py-2 px-2.5 w-24">UOM</th>
                          <th className="py-2 px-2.5 w-24">Scrap (%)</th>
                          <th className="py-2 px-2.5">Staging Lokasi</th>
                          <th className="py-2 px-2.5 w-28 text-right">Biaya Satuan</th>
                          <th className="py-2 px-2.5 w-28 text-right">Subtotal</th>
                          <th className="py-2 px-2 w-10 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 bg-white">
                        {bomForm.components.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-4 text-center text-neutral-400 italic">
                              Belum ada komponen terdaftar. Klik "+ Tambah Komponen" di atas.
                            </td>
                          </tr>
                        ) : (
                          bomForm.components.map((comp, idx) => {
                            const subtotal = comp.requiredQty * comp.unitCost;
                            return (
                              <tr key={comp.id} className="hover:bg-neutral-50">
                                <td className="py-1.5 px-2.5 text-neutral-400 font-mono">{idx + 1}</td>
                                <td className="py-1.5 px-2.5">
                                  <select
                                    value={comp.itemCode}
                                    onChange={(e) => handleUpdateComponent(comp.id, 'itemCode', e.target.value)}
                                    className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                                  >
                                    {masterItems.map((itm) => (
                                      <option key={itm.id} value={itm.code}>
                                        {itm.code} - {itm.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-1.5 px-2.5">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={comp.requiredQty}
                                    onChange={(e) => handleUpdateComponent(comp.id, 'requiredQty', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                                  />
                                </td>
                                <td className="py-1.5 px-2.5">
                                  <select
                                    value={comp.uom}
                                    onChange={(e) => handleUpdateComponent(comp.id, 'uom', e.target.value)}
                                    className="w-full bg-white border border-[#cbd5e1] rounded px-1.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
                                  >
                                    {masterUoms.map((u) => (
                                      <option key={u.id} value={u.code}>
                                        {u.code}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-1.5 px-2.5">
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={comp.scrapAllowancePercent}
                                    onChange={(e) => handleUpdateComponent(comp.id, 'scrapAllowancePercent', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-white border border-[#cbd5e1] rounded px-1.5 py-1 text-xs font-mono focus:outline-none focus:border-emerald-500"
                                  />
                                </td>
                                <td className="py-1.5 px-2.5">
                                  <input
                                    type="text"
                                    value={comp.stagingLocation}
                                    onChange={(e) => handleUpdateComponent(comp.id, 'stagingLocation', e.target.value)}
                                    placeholder="LOC-STG-..."
                                    className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-emerald-500"
                                  />
                                </td>
                                <td className="py-1.5 px-2.5 text-right font-mono text-neutral-600">
                                  Rp {comp.unitCost.toLocaleString('id-ID')}
                                </td>
                                <td className="py-1.5 px-2.5 text-right font-mono font-bold text-neutral-800">
                                  Rp {subtotal.toLocaleString('id-ID')}
                                </td>
                                <td className="py-1.5 px-2 text-center">
                                  <button
                                    onClick={() => handleRemoveComponentRow(comp.id)}
                                    className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                                    title="Hapus komponen"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      {bomForm.components.length > 0 && (
                        <tfoot className="bg-[#f8fafc] font-bold text-xs border-t-2 border-neutral-300">
                          <tr>
                            <td colSpan={7} className="py-2 px-2.5 text-right text-neutral-700">
                              Total Estimasi Biaya Bahan Baku per Unit:
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono text-emerald-700 text-sm">
                              Rp {totalBomMaterialCost.toLocaleString('id-ID')}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>

                {/* Sub-Table 2: Routing Steps (Alur Operasi Work Center MES) */}
                <div className="bg-white p-4 rounded-sm border border-[#e2e8f0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        Alur Routing & Work Center MES
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Urutan tahapan operasi mesin di lantai produksi dari pemotongan hingga perakitan akhir.
                      </p>
                    </div>

                    <button
                      onClick={handleAddRoutingRow}
                      className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 px-2.5 py-1 rounded-sm text-xs font-bold cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Operasi Routing</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-neutral-200 divide-y divide-neutral-200">
                      <thead className="bg-[#f8fafc] text-neutral-600 font-semibold">
                        <tr>
                          <th className="py-2 px-2.5 w-16">No Urut</th>
                          <th className="py-2 px-2.5">Nama Operasi Manufaktur *</th>
                          <th className="py-2 px-2.5 w-64">Work Center Ditugaskan *</th>
                          <th className="py-2 px-2.5 w-36 text-right">Standar Waktu (Menit)</th>
                          <th className="py-2 px-2 w-10 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 bg-white">
                        {bomForm.routings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-neutral-400 italic">
                              Belum ada alur routing terdaftar. Klik "+ Tambah Operasi Routing" di atas.
                            </td>
                          </tr>
                        ) : (
                          bomForm.routings.map((route, idx) => (
                            <tr key={route.stepNo} className="hover:bg-neutral-50">
                              <td className="py-1.5 px-2.5 font-mono font-bold text-neutral-700">
                                Op {route.stepNo}
                              </td>
                              <td className="py-1.5 px-2.5">
                                <input
                                  type="text"
                                  value={route.operationName}
                                  onChange={(e) => handleUpdateRouting(idx, 'operationName', e.target.value)}
                                  placeholder="Contoh: Pemotongan Laser CNC..."
                                  className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-blue-500"
                                />
                              </td>
                              <td className="py-1.5 px-2.5">
                                <select
                                  value={route.workCenterCode}
                                  onChange={(e) => handleUpdateRouting(idx, 'workCenterCode', e.target.value)}
                                  className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500"
                                >
                                  {masterWorkCenters.map((wc) => (
                                    <option key={wc.id} value={wc.code}>
                                      {wc.code} - {wc.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-1.5 px-2.5 text-right">
                                <input
                                  type="number"
                                  min="1"
                                  value={route.standardMinutes}
                                  onChange={(e) => handleUpdateRouting(idx, 'standardMinutes', parseInt(e.target.value) || 0)}
                                  className="w-24 text-right bg-white border border-[#cbd5e1] rounded px-2 py-1 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 inline-block"
                                />
                              </td>
                              <td className="py-1.5 px-2 text-center">
                                <button
                                  onClick={() => handleRemoveRoutingRow(route.stepNo)}
                                  className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Hapus step routing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      {bomForm.routings.length > 0 && (
                        <tfoot className="bg-[#f8fafc] font-bold text-xs border-t-2 border-neutral-300">
                          <tr>
                            <td colSpan={3} className="py-2 px-2.5 text-right text-neutral-700">
                              Total Estimasi Waktu Siklus Produksi (Lead Routing):
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono text-blue-700 text-sm">
                              {totalRoutingMinutes} Menit ({Math.round(totalRoutingMinutes / 60 * 10) / 10} Jam)
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* B. FORM: JOB ORDERS / SURAT PERINTAH KERJA (SPK)              */}
            {/* ------------------------------------------------------------- */}
            {productionSubTab === 'jobs' && jobForm && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-sm border border-[#e2e8f0] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      Detail Surat Perintah Kerja (SPK)
                    </span>
                    <span className="text-xs font-mono text-neutral-400">ID: {jobForm.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">No. SPK (Job Order Number) *</label>
                      <input
                        type="text"
                        value={jobForm.orderNumber}
                        onChange={(e) => setJobForm({ ...jobForm, orderNumber: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Referensi Struktur BOM *</label>
                      <select
                        value={jobForm.bomCode}
                        onChange={(e) => {
                          const targetBom = bomList.find((b) => b.bomCode === e.target.value);
                          setJobForm({
                            ...jobForm,
                            bomCode: e.target.value,
                            productCode: targetBom ? targetBom.productCode : jobForm.productCode,
                            productName: targetBom ? targetBom.productName : jobForm.productName,
                          });
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-semibold focus:outline-none focus:border-blue-500"
                      >
                        {bomList.map((b) => (
                          <option key={b.id} value={b.bomCode}>
                            {b.bomCode} ({b.productName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Pelanggan / Customer *</label>
                      <select
                        value={jobForm.customerName}
                        onChange={(e) => setJobForm({ ...jobForm, customerName: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-medium focus:outline-none focus:border-blue-500"
                      >
                        {masterCustomers.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Kode Produk (SKU)</label>
                      <input
                        type="text"
                        readOnly
                        value={jobForm.productCode}
                        className="w-full bg-neutral-100 border border-neutral-300 rounded-sm px-2.5 py-1.5 text-neutral-600 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-neutral-600 font-semibold mb-1">Nama Produk yang Diproduksi</label>
                      <input
                        type="text"
                        value={jobForm.productName}
                        onChange={(e) => setJobForm({ ...jobForm, productName: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Target Qty (Unit) *</label>
                      <input
                        type="number"
                        min="1"
                        value={jobForm.targetQty}
                        onChange={(e) => setJobForm({ ...jobForm, targetQty: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Completed Qty (Unit)</label>
                      <input
                        type="number"
                        min="0"
                        value={jobForm.completedQty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const percent = Math.min(100, Math.round((val / (jobForm.targetQty || 1)) * 100));
                          setJobForm({ ...jobForm, completedQty: val, progressPercent: percent });
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Scrap / Reject Qty (Unit)</label>
                      <input
                        type="number"
                        min="0"
                        value={jobForm.scrapQty}
                        onChange={(e) => setJobForm({ ...jobForm, scrapQty: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono text-rose-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Prioritas SPK *</label>
                      <select
                        value={jobForm.priority}
                        onChange={(e) => setJobForm({ ...jobForm, priority: e.target.value as JobPriority })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-bold focus:outline-none focus:border-blue-500"
                      >
                        <option value="LOW">LOW</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Status Progres SPK *</label>
                      <select
                        value={jobForm.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as JobStatus;
                          let progress = jobForm.progressPercent;
                          if (newStatus === 'MATERIAL_PREP') progress = Math.max(progress, 20);
                          if (newStatus === 'IN_PRODUCTION') progress = Math.max(progress, 50);
                          if (newStatus === 'QC_CHECK') progress = Math.max(progress, 85);
                          if (newStatus === 'COMPLETED' || newStatus === 'DISPATCHED') progress = 100;
                          setJobForm({ ...jobForm, status: newStatus, progressPercent: progress });
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-bold focus:outline-none focus:border-blue-500"
                      >
                        <option value="QUEUE">QUEUE (Antrean)</option>
                        <option value="MATERIAL_PREP">MATERIAL PREP (Persiapan Bahan)</option>
                        <option value="IN_PRODUCTION">IN PRODUCTION (Sedang Dikerjakan)</option>
                        <option value="QC_CHECK">QC CHECK (Pemeriksaan Kualitas)</option>
                        <option value="COMPLETED">COMPLETED (Selesai)</option>
                        <option value="DISPATCHED">DISPATCHED (Terkirim)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Progress Produksi: {jobForm.progressPercent}%</label>
                      <div className="flex items-center gap-2 pt-1.5">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={jobForm.progressPercent}
                          onChange={(e) => setJobForm({ ...jobForm, progressPercent: parseInt(e.target.value) || 0 })}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-neutral-700 w-10 text-right">{jobForm.progressPercent}%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Tim Produksi Ditugaskan</label>
                      <input
                        type="text"
                        value={jobForm.assignedTeam}
                        onChange={(e) => setJobForm({ ...jobForm, assignedTeam: e.target.value })}
                        placeholder="Contoh: Tim Fabrikasi Alpha"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Lead Teknisi / Supervisor</label>
                      <input
                        type="text"
                        value={jobForm.leadTechnician}
                        onChange={(e) => setJobForm({ ...jobForm, leadTechnician: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={jobForm.materialsDeducted}
                          onChange={(e) => setJobForm({ ...jobForm, materialsDeducted: e.target.checked })}
                          className="w-4 h-4 accent-emerald-600 rounded"
                        />
                        <span className="text-neutral-700 font-semibold">Bahan Baku Sudah Dipotong Dari Stok</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Tanggal Mulai SPK</label>
                      <input
                        type="date"
                        value={jobForm.startDate}
                        onChange={(e) => setJobForm({ ...jobForm, startDate: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Tanggal Tenggat (Due Date)</label>
                      <input
                        type="date"
                        value={jobForm.dueDate}
                        onChange={(e) => setJobForm({ ...jobForm, dueDate: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Tanggal Selesai Aktual</label>
                      <input
                        type="date"
                        value={jobForm.completedDate || ''}
                        onChange={(e) => setJobForm({ ...jobForm, completedDate: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-neutral-600 font-semibold mb-1">Catatan Khusus Instruksi Manufaktur</label>
                      <textarea
                        rows={2}
                        value={jobForm.notes}
                        onChange={(e) => setJobForm({ ...jobForm, notes: e.target.value })}
                        placeholder="Contoh: Perhatikan toleransi pengelasan dan lakukan pengujian tegangan isolasi..."
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Operations Linked to this SPK Card */}
                <div className="bg-white p-4 rounded-sm border border-[#e2e8f0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                        Operasi MES Terkait SPK ({jobOperations.filter((o) => o.jobOrderNumber === jobForm.orderNumber).length})
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        setProductionSubTab('operations');
                        setSearchTerm(jobForm.orderNumber);
                      }}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      <span>Buka & Kelola di Modul Job Operations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {jobOperations
                      .filter((o) => o.jobOrderNumber === jobForm.orderNumber)
                      .map((op) => (
                        <div key={op.id} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                              Op {op.sequenceNo}
                            </span>
                            <span className="font-semibold text-neutral-800">{op.operationName}</span>
                            <span className="text-neutral-500">({op.workCenterCode})</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-neutral-600 text-[11px]">
                              Good: {op.goodQty}/{op.targetQty}
                            </span>
                            {getOpStatusBadge(op.status)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* C. FORM: JOB OPERATIONS (MES EXECUTION)                       */}
            {/* ------------------------------------------------------------- */}
            {productionSubTab === 'operations' && opForm && (
              <div className="space-y-6">
                
                {/* Real-time MES Control Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-sm shadow-xs border border-slate-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {opForm.mesTerminalId}
                      </span>
                      <span className="text-neutral-400">•</span>
                      <span className="text-xs text-neutral-300">Workstation: {opForm.workCenterName}</span>
                    </div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <span>{opForm.operationCode}</span>: {opForm.operationName}
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Operator: <strong className="text-white">{opForm.assignedOperator}</strong> | SPK: <strong className="text-blue-300">{opForm.jobOrderNumber}</strong>
                    </p>
                  </div>

                  {/* MES Live Execution Buttons */}
                  <div className="flex items-center gap-2">
                    {opForm.status === 'IN_PROGRESS' ? (
                      <>
                        <button
                          onClick={() => {
                            const good = prompt('Masukkan Qty Lulus QC / Good Qty:', String(opForm.targetQty));
                            if (good !== null) {
                              const scrap = prompt('Masukkan Qty Reject / Scrap:', '0');
                              finishJobOperation(opForm.id, parseInt(good) || opForm.targetQty, parseInt(scrap || '0') || 0);
                              setOpForm({ ...opForm, status: 'COMPLETED', goodQty: parseInt(good) || opForm.targetQty, scrapQty: parseInt(scrap || '0') || 0 });
                            }
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-sm text-xs shadow-md cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selesaikan Operasi (Finish)</span>
                        </button>

                        <button
                          onClick={() => setOpForm({ ...opForm, status: 'PAUSED' })}
                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-sm text-xs cursor-pointer transition-colors"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Jeda (Pause)</span>
                        </button>
                      </>
                    ) : opForm.status === 'COMPLETED' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-sm text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Operasi Tuntas di Mesin</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          startJobOperation(opForm.id);
                          setOpForm({ ...opForm, status: 'IN_PROGRESS' });
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-sm text-xs shadow-md cursor-pointer transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Mulai Eksekusi MES (Start)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="bg-white p-4 rounded-sm border border-[#e2e8f0] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      Parameter Konfigurasi Operasi Lantai Pabrik
                    </span>
                    <span className="text-xs font-mono text-neutral-400">ID: {opForm.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Kode Operasi MES *</label>
                      <input
                        type="text"
                        value={opForm.operationCode}
                        onChange={(e) => setOpForm({ ...opForm, operationCode: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Referensi Nomor SPK *</label>
                      <select
                        value={opForm.jobOrderNumber}
                        onChange={(e) => setOpForm({ ...opForm, jobOrderNumber: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        {productionJobs.map((j) => (
                          <option key={j.id} value={j.orderNumber}>
                            {j.orderNumber} - {j.productName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Urutan Langkah (Sequence No) *</label>
                      <input
                        type="number"
                        step="10"
                        min="10"
                        value={opForm.sequenceNo}
                        onChange={(e) => setOpForm({ ...opForm, sequenceNo: parseInt(e.target.value) || 10 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-neutral-600 font-semibold mb-1">Nama Operasi Manufaktur *</label>
                      <input
                        type="text"
                        value={opForm.operationName}
                        onChange={(e) => setOpForm({ ...opForm, operationName: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Status Operasi *</label>
                      <select
                        value={opForm.status}
                        onChange={(e) => setOpForm({ ...opForm, status: e.target.value as OperationStatus })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-bold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="PENDING">PENDING (Menunggu Giliran)</option>
                        <option value="READY">READY (Material Staging Siap)</option>
                        <option value="IN_PROGRESS">IN_PROGRESS (Mesin Berjalan)</option>
                        <option value="PAUSED">PAUSED (Dijeda Tooling)</option>
                        <option value="COMPLETED">COMPLETED (Selesai & Lulus QC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Work Center Ditugaskan *</label>
                      <select
                        value={opForm.workCenterCode}
                        onChange={(e) => {
                          const wc = masterWorkCenters.find((w) => w.code === e.target.value);
                          setOpForm({
                            ...opForm,
                            workCenterCode: e.target.value,
                            workCenterName: wc ? wc.name : opForm.workCenterName,
                          });
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-indigo-500"
                      >
                        {masterWorkCenters.map((wc) => (
                          <option key={wc.id} value={wc.code}>
                            {wc.code} - {wc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Mesin / Resource Manufaktur *</label>
                      <select
                        value={opForm.resourceCode}
                        onChange={(e) => {
                          const res = masterResources.find((r) => r.code === e.target.value);
                          setOpForm({
                            ...opForm,
                            resourceCode: e.target.value,
                            resourceName: res ? res.name : opForm.resourceName,
                          });
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-indigo-500"
                      >
                        {masterResources.map((res) => (
                          <option key={res.id} value={res.code}>
                            {res.code} - {res.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">ID Touchscreen MES Terminal</label>
                      <input
                        type="text"
                        value={opForm.mesTerminalId}
                        onChange={(e) => setOpForm({ ...opForm, mesTerminalId: e.target.value })}
                        placeholder="Contoh: MES-TERM-01"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Operator Bertugas</label>
                      <input
                        type="text"
                        value={opForm.assignedOperator}
                        onChange={(e) => setOpForm({ ...opForm, assignedOperator: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Target Qty Batch (Unit)</label>
                      <input
                        type="number"
                        min="1"
                        value={opForm.targetQty}
                        onChange={(e) => setOpForm({ ...opForm, targetQty: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Good Qty (Lulus QC)</label>
                      <input
                        type="number"
                        min="0"
                        value={opForm.goodQty}
                        onChange={(e) => setOpForm({ ...opForm, goodQty: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-emerald-700 font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Scrap / Reject Qty (Unit)</label>
                      <input
                        type="number"
                        min="0"
                        value={opForm.scrapQty}
                        onChange={(e) => setOpForm({ ...opForm, scrapQty: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-rose-600 font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Standar Waktu Siklus (Menit/Unit)</label>
                      <input
                        type="number"
                        min="1"
                        value={opForm.standardCycleMinutes}
                        onChange={(e) => setOpForm({ ...opForm, standardCycleMinutes: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Durasi Aktual Akumulasi (Menit)</label>
                      <input
                        type="number"
                        min="0"
                        value={opForm.actualDurationMinutes}
                        onChange={(e) => setOpForm({ ...opForm, actualDurationMinutes: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Waktu Mulai Aktual</label>
                      <input
                        type="text"
                        value={opForm.startedAt || '-'}
                        readOnly
                        className="w-full bg-neutral-100 border border-neutral-300 rounded-sm px-2.5 py-1.5 text-neutral-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">Waktu Selesai Aktual</label>
                      <input
                        type="text"
                        value={opForm.finishedAt || '-'}
                        readOnly
                        className="w-full bg-neutral-100 border border-neutral-300 rounded-sm px-2.5 py-1.5 text-neutral-600 font-mono"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-neutral-600 font-semibold mb-1">Instruksi Tooling & Parameter CNC / Catatan MES</label>
                      <textarea
                        rows={2}
                        value={opForm.notes}
                        onChange={(e) => setOpForm({ ...opForm, notes: e.target.value })}
                        placeholder="Contoh: Nozzle laser 2.0mm, gas O2 tekanan 0.8 bar, program CAM file #42B..."
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-sm px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
