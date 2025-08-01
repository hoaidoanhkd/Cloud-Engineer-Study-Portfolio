/**
 * Authentication and user management type definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinDate: Date;
  totalQuizzes: number;
  totalCorrect: number;
  totalTime: number; // in minutes
  level: number;
  xp: number;
  streak: number; // consecutive days
  achievements: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
