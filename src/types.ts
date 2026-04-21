export type Role = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  name: string;
  role: Role;
  class?: string;
  nis?: string;
}

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  created_by: string;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  duration: number; // in minutes
  created_by: string;
  created_at: string;
}

export interface ExamWithQuestions extends Exam {
  questions: Question[];
}

export interface Result {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  finished_at: string;
}

export interface Answer {
  id: string;
  user_id: string;
  exam_id: string;
  question_id: string;
  answer: string;
}
