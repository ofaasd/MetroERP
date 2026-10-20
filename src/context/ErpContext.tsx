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
  MasterModuleTab
} from '../types/masterData';
import {
  INITIAL_MASTER_ITEMS,
  INITIAL_MASTER_UOMS,
  INITIAL_MASTER_WAREHOUSES,
  INITIAL_MASTER_LOCATIONS,
  INITIAL_MASTER_WORKCENTERS,
  INITIAL_MASTER_RESOURCES,
  INITIAL_MASTER_CUSTOMERS,
  INITIAL_MASTER_VENDORS,
  INITIAL_REL_ITEM_WAREHOUSES,
  INITIAL_REL_ITEM_UOMS,
  INITIAL_REL_WC_RESOURCES,
  INITIAL_REL_ITEM_VENDORS
} from '../data/mockMasterData';
import { 
  MasterBOM, 
  ProductionJobOrder, 
  JobOperation, 
  ProductionModuleTab 
} from '../types/production';
import {
  INITIAL_BOM_LIST,
  INITIAL_PRODUCTION_JOBS,
  INITIAL_JOB_OPERATIONS
} from '../data/mockProductionData';
import {
  InventorySubTab,
  MaterialTransaction,
  MiscellaneousIssue,
  MiscellaneousReceipt
} from '../types/inventoryControl';
import {
  INITIAL_MATERIAL_TRANSACTIONS,
  INITIAL_MISC_ISSUES,
  INITIAL_MISC_RECEIPTS
} from '../data/mockInventoryControlData';

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
  activeTab: 'hub' | 'jobs' | 'production' | 'inventory' | 'team' | 'report' | 'master-data';
  setActiveTab: (tab: 'hub' | 'jobs' | 'production' | 'inventory' | 'team' | 'report' | 'master-data') => void;
  productionSubTab: ProductionModuleTab;
  setProductionSubTab: (tab: ProductionModuleTab) => void;
  masterSubTab: MasterModuleTab;
  setMasterSubTab: (tab: MasterModuleTab) => void;
  inventorySubTab: InventorySubTab;
  setInventorySubTab: (tab: InventorySubTab) => void;

  // Basic Inventory Control Collections & Actions
  materialTransactions: MaterialTransaction[];
  miscIssues: MiscellaneousIssue[];
  miscReceipts: MiscellaneousReceipt[];
  saveMaterialTransaction: (txn: MaterialTransaction, isNew: boolean) => void;
  deleteMaterialTransaction: (id: string) => void;
  saveMiscIssue: (issue: MiscellaneousIssue, isNew: boolean) => void;
  deleteMiscIssue: (id: string) => void;
  saveMiscReceipt: (receipt: MiscellaneousReceipt, isNew: boolean) => void;
  deleteMiscReceipt: (id: string) => void;

  // Engineering & Production Collections & Actions
  bomList: MasterBOM[];
  productionJobs: ProductionJobOrder[];
  jobOperations: JobOperation[];
  saveBom: (bom: MasterBOM, isNew: boolean) => void;
  deleteBom: (id: string) => void;
  saveProductionJob: (job: ProductionJobOrder, isNew: boolean) => void;
  deleteProductionJob: (id: string) => void;
  saveJobOperation: (op: JobOperation, isNew: boolean) => void;
  deleteJobOperation: (id: string) => void;
  startJobOperation: (opId: string) => void;
  finishJobOperation: (opId: string, goodQty: number, scrapQty: number) => void;
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

  // 8 Atomic Master Collections & Actions
  masterItems: MasterItem[];
  masterUoms: MasterUom[];
  masterWarehouses: MasterWarehouse[];
  masterLocations: MasterLocation[];
  masterWorkCenters: MasterWorkCenter[];
  masterResources: MasterResource[];
  masterCustomers: MasterCustomer[];
  masterVendors: MasterVendor[];
  saveMasterItem: (item: MasterItem, isNew: boolean) => void;
  deleteMasterItem: (id: string) => void;
  saveMasterUom: (uom: MasterUom, isNew: boolean) => void;
  deleteMasterUom: (id: string) => void;
  saveMasterWarehouse: (wh: MasterWarehouse, isNew: boolean) => void;
  deleteMasterWarehouse: (id: string) => void;
  saveMasterLocation: (loc: MasterLocation, isNew: boolean) => void;
  deleteMasterLocation: (id: string) => void;
  saveMasterWorkCenter: (wc: MasterWorkCenter, isNew: boolean) => void;
  deleteMasterWorkCenter: (id: string) => void;
  saveMasterResource: (res: MasterResource, isNew: boolean) => void;
  deleteMasterResource: (id: string) => void;
  saveMasterCustomer: (cust: MasterCustomer, isNew: boolean) => void;
  deleteMasterCustomer: (id: string) => void;
  saveMasterVendor: (ven: MasterVendor, isNew: boolean) => void;
  deleteMasterVendor: (id: string) => void;

  // 4 Relation Collections & Actions
  relItemWarehouses: RelationItemWarehouse[];
  relItemUoms: RelationItemUom[];
  relWcResources: RelationWorkCenterResource[];
  relItemVendors: RelationItemVendor[];
  saveRelItemWarehouse: (rel: RelationItemWarehouse, isNew: boolean) => void;
  deleteRelItemWarehouse: (id: string) => void;
  saveRelItemUom: (rel: RelationItemUom, isNew: boolean) => void;
  deleteRelItemUom: (id: string) => void;
  saveRelWcResource: (rel: RelationWorkCenterResource, isNew: boolean) => void;
  deleteRelWcResource: (id: string) => void;
  saveRelItemVendor: (rel: RelationItemVendor, isNew: boolean) => void;
  deleteRelItemVendor: (id: string) => void;

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
  MASTER_ITEMS: 'metroerp_master_items_v2',
  MASTER_UOMS: 'metroerp_master_uoms_v2',
  MASTER_WAREHOUSES: 'metroerp_master_warehouses_v2',
  MASTER_LOCATIONS: 'metroerp_master_locations_v2',
  MASTER_WORKCENTERS: 'metroerp_master_workcenters_v2',
  MASTER_RESOURCES: 'metroerp_master_resources_v2',
  MASTER_CUSTOMERS: 'metroerp_master_customers_v2',
  MASTER_VENDORS: 'metroerp_master_vendors_v2',
  REL_ITEM_WAREHOUSES: 'metroerp_rel_item_warehouses_v2',
  REL_ITEM_UOMS: 'metroerp_rel_item_uoms_v2',
  REL_WC_RESOURCES: 'metroerp_rel_wc_resources_v2',
  REL_ITEM_VENDORS: 'metroerp_rel_item_vendors_v2',
  BOM_LIST: 'metroerp_bom_list_v1',
  PROD_JOBS: 'metroerp_prod_jobs_v1',
  JOB_OPS: 'metroerp_job_ops_v1',
  MATERIAL_TXNS: 'metroerp_mat_txns_v1',
  MISC_ISSUES: 'metroerp_misc_issues_v1',
  MISC_RECEIPTS: 'metroerp_misc_receipts_v1',
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

  const [activeTab, setActiveTab] = useState<'hub' | 'jobs' | 'production' | 'inventory' | 'team' | 'report' | 'master-data'>('jobs');
  const [productionSubTab, setProductionSubTab] = useState<ProductionModuleTab>('bom');
  const [masterSubTab, setMasterSubTab] = useState<MasterModuleTab>('items');
  const [inventorySubTab, setInventorySubTab] = useState<InventorySubTab>('material-engine');

  // Basic Inventory Control States
  const [materialTransactions, setMaterialTransactions] = useState<MaterialTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIAL_TXNS);
    return saved ? JSON.parse(saved) : INITIAL_MATERIAL_TRANSACTIONS;
  });

  const [miscIssues, setMiscIssues] = useState<MiscellaneousIssue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISC_ISSUES);
    return saved ? JSON.parse(saved) : INITIAL_MISC_ISSUES;
  });

  const [miscReceipts, setMiscReceipts] = useState<MiscellaneousReceipt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISC_RECEIPTS);
    return saved ? JSON.parse(saved) : INITIAL_MISC_RECEIPTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIAL_TXNS, JSON.stringify(materialTransactions));
  }, [materialTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISC_ISSUES, JSON.stringify(miscIssues));
  }, [miscIssues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISC_RECEIPTS, JSON.stringify(miscReceipts));
  }, [miscReceipts]);

  // Engineering & Production States
  const [bomList, setBomList] = useState<MasterBOM[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOM_LIST);
    return saved ? JSON.parse(saved) : INITIAL_BOM_LIST;
  });

  const [productionJobs, setProductionJobs] = useState<ProductionJobOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROD_JOBS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_JOBS;
  });

  const [jobOperations, setJobOperations] = useState<JobOperation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOB_OPS);
    return saved ? JSON.parse(saved) : INITIAL_JOB_OPERATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOM_LIST, JSON.stringify(bomList));
  }, [bomList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROD_JOBS, JSON.stringify(productionJobs));
  }, [productionJobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOB_OPS, JSON.stringify(jobOperations));
  }, [jobOperations]);

  // 8 Atomic Masters States
  const [masterItems, setMasterItems] = useState<MasterItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_ITEMS);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_ITEMS;
  });

  const [masterUoms, setMasterUoms] = useState<MasterUom[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_UOMS);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_UOMS;
  });

  const [masterWarehouses, setMasterWarehouses] = useState<MasterWarehouse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_WAREHOUSES);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_WAREHOUSES;
  });

  const [masterLocations, setMasterLocations] = useState<MasterLocation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_LOCATIONS);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_LOCATIONS;
  });

  const [masterWorkCenters, setMasterWorkCenters] = useState<MasterWorkCenter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_WORKCENTERS);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_WORKCENTERS;
  });

  const [masterResources, setMasterResources] = useState<MasterResource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_RESOURCES);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_RESOURCES;
  });

  const [masterCustomers, setMasterCustomers] = useState<MasterCustomer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_CUSTOMERS;
  });

  const [masterVendors, setMasterVendors] = useState<MasterVendor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_VENDORS);
    return saved ? JSON.parse(saved) : INITIAL_MASTER_VENDORS;
  });

  // 4 Relations States
  const [relItemWarehouses, setRelItemWarehouses] = useState<RelationItemWarehouse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REL_ITEM_WAREHOUSES);
    return saved ? JSON.parse(saved) : INITIAL_REL_ITEM_WAREHOUSES;
  });

  const [relItemUoms, setRelItemUoms] = useState<RelationItemUom[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REL_ITEM_UOMS);
    return saved ? JSON.parse(saved) : INITIAL_REL_ITEM_UOMS;
  });

  const [relWcResources, setRelWcResources] = useState<RelationWorkCenterResource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REL_WC_RESOURCES);
    return saved ? JSON.parse(saved) : INITIAL_REL_WC_RESOURCES;
  });

  const [relItemVendors, setRelItemVendors] = useState<RelationItemVendor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REL_ITEM_VENDORS);
    return saved ? JSON.parse(saved) : INITIAL_REL_ITEM_VENDORS;
  });

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

  // Master Data LocalStorage Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(masterItems));
  }, [masterItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_UOMS, JSON.stringify(masterUoms));
  }, [masterUoms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_WAREHOUSES, JSON.stringify(masterWarehouses));
  }, [masterWarehouses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_LOCATIONS, JSON.stringify(masterLocations));
  }, [masterLocations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_WORKCENTERS, JSON.stringify(masterWorkCenters));
  }, [masterWorkCenters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_RESOURCES, JSON.stringify(masterResources));
  }, [masterResources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_CUSTOMERS, JSON.stringify(masterCustomers));
  }, [masterCustomers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_VENDORS, JSON.stringify(masterVendors));
  }, [masterVendors]);

  // Relations LocalStorage Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REL_ITEM_WAREHOUSES, JSON.stringify(relItemWarehouses));
  }, [relItemWarehouses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REL_ITEM_UOMS, JSON.stringify(relItemUoms));
  }, [relItemUoms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REL_WC_RESOURCES, JSON.stringify(relWcResources));
  }, [relWcResources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REL_ITEM_VENDORS, JSON.stringify(relItemVendors));
  }, [relItemVendors]);

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

  // --- 8 Master Data Actions ---
  const saveMasterItem = (item: MasterItem, isNew: boolean) => {
    if (isNew) {
      setMasterItems((prev) => [item, ...prev]);
      showToast('success', 'Item Baru Tersimpan', `Master item ${item.code} (${item.name}) berhasil ditambahkan.`);
    } else {
      setMasterItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      showToast('success', 'Perubahan Disimpan', `Data item ${item.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterItem = (id: string) => {
    const target = masterItems.find((i) => i.id === id);
    setMasterItems((prev) => prev.filter((i) => i.id !== id));
    showToast('warning', 'Item Dihapus', `Master item ${target?.code || id} telah dihapus.`);
  };

  const saveMasterUom = (uom: MasterUom, isNew: boolean) => {
    if (isNew) {
      setMasterUoms((prev) => [uom, ...prev]);
      showToast('success', 'UOM Baru Tersimpan', `Satuan ${uom.code} (${uom.name}) berhasil ditambahkan.`);
    } else {
      setMasterUoms((prev) => prev.map((u) => (u.id === uom.id ? u : u)));
      showToast('success', 'Perubahan Disimpan', `Satuan ${uom.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterUom = (id: string) => {
    const target = masterUoms.find((u) => u.id === id);
    setMasterUoms((prev) => prev.filter((u) => u.id !== id));
    showToast('warning', 'UOM Dihapus', `Satuan ${target?.code || id} telah dihapus.`);
  };

  const saveMasterWarehouse = (wh: MasterWarehouse, isNew: boolean) => {
    if (isNew) {
      setMasterWarehouses((prev) => [wh, ...prev]);
      showToast('success', 'Gudang Baru Tersimpan', `Gudang ${wh.code} (${wh.name}) berhasil dibuat.`);
    } else {
      setMasterWarehouses((prev) => prev.map((w) => (w.id === wh.id ? wh : w)));
      showToast('success', 'Perubahan Disimpan', `Data gudang ${wh.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterWarehouse = (id: string) => {
    const target = masterWarehouses.find((w) => w.id === id);
    setMasterWarehouses((prev) => prev.filter((w) => w.id !== id));
    showToast('warning', 'Gudang Dihapus', `Gudang ${target?.code || id} telah dihapus.`);
  };

  const saveMasterLocation = (loc: MasterLocation, isNew: boolean) => {
    if (isNew) {
      setMasterLocations((prev) => [loc, ...prev]);
      showToast('success', 'Lokasi Baru Tersimpan', `Lokasi ${loc.code} (${loc.name}) berhasil dibuat.`);
    } else {
      setMasterLocations((prev) => prev.map((l) => (l.id === loc.id ? loc : l)));
      showToast('success', 'Perubahan Disimpan', `Data lokasi ${loc.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterLocation = (id: string) => {
    const target = masterLocations.find((l) => l.id === id);
    setMasterLocations((prev) => prev.filter((l) => l.id !== id));
    showToast('warning', 'Lokasi Dihapus', `Lokasi ${target?.code || id} telah dihapus.`);
  };

  const saveMasterWorkCenter = (wc: MasterWorkCenter, isNew: boolean) => {
    if (isNew) {
      setMasterWorkCenters((prev) => [wc, ...prev]);
      showToast('success', 'Work Center Tersimpan', `Work Center ${wc.code} (${wc.name}) siap untuk modul MES.`);
    } else {
      setMasterWorkCenters((prev) => prev.map((w) => (w.id === wc.id ? wc : w)));
      showToast('success', 'Perubahan Disimpan', `Work Center ${wc.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterWorkCenter = (id: string) => {
    const target = masterWorkCenters.find((w) => w.id === id);
    setMasterWorkCenters((prev) => prev.filter((w) => w.id !== id));
    showToast('warning', 'Work Center Dihapus', `Work Center ${target?.code || id} telah dihapus.`);
  };

  const saveMasterResource = (res: MasterResource, isNew: boolean) => {
    if (isNew) {
      setMasterResources((prev) => [res, ...prev]);
      showToast('success', 'Resource Tersimpan', `Resource ${res.code} (${res.name}) ditambahkan.`);
    } else {
      setMasterResources((prev) => prev.map((r) => (r.id === res.id ? res : r)));
      showToast('success', 'Perubahan Disimpan', `Resource ${res.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterResource = (id: string) => {
    const target = masterResources.find((r) => r.id === id);
    setMasterResources((prev) => prev.filter((r) => r.id !== id));
    showToast('warning', 'Resource Dihapus', `Resource ${target?.code || id} telah dihapus.`);
  };

  const saveMasterCustomer = (cust: MasterCustomer, isNew: boolean) => {
    if (isNew) {
      setMasterCustomers((prev) => [cust, ...prev]);
      showToast('success', 'Pelanggan Tersimpan', `Customer ${cust.code} (${cust.name}) berhasil ditambahkan.`);
    } else {
      setMasterCustomers((prev) => prev.map((c) => (c.id === cust.id ? cust : c)));
      showToast('success', 'Perubahan Disimpan', `Customer ${cust.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterCustomer = (id: string) => {
    const target = masterCustomers.find((c) => c.id === id);
    setMasterCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast('warning', 'Customer Dihapus', `Customer ${target?.code || id} telah dihapus.`);
  };

  const saveMasterVendor = (ven: MasterVendor, isNew: boolean) => {
    if (isNew) {
      setMasterVendors((prev) => [ven, ...prev]);
      showToast('success', 'Vendor Tersimpan', `Vendor ${ven.code} (${ven.name}) berhasil ditambahkan.`);
    } else {
      setMasterVendors((prev) => prev.map((v) => (v.id === ven.id ? ven : v)));
      showToast('success', 'Perubahan Disimpan', `Vendor ${ven.code} berhasil diperbarui.`);
    }
  };
  const deleteMasterVendor = (id: string) => {
    const target = masterVendors.find((v) => v.id === id);
    setMasterVendors((prev) => prev.filter((v) => v.id !== id));
    showToast('warning', 'Vendor Dihapus', `Vendor ${target?.code || id} telah dihapus.`);
  };

  // --- 4 Relations Actions ---
  const saveRelItemWarehouse = (rel: RelationItemWarehouse, isNew: boolean) => {
    if (isNew) {
      setRelItemWarehouses((prev) => [rel, ...prev]);
      showToast('success', 'Relasi Item-Warehouse Tersimpan', `${rel.itemCode} dipetakan ke ${rel.warehouseCode}.`);
    } else {
      setRelItemWarehouses((prev) => prev.map((r) => (r.id === rel.id ? rel : r)));
      showToast('success', 'Perubahan Disimpan', `Relasi ${rel.itemCode} - ${rel.warehouseCode} diperbarui.`);
    }
  };
  const deleteRelItemWarehouse = (id: string) => {
    setRelItemWarehouses((prev) => prev.filter((r) => r.id !== id));
    showToast('warning', 'Relasi Dihapus', 'Relasi Item-Warehouse telah dihapus.');
  };

  const saveRelItemUom = (rel: RelationItemUom, isNew: boolean) => {
    if (isNew) {
      setRelItemUoms((prev) => [rel, ...prev]);
      showToast('success', 'Relasi Item-UOM Tersimpan', `${rel.itemCode} dikonversi ke ${rel.uomCode}.`);
    } else {
      setRelItemUoms((prev) => prev.map((r) => (r.id === rel.id ? rel : r)));
      showToast('success', 'Perubahan Disimpan', `Relasi ${rel.itemCode} - ${rel.uomCode} diperbarui.`);
    }
  };
  const deleteRelItemUom = (id: string) => {
    setRelItemUoms((prev) => prev.filter((r) => r.id !== id));
    showToast('warning', 'Relasi Dihapus', 'Relasi Item-UOM telah dihapus.');
  };

  const saveRelWcResource = (rel: RelationWorkCenterResource, isNew: boolean) => {
    if (isNew) {
      setRelWcResources((prev) => [rel, ...prev]);
      showToast('success', 'Relasi WC-Resource Tersimpan', `${rel.workCenterCode} dialokasikan ke ${rel.resourceCode}.`);
    } else {
      setRelWcResources((prev) => prev.map((r) => (r.id === rel.id ? rel : r)));
      showToast('success', 'Perubahan Disimpan', `Relasi ${rel.workCenterCode} diperbarui.`);
    }
  };
  const deleteRelWcResource = (id: string) => {
    setRelWcResources((prev) => prev.filter((r) => r.id !== id));
    showToast('warning', 'Relasi Dihapus', 'Relasi Work Center - Resource telah dihapus.');
  };

  const saveRelItemVendor = (rel: RelationItemVendor, isNew: boolean) => {
    if (isNew) {
      setRelItemVendors((prev) => [rel, ...prev]);
      showToast('success', 'Relasi Item-Vendor Tersimpan', `${rel.itemCode} dipasok oleh ${rel.vendorCode}.`);
    } else {
      setRelItemVendors((prev) => prev.map((r) => (r.id === rel.id ? rel : r)));
      showToast('success', 'Perubahan Disimpan', `Relasi ${rel.itemCode} - ${rel.vendorCode} diperbarui.`);
    }
  };
  const deleteRelItemVendor = (id: string) => {
    setRelItemVendors((prev) => prev.filter((r) => r.id !== id));
    showToast('warning', 'Relasi Dihapus', 'Relasi Item-Vendor telah dihapus.');
  };

  // --- Engineering & Production Actions ---
  const saveBom = (bom: MasterBOM, isNew: boolean) => {
    if (isNew) {
      setBomList((prev) => [bom, ...prev]);
      showToast('success', 'BOM Baru Tersimpan', `Struktur BOM ${bom.bomCode} (${bom.productName}) berhasil dibuat.`);
    } else {
      setBomList((prev) => prev.map((b) => (b.id === bom.id ? bom : b)));
      showToast('success', 'Perubahan BOM Disimpan', `BOM ${bom.bomCode} Rev ${bom.revision} telah diperbarui.`);
    }
  };
  const deleteBom = (id: string) => {
    const target = bomList.find((b) => b.id === id);
    setBomList((prev) => prev.filter((b) => b.id !== id));
    showToast('warning', 'BOM Dihapus', `BOM ${target?.bomCode || id} telah dihapus.`);
  };

  const saveProductionJob = (job: ProductionJobOrder, isNew: boolean) => {
    if (isNew) {
      setProductionJobs((prev) => [job, ...prev]);
      showToast('success', 'SPK Baru Diterbitkan', `Surat Perintah Kerja ${job.orderNumber} berhasil dibuat.`);
    } else {
      setProductionJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
      showToast('success', 'SPK Diperbarui', `Data SPK ${job.orderNumber} berhasil diperbarui.`);
    }
  };
  const deleteProductionJob = (id: string) => {
    const target = productionJobs.find((j) => j.id === id);
    setProductionJobs((prev) => prev.filter((j) => j.id !== id));
    showToast('warning', 'SPK Dihapus', `SPK ${target?.orderNumber || id} telah dihapus.`);
  };

  const saveJobOperation = (op: JobOperation, isNew: boolean) => {
    if (isNew) {
      setJobOperations((prev) => [op, ...prev]);
      showToast('success', 'Operasi MES Ditambahkan', `Operasi ${op.operationCode} (${op.operationName}) berhasil didaftarkan.`);
    } else {
      setJobOperations((prev) => prev.map((o) => (o.id === op.id ? op : o)));
      showToast('success', 'Operasi MES Diperbarui', `Operasi ${op.operationCode} berhasil diperbarui.`);
    }
  };
  const deleteJobOperation = (id: string) => {
    const target = jobOperations.find((o) => o.id === id);
    setJobOperations((prev) => prev.filter((o) => o.id !== id));
    showToast('warning', 'Operasi Dihapus', `Operasi ${target?.operationCode || id} telah dihapus.`);
  };

  const startJobOperation = (opId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setJobOperations((prev) =>
      prev.map((o) =>
        o.id === opId
          ? {
              ...o,
              status: 'IN_PROGRESS',
              startedAt: nowStr,
            }
          : o
      )
    );
    showToast('info', 'MES Dimulai', 'Operasi pekerjaan sedang berjalan di workstation.');
  };

  const finishJobOperation = (opId: string, goodQty: number, scrapQty: number) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setJobOperations((prev) =>
      prev.map((o) =>
        o.id === opId
          ? {
              ...o,
              status: 'COMPLETED',
              goodQty,
              scrapQty,
              finishedAt: nowStr,
            }
          : o
      )
    );
    showToast('success', 'MES Operasi Tuntas', `Operasi tuntas dengan Good: ${goodQty}, Scrap: ${scrapQty}.`);
  };

  // Basic Inventory Control CRUD Actions
  const saveMaterialTransaction = (txn: MaterialTransaction, isNew: boolean) => {
    if (isNew) {
      setMaterialTransactions((prev) => [txn, ...prev]);
      if (txn.direction === 'OUT') {
        setInventory((prev) =>
          prev.map((item) =>
            item.sku === txn.itemCode
              ? { ...item, stock: Math.max(0, item.stock - txn.qty), lastUpdated: txn.timestamp }
              : item
          )
        );
      } else if (txn.direction === 'IN') {
        setInventory((prev) =>
          prev.map((item) =>
            item.sku === txn.itemCode
              ? { ...item, stock: item.stock + txn.qty, lastUpdated: txn.timestamp }
              : item
          )
        );
      }
      showToast('success', 'Transaksi Diposting', `Nomor Transaksi ${txn.transactionNumber} sukses diposting ke ledger inventaris.`);
    } else {
      setMaterialTransactions((prev) => prev.map((t) => (t.id === txn.id ? txn : t)));
      showToast('success', 'Transaksi Diperbarui', `Record transaksi ${txn.transactionNumber} berhasil diperbarui.`);
    }
  };

  const deleteMaterialTransaction = (id: string) => {
    const found = materialTransactions.find((t) => t.id === id);
    setMaterialTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('info', 'Transaksi Dihapus', `Transaksi ${found?.transactionNumber || id} telah dihapus.`);
  };

  const saveMiscIssue = (issue: MiscellaneousIssue, isNew: boolean) => {
    if (isNew) {
      setMiscIssues((prev) => [issue, ...prev]);
      // Deduct stock from inventory
      setInventory((prev) =>
        prev.map((item) =>
          item.sku === issue.itemCode
            ? { ...item, stock: Math.max(0, item.stock - issue.qty), lastUpdated: issue.issueDate }
            : item
        )
      );
      // Register stock movement
      const newMov: StockMovement = {
        id: `mov-${Date.now()}`,
        timestamp: issue.issueDate,
        sku: issue.itemCode,
        itemName: issue.itemName,
        type: 'OUT',
        qty: issue.qty,
        reference: issue.issueNumber,
        operator: issue.requester,
        notes: `Misc Issue (${issue.reasonLabel}) - ${issue.notes}`
      };
      setMovements((prev) => [newMov, ...prev]);
      // Automatically post to Material Transaction Engine
      const newTxn: MaterialTransaction = {
        id: `txn-${Date.now()}`,
        transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: issue.issueDate,
        type: 'MISC_ISSUE',
        typeLabel: 'Miscellaneous Issue',
        itemCode: issue.itemCode,
        itemName: issue.itemName,
        category: 'RAW_MATERIAL',
        warehouseCode: issue.warehouseCode,
        warehouseName: issue.warehouseName,
        locationCode: issue.locationCode,
        direction: 'OUT',
        qty: issue.qty,
        uom: issue.uom,
        unitCost: issue.unitCost,
        totalCost: issue.totalAmount,
        reasonCode: issue.reasonCode,
        referenceDoc: issue.issueNumber,
        operator: issue.requester,
        department: issue.department,
        costCenter: issue.costCenter,
        status: 'POSTED',
        notes: issue.notes,
      };
      setMaterialTransactions((prev) => [newTxn, ...prev]);
      showToast('success', 'Pengeluaran Non-PO Terposting', `Miscellaneous Issue ${issue.issueNumber} sebesar ${issue.qty} ${issue.uom} berhasil dikeluarkan dari gudang.`);
    } else {
      setMiscIssues((prev) => prev.map((i) => (i.id === issue.id ? issue : i)));
      showToast('success', 'Issue Diperbarui', `Dokumen issue ${issue.issueNumber} telah diperbarui.`);
    }
  };

  const deleteMiscIssue = (id: string) => {
    const found = miscIssues.find((i) => i.id === id);
    setMiscIssues((prev) => prev.filter((i) => i.id !== id));
    showToast('info', 'Issue Dihapus', `Dokumen issue ${found?.issueNumber || id} telah dihapus.`);
  };

  const saveMiscReceipt = (receipt: MiscellaneousReceipt, isNew: boolean) => {
    if (isNew) {
      setMiscReceipts((prev) => [receipt, ...prev]);
      // Add stock to inventory
      setInventory((prev) =>
        prev.map((item) =>
          item.sku === receipt.itemCode
            ? { ...item, stock: item.stock + receipt.qty, lastUpdated: receipt.receiptDate }
            : item
        )
      );
      // Register stock movement
      const newMov: StockMovement = {
        id: `mov-${Date.now()}`,
        timestamp: receipt.receiptDate,
        sku: receipt.itemCode,
        itemName: receipt.itemName,
        type: 'IN',
        qty: receipt.qty,
        reference: receipt.receiptNumber,
        operator: receipt.receivedBy,
        notes: `Misc Receipt (${receipt.reasonLabel}) - ${receipt.notes}`
      };
      setMovements((prev) => [newMov, ...prev]);
      // Automatically post to Material Transaction Engine
      const newTxn: MaterialTransaction = {
        id: `txn-${Date.now()}`,
        transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: receipt.receiptDate,
        type: 'MISC_RECEIPT',
        typeLabel: 'Miscellaneous Receipt',
        itemCode: receipt.itemCode,
        itemName: receipt.itemName,
        category: 'RAW_MATERIAL',
        warehouseCode: receipt.warehouseCode,
        warehouseName: receipt.warehouseName,
        locationCode: receipt.locationCode,
        direction: 'IN',
        qty: receipt.qty,
        uom: receipt.uom,
        unitCost: receipt.unitCost,
        totalCost: receipt.totalAmount,
        reasonCode: receipt.reasonCode,
        referenceDoc: receipt.receiptNumber,
        operator: receipt.receivedBy,
        department: 'Gudang Logistik',
        costCenter: receipt.offsetAccount,
        status: 'POSTED',
        notes: receipt.notes,
        lotBatchNo: receipt.lotBatchNo,
      };
      setMaterialTransactions((prev) => [newTxn, ...prev]);
      showToast('success', 'Penerimaan Non-PO Terposting', `Miscellaneous Receipt ${receipt.receiptNumber} sebesar ${receipt.qty} ${receipt.uom} berhasil dimasukkan ke stok gudang.`);
    } else {
      setMiscReceipts((prev) => prev.map((r) => (r.id === receipt.id ? receipt : r)));
      showToast('success', 'Receipt Diperbarui', `Dokumen penerimaan ${receipt.receiptNumber} telah diperbarui.`);
    }
  };

  const deleteMiscReceipt = (id: string) => {
    const found = miscReceipts.find((r) => r.id === id);
    setMiscReceipts((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Receipt Dihapus', `Dokumen penerimaan ${found?.receiptNumber || id} telah dihapus.`);
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.WORKSTATIONS);
    localStorage.removeItem(STORAGE_KEYS.MASTER_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.MASTER_UOMS);
    localStorage.removeItem(STORAGE_KEYS.MASTER_WAREHOUSES);
    localStorage.removeItem(STORAGE_KEYS.MASTER_LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.MASTER_WORKCENTERS);
    localStorage.removeItem(STORAGE_KEYS.MASTER_RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.MASTER_CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.MASTER_VENDORS);
    localStorage.removeItem(STORAGE_KEYS.REL_ITEM_WAREHOUSES);
    localStorage.removeItem(STORAGE_KEYS.REL_ITEM_UOMS);
    localStorage.removeItem(STORAGE_KEYS.REL_WC_RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.REL_ITEM_VENDORS);
    localStorage.removeItem(STORAGE_KEYS.BOM_LIST);
    localStorage.removeItem(STORAGE_KEYS.PROD_JOBS);
    localStorage.removeItem(STORAGE_KEYS.JOB_OPS);
    localStorage.removeItem(STORAGE_KEYS.MATERIAL_TXNS);
    localStorage.removeItem(STORAGE_KEYS.MISC_ISSUES);
    localStorage.removeItem(STORAGE_KEYS.MISC_RECEIPTS);

    setJobOrders(INITIAL_JOB_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setMovements(INITIAL_MOVEMENTS);
    setWorkstations(INITIAL_WORKSTATIONS);
    setMasterItems(INITIAL_MASTER_ITEMS);
    setMasterUoms(INITIAL_MASTER_UOMS);
    setMasterWarehouses(INITIAL_MASTER_WAREHOUSES);
    setMasterLocations(INITIAL_MASTER_LOCATIONS);
    setMasterWorkCenters(INITIAL_MASTER_WORKCENTERS);
    setMasterResources(INITIAL_MASTER_RESOURCES);
    setMasterCustomers(INITIAL_MASTER_CUSTOMERS);
    setMasterVendors(INITIAL_MASTER_VENDORS);
    setRelItemWarehouses(INITIAL_REL_ITEM_WAREHOUSES);
    setRelItemUoms(INITIAL_REL_ITEM_UOMS);
    setRelWcResources(INITIAL_REL_WC_RESOURCES);
    setRelItemVendors(INITIAL_REL_ITEM_VENDORS);
    setBomList(INITIAL_BOM_LIST);
    setProductionJobs(INITIAL_PRODUCTION_JOBS);
    setJobOperations(INITIAL_JOB_OPERATIONS);
    setMaterialTransactions(INITIAL_MATERIAL_TRANSACTIONS);
    setMiscIssues(INITIAL_MISC_ISSUES);
    setMiscReceipts(INITIAL_MISC_RECEIPTS);

    showToast('info', 'Data Direset', 'Semua data master, relasi, modul produksi, & inventaris dikembalikan ke konfigurasi awal.');
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
        productionSubTab,
        setProductionSubTab,
        masterSubTab,
        setMasterSubTab,
        inventorySubTab,
        setInventorySubTab,

        // Basic Inventory Control
        materialTransactions,
        miscIssues,
        miscReceipts,
        saveMaterialTransaction,
        deleteMaterialTransaction,
        saveMiscIssue,
        deleteMiscIssue,
        saveMiscReceipt,
        deleteMiscReceipt,

        // Engineering & Production
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
