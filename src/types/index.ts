/**
 * Type definitions for GCP Quiz application
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

export interface AppState {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  quizStarted: boolean;
  quizCompleted: boolean;
}
