
export interface Question {
  id: string;
  text: string; // HTML from ReactQuill
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
  createdAt: number;
}

export interface StudentInfo {
  regdNo: string;
  name: string;
  section: string;
  year: string;
  branch: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  student: StudentInfo;
  score: number;
  totalQuestions: number;
  submittedAt: number;
  violations: number; // For proctoring
}

export enum UserRole {
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}
