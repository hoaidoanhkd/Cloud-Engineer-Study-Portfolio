/**
 * Type definitions for GCP learning application
 */

export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at?: Date;
  updated_at?: Date;
  status?: 'active' | 'inactive' | 'draft';
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface KeywordStats {
  [keyword: string]: {
    [date: string]: number; // số lần trả lời sai
  };
}

export interface Portfolio {
  [keyword: string]: {
    credit: number;
    growth: number; // % tăng trưởng
    lastUpdated: Date;
  };
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  weakKeywords: string[];
}

export interface AppState {
  questions: Question[];
  userAnswers: UserAnswer[];
  keywordStats: KeywordStats;
  portfolio: Portfolio;
  currentQuiz: {
    questions: Question[];
    currentIndex: number;
    startTime: Date | null;
    answers: UserAnswer[];
  } | null;
}
