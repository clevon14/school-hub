export interface Teacher {
  id: number;
  schoolId: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  qualification?: string;
}

export interface TeacherFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  qualification?: string;
}
