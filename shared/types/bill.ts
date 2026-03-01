// shared/types/bill.ts

export interface Bill {
  rowIndex: number;
  billNumber: string;
  term: number | null;
  serialNumber: number | null;
  submittedAt: string;
  proposingEntity: string;
  proposerName: string;
  contactName: string;
  billType: string;
  subject: string;
  description: string;
  proposedAction: string;
  attachments: string[];
  scheduledSession: string;
}

export interface BillResponse {
  cachedAt: string;
  data: Bill[];
}

export interface BillApiResponse {
  bills: Bill[];
}