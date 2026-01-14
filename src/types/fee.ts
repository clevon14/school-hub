export type PaymentMode = "Cash" | "UPI" | "Bank";

export interface Fee {
  id: number;
  studentId: number;
  studentName?: string;
  amount: number;
  paidOn?: string;
  mode?: PaymentMode;
  status: "pending" | "paid";
  dueDate?: string;
  description?: string;
}

export interface FeeFormData {
  studentId: number;
  amount: number;
  dueDate?: string;
  description?: string;
}

export interface FeeSummary {
  totalDues: number;
  totalCollected: number;
  pendingCount: number;
  paidCount: number;
}
