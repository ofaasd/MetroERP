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
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  onOpenNewJob: () => void;
  onOpenRestock: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewJob, onOpenRestock }) => {
  const { activeTab, setActiveTab, jobOrders, inventory } = useErp();
  
  const [isJobsOpen, setIsJobsOpen] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
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

        {/* Section: Job Order & Produksi (Expandable Folder) */}
        <div>
          <button
            onClick={() => setIsJobsOpen(!isJobsOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-[#1e293b]/50 rounded-sm cursor-pointer transition-colors"
            title="Job Order & Produksi"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isJobsOpen ? <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" /> : <Folder className="w-4 h-4 text-amber-400 shrink-0" />}
              {!isCollapsed && <span className="font-semibold text-neutral-200 truncate">Job Order & SPK</span>}
            </div>
            {!isCollapsed && (
              <span className="text-neutral-500">
                {isJobsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </button>

          {isJobsOpen && (
            <div className={`mt-0.5 space-y-0.5 ${!isCollapsed ? 'pl-4' : ''}`}>
              {/* Active Leaf Item (with the signature green highlighted pill from screenshot!) */}
              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                  activeTab === 'jobs'
                    ? 'bg-[#243729] text-[#a7f3d0] font-semibold border-l-2 border-emerald-400'
                    : 'hover:bg-[#1e293b] text-neutral-300 hover:text-white'
                }`}
                title="Pelacakan SPK"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ClipboardList className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'jobs' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {!isCollapsed && <span className="truncate">Pelacakan SPK</span>}
                </div>
                {!isCollapsed && activeJobsCount > 0 && (
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-emerald-800/80">
                    {activeJobsCount}
                  </span>
                )}
              </button>

              {!isCollapsed && (
                <button
                  onClick={() => { setActiveTab('jobs'); onOpenNewJob(); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-neutral-400 hover:text-white hover:bg-[#1e293b] rounded-sm transition-colors cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 ml-1" />
                  <span className="truncate">+ Buat SPK Baru</span>
                </button>
              )}
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
