/**
 * Authentication context for managing user login and profile
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

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
    
    try {
      // Simple mock authentication
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const user: User = {
          id: 1,
          email: credentials.email,
          name: 'Demo User',
          avatar: '/avatars/default.png',
          level: 1,
          xp: 0,
          streak: 0,
          joinDate: new Date(),
        };
        
        localStorage.setItem('gcp_user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simple mock registration
      const user: User = {
        id: Date.now(),
        email: data.email,
        name: data.name,
        avatar: '/avatars/default.png',
        level: 1,
        xp: 0,
        streak: 0,
        joinDate: new Date(),
      };
      
      localStorage.setItem('gcp_user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('gcp_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  return (
    <AuthContext.Provider value={{
      state,
      login,
      register,
      logout,
      updateProfile,
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
