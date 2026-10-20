import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import { 
  LayoutGrid, 
  Folder, 
  FolderOpen, 
  ClipboardList, 
  Boxes, 
  Warehouse, 
  Users, 
  FileSpreadsheet, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Settings2,
  CheckCircle2,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  Database,
  Cpu,
  Building2,
  Users2,
  Package,
  Scale,
  MapPin,
  Factory,
  HardHat,
  Truck,
  GitMerge,
  Link2,
  Boxes as BoxesIcon
} from 'lucide-react';

interface SidebarProps {
  onOpenNewJob: () => void;
  onOpenRestock: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewJob, onOpenRestock }) => {
  const { 
    activeTab, 
    setActiveTab, 
    productionSubTab,
    setProductionSubTab,
    bomList,
    productionJobs,
    jobOperations,
    masterSubTab, 
    setMasterSubTab, 
    jobOrders, 
    inventory, 
    masterItems,
    masterUoms,
    masterWarehouses,
    masterLocations, 
    masterWorkCenters, 
    masterResources,
    masterCustomers,
    masterVendors,
    relItemWarehouses,
    relItemUoms,
    relWcResources,
    relItemVendors
  } = useErp();
  
  const [isProdOpen, setIsProdOpen] = useState(true);
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const [isRelationsOpen, setIsRelationsOpen] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeJobsCount = jobOrders.filter(
    (j) => j.status === 'MATERIAL_PREP' || j.status === 'IN_PRODUCTION' || j.status === 'QC_CHECK'
  ).length;

  const lowStockCount = inventory.filter((i) => i.stock <= i.safetyMin).length;

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-[#161e2a] text-[#94a3b8] flex flex-col h-full border-r border-[#263143] select-none transition-all duration-200 shrink-0 no-print z-10`}
    >
      {/* Brand Header: Logo matching screenshot (e-gecko evo style -> MetroERP evo) */}
      <div className="h-12 border-b border-[#263143] flex items-center justify-between px-3.5 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('hub')}>
            <div className="w-6 h-6 rounded-sm bg-[#10b981] text-white flex items-center justify-center font-black text-xs">
              M
            </div>
            <div className="leading-none">
              <span className="text-sm font-black tracking-tight text-white font-sans">
                MetroERP
              </span>
              <span className="text-[10px] text-emerald-400 font-medium ml-1">evo</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-6 h-6 rounded-sm bg-[#10b981] text-white flex items-center justify-center font-black text-xs">
            M
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-neutral-400 hover:text-white p-1 rounded-sm hover:bg-[#253247] transition-colors cursor-pointer"
          title={isCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Search Bar (matching screenshot 'Suche' with ⌘K badge) */}
      {!isCollapsed && (
        <div className="p-3 border-b border-[#263143]/60 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full bg-[#1e293b] text-neutral-200 placeholder-neutral-500 text-xs pl-8 pr-8 py-1.5 rounded-sm border border-[#334155] focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500 bg-[#0f172a] px-1 py-0.2 rounded-xs border border-neutral-700">
              ⌘K
            </span>
          </div>
        </div>
      )}

      {/* Navigation Tree (Hierarchical folder-based layout matching screenshot) */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-none text-xs">
        {/* Item: Dashboard Utama */}
        <button
          onClick={() => setActiveTab('hub')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm transition-colors cursor-pointer text-left ${
            activeTab === 'hub'
              ? 'bg-[#233527] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
              : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
          }`}
          title="Dashboard Utama"
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Dashboard Utama</span>}
        </button>

        {/* Section: Engineering & Production (Expandable Folder with 3 Submenus) */}
        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                setActiveTab('production');
              } else {
                setIsProdOpen(!isProdOpen);
              }
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]/50 rounded-sm cursor-pointer transition-colors ${
              activeTab === 'production' && isCollapsed
                ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                : ''
            }`}
            title="Engineering & Production"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isProdOpen ? <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" /> : <Folder className="w-4 h-4 text-emerald-400 shrink-0" />}
              {!isCollapsed && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-neutral-200 truncate">Engineering & Production</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-neutral-500">
                {isProdOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </button>

          {isProdOpen && (
            <div className={`mt-0.5 space-y-0.5 ${!isCollapsed ? 'pl-4' : ''}`}>
              {/* 1. Engineering Board & BOM */}
              <button
                onClick={() => { setActiveTab('production'); setProductionSubTab('bom'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'production' && productionSubTab === 'bom'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Engineering Board & BOM"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Cpu className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'production' && productionSubTab === 'bom' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Engineering Board & BOM</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {bomList.length}
                  </span>
                )}
              </button>

              {/* 2. Job Orders / SPK */}
              <button
                onClick={() => { setActiveTab('production'); setProductionSubTab('jobs'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'production' && productionSubTab === 'jobs'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Job Orders / SPK"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ClipboardList className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'production' && productionSubTab === 'jobs' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Job Orders / SPK</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {productionJobs.length}
                  </span>
                )}
              </button>

              {/* 3. Job Operations */}
              <button
                onClick={() => { setActiveTab('production'); setProductionSubTab('operations'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'production' && productionSubTab === 'operations'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Job Operations"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Sliders className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'production' && productionSubTab === 'operations' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Job Operations</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {jobOperations.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section: Master Data (8 Modules) */}
        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                setActiveTab('master-data');
              } else {
                setIsMasterOpen(!isMasterOpen);
              }
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]/50 rounded-sm cursor-pointer transition-colors ${
              activeTab === 'master-data' && isCollapsed
                ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                : ''
            }`}
            title="Master Data"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isMasterOpen ? <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" /> : <Folder className="w-4 h-4 text-emerald-400 shrink-0" />}
              {!isCollapsed && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-neutral-200 truncate">Master Data</span>
                  <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono px-1 rounded-xs border border-emerald-800">8 Modul</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-neutral-500">
                {isMasterOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </button>

          {isMasterOpen && (
            <div className={`mt-0.5 space-y-0.5 ${!isCollapsed ? 'pl-4' : ''}`}>
              {/* 1. Items */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('items'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'items'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Items"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Package className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'items' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Items</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterItems.length}
                  </span>
                )}
              </button>

              {/* 2. UOM */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('uom'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'uom'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="UOM"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Scale className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'uom' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">UOM</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterUoms.length}
                  </span>
                )}
              </button>

              {/* 3. Warehouse */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('warehouse'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'warehouse'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Warehouse"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Warehouse className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'warehouse' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Warehouse</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterWarehouses.length}
                  </span>
                )}
              </button>

              {/* 4. Location */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('location'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'location'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Location"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'location' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Location</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterLocations.length}
                  </span>
                )}
              </button>

              {/* 5. Work Center */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('workcenter'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'workcenter'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Work Center"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Factory className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'workcenter' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Work Center</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-emerald-400 text-[10px] font-mono px-1 py-0.2 rounded-xs border border-emerald-800/80">
                    MES
                  </span>
                )}
              </button>

              {/* 6. Resources */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('resources'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'resources'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Resources"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <HardHat className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'resources' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Resources</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterResources.length}
                  </span>
                )}
              </button>

              {/* 7. Customer */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('customer'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'customer'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Customer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'customer' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Customer</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterCustomers.length}
                  </span>
                )}
              </button>

              {/* 8. Vendors */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('vendors'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'vendors'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Vendors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Truck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'vendors' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Vendors</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {masterVendors.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section: Master Relations / Mapping */}
        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                setActiveTab('master-data');
                setMasterSubTab('rel_item_warehouse');
              } else {
                setIsRelationsOpen(!isRelationsOpen);
              }
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]/50 rounded-sm cursor-pointer transition-colors`}
            title="Master Relations (Mapping)"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isRelationsOpen ? <FolderOpen className="w-4 h-4 text-purple-400 shrink-0" /> : <Folder className="w-4 h-4 text-purple-400 shrink-0" />}
              {!isCollapsed && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-neutral-200 truncate">Relations</span>
                  <span className="bg-purple-950 text-purple-400 text-[9px] font-mono px-1 rounded-xs border border-purple-800">Mapping</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-neutral-500">
                {isRelationsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </button>

          {isRelationsOpen && (
            <div className={`mt-0.5 space-y-0.5 ${!isCollapsed ? 'pl-4' : ''}`}>
              {/* Rel 1: ItemsWarehouse */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('rel_item_warehouse'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'rel_item_warehouse'
                    ? 'bg-[#2b1f3d] text-purple-300 font-semibold border-l-2 border-purple-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="ItemsWarehouse: Memasukkan Items ke Warehouse"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GitMerge className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'rel_item_warehouse' ? 'text-purple-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">ItemsWarehouse</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {relItemWarehouses.length}
                  </span>
                )}
              </button>

              {/* Rel 2: ItemUOM */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('rel_item_uom'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'rel_item_uom'
                    ? 'bg-[#2b1f3d] text-purple-300 font-semibold border-l-2 border-purple-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="ItemUOM: Memasukkan List UOM pada Item"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Link2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'rel_item_uom' ? 'text-purple-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">ItemUOM</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {relItemUoms.length}
                  </span>
                )}
              </button>

              {/* Rel 3: WorkCenterResource */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('rel_wc_resource'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'rel_wc_resource'
                    ? 'bg-[#2b1f3d] text-purple-300 font-semibold border-l-2 border-purple-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="WorkCenterResource: Alokasi Mesin & Operator ke Work Center"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Factory className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'rel_wc_resource' ? 'text-purple-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">WC - Resource</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-purple-400 text-[10px] font-mono px-1 py-0.2 rounded-xs border border-purple-800/80">
                    MES
                  </span>
                )}
              </button>

              {/* Rel 4: ItemVendor */}
              <button
                onClick={() => { setActiveTab('master-data'); setMasterSubTab('rel_item_vendor'); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'master-data' && masterSubTab === 'rel_item_vendor'
                    ? 'bg-[#2b1f3d] text-purple-300 font-semibold border-l-2 border-purple-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="ItemVendor: Pemasok Supplier untuk Tiap Item"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Truck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'master-data' && masterSubTab === 'rel_item_vendor' ? 'text-purple-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">ItemVendor</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-[#141d2b] text-neutral-400 text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-neutral-700">
                    {relItemVendors.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section: Manajemen Inventaris (Expandable Folder) */}
        <div>
          <button
            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]/50 rounded-sm cursor-pointer transition-colors"
            title="Manajemen Inventaris"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isInventoryOpen ? <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" /> : <Folder className="w-4 h-4 text-emerald-400 shrink-0" />}
              {!isCollapsed && <span className="font-semibold text-neutral-200 truncate">Gudang & Inventaris</span>}
            </div>
            {!isCollapsed && (
              <span className="text-neutral-500">
                {isInventoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </button>

          {isInventoryOpen && (
            <div className={`mt-0.5 space-y-0.5 ${!isCollapsed ? 'pl-4' : ''}`}>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'inventory'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Katalog Stok & Mutasi"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Warehouse className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'inventory' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Katalog Stok SKU</span>}
                </div>
                {!isCollapsed && lowStockCount > 0 && (
                  <span className="bg-red-950 text-red-300 text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-red-800/80 flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5 inline" />
                    {lowStockCount}
                  </span>
                )}
              </button>

              {!isCollapsed && (
                <button
                  onClick={() => { setActiveTab('inventory'); onOpenRestock(); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-neutral-400 hover:text-white hover:bg-[#1e293b] rounded-sm transition-colors cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 ml-1" />
                  <span className="truncate">+ Penerimaan Stok (PO)</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Item: Workstation & Tim */}
        <button
          onClick={() => setActiveTab('team')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm transition-colors cursor-pointer text-left ${
            activeTab === 'team'
              ? 'bg-[#233527] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
              : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
          }`}
          title="Workstation & Performa Tim"
        >
          <Users className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Lini & Operator Tim</span>}
        </button>

        {/* Item: Laporan Tutup Harian */}
        <button
          onClick={() => setActiveTab('report')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm transition-colors cursor-pointer text-left ${
            activeTab === 'report'
              ? 'bg-[#233527] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
              : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
          }`}
          title="Laporan Tutup Harian"
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Laporan Harian PM</span>}
        </button>
      </div>

      {/* Sidebar Footer (matching screenshot bottom info: '41.3.3' and layout icon) */}
      <div className="h-10 border-t border-[#263143] px-3 flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
        {!isCollapsed ? (
          <>
            <span className="font-mono">v4.1.3 · Plant 2</span>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </>
        ) : (
          <span className="mx-auto font-mono text-[10px]">v4.1</span>
        )}
      </div>
    </aside>
  );
};
