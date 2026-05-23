// ─── Auth ───
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender: 'male' | 'female';
  role: 'student' | 'teacher' | 'admin';
  field_id: number | null;
  subject_id: number | null;
  field?: Field | null;
  subject?: SubjectShort | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  gender: 'male' | 'female';
  role: 'student' | 'teacher';
  field_id?: number;
  subject_id?: number;
}

// ─── Fields ───
export interface Field {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  subjects?: SubjectShort[];
}

export interface SubjectShort {
  id: number;
  name: string;
}

// ─── Subjects & Topics ───
export interface Subject {
  id: number;
  name: string;
  description: string | null;
  topics_count: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  subject_id: number;
  title: string;
  content?: string;
  order_num: number;
  subject?: SubjectShort;
}

// ─── Quiz ───
export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizStartResponse {
  topic: { id: number; title: string };
  questions: Question[];
}

export interface QuizAnswer {
  question_id: number;
  selected_answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizSubmitPayload {
  topic_id: number;
  answers: QuizAnswer[];
}

export interface DiagnosisItem {
  question: string;
  student_answer: string;
  correct_answer: string;
  misconception: string;
  why_student_chose: string;
  correct_reasoning: string;
  tip: string;
}

export interface QuizSubmitResponse {
  attempt_id: number;
  score: number;
  total: number;
  percentage: number;
  diagnosis: DiagnosisItem[] | null;
}

export interface QuizAttempt {
  id: number;
  topic_id: number;
  score: number;
  total: number;
  percentage?: number;
  completed_at: string | null;
  topic?: { id: number; title: string; subject_id?: number };
  answers?: QuizAttemptAnswer[];
  diagnosis?: DiagnosisItem[] | null;
}

export interface QuizAttemptAnswer {
  id: number;
  question_id: number;
  selected_answer: string;
  is_correct: boolean;
  question?: Question & { correct_answer: string; explanation: string | null };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─── Dashboard ───
export interface SubjectProgress {
  subject_id: number;
  subject_name: string;
  total_topics: number;
  completed_topics: number;
  avg_score: number;
  percentage: number;
  topics?: TopicProgress[];
}

export interface TopicProgress {
  topic_id: number;
  topic_title: string;
  status: 'new' | 'in_progress' | 'completed';
  best_score: number | null;
  attempts_count: number;
}

export interface Recommendation {
  topic_id: number;
  topic_title: string;
  subject_name: string;
  best_score: number | null;
  reason: string;
}

export interface StreakDay {
  date: string;
  active: boolean;
  quizzes_done: number;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  today_done: boolean;
  calendar: StreakDay[];
}

export interface DashboardData {
  total_quizzes: number;
  avg_score: number;
  current_streak: number;
  longest_streak: number;
  today_done: boolean;
  days_until_dtm: number;
  subjects_progress: SubjectProgress[];
  recommendations: Recommendation[];
  recent_attempts: QuizAttempt[];
  streak_calendar: StreakDay[];
}

// ─── Chat ───
export interface ChatSession {
  id: number;
  subject_id: number | null;
  title: string;
  created_at: string;
  updated_at: string;
  subject?: SubjectShort | null;
  messages_count?: number;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: number;
  chat_session_id: number;
  role: 'user' | 'ai';
  content: string;
  sources: string[] | null;
  created_at: string;
}

export interface ChatAskResponse {
  user_message: ChatMessage;
  ai_message: ChatMessage;
}

export interface TutorAskResponse {
  answer: string;
  sources: string[];
}

// ─── Feynman ───
export interface FeynmanResponse {
  score: number;
  correct: string[];
  wrong: string[];
  missing: string[];
  feedback: string;
}

// ─── Profile ───
export interface ProfileResponse {
  user: User;
  stats: {
    total_quizzes: number;
    avg_score: number;
    current_streak: number;
    longest_streak: number;
  };
}
