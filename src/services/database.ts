/**
 * LocalStorage-based database service (SQLite-like interface)
 */

import { Question } from '../types';

/**
 * Database interface for questions
 */
export interface DatabaseQuestion extends Question {
  id: number;
  created_at: string;
  updated_at: string;
  import_batch_id?: string;
}

/**
 * Import batch information
 */
export interface ImportBatch {
  id: string;
  filename: string;
  total_questions: number;
  success_count: number;
  failed_count: number;
  import_date: string;
  file_size: number;
  file_type: string;
}

/**
 * Database tables structure
 */
interface DatabaseTables {
  questions: DatabaseQuestion[];
  import_batches: ImportBatch[];
}

class DatabaseService {
  private readonly STORAGE_KEY = 'gcp-quiz-database';
  
  /**
   * Get database from localStorage
   */
  private getDatabase(): DatabaseTables {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load database:', error);
    }
    
    return {
      questions: [],
      import_batches: []
    };
  }

  /**
   * Save database to localStorage
   */
  private saveDatabase(db: DatabaseTables): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  /**
   * Initialize database (no-op for localStorage)
   */
  async init(): Promise<void> {
    // No initialization needed for localStorage
    return Promise.resolve();
  }

  /**
   * Insert questions with batch tracking
   */
  async insertQuestions(questions: Question[], batchInfo: Partial<ImportBatch>): Promise<string> {
    const db = this.getDatabase();
    const batchId = `batch_${Date.now()}`;
    const importDate = new Date().toISOString();

    try {
      // Create batch record
      const batch: ImportBatch = {
        id: batchId,
        filename: batchInfo.filename || 'unknown',
        total_questions: questions.length,
        success_count: questions.length,
        failed_count: 0,
        import_date: importDate,
        file_size: batchInfo.file_size || 0,
        file_type: batchInfo.file_type || 'unknown'
      };

      // Add batch to database
      db.import_batches.push(batch);

      // Add questions to database
      questions.forEach(question => {
        const dbQuestion: DatabaseQuestion = {
          id: this.generateId(),
          topic: question.topic,
          question: question.question,
          options: [...question.options],
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          keywords: [...question.keywords],
          difficulty: question.difficulty,
          status: question.status || 'active',
          created_at: importDate,
          updated_at: importDate,
          import_batch_id: batchId
        };
        
        db.questions.push(dbQuestion);
      });

      this.saveDatabase(db);
      return batchId;
    } catch (error) {
      console.error('Failed to insert questions:', error);
      throw error;
    }
  }

  /**
   * Get all questions
   */
  async getAllQuestions(): Promise<DatabaseQuestion[]> {
    const db = this.getDatabase();
    return db.questions.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * Get import batches
   */
  async getImportBatches(): Promise<ImportBatch[]> {
    const db = this.getDatabase();
    return db.import_batches.sort((a, b) => 
      new Date(b.import_date).getTime() - new Date(a.import_date).getTime()
    );
  }

  /**
   * Get questions by batch ID
   */
  async getQuestionsByBatch(batchId: string): Promise<DatabaseQuestion[]> {
    const db = this.getDatabase();
    return db.questions.filter(q => q.import_batch_id === batchId);
  }

  /**
   * Update question
   */
  async updateQuestion(question: DatabaseQuestion): Promise<boolean> {
    try {
      const db = this.getDatabase();
      const index = db.questions.findIndex(q => q.id === question.id);
      
      if (index !== -1) {
        db.questions[index] = {
          ...question,
          updated_at: new Date().toISOString()
        };
        this.saveDatabase(db);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update question:', error);
      return false;
    }
  }

  /**
   * Delete question
   */
  async deleteQuestion(id: number): Promise<boolean> {
    try {
      const db = this.getDatabase();
      const initialLength = db.questions.length;
      db.questions = db.questions.filter(q => q.id !== id);
      
      if (db.questions.length < initialLength) {
        this.saveDatabase(db);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to delete question:', error);
      return false;
    }
  }

  /**
   * Delete import batch and its questions
   */
  async deleteImportBatch(batchId: string): Promise<boolean> {
    try {
      const db = this.getDatabase();
      
      // Remove questions from this batch
      db.questions = db.questions.filter(q => q.import_batch_id !== batchId);
      
      // Remove batch record
      db.import_batches = db.import_batches.filter(b => b.id !== batchId);
      
      this.saveDatabase(db);
      return true;
    } catch (error) {
      console.error('Failed to delete import batch:', error);
      return false;
    }
  }

  /**
   * Get database stats
   */
  async getStats(): Promise<any> {
    try {
      const db = this.getDatabase();
      
      const totalQuestions = db.questions.length;
      const activeQuestions = db.questions.filter(q => q.status === 'active').length;
      const totalBatches = db.import_batches.length;
      const topics = new Set(db.questions.map(q => q.topic)).size;

      return {
        totalQuestions,
        activeQuestions,
        totalBatches,
        topics
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return { totalQuestions: 0, activeQuestions: 0, totalBatches: 0, topics: 0 };
    }
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<boolean> {
    try {
      const emptyDb: DatabaseTables = {
        questions: [],
        import_batches: []
      };
      this.saveDatabase(emptyDb);
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
