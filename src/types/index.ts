/**
 * Type definitions for GCP learning application
 */

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'radio' | 'checkbox';
  topic?: string;
  keywords?: string[];
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
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    lastUpdated: Date;
  };
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
