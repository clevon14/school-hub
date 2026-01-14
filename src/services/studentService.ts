import { api } from "@/lib/api";
import { env } from "@/config/env";
import type { Student, StudentFormData } from "@/types/student";

const STORAGE_KEY = "school_students";

const mockStudents: Student[] = [
  { id: 1, schoolId: 1, admissionNo: "2024001", name: "Rahul Kumar", dob: "2010-05-15", parentName: "Ramesh Kumar", phone: "9876543210", class: "10-A" },
  { id: 2, schoolId: 1, admissionNo: "2024002", name: "Priya Sharma", dob: "2010-08-22", parentName: "Suresh Sharma", phone: "9876543211", class: "10-A" },
  { id: 3, schoolId: 1, admissionNo: "2024003", name: "Amit Singh", dob: "2011-02-10", parentName: "Rajesh Singh", phone: "9876543212", class: "9-B" },
  { id: 4, schoolId: 1, admissionNo: "2024004", name: "Sneha Patel", dob: "2011-11-05", parentName: "Dinesh Patel", phone: "9876543213", class: "9-A" },
  { id: 5, schoolId: 1, admissionNo: "2024005", name: "Vikram Rao", dob: "2010-03-18", parentName: "Venkat Rao", phone: "9876543214", class: "10-B" },
];

function getFromStorage(): Student[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStudents));
    return mockStudents;
  }
  return JSON.parse(data);
}

function saveToStorage(students: Student[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export const studentService = {
  async getAll(): Promise<Student[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Student[]>("/students");
    }
    return getFromStorage();
  },

  async getById(id: number): Promise<Student | undefined> {
    if (env.IS_API_ENABLED) {
      return api.get<Student>(`/students/${id}`);
    }
    const students = getFromStorage();
    return students.find((s) => s.id === id);
  },

  async getByClass(className: string): Promise<Student[]> {
    if (env.IS_API_ENABLED) {
      return api.get<Student[]>("/students", { class: className });
    }
    const students = getFromStorage();
    return students.filter((s) => s.class === className);
  },

  async create(data: StudentFormData): Promise<Student> {
    if (env.IS_API_ENABLED) {
      return api.post<Student>("/students", data);
    }
    const students = getFromStorage();
    const newStudent: Student = {
      id: Math.max(0, ...students.map((s) => s.id)) + 1,
      schoolId: 1,
      ...data,
    };
    students.push(newStudent);
    saveToStorage(students);
    return newStudent;
  },

  async update(id: number, data: Partial<StudentFormData>): Promise<Student> {
    if (env.IS_API_ENABLED) {
      return api.put<Student>(`/students/${id}`, data);
    }
    const students = getFromStorage();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");
    students[index] = { ...students[index], ...data };
    saveToStorage(students);
    return students[index];
  },

  async delete(id: number): Promise<void> {
    if (env.IS_API_ENABLED) {
      await api.delete(`/students/${id}`);
      return;
    }
    const students = getFromStorage();
    const filtered = students.filter((s) => s.id !== id);
    saveToStorage(filtered);
  },
};
