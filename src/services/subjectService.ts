import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Subject, SubjectFormData } from "@/types/subject";

const STORAGE_KEY = "school_subjects";

const mockSubjects: Subject[] = [
  { id: 1, schoolId: 1, name: "Mathematics", code: "MATH" },
  { id: 2, schoolId: 1, name: "Science", code: "SCI" },
  { id: 3, schoolId: 1, name: "English", code: "ENG" },
  { id: 4, schoolId: 1, name: "Hindi", code: "HIN" },
  { id: 5, schoolId: 1, name: "Social Studies", code: "SST" },
];

function getFromStorage(): Subject[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSubjects));
    return mockSubjects;
  }
  return JSON.parse(data);
}

function saveToStorage(subjects: Subject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Subject[]>("/subjects");
    }
    return getFromStorage();
  },

  async getById(id: number): Promise<Subject | undefined> {
    if (env.IS_API_ENABLED) {
      return api.get<Subject>(`/subjects/${id}`);
    }
    const subjects = getFromStorage();
    return subjects.find((s) => s.id === id);
  },

  async create(data: SubjectFormData): Promise<Subject> {
    if (env.IS_API_ENABLED) {
      return api.post<Subject>("/subjects", data);
    }
    const subjects = getFromStorage();
    const newSubject: Subject = {
      id: Math.max(0, ...subjects.map((s) => s.id)) + 1,
      schoolId: 1,
      ...data,
    };
    subjects.push(newSubject);
    saveToStorage(subjects);
    return newSubject;
  },

  async update(id: number, data: Partial<SubjectFormData>): Promise<Subject> {
    if (env.IS_API_ENABLED) {
      return api.put<Subject>(`/subjects/${id}`, data);
    }
    const subjects = getFromStorage();
    const index = subjects.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Subject not found");
    subjects[index] = { ...subjects[index], ...data };
    saveToStorage(subjects);
    return subjects[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/subjects/${id}`);
      return;
    }
    const subjects = getFromStorage();
    const filtered = subjects.filter((s) => s.id !== id);
    saveToStorage(filtered);
  },
};
