export interface Mark {
  id: number;
  examId: number;
  studentId: number;
  marksObtained: number;
  grade?: string;
  studentName?: string;
  examName?: string;
  subjectName?: string;
  maxMarks?: number;
}

export interface MarkFormData {
  examId: number;
  studentId: number;
  marksObtained: number;
}
