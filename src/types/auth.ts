/**
 * Authentication and user management type definitions
 */

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  joinDate: Date;
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
