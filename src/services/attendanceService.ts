import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Attendance, AttendanceFormData, AttendanceSummary } from "@/types/attendance";
import { studentService } from "./studentService";

const STORAGE_KEY = "school_attendance";

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const mockAttendance: Attendance[] = [
  { id: 1, studentId: 1, date: today, status: "present" },
  { id: 2, studentId: 2, date: today, status: "present" },
  { id: 3, studentId: 3, date: today, status: "absent" },
  { id: 4, studentId: 4, date: today, status: "late" },
  { id: 5, studentId: 5, date: today, status: "present" },
  { id: 6, studentId: 1, date: yesterday, status: "present" },
  { id: 7, studentId: 2, date: yesterday, status: "present" },
  { id: 8, studentId: 3, date: yesterday, status: "present" },
];

function getFromStorage(): Attendance[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAttendance));
    return mockAttendance;
  }
  return JSON.parse(data);
}

function saveToStorage(attendance: Attendance[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
}

export const attendanceService = {
  async getAll(): Promise<Attendance[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Attendance[]>("/attendance");
    }
    const attendance = getFromStorage();
    const students = await studentService.getAll();
    return attendance.map((a) => ({
      ...a,
      studentName: students.find((s) => s.id === a.studentId)?.name,
    }));
  },

  async getByDate(date: string): Promise<Attendance[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Attendance[]>("/attendance", { date });
    }
    const attendance = await this.getAll();
    return attendance.filter((a) => a.date === date);
  },

  async getByStudent(studentId: number): Promise<Attendance[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Attendance[]>(`/attendance/student/${studentId}`);
    }
    const attendance = getFromStorage();
    return attendance.filter((a) => a.studentId === studentId);
  },

  async getStudentSummary(studentId: number): Promise<AttendanceSummary> {
    const records = await this.getByStudent(studentId);
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const total = records.length;
    return {
      totalDays: total,
      presentDays: present,
      absentDays: absent,
      lateDays: late,
      percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    };
  },

  async create(data: AttendanceFormData): Promise<Attendance> {
    if (env.IS_API_ENABLED) {
      return api.post<Attendance>("/attendance", data);
    }
    const attendance = getFromStorage();
    // Check if record exists for this student and date
    const existing = attendance.find(
      (a) => a.studentId === data.studentId && a.date === data.date
    );
    if (existing) {
      return this.update(existing.id, data);
    }
    const newAttendance: Attendance = {
      id: Math.max(0, ...attendance.map((a) => a.id)) + 1,
      ...data,
    };
    attendance.push(newAttendance);
    saveToStorage(attendance);
    return newAttendance;
  },

  async update(id: number, data: Partial<AttendanceFormData>): Promise<Attendance> {
    if (env.IS_API_ENABLED) {
      return api.put<Attendance>(`/attendance/${id}`, data);
    }
    const attendance = getFromStorage();
    const index = attendance.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Attendance record not found");
    attendance[index] = { ...attendance[index], ...data };
    saveToStorage(attendance);
    return attendance[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/attendance/${id}`);
      return;
    }
    const attendance = getFromStorage();
    const filtered = attendance.filter((a) => a.id !== id);
    saveToStorage(filtered);
  },
};
