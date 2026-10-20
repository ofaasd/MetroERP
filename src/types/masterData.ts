export type MasterStatus = 'ACTIVE' | 'INACTIVE';

// -------------------------------------------------------------
// 1. ATOMIC MASTER ENTITIES
// -------------------------------------------------------------

// 1. Items
export type ItemCategory = 
  | 'RAW_MATERIAL' 
  | 'COMPONENT' 
  | 'FINISHED_GOOD' 
  | 'SUB_ASSEMBLY' 
  | 'CONSUMABLE' 
  | 'PACKAGING';

export interface MasterItem {
  id: string;
  code: string;               // e.g. ITM-STL-002
  name: string;
  category: ItemCategory;
  baseUom: string;            // e.g. Pcs, Lembar, Batang, Kg
  standardCost: number;       // HPP (IDR)
  salesPrice: number;         // Harga Jual (IDR)
  isMesTracked: boolean;      // True jika material dipakai dalam routing SPK/MES
  barcode: string;
  status: MasterStatus;
  description: string;
}

// 2. UOM (Unit of Measure)
export type UomCategory = 'QUANTITY' | 'WEIGHT' | 'LENGTH' | 'AREA' | 'VOLUME' | 'PACKAGING';

export interface MasterUom {
  id: string;
  code: string;               // e.g. PCS, BOX, MTR, LBR, BTG, KG, ROL, SET, PLT
  name: string;               // e.g. Pieces, Box, Meter, Lembar, Batang, Kilogram
  category: UomCategory;
  symbol: string;             // e.g. pcs, bx, m, lbr, btg, kg
  isBase: boolean;
  status: MasterStatus;
  description: string;
}

// 3. Warehouse
export interface MasterWarehouse {
  id: string;
  code: string;               // e.g. WH-RAW-01, WH-FG-01, WH-SPARE
  name: string;               // e.g. Gudang Utama Bahan Baku
  branch: string;             // e.g. Plant 2 Cikarang Pusat
  managerPic: string;         // e.g. Hendra Gunawan
  phone: string;
  capacity: string;           // e.g. 1,500 Pallet / 3,000 Ton
  address: string;
  status: MasterStatus;
  notes: string;
}

// 4. Location
export type LocationType = 
  | 'STAGING_MES' 
  | 'STORAGE_BIN' 
  | 'RECEIVING' 
  | 'DISPATCH' 
  | 'QUARANTINE';

export interface MasterLocation {
  id: string;
  code: string;               // e.g. LOC-STG-CNC, LOC-BIN-A01
  name: string;
  warehouseCode: string;      // e.g. WH-RAW-01
  zone: string;               // e.g. Lantai 1 Sektor Barat
  type: LocationType;
  capacity: string;           // e.g. 50 Pallet
  currentOccupancyPercent: number; // 0-100%
  status: MasterStatus;
  notes: string;
}

// 5. Work Center
export type WorkCenterDepartment = 
  | 'MACHINING' 
  | 'FABRICATION' 
  | 'WELDING' 
  | 'ASSEMBLY' 
  | 'FINISHING' 
  | 'QUALITY_CONTROL';

export interface MasterWorkCenter {
  id: string;
  code: string;               // e.g. WC-CNC-01, WC-CUT-01
  name: string;
  department: WorkCenterDepartment;
  workCenterType: 'MACHINE' | 'MANUAL_STATION' | 'AUTOMATED_LINE' | 'WORK_CELL';
  capacityPerHour: number;
  capacityUom: string;        // Part/Jam, Lembar/Jam, Unit/Jam
  efficiencyTargetPercent: number; // Target OEE e.g. 95%
  standardHourlyRate: number; // Biaya Beban Mesin/Jam IDR
  status: 'AVAILABLE' | 'RUNNING' | 'MAINTENANCE' | 'OFFLINE';
  description: string;
}

// 6. Resources
export type ResourceType = 'MACHINE' | 'OPERATOR' | 'TOOL_EQUIPMENT' | 'MES_TERMINAL';

export interface MasterResource {
  id: string;
  code: string;               // e.g. RES-MAZAK-530, RES-OP-BUDI, RES-TERM-01
  name: string;               // e.g. Mesin CNC Mazak VCN-530C, Terminal MES-01
  resourceType: ResourceType;
  identifierNo: string;       // Serial No / NIK Karyawan / IP Terminal
  specification: string;      // e.g. 4-Axis Vertical Spindle 12000 RPM
  hourlyCost: number;         // IDR / Jam
  leadOperatorPic: string;    // PIC Teknisi
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  notes: string;
}

// 7. Customer
export interface MasterCustomer {
  id: string;
  code: string;               // e.g. CUST-AST-001
  name: string;
  industry: string;           // e.g. Automotive OEM
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  npwp: string;
  paymentTerms: 'COD' | 'NET_14' | 'NET_30' | 'NET_45' | 'NET_60' | 'ADVANCE';
  creditLimit: number;        // IDR
  status: MasterStatus;
  notes: string;
}

// 8. Vendors
export interface MasterVendor {
  id: string;
  code: string;               // e.g. VEN-KRAK-001
  name: string;
  supplyCategory: string;     // e.g. Raw Material Steel, Inverter & PLC
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  npwp: string;
  paymentTerms: 'COD' | 'NET_14' | 'NET_30' | 'NET_45' | 'NET_60' | 'ADVANCE';
  bankAccount: string;
  status: MasterStatus;
  notes: string;
}

// -------------------------------------------------------------
// 2. RELATION / MAPPING MASTER DATA
// -------------------------------------------------------------

// Relation A: Items - Warehouse (Item berada di warehouse mana saja)
export interface RelationItemWarehouse {
  id: string;
  itemCode: string;
  itemName: string;
  warehouseCode: string;
  warehouseName: string;
  defaultLocationCode: string;
  stockOnHand: number;
  minSafetyStock: number;
  maxStock: number;
  status: MasterStatus;
  notes: string;
}

// Relation B: Item - UOM (Item memiliki list UOM apa saja & konversi)
export interface RelationItemUom {
  id: string;
  itemCode: string;
  itemName: string;
  uomCode: string;
  uomName: string;
  isBaseUom: boolean;
  conversionFactor: number;   // 1 UOM ini = X Base UOM (e.g. 1 Box = 24 Pcs)
  uomType: 'BASE' | 'PURCHASE' | 'SALES' | 'PACKAGING';
  barcode: string;
  status: MasterStatus;
}

// Relation C: Work Center - Resource (Work center menggunakan resource/mesin/terminal apa saja)
export interface RelationWorkCenterResource {
  id: string;
  workCenterCode: string;
  workCenterName: string;
  resourceCode: string;
  resourceName: string;
  resourceType: ResourceType;
  isPrimary: boolean;
  allocationPercent: number;  // 0-100%
  status: MasterStatus;
  notes: string;
}

// Relation D: Item - Vendor (Item disuplai oleh vendor mana saja)
export interface RelationItemVendor {
  id: string;
  itemCode: string;
  itemName: string;
  vendorCode: string;
  vendorName: string;
  vendorItemCode: string;
  leadTimeDays: number;
  lastPurchasePrice: number;
  isPreferredVendor: boolean;
  status: MasterStatus;
}

// Type enumerator for UI active subtabs
export type MasterModuleTab = 
  // Atomic Entities
  | 'items'
  | 'uom'
  | 'warehouse'
  | 'location'
  | 'workcenter'
  | 'resources'
  | 'customer'
  | 'vendors'
  // Relations
  | 'rel_item_warehouse'
  | 'rel_item_uom'
  | 'rel_wc_resource'
  | 'rel_item_vendor';
