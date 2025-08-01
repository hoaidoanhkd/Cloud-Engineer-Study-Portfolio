/**
 * Global application context for managing quiz state and statistics
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Question, UserAnswer, Portfolio, KeywordStats } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  submitAnswer: (questionId: number, selectedAnswer: string) => void;
  updatePortfolio: (keywords: string[], isCorrect: boolean) => void;
  getKeywordHeatmapData: () => any[];
}

type AppAction =
  | { type: 'START_QUIZ'; payload: { questions: Question[] } }
  | { type: 'SUBMIT_ANSWER'; payload: UserAnswer }
  | { type: 'UPDATE_PORTFOLIO'; payload: { keywords: string[]; isCorrect: boolean } }
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
 * Load portfolio from localStorage
 */
const loadPortfolioFromStorage = (): Portfolio => {
  try {
    const stored = localStorage.getItem('gcp-quiz-portfolio');
    if (stored) {
      const portfolio = JSON.parse(stored);
      // Convert date strings back to Date objects
      Object.keys(portfolio).forEach(key => {
        if (portfolio[key].lastUpdated) {
          portfolio[key].lastUpdated = new Date(portfolio[key].lastUpdated);
        }
      });
      return portfolio;
    }
    return {};
  } catch (error) {
    console.error('Error loading portfolio from storage:', error);
    return {};
  }
};

/**
 * Load keyword stats from localStorage
 */
const loadKeywordStatsFromStorage = (): KeywordStats => {
  try {
    const stored = localStorage.getItem('gcp-quiz-keyword-stats');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading keyword stats from storage:', error);
    return {};
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

/**
 * Save portfolio to localStorage
 */
const savePortfolioToStorage = (portfolio: Portfolio) => {
  try {
    localStorage.setItem('gcp-quiz-portfolio', JSON.stringify(portfolio));
  } catch (error) {
    console.error('Error saving portfolio to storage:', error);
  }
};

/**
 * Save keyword stats to localStorage
 */
const saveKeywordStatsToStorage = (stats: KeywordStats) => {
  try {
    localStorage.setItem('gcp-quiz-keyword-stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving keyword stats to storage:', error);
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        currentQuiz: {
          questions: action.payload.questions,
          currentIndex: 0,
          answers: [],
          startTime: new Date()
        }
      };

    case 'SUBMIT_ANSWER':
      const updatedAnswers = [...state.userAnswers];
      const existingIndex = updatedAnswers.findIndex(a => a.questionId === action.payload.questionId);
      
      if (existingIndex >= 0) {
        updatedAnswers[existingIndex] = action.payload;
      } else {
        updatedAnswers.push(action.payload);
      }
      
      saveUserAnswersToStorage(updatedAnswers);
      
      return {
        ...state,
        userAnswers: updatedAnswers,
        currentQuiz: state.currentQuiz ? {
          ...state.currentQuiz,
          answers: [...state.currentQuiz.answers, action.payload]
        } : null
      };

    case 'UPDATE_PORTFOLIO':
      const { keywords, isCorrect } = action.payload;
      const updatedPortfolio = { ...state.portfolio };
      
      keywords.forEach(keyword => {
        if (!updatedPortfolio[keyword]) {
          updatedPortfolio[keyword] = {
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            lastUpdated: new Date()
          };
        }
        
        updatedPortfolio[keyword].totalQuestions++;
        if (isCorrect) {
          updatedPortfolio[keyword].correctAnswers++;
        }
        updatedPortfolio[keyword].accuracy = 
          (updatedPortfolio[keyword].correctAnswers / updatedPortfolio[keyword].totalQuestions) * 100;
        updatedPortfolio[keyword].lastUpdated = new Date();
      });
      
      savePortfolioToStorage(updatedPortfolio);
      
      return {
        ...state,
        portfolio: updatedPortfolio
      };

    case 'NEXT_QUESTION':
      if (!state.currentQuiz) return state;
      
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          currentIndex: state.currentQuiz.currentIndex + 1
        }
      };

    case 'FINISH_QUIZ':
      return {
        ...state,
        currentQuiz: null
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  
  const [state, dispatch] = useReducer(appReducer, {
    questions: [],
    userAnswers: loadUserAnswersFromStorage(),
    portfolio: loadPortfolioFromStorage(),
    keywordStats: loadKeywordStatsFromStorage(),
    currentQuiz: null
  });

  const submitAnswer = (questionId: number, selectedAnswer: string) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correct_answer === selectedAnswer;
    
    const userAnswer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timestamp: new Date()
    };

    dispatch({ type: 'SUBMIT_ANSWER', payload: userAnswer });
    
    // Update portfolio with question keywords
    if (question.keywords && Array.isArray(question.keywords)) {
      dispatch({ 
        type: 'UPDATE_PORTFOLIO', 
        payload: { keywords: question.keywords, isCorrect } 
      });
    }
  };

  const updatePortfolio = (keywords: string[], isCorrect: boolean) => {
    dispatch({ type: 'UPDATE_PORTFOLIO', payload: { keywords, isCorrect } });
  };

  const getKeywordHeatmapData = () => {
    return Object.entries(state.portfolio).map(([keyword, stats]) => ({
      keyword,
      totalQuestions: stats.totalQuestions,
      correctAnswers: stats.correctAnswers,
      accuracy: stats.accuracy,
      lastUpdated: stats.lastUpdated
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      submitAnswer,
      updatePortfolio,
      getKeywordHeatmapData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
