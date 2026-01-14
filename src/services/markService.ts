import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Mark, MarkFormData } from "@/types/mark";
import { studentService } from "./studentService";

const STORAGE_KEY = "school_marks";

const mockMarks: Mark[] = [
  { id: 1, examId: 1, studentId: 1, marksObtained: 85, grade: "A" },
  { id: 2, examId: 1, studentId: 2, marksObtained: 92, grade: "A+" },
  { id: 3, examId: 2, studentId: 1, marksObtained: 78, grade: "B+" },
  { id: 4, examId: 2, studentId: 2, marksObtained: 88, grade: "A" },
];

function getFromStorage(): Mark[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMarks));
    return mockMarks;
  }
  return JSON.parse(data);
}

function saveToStorage(marks: Mark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

export const markService = {
  async getAll(): Promise<Mark[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Mark[]>("/marks");
    }
    return getFromStorage();
  },

  async getByExam(examId: number): Promise<Mark[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Mark[]>(`/marks/exam/${examId}`);
    }
    const marks = getFromStorage();
    const students = await studentService.getAll();
    return marks
      .filter((m) => m.examId === examId)
      .map((m) => ({
        ...m,
        studentName: students.find((s) => s.id === m.studentId)?.name,
      }));
  },

  async getByStudent(studentId: number): Promise<Mark[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Mark[]>(`/marks/student/${studentId}`);
    }
    const marks = getFromStorage();
    return marks.filter((m) => m.studentId === studentId);
  },

  async create(data: MarkFormData, maxMarks: number = 100): Promise<Mark> {
    if (env.IS_API_ENABLED) {
      return api.post<Mark>("/marks", data);
    }
    const marks = getFromStorage();
    const percentage = (data.marksObtained / maxMarks) * 100;
    const newMark: Mark = {
      id: Math.max(0, ...marks.map((m) => m.id)) + 1,
      ...data,
      grade: calculateGrade(percentage),
    };
    marks.push(newMark);
    saveToStorage(marks);
    return newMark;
  },

  async update(id: number, data: Partial<MarkFormData>, maxMarks: number = 100): Promise<Mark> {
    if (env.IS_API_ENABLED) {
      return api.put<Mark>(`/marks/${id}`, data);
    }
    const marks = getFromStorage();
    const index = marks.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Mark not found");
    const updatedMark = { ...marks[index], ...data };
    if (data.marksObtained !== undefined) {
      const percentage = (data.marksObtained / maxMarks) * 100;
      updatedMark.grade = calculateGrade(percentage);
    }
    marks[index] = updatedMark;
    saveToStorage(marks);
    return marks[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/marks/${id}`);
      return;
    }
    const marks = getFromStorage();
    const filtered = marks.filter((m) => m.id !== id);
    saveToStorage(filtered);
  },
};
