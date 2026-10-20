export type InventorySubTab = 'material-engine' | 'misc-issue' | 'misc-receipt';

export type TransactionType = 
  | 'MISC_ISSUE' 
  | 'MISC_RECEIPT' 
  | 'WIP_ISSUE' 
  | 'WIP_RETURN' 
  | 'PO_RECEIPT' 
  | 'INTER_WH_TRANSFER' 
  | 'CYCLE_COUNT_ADJ';

export type TransactionStatus = 'POSTED' | 'PENDING' | 'REVERSED';

export interface MaterialTransaction {
  id: string;
  transactionNumber: string;
  timestamp: string;
  type: TransactionType;
  typeLabel: string;
  itemCode: string;
  itemName: string;
  category: string;
  warehouseCode: string;
  warehouseName: string;
  locationCode: string;
  destWarehouseCode?: string;
  destLocationCode?: string;
  direction: 'IN' | 'OUT' | 'TRANSFER';
  qty: number;
  uom: string;
  unitCost: number;
  totalCost: number;
  reasonCode: string;
  referenceDoc: string;
  operator: string;
  department?: string;
  costCenter?: string;
  status: TransactionStatus;
  notes?: string;
  lotBatchNo?: string;
}

export type MiscIssueReason = 
  | 'RND_TESTING' 
  | 'MAINTENANCE_MRO' 
  | 'SCRAP_DAMAGE' 
  | 'MARKETING_SAMPLE' 
  | 'SHRINKAGE_ADJ' 
  | 'INTERNAL_USE' 
  | 'REWORK_EXPENSE';

export interface MiscellaneousIssue {
  id: string;
  issueNumber: string;
  issueDate: string;
  reasonCode: MiscIssueReason;
  reasonLabel: string;
  costCenter: string;
  department: string;
  itemCode: string;
  itemName: string;
  warehouseCode: string;
  warehouseName: string;
  locationCode: string;
  availableStock: number;
  qty: number;
  uom: string;
  unitCost: number;
  totalAmount: number;
  requester: string;
  approvedBy: string;
  status: 'POSTED' | 'DRAFT' | 'APPROVED';
  notes: string;
  linkedTransactionId?: string;
}

export type MiscReceiptReason = 
  | 'INITIAL_BALANCE' 
  | 'SHOPFLOOR_RETURN' 
  | 'VENDOR_SAMPLE' 
  | 'PHYSICAL_SURPLUS' 
  | 'RECLAIMED_MATERIAL' 
  | 'INTERPLANT_GIFT';

export interface MiscellaneousReceipt {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  reasonCode: MiscReceiptReason;
  reasonLabel: string;
  offsetAccount: string;
  itemCode: string;
  itemName: string;
  warehouseCode: string;
  warehouseName: string;
  locationCode: string;
  qty: number;
  uom: string;
  unitCost: number;
  totalAmount: number;
  receivedBy: string;
  inspectedBy: string;
  vendorSource?: string;
  lotBatchNo?: string;
  expiryDate?: string;
  status: 'POSTED' | 'DRAFT' | 'VERIFIED';
  notes: string;
  linkedTransactionId?: string;
}
