export interface Student {
  id: number;
  schoolId: number;
  admissionNo: string;
  name: string;
  dob?: string;
  parentName?: string;
  phone?: string;
  class?: string;
}

export interface StudentFormData {
  admissionNo: string;
  name: string;
  dob?: string;
  parentName?: string;
  phone?: string;
  class?: string;
}
