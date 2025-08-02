import type { Question, QuizSession, UserAnswer, QuizSettings, QuizMode } from '../types/quiz.ts';
import { StorageManager } from './storage.ts';

export class QuizManager {
  private currentSession: QuizSession | null = null;
  private questions: Question[] = [];
  private settings: QuizSettings;
  private questionStartTime: number = 0;

  constructor() {
    this.settings = StorageManager.getSettings();
    this.loadQuestions();
  }

  // Question Management
  private async loadQuestions(): Promise<void> {
    try {
      const response = await fetch('/data/questions.json');
      this.questions = await response.json();
    } catch (error) {
      console.error('Failed to load questions:', error);
      // Fallback to empty array or default questions
      this.questions = [];
    }
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  getQuestionsByCategory(category: string): Question[] {
    return this.questions.filter(q => q.category === category);
  }

  getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
    return this.questions.filter(q => q.difficulty === difficulty);
  }

  searchQuestions(query: string): Question[] {
    const lowercaseQuery = query.toLowerCase();
    return this.questions.filter(q => 
      q.text.toLowerCase().includes(lowercaseQuery) ||
      q.options.some(option => option.text.toLowerCase().includes(lowercaseQuery)) ||
      q.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Session Management
  startNewSession(mode: QuizMode, options: {
    questionsCount?: number;
    timeLimit?: number;
    categories?: string[];
    difficulties?: string[];
    randomize?: boolean;
  } = {}): QuizSession {
    const sessionId = this.generateSessionId();
    let sessionQuestions = [...this.questions];

    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      sessionQuestions = sessionQuestions.filter(q => 
        options.categories!.includes(q.category || 'Unknown')
      );
    }

    // Filter by difficulties
    if (options.difficulties && options.difficulties.length > 0) {
      sessionQuestions = sessionQuestions.filter(q => 
        options.difficulties!.includes(q.difficulty || 'medium')
      );
    }

    // Randomize questions if requested
    if (options.randomize || this.settings.randomizeQuestions) {
      sessionQuestions = this.shuffleArray(sessionQuestions);
    }

    // Limit number of questions
    const questionsCount = options.questionsCount || this.settings.questionsPerSession;
    if (questionsCount > 0 && questionsCount < sessionQuestions.length) {
      sessionQuestions = sessionQuestions.slice(0, questionsCount);
    }

    // Randomize options if enabled
    if (this.settings.randomizeOptions) {
      sessionQuestions = sessionQuestions.map(q => ({
        ...q,
        options: this.shuffleArray([...q.options])
      }));
    }

    this.currentSession = {
      id: sessionId,
      startTime: new Date(),
      mode,
      timeLimit: options.timeLimit,
      questions: sessionQuestions,
      answers: [],
      currentQuestionIndex: 0,
      isCompleted: false,
      settings: { ...this.settings }
    };

    this.questionStartTime = Date.now();
    StorageManager.saveCurrentSession(this.currentSession);
    return this.currentSession;
  }

  resumeSession(): QuizSession | null {
    const session = StorageManager.getCurrentSession();
    if (session && !session.isCompleted) {
      this.currentSession = session;
      this.questionStartTime = Date.now();
      return session;
    }
    return null;
  }

  getCurrentSession(): QuizSession | null {
    return this.currentSession;
  }

  getCurrentQuestion(): Question | null {
    if (!this.currentSession) return null;
    const index = this.currentSession.currentQuestionIndex;
    return this.currentSession.questions[index] || null;
  }

  // Answer Management
  submitAnswer(questionId: string, selectedOptionId: string): UserAnswer {
    if (!this.currentSession) {
      throw new Error('No active quiz session');
    }

    const question = this.currentSession.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found in current session');
    }

    const selectedOption = question.options.find(o => o.id === selectedOptionId);
    if (!selectedOption) {
      throw new Error('Invalid option selected');
    }

    const timeSpent = Date.now() - this.questionStartTime;
    const answer: UserAnswer = {
      questionId,
      selectedOption: selectedOptionId,
      isCorrect: selectedOption.isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    // Add answer to session
    this.currentSession.answers.push(answer);
    
    // Move to next question or complete session
    if (this.currentSession.currentQuestionIndex < this.currentSession.questions.length - 1) {
      this.currentSession.currentQuestionIndex++;
      this.questionStartTime = Date.now();
    } else {
      this.completeSession();
    }

    StorageManager.saveCurrentSession(this.currentSession);
    return answer;
  }

  getAnswerForQuestion(questionId: string): UserAnswer | undefined {
    if (!this.currentSession) return undefined;
    return this.currentSession.answers.find(a => a.questionId === questionId);
  }

  // Navigation
  goToQuestion(index: number): boolean {
    if (!this.currentSession || index < 0 || index >= this.currentSession.questions.length) {
      return false;
    }

    this.currentSession.currentQuestionIndex = index;
    this.questionStartTime = Date.now();
    StorageManager.saveCurrentSession(this.currentSession);
    return true;
  }

  goToNextQuestion(): boolean {
    if (!this.currentSession) return false;
    return this.goToQuestion(this.currentSession.currentQuestionIndex + 1);
  }

  goToPreviousQuestion(): boolean {
    if (!this.currentSession) return false;
    return this.goToQuestion(this.currentSession.currentQuestionIndex - 1);
  }

  // Session Completion
  completeSession(): QuizSession {
    if (!this.currentSession) {
      throw new Error('No active quiz session');
    }

    this.currentSession.isCompleted = true;
    this.currentSession.endTime = new Date();
    
    // Calculate score
    const correctAnswers = this.currentSession.answers.filter(a => a.isCorrect).length;
    this.currentSession.score = (correctAnswers / this.currentSession.answers.length) * 100;

    // Save to storage
    StorageManager.saveSession(this.currentSession);
    StorageManager.updateStats(this.currentSession);
    StorageManager.clearCurrentSession();

    const completedSession = this.currentSession;
    this.currentSession = null;
    
    return completedSession;
  }

  // Progress Tracking
  getProgress(): {
    current: number;
    total: number;
    percentage: number;
    answered: number;
    correct: number;
    incorrect: number;
  } {
    if (!this.currentSession) {
      return { current: 0, total: 0, percentage: 0, answered: 0, correct: 0, incorrect: 0 };
    }

    const current = this.currentSession.currentQuestionIndex + 1;
    const total = this.currentSession.questions.length;
    const answered = this.currentSession.answers.length;
    const correct = this.currentSession.answers.filter(a => a.isCorrect).length;
    const incorrect = answered - correct;

    return {
      current,
      total,
      percentage: (current / total) * 100,
      answered,
      correct,
      incorrect
    };
  }

  // Time Management
  getRemainingTime(): number | null {
    if (!this.currentSession || !this.currentSession.timeLimit) return null;
    
    const elapsed = Date.now() - this.currentSession.startTime.getTime();
    const remaining = (this.currentSession.timeLimit * 60 * 1000) - elapsed;
    return Math.max(0, remaining);
  }

  getQuestionTime(): number {
    return Date.now() - this.questionStartTime;
  }

  // Settings
  updateSettings(newSettings: Partial<QuizSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    StorageManager.saveSettings(this.settings);
    
    if (this.currentSession) {
      this.currentSession.settings = { ...this.settings };
      StorageManager.saveCurrentSession(this.currentSession);
    }
  }

  getSettings(): QuizSettings {
    return { ...this.settings };
  }

  // Utility Methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Bookmarks
  toggleBookmark(questionId: string): boolean {
    const question = this.getQuestionById(questionId);
    if (!question) return false;

    if (StorageManager.isBookmarked(questionId)) {
      StorageManager.removeBookmark(questionId);
      return false;
    } else {
      StorageManager.addBookmark({
        questionId,
        questionNumber: question.questionNumber,
        text: question.text.substring(0, 100) + '...',
        source: question.source || 'unknown',
        timestamp: new Date()
      });
      return true;
    }
  }

  isQuestionBookmarked(questionId: string): boolean {
    return StorageManager.isBookmarked(questionId);
  }

  // Review Mode
  getIncorrectQuestions(): Question[] {
    const sessions = StorageManager.getSessions();
    const incorrectQuestionIds = new Set<string>();

    sessions.forEach(session => {
      session.answers.forEach(answer => {
        if (!answer.isCorrect) {
          incorrectQuestionIds.add(answer.questionId);
        }
      });
    });

    return this.questions.filter(q => incorrectQuestionIds.has(q.id));
  }

  getBookmarkedQuestions(): Question[] {
    const bookmarks = StorageManager.getBookmarkedQuestions();
    const bookmarkedIds = bookmarks.map(b => b.questionId);
    return this.questions.filter(q => bookmarkedIds.includes(q.id));
  }

  // Statistics
  getDetailedStats() {
    return StorageManager.getStats();
  }

  // Export functionality
  exportResults(): string {
    if (!this.currentSession) {
      throw new Error('No active session to export');
    }

    const results = {
      sessionId: this.currentSession.id,
      startTime: this.currentSession.startTime,
      endTime: this.currentSession.endTime,
      mode: this.currentSession.mode,
      score: this.currentSession.score,
      questions: this.currentSession.questions.length,
      answers: this.currentSession.answers.map(answer => {
        const question = this.currentSession!.questions.find(q => q.id === answer.questionId);
        return {
          questionNumber: question?.questionNumber,
          questionText: question?.text.substring(0, 100) + '...',
          selectedAnswer: answer.selectedOption,
          correctAnswer: question?.correctAnswer,
          isCorrect: answer.isCorrect,
          timeSpent: answer.timeSpent
        };
      })
    };

    return JSON.stringify(results, null, 2);
  }
}