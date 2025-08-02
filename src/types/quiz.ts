export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  source?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}

export interface QuizSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  mode: 'practice' | 'exam' | 'review';
  timeLimit?: number;
  questions: Question[];
  answers: UserAnswer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  score?: number;
  settings: QuizSettings;
}

export interface QuizSettings {
  theme: 'light' | 'dark' | 'auto';
  showExplanations: boolean;
  showTimer: boolean;
  autoAdvance: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  questionsPerSession: number;
  enableSound: boolean;
}

export interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTimePerQuestion: number;
  categoryPerformance: Record<string, CategoryStats>;
  difficultyPerformance: Record<string, DifficultyStats>;
  recentSessions: QuizSession[];
  improvementTrend: number[];
}

export interface CategoryStats {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}

export interface DifficultyStats {
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}

export interface BookmarkedQuestion {
  questionId: string;
  questionNumber: number;
  text: string;
  source: string;
  timestamp: Date;
  notes?: string;
}

export interface ExamMode {
  timeLimit: number;
  questionsCount: number;
  showResults: boolean;
  allowReview: boolean;
  randomizeQuestions: boolean;
}

export type QuizMode = 'practice' | 'exam' | 'review' | 'difficult';

export interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}