/**
 * Global application context for managing quiz state
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Question, UserAnswer } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  submitAnswer: (questionId: number, selectedAnswer: string) => void;
}

type AppAction =
  | { type: 'START_QUIZ'; payload: { questions: Question[] } }
  | { type: 'SUBMIT_ANSWER'; payload: UserAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_QUIZ' };

/**
 * Load user answers from localStorage
 */
const loadUserAnswersFromStorage = (): UserAnswer[] => {
  try {
    const stored = localStorage.getItem('gcp-quiz-answers');
    return stored ? JSON.parse(stored).map((answer: any) => ({
      ...answer,
      timestamp: new Date(answer.timestamp)
    })) : [];
  } catch (error) {
    console.error('Error loading user answers from storage:', error);
    return [];
  }
};

/**
 * Save user answers to localStorage
 */
const saveUserAnswersToStorage = (answers: UserAnswer[]) => {
  try {
    localStorage.setItem('gcp-quiz-answers', JSON.stringify(answers));
  } catch (error) {
    console.error('Error saving user answers to storage:', error);
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        questions: action.payload.questions,
        currentQuestionIndex: 0,
        userAnswers: [],
        quizStarted: true,
        quizCompleted: false
      };

    case 'SUBMIT_ANSWER': {
      const newAnswers = [...state.userAnswers, action.payload];
      saveUserAnswersToStorage(newAnswers);
      return {
        ...state,
        userAnswers: newAnswers
      };
    }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      };

    case 'FINISH_QUIZ':
      return {
        ...state,
        quizCompleted: true
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  
  const [state, dispatch] = useReducer(appReducer, {
    questions: [],
    userAnswers: loadUserAnswersFromStorage(),
    currentQuestionIndex: 0,
    quizStarted: false,
    quizCompleted: false
  });

  const submitAnswer = (questionId: number, selectedAnswer: string) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswer === selectedAnswer;
    
    const userAnswer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timestamp: new Date()
    };
    
    dispatch({ type: 'SUBMIT_ANSWER', payload: userAnswer });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      submitAnswer
    }}>
      {children}
    </AppContext.Provider>
  );
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
