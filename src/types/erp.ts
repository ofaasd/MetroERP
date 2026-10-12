export type JobPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export type JobStatus = 
  | 'QUEUE'            // 0: Antrean / Draft
  | 'MATERIAL_PREP'   // 1: Alokasi & Persiapan Material
  | 'IN_PRODUCTION'   // 2: Proses Produksi (BOM terpotong otomatis)
  | 'QC_CHECK'        // 3: Inspeksi Kontrol Kualitas
  | 'COMPLETED'       // 4: Selesai & Produk Jadi Masuk Stok
  | 'DISPATCHED';      // 5: Terkirim ke Klien

export interface BOMItem {
  sku: string;
  requiredQty: number;
}

export interface JobOrder {
  id: string;
  orderNumber: string;        // e.g. SPK-2026-0042
  clientName: string;
  productName: string;
  productSku: string;
  targetQty: number;
  completedQty: number;
  scrapQty: number;
  priority: JobPriority;
  status: JobStatus;
  progressPercent: number;
  assignedTeam: string;        // e.g. Tim Fabrikasi A, Tim Perakitan Elektrik
  leadTechnician: string;      // e.g. Budi Santoso
  startDate: string;
  dueDate: string;
  completedDate?: string;
  bom: BOMItem[];
  notes: string;
  materialsDeducted: boolean;  // True when inventory raw materials have been deducted
  finishedProductAdded: boolean; // True when finished good stock is added
}

export type InventoryCategory = 'RAW_MATERIAL' | 'COMPONENT' | 'FINISHED_GOOD' | 'PACKAGING';

export interface InventoryItem {
  sku: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  safetyMin: number;
  unit: string;               // e.g. Pcs, Batang, Roll, Meter, Set, Kg
  unitPrice: number;          // in IDR
  binLocation: string;        // e.g. Rak A-02, Gudang 1
  lastUpdated: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUST';

export interface StockMovement {
  id: string;
  timestamp: string;
  sku: string;
  itemName: string;
  type: MovementType;
  qty: number;
  reference: string;          // e.g. SPK-2026-0042, PO-IN-8891, OPNAME-03
  operator: string;
  notes?: string;
}

export interface Workstation {
  id: string;
  name: string;
  code: string;
  lead: string;
  avatar?: string;
  currentJobNumber?: string;
  efficiencyRate: number;      // e.g. 94%
  outputToday: number;         // units
  targetToday: number;
  status: 'RUNNING' | 'IDLE' | 'MAINTENANCE';
  activeShift: 'Pagi (08:00 - 16:00)' | 'Sore (16:00 - 24:00)';
}

export interface DailyKPISummary {
  date: string;
  totalOrdersCompleted: number;
  targetOrders: number;
  efficiencyRate: number;
  onTimeDeliveryRate: number;
  scrapRate: number;
  totalUnitsProduced: number;
  totalStockValue: number;
  criticalStockItemsCount: number;
  activeOrdersInFlight: number;
}
