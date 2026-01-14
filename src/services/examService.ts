import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Exam, ExamFormData } from "@/types/exam";

const STORAGE_KEY = "school_exams";

const mockExams: Exam[] = [
  { id: 1, schoolId: 1, name: "Mid-Term Exam", date: "2024-09-15", classId: 1, subjectId: 1, maxMarks: 100 },
  { id: 2, schoolId: 1, name: "Mid-Term Exam", date: "2024-09-16", classId: 1, subjectId: 2, maxMarks: 100 },
  { id: 3, schoolId: 1, name: "Final Exam", date: "2024-03-15", classId: 3, subjectId: 1, maxMarks: 100 },
];

function getFromStorage(): Exam[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockExams));
    return mockExams;
  }
  return JSON.parse(data);
}

function saveToStorage(exams: Exam[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
}

export const examService = {
  async getAll(): Promise<Exam[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Exam[]>("/exams");
    }
    return getFromStorage();
  },

  async getById(id: number): Promise<Exam | undefined> {
    if (env.IS_API_ENABLED) {
      return api.get<Exam>(`/exams/${id}`);
    }
    const exams = getFromStorage();
    return exams.find((e) => e.id === id);
  },

  async create(data: ExamFormData): Promise<Exam> {
    if (env.IS_API_ENABLED) {
      return api.post<Exam>("/exams", data);
    }
    const exams = getFromStorage();
    const newExam: Exam = {
      id: Math.max(0, ...exams.map((e) => e.id)) + 1,
      schoolId: 1,
      ...data,
    };
    exams.push(newExam);
    saveToStorage(exams);
    return newExam;
  },

  async update(id: number, data: Partial<ExamFormData>): Promise<Exam> {
    if (env.IS_API_ENABLED) {
      return api.put<Exam>(`/exams/${id}`, data);
    }
    const exams = getFromStorage();
    const index = exams.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Exam not found");
    exams[index] = { ...exams[index], ...data };
    saveToStorage(exams);
    return exams[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/exams/${id}`);
      return;
    }
    const exams = getFromStorage();
    const filtered = exams.filter((e) => e.id !== id);
    saveToStorage(filtered);
  },
};
