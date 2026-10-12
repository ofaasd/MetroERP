import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  JobOrder, 
  InventoryItem, 
  StockMovement, 
  Workstation, 
  JobStatus, 
  DailyKPISummary,
  BOMItem
} from '../types/erp';
import { 
  INITIAL_INVENTORY, 
  INITIAL_JOB_ORDERS, 
  INITIAL_MOVEMENTS, 
  INITIAL_WORKSTATIONS,
  PROJECT_MANAGER_PROFILE
} from '../data/mockData';

interface ToastState {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface ErpContextType {
  jobOrders: JobOrder[];
  inventory: InventoryItem[];
  movements: StockMovement[];
  workstations: Workstation[];
  activeTab: 'hub' | 'jobs' | 'inventory' | 'team' | 'report';
  setActiveTab: (tab: 'hub' | 'jobs' | 'inventory' | 'team' | 'report') => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  selectedSkuId: string | null;
  setSelectedSkuId: (sku: string | null) => void;
  toast: ToastState | null;
  showToast: (type: ToastState['type'], title: string, message: string) => void;
  closeToast: () => void;
  currentTime: Date;
  isSimulating: boolean;
  toggleSimulation: () => void;
  
  // Job Order Actions
  advanceJobStage: (jobId: string) => { success: boolean; message: string };
  rollbackJobStage: (jobId: string) => void;
  createJobOrder: (newOrder: Omit<JobOrder, 'id' | 'orderNumber' | 'completedQty' | 'scrapQty' | 'progressPercent' | 'materialsDeducted' | 'finishedProductAdded'>) => void;
  updateJobOrderProgress: (jobId: string, progress: number, scrapIncrement?: number) => void;
  
  // Inventory Actions
  addStock: (sku: string, qty: number, reference: string, operator: string, notes?: string) => void;
  removeStock: (sku: string, qty: number, reference: string, operator: string, notes?: string) => { success: boolean; message: string };
  adjustStock: (sku: string, newTotalStock: number, operator: string, notes?: string) => void;
  createInventoryItem: (item: Omit<InventoryItem, 'lastUpdated'>) => void;
  
  // Workstation Actions
  updateWorkstationStatus: (wsId: string, status: 'RUNNING' | 'IDLE' | 'MAINTENANCE') => void;

  // Analytics & Summary
  getKpiSummary: () => DailyKPISummary;
  resetToSampleData: () => void;
  projectManager: typeof PROJECT_MANAGER_PROFILE;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: 'metroerp_jobs_v1',
  INVENTORY: 'metroerp_inventory_v1',
  MOVEMENTS: 'metroerp_movements_v1',
  WORKSTATIONS: 'metroerp_workstations_v1',
};

export const ErpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobOrders, setJobOrders] = useState<JobOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOB_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [workstations, setWorkstations] = useState<Workstation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKSTATIONS);
    return saved ? JSON.parse(saved) : INITIAL_WORKSTATIONS;
  });

  const [activeTab, setActiveTab] = useState<'hub' | 'jobs' | 'inventory' | 'team' | 'report'>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => INITIAL_JOB_ORDERS[1]?.id || INITIAL_JOB_ORDERS[0]?.id || null);
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(() => INITIAL_INVENTORY[0]?.sku || null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobOrders));
  }, [jobOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKSTATIONS, JSON.stringify(workstations));
  }, [workstations]);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (type: ToastState['type'], title: string, message: string) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 4500);
  };

  const closeToast = () => setToast(null);

  const toggleSimulation = () => {
    setIsSimulating((prev) => {
      const next = !prev;
      showToast(
        next ? 'info' : 'warning',
        next ? 'Simulasi Real-Time Aktif' : 'Simulasi Dijeda',
        next 
          ? 'Perkembangan mesin dan waktu siklus produksi akan diperbarui secara periodik.'
          : 'Perubahan status hanya akan terjadi melalui interaksi manual operator.'
      );
      return next;
    });
  };

  // Real-time Simulation Engine (updates progress of 'IN_PRODUCTION' job orders periodically)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setJobOrders((prevOrders) => {
        let hasChanges = false;
        const updated = prevOrders.map((job) => {
          if (job.status === 'IN_PRODUCTION' && job.progressPercent < 90) {
            hasChanges = true;
            const newProgress = Math.min(90, job.progressPercent + 2);
            return {
              ...job,
              progressPercent: newProgress,
            };
          }
          return job;
        });
        return hasChanges ? updated : prevOrders;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Advance Job Stage with real-time inventory logic
  const advanceJobStage = (jobId: string): { success: boolean; message: string } => {
    const job = jobOrders.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'SPK tidak ditemukan.' };

    const stages: JobStatus[] = ['QUEUE', 'MATERIAL_PREP', 'IN_PRODUCTION', 'QC_CHECK', 'COMPLETED', 'DISPATCHED'];
    const currentIndex = stages.indexOf(job.status);
    if (currentIndex >= stages.length - 1) {
      return { success: false, message: 'SPK sudah dalam status final (Terkirim).' };
    }

    const nextStatus = stages[currentIndex + 1];

    // Logic: moving into IN_PRODUCTION requires deducting materials if not yet deducted
    if (nextStatus === 'IN_PRODUCTION' && !job.materialsDeducted) {
      // Check stock sufficiency
      const missingMaterials: string[] = [];
      job.bom.forEach((bomItem) => {
        const invItem = inventory.find((i) => i.sku === bomItem.sku);
        if (!invItem || invItem.stock < bomItem.requiredQty) {
          missingMaterials.push(
            `${invItem ? invItem.name : bomItem.sku} (Butuh: ${bomItem.requiredQty}, Ada: ${invItem ? invItem.stock : 0})`
          );
        }
      });

      if (missingMaterials.length > 0) {
        showToast(
          'error',
          'Stok Bahan Baku Tidak Cukup!',
          `Tidak dapat memulai produksi. Kekurangan material: ${missingMaterials.slice(0, 2).join('; ')}`
        );
        return {
          success: false,
          message: `Stok material kurang: ${missingMaterials.join(', ')}`,
        };
      }

      // Deduct materials from inventory
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newMovements: StockMovement[] = [];

      setInventory((prevInv) =>
        prevInv.map((item) => {
          const bomMatch = job.bom.find((b) => b.sku === item.sku);
          if (bomMatch) {
            newMovements.push({
              id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: nowStr,
              sku: item.sku,
              itemName: item.name,
              type: 'OUT',
              qty: bomMatch.requiredQty,
              reference: job.orderNumber,
              operator: job.leadTechnician,
              notes: `Alokasi bahan otomatis untuk ${job.productName} (${job.targetQty} unit)`,
            });
            return {
              ...item,
              stock: item.stock - bomMatch.requiredQty,
              lastUpdated: nowStr,
            };
          }
          return item;
        })
      );

      setMovements((prev) => [...newMovements, ...prev]);

      // Update Job
      setJobOrders((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'IN_PRODUCTION',
                progressPercent: Math.max(j.progressPercent, 45),
                materialsDeducted: true,
              }
            : j
        )
      );

      showToast(
        'success',
        'Material Terpotong Otomatis',
        `Bahan baku untuk ${job.orderNumber} telah dipotong dari stok dan proses produksi resmi dimulai.`
      );
      return { success: true, message: 'Produksi dimulai dan bahan baku terpotong.' };
    }

    // Logic: moving to COMPLETED finishes the order and adds Finished Good to inventory
    if (nextStatus === 'COMPLETED') {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Add to inventory finished goods if matched
      if (job.productSku && !job.finishedProductAdded) {
        setInventory((prevInv) => {
          const exists = prevInv.some((item) => item.sku === job.productSku);
          if (exists) {
            return prevInv.map((item) =>
              item.sku === job.productSku
                ? {
                    ...item,
                    stock: item.stock + (job.targetQty - job.scrapQty),
                    lastUpdated: nowStr,
                  }
                : item
            );
          }
          return prevInv;
        });

        // Add stock IN movement
        const inMov: StockMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: nowStr,
          sku: job.productSku,
          itemName: job.productName,
          type: 'IN',
          qty: job.targetQty - job.scrapQty,
          reference: job.orderNumber,
          operator: job.leadTechnician,
          notes: `Hasil produksi selesai dari ${job.orderNumber}`,
        };
        setMovements((prev) => [inMov, ...prev]);
      }

      // Update Workstation output
      setWorkstations((prev) =>
        prev.map((ws) =>
          ws.lead.includes(job.leadTechnician) || ws.name.includes(job.assignedTeam)
            ? { ...ws, outputToday: ws.outputToday + 1 }
            : ws
        )
      );

      setJobOrders((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'COMPLETED',
                progressPercent: 100,
                completedQty: j.targetQty - j.scrapQty,
                completedDate: nowStr,
                finishedProductAdded: true,
              }
            : j
        )
      );

      showToast(
        'success',
        'SPK Selesai & Masuk Stok',
        `${job.orderNumber} telah tuntas. Produk jadi (${job.targetQty - job.scrapQty} unit) berhasil ditambahkan ke inventaris barang jadi!`
      );
      return { success: true, message: 'SPK Selesai dan stok barang jadi ditambahkan.' };
    }

    // Other transitions: QUEUE -> MATERIAL_PREP, IN_PRODUCTION -> QC_CHECK, COMPLETED -> DISPATCHED
    setJobOrders((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          let newProgress = j.progressPercent;
          if (nextStatus === 'MATERIAL_PREP') newProgress = 25;
          if (nextStatus === 'QC_CHECK') newProgress = 85;
          if (nextStatus === 'DISPATCHED') newProgress = 100;
          return {
            ...j,
            status: nextStatus,
            progressPercent: newProgress,
          };
        }
        return j;
      })
    );

    showToast(
      'info',
      'Status SPK Diperbarui',
      `${job.orderNumber} berpindah ke tahap: ${nextStatus.replace('_', ' ')}.`
    );
    return { success: true, message: `Status diperbarui ke ${nextStatus}` };
  };

  const rollbackJobStage = (jobId: string) => {
    const job = jobOrders.find((j) => j.id === jobId);
    if (!job) return;

    const stages: JobStatus[] = ['QUEUE', 'MATERIAL_PREP', 'IN_PRODUCTION', 'QC_CHECK', 'COMPLETED', 'DISPATCHED'];
    const currentIndex = stages.indexOf(job.status);
    if (currentIndex <= 0) return;

    const prevStatus = stages[currentIndex - 1];
    setJobOrders((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: prevStatus,
              progressPercent: Math.max(0, j.progressPercent - 25),
            }
          : j
      )
    );
    showToast('warning', 'Tahap Dikembalikan', `${job.orderNumber} dikembalikan ke ${prevStatus}.`);
  };

  const createJobOrder = (
    newOrderData: Omit<JobOrder, 'id' | 'orderNumber' | 'completedQty' | 'scrapQty' | 'progressPercent' | 'materialsDeducted' | 'finishedProductAdded'>
  ) => {
    const nextSeq = jobOrders.length + 42;
    const orderNumber = `SPK-2026-00${nextSeq}`;
    const newJob: JobOrder = {
      ...newOrderData,
      id: `job-${Date.now()}`,
      orderNumber,
      completedQty: 0,
      scrapQty: 0,
      progressPercent: 0,
      materialsDeducted: false,
      finishedProductAdded: false,
    };

    setJobOrders((prev) => [newJob, ...prev]);
    showToast('success', 'Job Order Baru Dibuat', `${orderNumber} untuk ${newJob.clientName} berhasil dijadwalkan.`);
  };

  const updateJobOrderProgress = (jobId: string, progress: number, scrapIncrement = 0) => {
    setJobOrders((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const newScrap = j.scrapQty + scrapIncrement;
          return {
            ...j,
            progressPercent: progress,
            scrapQty: newScrap,
          };
        }
        return j;
      })
    );
    showToast('info', 'Progress Diperbarui', `Kemajuan pengerjaan SPK disesuaikan.`);
  };

  // Inventory actions
  const addStock = (sku: string, qty: number, reference: string, operator: string, notes?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let itemTitle = sku;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          itemTitle = item.name;
          return {
            ...item,
            stock: item.stock + qty,
            lastUpdated: nowStr,
          };
        }
        return item;
      })
    );

    const newMov: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: nowStr,
      sku,
      itemName: itemTitle,
      type: 'IN',
      qty,
      reference,
      operator,
      notes,
    };
    setMovements((prev) => [newMov, ...prev]);

    showToast('success', 'Stok Masuk Berhasil', `+${qty} unit ditambahkan ke ${sku} (${itemTitle}).`);
  };

  const removeStock = (
    sku: string,
    qty: number,
    reference: string,
    operator: string,
    notes?: string
  ): { success: boolean; message: string } => {
    const item = inventory.find((i) => i.sku === sku);
    if (!item) return { success: false, message: 'Item inventaris tidak ditemukan.' };
    if (item.stock < qty) {
      showToast('error', 'Stok Tidak Cukup', `Stok ${item.name} hanya tersisa ${item.stock} ${item.unit}.`);
      return { success: false, message: 'Jumlah melebihi stok yang tersedia.' };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setInventory((prev) =>
      prev.map((i) =>
        i.sku === sku
          ? {
              ...i,
              stock: i.stock - qty,
              lastUpdated: nowStr,
            }
          : i
      )
    );

    const newMov: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: nowStr,
      sku,
      itemName: item.name,
      type: 'OUT',
      qty,
      reference,
      operator,
      notes,
    };
    setMovements((prev) => [newMov, ...prev]);

    showToast('warning', 'Pengeluaran Stok Dicatat', `-${qty} ${item.unit} dikeluarkan dari ${item.name}.`);
    return { success: true, message: 'Stok berhasil dikeluarkan.' };
  };

  const adjustStock = (sku: string, newTotalStock: number, operator: string, notes?: string) => {
    const item = inventory.find((i) => i.sku === sku);
    if (!item) return;

    const diff = newTotalStock - item.stock;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setInventory((prev) =>
      prev.map((i) =>
        i.sku === sku
          ? {
              ...i,
              stock: newTotalStock,
              lastUpdated: nowStr,
            }
          : i
      )
    );

    const newMov: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: nowStr,
      sku,
      itemName: item.name,
      type: 'ADJUST',
      qty: Math.abs(diff),
      reference: 'OPNAME-AUDIT',
      operator,
      notes: `${notes || 'Penyesuaian Fisik'} (Selisih: ${diff > 0 ? '+' : ''}${diff})`,
    };
    setMovements((prev) => [newMov, ...prev]);

    showToast('info', 'Stok Opname Tersimpan', `Stok ${item.name} diperbarui menjadi ${newTotalStock} ${item.unit}.`);
  };

  const createInventoryItem = (itemData: Omit<InventoryItem, 'lastUpdated'>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newItem: InventoryItem = {
      ...itemData,
      lastUpdated: nowStr,
    };

    setInventory((prev) => [newItem, ...prev]);
    showToast('success', 'Item Baru Terdaftar', `${newItem.sku} - ${newItem.name} ditambahkan ke master inventaris.`);
  };

  const updateWorkstationStatus = (wsId: string, status: 'RUNNING' | 'IDLE' | 'MAINTENANCE') => {
    setWorkstations((prev) =>
      prev.map((ws) => (ws.id === wsId ? { ...ws, status } : ws))
    );
    showToast('info', 'Status Workstation Diperbarui', `Workstation beralih status ke ${status}.`);
  };

  const getKpiSummary = (): DailyKPISummary => {
    const completedOrders = jobOrders.filter((j) => j.status === 'COMPLETED' || j.status === 'DISPATCHED');
    const totalOrdersCompleted = completedOrders.length;
    const activeOrdersInFlight = jobOrders.filter((j) => j.status === 'IN_PRODUCTION' || j.status === 'QC_CHECK').length;
    const totalUnitsProduced = completedOrders.reduce((acc, curr) => acc + (curr.completedQty || curr.targetQty), 0);
    const totalScrap = jobOrders.reduce((acc, curr) => acc + (curr.scrapQty || 0), 0);
    const totalTarget = jobOrders.reduce((acc, curr) => acc + curr.targetQty, 0);

    const scrapRate = totalTarget > 0 ? Math.round((totalScrap / totalTarget) * 100 * 10) / 10 : 0;
    
    // Average efficiency of workstations
    const avgEfficiency = workstations.length > 0 
      ? Math.round(workstations.reduce((acc, ws) => acc + ws.efficiencyRate, 0) / workstations.length * 10) / 10
      : 92.5;

    // Critical stock items
    const criticalStockItemsCount = inventory.filter((i) => i.stock <= i.safetyMin).length;
    
    // Total stock valuation
    const totalStockValue = inventory.reduce((acc, curr) => acc + (curr.stock * curr.unitPrice), 0);

    return {
      date: new Date().toISOString().split('T')[0],
      totalOrdersCompleted,
      targetOrders: 4, // target daily orders
      efficiencyRate: avgEfficiency,
      onTimeDeliveryRate: 97.4,
      scrapRate,
      totalUnitsProduced,
      totalStockValue,
      criticalStockItemsCount,
      activeOrdersInFlight,
    };
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.WORKSTATIONS);
    setJobOrders(INITIAL_JOB_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setMovements(INITIAL_MOVEMENTS);
    setWorkstations(INITIAL_WORKSTATIONS);
    showToast('info', 'Data Direset', 'Semua data dikembalikan ke konfigurasi awal bawaan.');
  };

  return (
    <ErpContext.Provider
      value={{
        jobOrders,
        inventory,
        movements,
        workstations,
        activeTab,
        setActiveTab,
        selectedJobId,
        setSelectedJobId,
        selectedSkuId,
        setSelectedSkuId,
        toast,
        showToast,
        closeToast,
        currentTime,
        isSimulating,
        toggleSimulation,
        advanceJobStage,
        rollbackJobStage,
        createJobOrder,
        updateJobOrderProgress,
        addStock,
        removeStock,
        adjustStock,
        createInventoryItem,
        updateWorkstationStatus,
        getKpiSummary,
        resetToSampleData,
        projectManager: PROJECT_MANAGER_PROFILE,
      }}
    >
      {children}
    </ErpContext.Provider>
  );
};

export const useErp = () => {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErp must be used within an ErpProvider');
  }
  return context;
};
