import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Class, ClassFormData } from "@/types/class";

const STORAGE_KEY = "school_classes";

const mockClasses: Class[] = [
  { id: 1, schoolId: 1, name: "Class 9", section: "A", teacherId: 1, studentCount: 35 },
  { id: 2, schoolId: 1, name: "Class 9", section: "B", teacherId: 2, studentCount: 32 },
  { id: 3, schoolId: 1, name: "Class 10", section: "A", teacherId: 3, studentCount: 30 },
  { id: 4, schoolId: 1, name: "Class 10", section: "B", teacherId: 4, studentCount: 28 },
];

function getFromStorage(): Class[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockClasses));
    return mockClasses;
  }
  return JSON.parse(data);
}

function saveToStorage(classes: Class[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

export const classService = {
  async getAll(): Promise<Class[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Class[]>("/classes");
    }
    return getFromStorage();
  },

  async getById(id: number): Promise<Class | undefined> {
    if (env.IS_API_ENABLED) {
      return api.get<Class>(`/classes/${id}`);
    }
    const classes = getFromStorage();
    return classes.find((c) => c.id === id);
  },

  async create(data: ClassFormData): Promise<Class> {
    if (env.IS_API_ENABLED) {
      return api.post<Class>("/classes", data);
    }
    const classes = getFromStorage();
    const newClass: Class = {
      id: Math.max(0, ...classes.map((c) => c.id)) + 1,
      schoolId: 1,
      studentCount: 0,
      ...data,
    };
    classes.push(newClass);
    saveToStorage(classes);
    return newClass;
  },

  async update(id: number, data: Partial<ClassFormData>): Promise<Class> {
    if (env.IS_API_ENABLED) {
      return api.put<Class>(`/classes/${id}`, data);
    }
    const classes = getFromStorage();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Class not found");
    classes[index] = { ...classes[index], ...data };
    saveToStorage(classes);
    return classes[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/classes/${id}`);
      return;
    }
    const classes = getFromStorage();
    const filtered = classes.filter((c) => c.id !== id);
    saveToStorage(filtered);
  },
};
