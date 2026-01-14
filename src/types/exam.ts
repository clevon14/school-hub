export interface Exam {
  id: number;
  schoolId: number;
  name: string;
  date: string;
  classId: number;
  subjectId: number;
  maxMarks: number;
}

export interface ExamFormData {
  name: string;
  date: string;
  classId: number;
  subjectId: number;
  maxMarks: number;
}
