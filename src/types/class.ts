export interface Class {
  id: number;
  schoolId: number;
  name: string;
  section: string;
  teacherId?: number;
  studentCount?: number;
}

export interface ClassFormData {
  name: string;
  section: string;
  teacherId?: number;
}
