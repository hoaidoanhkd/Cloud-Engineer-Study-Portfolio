/**
 * Global application context for managing quiz state, portfolio, and statistics
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Question, UserAnswer, Portfolio, KeywordStats } from '../types';
import { mockQuestions } from '../data/mockData';
import { useAuth } from './AuthContext';
import '../data/demoUser'; // Initialize demo user
import { databaseService, DatabaseQuestion } from '../services/database';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  submitAnswer: (questionId: number, selectedAnswer: string) => void;
  updatePortfolio: (keywords: string[], isCorrect: boolean) => void;
  getKeywordHeatmapData: () => any[];
  // Question management functions
  addQuestions: (questions: Question[]) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: number) => void;
  refreshQuestions: () => Promise<void>;
}

type AppAction =
  | { type: 'START_QUIZ'; payload: { questions: Question[] } }
  | { type: 'SUBMIT_ANSWER'; payload: UserAnswer }
  | { type: 'UPDATE_PORTFOLIO'; payload: { keywords: string[]; isCorrect: boolean } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_QUIZ' }
  | { type: 'ADD_QUESTIONS'; payload: { questions: Question[] } }
  | { type: 'UPDATE_QUESTION'; payload: { question: Question } }
  | { type: 'DELETE_QUESTION'; payload: { questionId: number } }
  | { type: 'LOAD_QUESTIONS'; payload: { questions: Question[] } };

/**
 * Load questions from SQLite database
 */
const loadQuestionsFromDatabase = async (): Promise<Question[]> => {
  try {
    const dbQuestions = await databaseService.getAllQuestions();
    return dbQuestions
      .filter(q => q.question && q.options && q.correct_answer && q.topic) // Validate required fields
      .map((q: DatabaseQuestion) => ({
        ...q,
        keywords: Array.isArray(q.keywords) ? q.keywords : [],
        options: Array.isArray(q.options) ? q.options : [],
        created_at: new Date(q.created_at),
        updated_at: new Date(q.updated_at)
      }));
  } catch (error) {
    console.error('Error loading questions from database:', error);
    return mockQuestions;
  }
};

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
    const stored = localStorage.getItem('gcp-quiz-stats');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading keyword stats from storage:', error);
    return {};
  }
};

const initialState: AppState = {
  questions: [], // Will be loaded asynchronously
  userAnswers: loadUserAnswersFromStorage(),
  keywordStats: loadKeywordStatsFromStorage(),
  portfolio: loadPortfolioFromStorage(),
  currentQuiz: null,
};

/**
 * Save questions to localStorage
 */
const saveQuestionsToStorage = (questions: Question[]) => {
  try {
    localStorage.setItem('gcp-quiz-questions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions to storage:', error);
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
    localStorage.setItem('gcp-quiz-stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving keyword stats to storage:', error);
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        questions: action.payload.questions,
      };

    case 'ADD_QUESTIONS': {
      const newQuestions = [...state.questions, ...action.payload.questions];
      return {
        ...state,
        questions: newQuestions,
      };
    }

    case 'UPDATE_QUESTION': {
      const updatedQuestions = state.questions.map(q =>
        q.id === action.payload.question.id ? action.payload.question : q
      );
      return {
        ...state,
        questions: updatedQuestions,
      };
    }

    case 'DELETE_QUESTION': {
      const filteredQuestions = state.questions.filter(q => q.id !== action.payload.questionId);
      return {
        ...state,
        questions: filteredQuestions,
      };
    }

    case 'START_QUIZ':
      return {
        ...state,
        currentQuiz: {
          questions: action.payload.questions || [],
          currentIndex: 0,
          startTime: new Date(),
          answers: [],
        },
      };

    case 'SUBMIT_ANSWER':
      if (!state.currentQuiz) return state;
      
      const newAnswers = [...state.currentQuiz.answers, action.payload];
      const allUserAnswers = [...state.userAnswers, action.payload];
      saveUserAnswersToStorage(allUserAnswers);
      
      return {
        ...state,
        userAnswers: allUserAnswers,
        currentQuiz: {
          ...state.currentQuiz,
          answers: newAnswers,
        },
      };

    case 'NEXT_QUESTION':
      if (!state.currentQuiz) return state;
      
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          currentIndex: state.currentQuiz.currentIndex + 1,
        },
      };

    case 'UPDATE_PORTFOLIO':
      const { keywords, isCorrect } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      
      const newPortfolio = { ...state.portfolio };
      const newKeywordStats = { ...state.keywordStats };
      
      keywords.forEach(keyword => {
        // Update portfolio
        if (!newPortfolio[keyword]) {
          newPortfolio[keyword] = { credit: 100, growth: 0, lastUpdated: new Date() };
        }
        
        const multiplier = isCorrect ? 1.05 : 0.95;
        const oldCredit = newPortfolio[keyword].credit;
        newPortfolio[keyword].credit *= multiplier;
        newPortfolio[keyword].growth = ((newPortfolio[keyword].credit - oldCredit) / oldCredit) * 100;
        newPortfolio[keyword].lastUpdated = new Date();
        
        // Update keyword stats (only for wrong answers)
        if (!isCorrect) {
          if (!newKeywordStats[keyword]) {
            newKeywordStats[keyword] = {};
          }
          newKeywordStats[keyword][today] = (newKeywordStats[keyword][today] || 0) + 1;
        }
      });
      
      // Save to localStorage
      savePortfolioToStorage(newPortfolio);
      saveKeywordStatsToStorage(newKeywordStats);
      
      return {
        ...state,
        portfolio: newPortfolio,
        keywordStats: newKeywordStats,
      };

    case 'FINISH_QUIZ':
      return {
        ...state,
        currentQuiz: null,
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load questions from database on mount
  React.useEffect(() => {
    loadQuestionsFromDatabase()
      .then(questions => {
        dispatch({ type: 'LOAD_QUESTIONS', payload: { questions } });
      })
      .catch(error => {
        console.error('Failed to load questions:', error);
        dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: [] } });
      });
  }, []);



  const submitAnswer = (questionId: number, selectedAnswer: string) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) {
      console.error('Question not found:', questionId);
      return;
    }

    const isCorrect = selectedAnswer.trim() === question.correct_answer.trim();
    const userAnswer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timestamp: new Date(),
    };

    dispatch({ type: 'SUBMIT_ANSWER', payload: userAnswer });
    
    // Update portfolio with question keywords
    const keywords = Array.isArray(question.keywords) ? question.keywords : [];
    if (keywords.length > 0) {
      dispatch({ type: 'UPDATE_PORTFOLIO', payload: { keywords, isCorrect } });
    }
  };

  const updatePortfolio = (keywords: string[], isCorrect: boolean) => {
    dispatch({ type: 'UPDATE_PORTFOLIO', payload: { keywords, isCorrect } });
  };

  const getKeywordHeatmapData = () => {
    const heatmapData = [];
    const keywords = Object.keys(state.keywordStats);
    
    keywords.forEach(keyword => {
      const dates = Object.keys(state.keywordStats[keyword]);
      dates.forEach(date => {
        heatmapData.push({
          keyword,
          date,
          value: state.keywordStats[keyword][date],
        });
      });
    });
    
    return heatmapData;
  };

  const addQuestions = async (questions: Question[]) => {
    try {
      // Reload all questions from database to ensure sync
      const allQuestions = await databaseService.getAllQuestions();
      const formattedQuestions = allQuestions.map(q => ({
        ...q,
        created_at: new Date(q.created_at),
        updated_at: new Date(q.updated_at)
      }));
      
      // Update state with fresh data from database
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: formattedQuestions } });
    } catch (error) {
      console.error('Failed to reload questions:', error);
    }
  };

  const refreshQuestions = async () => {
    try {
      const questions = await loadQuestionsFromDatabase();
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions } });
      return questions;
    } catch (error) {
      console.error('Failed to refresh questions:', error);
      return [];
    }
  };

  const updateQuestion = async (question: Question) => {
    try {
      // Update in database
      await databaseService.updateQuestion({
        ...question,
        created_at: question.created_at?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Reload all questions from database to ensure sync
      const allQuestions = await databaseService.getAllQuestions();
      const formattedQuestions = allQuestions.map(q => ({
        ...q,
        created_at: new Date(q.created_at),
        updated_at: new Date(q.updated_at)
      }));
      
      // Update state with fresh data from database
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: formattedQuestions } });
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    try {
      console.log('AppContext: Deleting question ID:', questionId);
      
      // Delete from database
      const success = await databaseService.deleteQuestion(questionId);
      console.log('Database delete result:', success);
      
      if (success) {
        // Reload all questions from database to ensure sync
        const allQuestions = await databaseService.getAllQuestions();
        const formattedQuestions = allQuestions.map(q => ({
          ...q,
          created_at: new Date(q.created_at),
          updated_at: new Date(q.updated_at)
        }));
        
        // Update state with fresh data from database
        dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: formattedQuestions } });
        console.log('Questions reloaded from database successfully');
      } else {
        throw new Error('Database delete returned false');
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
      throw error; // Re-throw to handle in UI
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      submitAnswer,
      updatePortfolio,
      getKeywordHeatmapData,
      addQuestions,
      updateQuestion,
      deleteQuestion,
      refreshQuestions,
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
