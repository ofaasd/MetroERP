import React from 'react';
import { useErp } from '../context/ErpContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Warehouse, 
  Users, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export const MetroNav: React.FC = () => {
  const { activeTab, setActiveTab, jobOrders, inventory } = useErp();

  // Calculate live badge counts
  const activeJobsCount = jobOrders.filter(
    (j) => j.status === 'MATERIAL_PREP' || j.status === 'IN_PRODUCTION' || j.status === 'QC_CHECK'
  ).length;

  const lowStockCount = inventory.filter((i) => i.stock <= i.safetyMin).length;

  const navItems = [
    {
      id: 'hub' as const,
      label: 'Ringkasan Utama',
      sublabel: 'Executive Live Hub',
      icon: LayoutDashboard,
      badge: null,
      activeColor: 'bg-[#0050ef]', // Metro Cobalt
    },
    {
      id: 'jobs' as const,
      label: 'Pelacakan Job Order',
      sublabel: 'SPK & Workflow',
      icon: ClipboardList,
      badge: activeJobsCount > 0 ? `${activeJobsCount} Aktif` : null,
      badgeType: 'blue',
      activeColor: 'bg-[#0050ef]',
    },
    {
      id: 'inventory' as const,
      label: 'Manajemen Inventaris',
      sublabel: 'Stok & Mutasi Real-Time',
      icon: Warehouse,
      badge: lowStockCount > 0 ? `${lowStockCount} Kritis` : null,
      badgeType: 'alert',
      activeColor: 'bg-[#107c41]', // Metro Emerald
    },
    {
      id: 'team' as const,
      label: 'Workstation & Tim',
      sublabel: 'Performa Lini Produksi',
      icon: Users,
      badge: null,
      activeColor: 'bg-[#fa6800]', // Metro Amber
    },
    {
      id: 'report' as const,
      label: 'Laporan Otomatis',
      sublabel: 'Tutup Harian PM',
      icon: FileSpreadsheet,
      badge: 'Auto KPI',
      badgeType: 'purple',
      activeColor: 'bg-[#7133c9]', // Metro Violet
    },
  ];

  return (
    <nav className="bg-[#1f1f1f] text-neutral-300 border-b border-neutral-700 select-none no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2.5 text-left transition-all shrink-0 cursor-pointer group flex items-center gap-2.5 ${
                  isActive 
                    ? 'text-white bg-[#2b2b2b]' 
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-[#282828]'
                }`}
              >
                {/* Metro accent bar on bottom */}
                {isActive && (
                  <span className={`absolute bottom-0 left-0 right-0 h-[3px] ${item.activeColor}`} />
                )}

                <Icon 
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`} 
                />

                <div className="leading-tight">
                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    {item.label}
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 font-mono font-bold uppercase tracking-tight ${
                          item.badgeType === 'alert'
                            ? 'bg-[#ce352c] text-white flex items-center gap-0.5'
                            : item.badgeType === 'purple'
                            ? 'bg-[#7133c9] text-white'
                            : 'bg-[#0050ef] text-white'
                        }`}
                      >
                        {item.badgeType === 'alert' && <AlertTriangle className="w-2.5 h-2.5 inline" />}
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 hidden md:block">
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
