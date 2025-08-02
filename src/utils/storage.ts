import type { QuizSession, QuizSettings, BookmarkedQuestion, QuizStats } from '../types/quiz.ts';

export class StorageManager {
  private static readonly KEYS = {
    QUIZ_SESSIONS: 'gcp-quiz-sessions',
    QUIZ_SETTINGS: 'gcp-quiz-settings',
    BOOKMARKED_QUESTIONS: 'gcp-quiz-bookmarks',
    QUIZ_STATS: 'gcp-quiz-stats',
    CURRENT_SESSION: 'gcp-quiz-current-session',
    THEME: 'gcp-quiz-theme'
  } as const;

  // Quiz Sessions
  static saveSession(session: QuizSession): void {
    try {
      const sessions = this.getSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      // Keep only last 50 sessions
      if (sessions.length > 50) {
        sessions.splice(0, sessions.length - 50);
      }
      
      localStorage.setItem(this.KEYS.QUIZ_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save quiz session:', error);
    }
  }

  static getSessions(): QuizSession[] {
    try {
      const data = localStorage.getItem(this.KEYS.QUIZ_SESSIONS);
      if (!data) return [];
      
      const sessions = JSON.parse(data);
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        answers: session.answers.map((answer: any) => ({
          ...answer,
          timestamp: new Date(answer.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Failed to load quiz sessions:', error);
      return [];
    }
  }

  static getCurrentSession(): QuizSession | null {
    try {
      const data = localStorage.getItem(this.KEYS.CURRENT_SESSION);
      if (!data) return null;
      
      const session = JSON.parse(data);
      return {
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        answers: session.answers.map((answer: any) => ({
          ...answer,
          timestamp: new Date(answer.timestamp)
        }))
      };
    } catch (error) {
      console.error('Failed to load current session:', error);
      return null;
    }
  }

  static saveCurrentSession(session: QuizSession): void {
    try {
      localStorage.setItem(this.KEYS.CURRENT_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save current session:', error);
    }
  }

  static clearCurrentSession(): void {
    localStorage.removeItem(this.KEYS.CURRENT_SESSION);
  }

  // Quiz Settings
  static getSettings(): QuizSettings {
    try {
      const data = localStorage.getItem(this.KEYS.QUIZ_SETTINGS);
      if (!data) return this.getDefaultSettings();
      
      return { ...this.getDefaultSettings(), ...JSON.parse(data) };
    } catch (error) {
      console.error('Failed to load quiz settings:', error);
      return this.getDefaultSettings();
    }
  }

  static saveSettings(settings: Partial<QuizSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.KEYS.QUIZ_SETTINGS, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save quiz settings:', error);
    }
  }

  private static getDefaultSettings(): QuizSettings {
    return {
      theme: 'auto',
      showExplanations: true,
      showTimer: true,
      autoAdvance: false,
      randomizeQuestions: false,
      randomizeOptions: false,
      questionsPerSession: 25,
      enableSound: false
    };
  }

  // Bookmarked Questions
  static getBookmarkedQuestions(): BookmarkedQuestion[] {
    try {
      const data = localStorage.getItem(this.KEYS.BOOKMARKED_QUESTIONS);
      if (!data) return [];
      
      const bookmarks = JSON.parse(data);
      return bookmarks.map((bookmark: any) => ({
        ...bookmark,
        timestamp: new Date(bookmark.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load bookmarked questions:', error);
      return [];
    }
  }

  static addBookmark(bookmark: BookmarkedQuestion): void {
    try {
      const bookmarks = this.getBookmarkedQuestions();
      const existingIndex = bookmarks.findIndex(b => b.questionId === bookmark.questionId);
      
      if (existingIndex >= 0) {
        bookmarks[existingIndex] = bookmark;
      } else {
        bookmarks.push(bookmark);
      }
      
      localStorage.setItem(this.KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  }

  static removeBookmark(questionId: string): void {
    try {
      const bookmarks = this.getBookmarkedQuestions();
      const filtered = bookmarks.filter(b => b.questionId !== questionId);
      localStorage.setItem(this.KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  }

  static isBookmarked(questionId: string): boolean {
    const bookmarks = this.getBookmarkedQuestions();
    return bookmarks.some(b => b.questionId === questionId);
  }

  // Quiz Statistics
  static getStats(): QuizStats {
    try {
      const data = localStorage.getItem(this.KEYS.QUIZ_STATS);
      if (!data) return this.getDefaultStats();
      
      const stats = JSON.parse(data);
      return {
        ...stats,
        recentSessions: stats.recentSessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined
        }))
      };
    } catch (error) {
      console.error('Failed to load quiz stats:', error);
      return this.getDefaultStats();
    }
  }

  static updateStats(session: QuizSession): void {
    try {
      const stats = this.getStats();
      
      // Update basic stats
      stats.totalQuestions += session.answers.length;
      stats.correctAnswers += session.answers.filter(a => a.isCorrect).length;
      stats.incorrectAnswers += session.answers.filter(a => !a.isCorrect).length;
      
      // Update average time
      const totalTime = session.answers.reduce((sum, a) => sum + a.timeSpent, 0);
      stats.averageTimePerQuestion = totalTime / session.answers.length;
      
      // Update category performance
      session.questions.forEach((question, index) => {
        const answer = session.answers[index];
        if (!answer) return;
        
        const category = question.category || 'Unknown';
        if (!stats.categoryPerformance[category]) {
          stats.categoryPerformance[category] = {
            category,
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            averageTime: 0
          };
        }
        
        const categoryStats = stats.categoryPerformance[category];
        categoryStats.totalQuestions++;
        if (answer.isCorrect) categoryStats.correctAnswers++;
        categoryStats.accuracy = (categoryStats.correctAnswers / categoryStats.totalQuestions) * 100;
        categoryStats.averageTime = answer.timeSpent;
      });
      
      // Update difficulty performance
      session.questions.forEach((question, index) => {
        const answer = session.answers[index];
        if (!answer) return;
        
        const difficulty = question.difficulty || 'medium';
        if (!stats.difficultyPerformance[difficulty]) {
          stats.difficultyPerformance[difficulty] = {
            difficulty,
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            averageTime: 0
          };
        }
        
        const difficultyStats = stats.difficultyPerformance[difficulty];
        difficultyStats.totalQuestions++;
        if (answer.isCorrect) difficultyStats.correctAnswers++;
        difficultyStats.accuracy = (difficultyStats.correctAnswers / difficultyStats.totalQuestions) * 100;
        difficultyStats.averageTime = answer.timeSpent;
      });
      
      // Add to recent sessions
      stats.recentSessions.unshift(session);
      if (stats.recentSessions.length > 10) {
        stats.recentSessions = stats.recentSessions.slice(0, 10);
      }
      
      // Update improvement trend
      const accuracy = (session.answers.filter(a => a.isCorrect).length / session.answers.length) * 100;
      stats.improvementTrend.push(accuracy);
      if (stats.improvementTrend.length > 20) {
        stats.improvementTrend = stats.improvementTrend.slice(-20);
      }
      
      localStorage.setItem(this.KEYS.QUIZ_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update quiz stats:', error);
    }
  }

  private static getDefaultStats(): QuizStats {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageTimePerQuestion: 0,
      categoryPerformance: {},
      difficultyPerformance: {},
      recentSessions: [],
      improvementTrend: []
    };
  }

  // Theme Management
  static getTheme(): 'light' | 'dark' | 'auto' {
    try {
      const theme = localStorage.getItem(this.KEYS.THEME) as 'light' | 'dark' | 'auto';
      return theme || 'auto';
    } catch (error) {
      console.error('Failed to load theme:', error);
      return 'auto';
    }
  }

  static saveTheme(theme: 'light' | 'dark' | 'auto'): void {
    try {
      localStorage.setItem(this.KEYS.THEME, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  // Data Export/Import
  static exportData(): string {
    try {
      const data = {
        sessions: this.getSessions(),
        settings: this.getSettings(),
        bookmarks: this.getBookmarkedQuestions(),
        stats: this.getStats(),
        theme: this.getTheme(),
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.version && data.exportDate) {
        // Import sessions
        if (data.sessions) {
          localStorage.setItem(this.KEYS.QUIZ_SESSIONS, JSON.stringify(data.sessions));
        }
        
        // Import settings
        if (data.settings) {
          localStorage.setItem(this.KEYS.QUIZ_SETTINGS, JSON.stringify(data.settings));
        }
        
        // Import bookmarks
        if (data.bookmarks) {
          localStorage.setItem(this.KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(data.bookmarks));
        }
        
        // Import stats
        if (data.stats) {
          localStorage.setItem(this.KEYS.QUIZ_STATS, JSON.stringify(data.stats));
        }
        
        // Import theme
        if (data.theme) {
          localStorage.setItem(this.KEYS.THEME, data.theme);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  static clearAllData(): void {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}