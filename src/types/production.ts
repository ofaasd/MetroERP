import { JobPriority, JobStatus } from './erp';

// -------------------------------------------------------------
// 1. BILL OF MATERIALS (BOM) & ENGINEERING BOARD
// -------------------------------------------------------------
export type BomStatus = 'DRAFT' | 'RELEASED' | 'UNDER_REVIEW' | 'OBSOLETE';

export interface BomComponent {
  id: string;
  itemCode: string;
  itemName: string;
  requiredQty: number;        // Kebutuhan per unit produk jadi
  uom: string;                // e.g. Lembar, Pcs, Kg, Meter
  scrapAllowancePercent: number; // e.g. 2%
  stagingLocation: string;    // e.g. LOC-STG-CNC
  unitCost: number;           // IDR
}

export interface BomRoutingStep {
  stepNo: number;             // 10, 20, 30, ...
  operationName: string;      // e.g. Cutting Plat, Bending, Wiring
  workCenterCode: string;     // e.g. WC-LASER-01
  standardMinutes: number;    // Estimasi waktu siklus (menit)
}

export interface MasterBOM {
  id: string;
  bomCode: string;            // e.g. BOM-PNL-DIST3P
  productCode: string;        // e.g. FG-PNL-DIST3P
  productName: string;
  revision: string;           // e.g. Rev 2.1
  status: BomStatus;
  leadEngineer: string;       // e.g. Ir. Dimas Satrio, MT
  cadDrawingNumber: string;   // e.g. DWG-2026-081-CAD
  targetBatchSize: number;    // e.g. 1 Unit
  baseUom: string;            // e.g. Unit / Set
  effectiveDate: string;      // e.g. 2026-01-15
  estimatedLeadTimeDays: number;
  components: BomComponent[];
  routings: BomRoutingStep[];
  notes: string;
}

// -------------------------------------------------------------
// 2. JOB ORDERS / SPK (PRODUKSI)
// -------------------------------------------------------------
export interface ProductionJobOrder {
  id: string;
  orderNumber: string;        // e.g. SPK-2026-0042
  bomCode: string;            // Referensi BOM
  customerName: string;       // e.g. PT Astra Otoparts Tbk
  productCode: string;        // e.g. FG-PNL-DIST3P
  productName: string;
  targetQty: number;
  completedQty: number;
  scrapQty: number;
  priority: JobPriority;
  status: JobStatus;
  progressPercent: number;
  assignedTeam: string;        // e.g. Tim Fabrikasi Alpha, Tim Perakitan Elektrik
  leadTechnician: string;      // e.g. Budi Santoso
  startDate: string;
  dueDate: string;
  completedDate?: string;
  materialsDeducted: boolean;
  notes: string;
}

// -------------------------------------------------------------
// 3. JOB OPERATIONS (OPERASI MES LANTAI PABRIK)
// -------------------------------------------------------------
export type OperationStatus = 
  | 'PENDING'       // Belum dimulai / menunggu giliran antrean
  | 'READY'         // Bahan di staging sudah siap
  | 'IN_PROGRESS'   // Mesin sedang berjalan
  | 'PAUSED'        // Dijeda (ganti tooling / shift)
  | 'COMPLETED';    // Selesai & lulus QC per tahap

export interface JobOperation {
  id: string;
  operationCode: string;      // e.g. OP-SPK42-010
  jobOrderNumber: string;     // e.g. SPK-2026-0042
  sequenceNo: number;         // 10, 20, 30, 40, 50
  operationName: string;      // e.g. Pemotongan Plat Fiber Laser, Bending Rangka
  workCenterCode: string;     // e.g. WC-LASER-01
  workCenterName: string;
  resourceCode: string;       // e.g. RES-TRUMPF-3030
  resourceName: string;
  mesTerminalId: string;      // e.g. MES-TERM-02
  assignedOperator: string;   // e.g. Heri Kurniawan
  targetQty: number;
  goodQty: number;            // Hasil bagus
  scrapQty: number;           // Hasil reject
  standardCycleMinutes: number; // Standar per unit (menit)
  actualDurationMinutes: number; // Waktu aktual akumulasi
  status: OperationStatus;
  startedAt?: string;
  finishedAt?: string;
  notes: string;
}

export type ProductionModuleTab = 'bom' | 'jobs' | 'operations';
