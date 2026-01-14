import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Fee, FeeFormData, FeeSummary, PaymentMode } from "@/types/fee";
import { studentService } from "./studentService";

const STORAGE_KEY = "school_fees";

const mockFees: Fee[] = [
  { id: 1, studentId: 1, amount: 15000, status: "paid", paidOn: "2024-04-10", mode: "UPI", description: "Term 1 Fee" },
  { id: 2, studentId: 2, amount: 15000, status: "pending", dueDate: "2024-04-30", description: "Term 1 Fee" },
  { id: 3, studentId: 3, amount: 12000, status: "paid", paidOn: "2024-04-15", mode: "Bank", description: "Term 1 Fee" },
  { id: 4, studentId: 4, amount: 12000, status: "pending", dueDate: "2024-05-15", description: "Term 1 Fee" },
  { id: 5, studentId: 5, amount: 15000, status: "paid", paidOn: "2024-04-05", mode: "Cash", description: "Term 1 Fee" },
];

function getFromStorage(): Fee[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFees));
    return mockFees;
  }
  return JSON.parse(data);
}

function saveToStorage(fees: Fee[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));
}

export const feeService = {
  async getAll(): Promise<Fee[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Fee[]>("/fees");
    }
    const fees = getFromStorage();
    const students = await studentService.getAll();
    return fees.map((f) => ({
      ...f,
      studentName: students.find((s) => s.id === f.studentId)?.name,
    }));
  },

  async getPending(): Promise<Fee[]> {
    const fees = await this.getAll();
    return fees.filter((f) => f.status === "pending");
  },

  async getPaid(): Promise<Fee[]> {
    const fees = await this.getAll();
    return fees.filter((f) => f.status === "paid");
  },

  async getByStudent(studentId: number): Promise<Fee[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Fee[]>(`/fees/student/${studentId}`);
    }
    const fees = getFromStorage();
    return fees.filter((f) => f.studentId === studentId);
  },

  async getSummary(): Promise<FeeSummary> {
    const fees = await this.getAll();
    const pending = fees.filter((f) => f.status === "pending");
    const paid = fees.filter((f) => f.status === "paid");
    return {
      totalDues: pending.reduce((sum, f) => sum + f.amount, 0),
      totalCollected: paid.reduce((sum, f) => sum + f.amount, 0),
      pendingCount: pending.length,
      paidCount: paid.length,
    };
  },

  async create(data: FeeFormData): Promise<Fee> {
    if (env.IS_API_ENABLED) {
      return api.post<Fee>("/fees", data);
    }
    const fees = getFromStorage();
    const newFee: Fee = {
      id: Math.max(0, ...fees.map((f) => f.id)) + 1,
      ...data,
      status: "pending",
    };
    fees.push(newFee);
    saveToStorage(fees);
    return newFee;
  },

  async recordPayment(id: number, mode: PaymentMode): Promise<Fee> {
    if (env.IS_API_ENABLED) {
      return api.post<Fee>(`/fees/${id}/pay`, { mode });
    }
    const fees = getFromStorage();
    const index = fees.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("Fee not found");
    fees[index] = {
      ...fees[index],
      status: "paid",
      paidOn: new Date().toISOString().split("T")[0],
      mode,
    };
    saveToStorage(fees);
    return fees[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/fees/${id}`);
      return;
    }
    const fees = getFromStorage();
    const filtered = fees.filter((f) => f.id !== id);
    saveToStorage(filtered);
  },
};
