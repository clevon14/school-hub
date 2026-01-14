export type AttendanceStatus = "present" | "absent" | "late";

export interface Attendance {
  id: number;
  studentId: number;
  studentName?: string;
  date: string;
  status: AttendanceStatus;
  classId?: number;
}

export interface AttendanceFormData {
  studentId: number;
  date: string;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}
