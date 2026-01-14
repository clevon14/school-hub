import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Teacher, TeacherFormData } from "@/types/teacher";

const STORAGE_KEY = "school_teachers";

const mockTeachers: Teacher[] = [
  { id: 1, schoolId: 1, name: "Dr. Anjali Verma", email: "anjali.v@school.com", phone: "9876543220", subject: "Mathematics", qualification: "Ph.D. Mathematics" },
  { id: 2, schoolId: 1, name: "Mr. Sunil Mehta", email: "sunil.m@school.com", phone: "9876543221", subject: "Science", qualification: "M.Sc. Physics" },
  { id: 3, schoolId: 1, name: "Mrs. Kavita Reddy", email: "kavita.r@school.com", phone: "9876543222", subject: "English", qualification: "M.A. English" },
  { id: 4, schoolId: 1, name: "Mr. Arun Gupta", email: "arun.g@school.com", phone: "9876543223", subject: "Hindi", qualification: "M.A. Hindi" },
  { id: 5, schoolId: 1, name: "Ms. Deepa Nair", email: "deepa.n@school.com", phone: "9876543224", subject: "Social Studies", qualification: "M.A. History" },
];

function getFromStorage(): Teacher[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTeachers));
    return mockTeachers;
  }
  return JSON.parse(data);
}

function saveToStorage(teachers: Teacher[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
}

export const teacherService = {
  async getAll(): Promise<Teacher[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Teacher[]>("/teachers");
    }
    return getFromStorage();
  },

  async getById(id: number): Promise<Teacher | undefined> {
    if (env.IS_API_ENABLED) {
      return api.get<Teacher>(`/teachers/${id}`);
    }
    const teachers = getFromStorage();
    return teachers.find((t) => t.id === id);
  },

  async create(data: TeacherFormData): Promise<Teacher> {
    if (env.IS_API_ENABLED) {
      return api.post<Teacher>("/teachers", data);
    }
    const teachers = getFromStorage();
    const newTeacher: Teacher = {
      id: Math.max(0, ...teachers.map((t) => t.id)) + 1,
      schoolId: 1,
      ...data,
    };
    teachers.push(newTeacher);
    saveToStorage(teachers);
    return newTeacher;
  },

  async update(id: number, data: Partial<TeacherFormData>): Promise<Teacher> {
    if (env.IS_API_ENABLED) {
      return api.put<Teacher>(`/teachers/${id}`, data);
    }
    const teachers = getFromStorage();
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Teacher not found");
    teachers[index] = { ...teachers[index], ...data };
    saveToStorage(teachers);
    return teachers[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/teachers/${id}`);
      return;
    }
    const teachers = getFromStorage();
    const filtered = teachers.filter((t) => t.id !== id);
    saveToStorage(filtered);
  },
};
