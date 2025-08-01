/**
 * Authentication context for managing user login, registration, and profile
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'INCREMENT_STREAK' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'UPDATE_PROFILE':
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem('gcp_user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    
    case 'ADD_XP':
      if (!state.user) return state;
      const newXP = state.user.xp + action.payload;
      const newLevel = Math.floor(newXP / 100) + 1;
      const userWithXP = { ...state.user, xp: newXP, level: newLevel };
      localStorage.setItem('gcp_user', JSON.stringify(userWithXP));
      return { ...state, user: userWithXP };
    
    case 'INCREMENT_STREAK':
      if (!state.user) return state;
      const userWithStreak = { ...state.user, streak: state.user.streak + 1 };
      localStorage.setItem('gcp_user', JSON.stringify(userWithStreak));
      return { ...state, user: userWithStreak };
    
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gcp_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('gcp_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation - in real app, this would be server-side
    const savedUsers = JSON.parse(localStorage.getItem('gcp_users') || '[]');
    const user = savedUsers.find((u: any) => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('gcp_user', JSON.stringify(userWithoutPassword));
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
      return true;
    } else {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validation
    if (data.password !== data.confirmPassword) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }

    const savedUsers = JSON.parse(localStorage.getItem('gcp_users') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === data.email);

    if (existingUser) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      avatar: `https://pub-cdn.sider.ai/u/U005H3JLKO4/web-coder/688b04f2088b7577affe1214/resource/aeb79e84-7c78-4359-9ee9-38fdfe82969e.jpg`,
      joinDate: new Date(),
      totalQuizzes: 0,
      totalCorrect: 0,
      totalTime: 0,
      level: 1,
      xp: 0,
      streak: 0,
      achievements: ['🎓 Welcome to GCP Learning!'],
    };

    // Save to users list
    savedUsers.push({ ...newUser, password: data.password });
    localStorage.setItem('gcp_users', JSON.stringify(savedUsers));

    // Login user
    localStorage.setItem('gcp_user', JSON.stringify(newUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('gcp_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  const addXP = (amount: number) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const incrementStreak = () => {
    dispatch({ type: 'INCREMENT_STREAK' });
  };

  return (
    <AuthContext.Provider value={{
      state,
      login,
      register,
      logout,
      updateProfile,
      addXP,
      incrementStreak,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
