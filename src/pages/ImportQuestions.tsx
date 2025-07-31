/**
 * Import Questions page for uploading and managing quiz questions
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { databaseService, ImportBatch } from '../services/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Database,
  FileSpreadsheet,
  FileJson,
  Plus,
  Save
} from 'lucide-react';
import { cn, getTimeAgo, formatFileSize, getDifficultyColor, truncate } from '../lib/utils';
import { toast } from 'sonner';

/**
 * Question data structure for import
 */
interface ImportQuestion {
  id?: number;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Import result structure
 */
interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export default function ImportQuestionsPage() {
  const { addQuestions, dispatch } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<ImportQuestion[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**
   * Handle file drag and drop
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  /**
   * Handle file drop
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = (file: File) => {
    const validTypes = ['text/csv', 'application/json', '.csv', '.json'];
    const isValidType = validTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type.replace('text/', '.').replace('application/', '.'))
    );

    if (!isValidType) {
      alert('Please select a CSV or JSON file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    parseFile(file);
  };

  /**
   * Parse uploaded file
   */
  const parseFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      let questions: ImportQuestion[] = [];

      if (file.name.toLowerCase().endsWith('.json')) {
        questions = JSON.parse(text);
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        questions = parseCSV(text);
      }

      // Validate questions
      const validatedQuestions = validateQuestions(questions);
      setPreviewQuestions(validatedQuestions);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Parse CSV content - Enhanced to match JSON format
   */
  const parseCSV = (csvText: string): ImportQuestion[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return []; // Need at least header + 1 data row
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const questions: ImportQuestion[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handle quoted values)
      const values = parseCSVLine(line);
      if (values.length < 8) continue; // Minimum required columns
      
      // Map columns to question structure
      const question: ImportQuestion = {
        topic: values[0]?.replace(/"/g, '') || 'General',
        question: values[1]?.replace(/"/g, '') || '',
        options: [
          values[2]?.replace(/"/g, '') || '',
          values[3]?.replace(/"/g, '') || '',
          values[4]?.replace(/"/g, '') || '',
          values[5]?.replace(/"/g, '') || ''
        ].filter(Boolean),
        correct_answer: values[6]?.replace(/"/g, '') || '',
        explanation: values[7]?.replace(/"/g, '') || '',
        keywords: (values[8]?.replace(/"/g, '') || '').split(';').map(k => k.trim()).filter(Boolean),
        difficulty: (values[9]?.replace(/"/g, '') as any) || 'intermediate'
      };

      // Only add if we have minimum required data
      if (question.question && question.options.length >= 2 && question.correct_answer) {
        questions.push(question);
      }
    }

    return questions;
  };

  /**
   * Parse a single CSV line handling quoted values
   */
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  /**
   * Validate questions format
   */
  const validateQuestions = (questions: any[]): ImportQuestion[] => {
    return questions.map((q, index) => ({
      id: index + 1,
      topic: q.topic || 'General',
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correct_answer: q.correct_answer || '',
      explanation: q.explanation || '',
      keywords: Array.isArray(q.keywords) ? q.keywords : [],
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(q.difficulty) ? q.difficulty : 'intermediate'
    }));
  };

  /**
   * Database stats component
   */
  const DatabaseStats = () => {
    const [stats, setStats] = useState({ totalQuestions: 0, activeQuestions: 0, totalBatches: 0, topics: 0 });

    useEffect(() => {
      const loadStats = async () => {
        try {
          const dbStats = await databaseService.getStats();
          setStats(dbStats);
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      };

      loadStats();
    }, [importBatches, importResult]);

    return (
      <>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Total Questions</span>
          <span className="font-semibold text-slate-900">{stats.totalQuestions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Active Questions</span>
          <span className="font-semibold text-slate-900">{stats.activeQuestions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Import Batches</span>
          <span className="font-semibold text-slate-900">{stats.totalBatches}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Topics Covered</span>
          <span className="font-semibold text-slate-900">{stats.topics}</span>
        </div>
      </>
    );
  };

  /**
   * Load import batches on mount
   */
  useEffect(() => {
    loadImportBatches();
  }, []);

  /**
   * Load import batches from database
   */
  const loadImportBatches = async () => {
    try {
      const batches = await databaseService.getImportBatches();
      setImportBatches(batches);
    } catch (error) {
      console.error('Failed to load import batches:', error);
    }
  };

  /**
   * Import questions to system
   */
  const handleImport = async () => {
    setIsProcessing(true);
    
    try {
      const errors: string[] = [];
      const validQuestions: ImportQuestion[] = [];
      
      previewQuestions.forEach((q, index) => {
        if (!q.question || q.options.length < 2 || !q.correct_answer) {
          errors.push(`Question ${index + 1}: Missing required fields`);
        } else {
          validQuestions.push({
            ...q,
            id: Date.now() + index,
            status: 'active'
          });
        }
      });
      
      if (validQuestions.length > 0) {
        // Save to SQLite database
        const batchId = await databaseService.insertQuestions(validQuestions, {
          filename: selectedFile?.name || 'unknown',
          file_size: selectedFile?.size || 0,
          file_type: selectedFile?.type || 'unknown'
        });

        // Update app state
        addQuestions(validQuestions);
        
        // Reload questions from database
        const allQuestions = await databaseService.getAllQuestions();
        const formattedQuestions = allQuestions.map(q => ({
          ...q,
          created_at: new Date(q.created_at),
          updated_at: new Date(q.updated_at)
        }));
        dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: formattedQuestions } });
      }
      
      const result: ImportResult = {
        total: previewQuestions.length,
        success: validQuestions.length,
        failed: previewQuestions.length - validQuestions.length,
        errors
      };
      
      setImportResult(result);
      
      // Show success modal
      if (validQuestions.length > 0) {
        setShowSuccessModal(true);
      }
      
      // Show error toast if there are failures
      if (errors.length > 0) {
        toast.error(
          `Import completed with ${errors.length} errors.`,
          {
            description: `${validQuestions.length} questions imported successfully`,
            duration: 7000
          }
        );
      }
      
      // Reload import batches
      await loadImportBatches();
      
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Import failed', {
        description: 'Please check your file format and try again.',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle success modal close and reset
   */
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    handleReset();
  };

  /**
   * Reset import state
   */
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewQuestions([]);
    setImportResult(null);
    setIsProcessing(false);
    
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  /**
   * View questions in a batch
   */
  const viewBatchQuestions = async (batchId: string) => {
    try {
      const questions = await databaseService.getQuestionsByBatch(batchId);
      console.log('Batch questions:', questions);
      // Could open a modal or navigate to detailed view
      alert(`Found ${questions.length} questions in this batch`);
    } catch (error) {
      console.error('Failed to load batch questions:', error);
    }
  };

  /**
   * Delete a batch and its questions
   */
  const deleteBatch = async (batchId: string) => {
    const batch = importBatches.find(b => b.id === batchId);
    
    if (!confirm(`Are you sure you want to delete "${batch?.filename}" and all its ${batch?.total_questions} questions?`)) {
      return;
    }

    try {
      await databaseService.deleteImportBatch(batchId);
      
      // Reload questions and batches
      const allQuestions = await databaseService.getAllQuestions();
      const formattedQuestions = allQuestions.map(q => ({
        ...q,
        created_at: new Date(q.created_at),
        updated_at: new Date(q.updated_at)
      }));
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: formattedQuestions } });
      
      await loadImportBatches();
      setSelectedBatch(null);
      
    } catch (error) {
      console.error('Failed to delete batch:', error);
      alert('Failed to delete batch');
    }
  };

  /**
   * Download sample template - Enhanced with more examples
   */
  const downloadTemplate = (format: 'csv' | 'json') => {
    const sampleData = [
      {
        topic: 'Compute Engine',
        question: 'What is Google Compute Engine?',
        options: ['Virtual machines', 'Container service', 'Database service', 'Storage service'],
        correct_answer: 'Virtual machines',
        explanation: 'Google Compute Engine provides virtual machines running in Google data centers and connected to worldwide fiber network.',
        keywords: ['compute-engine', 'vm', 'infrastructure'],
        difficulty: 'beginner'
      },
      {
        topic: 'Cloud Storage',
        question: 'Which Google Cloud Storage class is best for frequently accessed data?',
        options: ['Standard', 'Nearline', 'Coldline', 'Archive'],
        correct_answer: 'Standard',
        explanation: 'Standard storage is optimized for data that is frequently accessed and requires low latency.',
        keywords: ['cloud-storage', 'storage-classes', 'standard'],
        difficulty: 'intermediate'
      },
      {
        topic: 'BigQuery',
        question: 'What is the primary use case for Google BigQuery?',
        options: ['Real-time transactions', 'Data warehousing and analytics', 'File storage', 'Container orchestration'],
        correct_answer: 'Data warehousing and analytics',
        explanation: 'BigQuery is a fully-managed, serverless data warehouse that enables scalable analysis over large datasets.',
        keywords: ['bigquery', 'data-warehouse', 'analytics', 'sql'],
        difficulty: 'advanced'
      }
    ];

    if (format === 'csv') {
      const headers = 'Topic,Question,Option1,Option2,Option3,Option4,Correct Answer,Explanation,Keywords,Difficulty\n';
      const csvContent = sampleData.map(q => 
        `"${q.topic}","${q.question}","${q.options[0]}","${q.options[1]}","${q.options[2]}","${q.options[3]}","${q.correct_answer}","${q.explanation}","${q.keywords.join(';')}","${q.difficulty}"`
      ).join('\n');
      
      const blob = new Blob([headers + csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gcp_questions_template.csv';
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gcp_questions_template.json';
      a.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Import Questions
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              Upload CSV or JSON files to add new quiz questions to the system.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate('csv')}
              className="text-xs"
            >
              <FileSpreadsheet className="h-3 w-3 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate('json')}
              className="text-xs"
            >
              <FileJson className="h-3 w-3 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* File Upload */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Upload Questions File
              </CardTitle>
              <CardDescription>
                Upload a CSV or JSON file containing quiz questions. Maximum file size: 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-300 hover:border-slate-400"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{selectedFile.name}</h3>
                      <p className="text-slate-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Unknown type'}
                      </p>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Change File
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Drop your file here, or browse
                      </h3>
                      <p className="text-slate-600">
                        Supports CSV and JSON formats
                      </p>
                    </div>
                    <Button
                      onClick={() => document.getElementById('file-input')?.click()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                )}

                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-600">Processing file...</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Questions */}
          {previewQuestions.length > 0 && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-green-600" />
                      Preview Questions ({previewQuestions.length})
                    </CardTitle>
                    <CardDescription>
                      Review the questions before importing them to the system.
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Import Questions
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previewQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{question.topic}</Badge>
                          <Badge className={
                            question.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {question.difficulty}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">#{index + 1}</span>
                      </div>
                      
                      <h4 className="font-medium text-slate-900 mb-2">{question.question || 'No question text'}</h4>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={cn(
                              "p-2 text-sm rounded border",
                              option === question.correct_answer
                                ? "bg-green-100 border-green-300 text-green-800"
                                : "bg-white border-slate-200"
                            )}
                          >
                            {option || `Option ${optIndex + 1}`}
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <p className="text-xs text-slate-600 mt-2">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {previewQuestions.length > 5 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-600">
                        ... and {previewQuestions.length - 5} more questions
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Results */}
          {importResult && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-600" />
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                    <div className="text-sm text-slate-600">Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                    <div className="text-sm text-slate-600">Success</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                    <div className="text-sm text-slate-600">Failed</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-800">Errors:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-red-700">
                          <XCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex space-x-3">
                  <Button onClick={handleReset} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Import More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Import History - Optimized */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Imports
                </div>
                <Badge variant="outline" className="text-xs">
                  {importBatches.length} total
                </Badge>
              </CardTitle>
              <CardDescription>
                Last 10 imported question batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {importBatches.length === 0 ? (
                <div className="text-center py-6">
                  <Database className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No imports yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {importBatches.slice(0, 10).map((batch) => (
                    <div
                      key={batch.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm",
                        selectedBatch === batch.id 
                          ? "border-blue-500 bg-blue-50 shadow-sm" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      onClick={() => setSelectedBatch(selectedBatch === batch.id ? null : batch.id)}
                    >
                      {/* Compact Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 text-sm truncate">
                            {batch.filename}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <span>{getTimeAgo(new Date(batch.import_date))}</span>
                            <span>•</span>
                            <span>{formatFileSize(batch.file_size)}</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {batch.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <div className="text-right">
                            <div className="text-xs font-medium text-slate-900">
                              {batch.success_count}/{batch.total_questions}
                            </div>
                            <div className="text-xs text-slate-500">
                              {batch.failed_count > 0 && (
                                <span className="text-red-600">{batch.failed_count} failed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Stats */}
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div className="text-center p-1.5 bg-blue-50 rounded">
                          <div className="font-semibold text-blue-600">{batch.total_questions}</div>
                          <div className="text-slate-600 text-xs">Total</div>
                        </div>
                        <div className="text-center p-1.5 bg-green-50 rounded">
                          <div className="font-semibold text-green-600">{batch.success_count}</div>
                          <div className="text-slate-600 text-xs">Success</div>
                        </div>
                        <div className="text-center p-1.5 bg-slate-50 rounded">
                          <div className="font-semibold text-slate-600">
                            {Math.round((batch.success_count / batch.total_questions) * 100)}%
                          </div>
                          <div className="text-slate-600 text-xs">Rate</div>
                        </div>
                      </div>

                      {/* Expanded Actions */}
                      {selectedBatch === batch.id && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-slate-600">
                              Imported on {new Date(batch.import_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewBatchQuestions(batch.id);
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBatch(batch.id);
                                }}
                                className="h-7 px-2 text-xs border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Load More Indicator */}
                  {importBatches.length > 10 && (
                    <div className="text-center pt-2">
                      <p className="text-xs text-slate-500">
                        Showing 10 of {importBatches.length} imports
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Database className="h-5 w-5 mr-2" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Questions</span>
                <span className="font-semibold text-slate-900">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Topics</span>
                <span className="font-semibold text-slate-900">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Last Import</span>
                <span className="font-semibold text-slate-900">Never</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center text-orange-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-orange-700 pt-0">
              <div className="space-y-1">
                <p>• Download templates above</p>
                <p>• Max file size: 5MB</p>
                <p>• Keywords: comma-separated</p>
                <p>• Preview before import</p>
              </div>
              
              <div className="pt-2 border-t border-orange-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <FileSpreadsheet className="h-3 w-3 text-green-600" />
                    <span>CSV</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileJson className="h-3 w-3 text-blue-600" />
                    <span>JSON</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Import Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span>Import Successful!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {importResult && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Questions Imported Successfully
                  </h3>
                  <p className="text-slate-600">
                    Your questions have been added to the database and are ready for use in quizzes.
                  </p>
                </div>

                {/* Import Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                    <div className="text-sm text-green-700">Questions Added</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                    <div className="text-sm text-blue-700">Total Processed</div>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-700">File Details</span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>📁 {selectedFile?.name}</div>
                    <div>📊 {formatFileSize(selectedFile?.size || 0)}</div>
                    <div>🕒 {new Date().toLocaleString()}</div>
                  </div>
                </div>

                {/* Success Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleSuccessModalClose}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Import More Questions
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowSuccessModal(false);
                        // Navigate to quiz page
                        window.location.href = '#/quiz';
                      }}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowSuccessModal(false);
                        // Navigate to manage page
                        window.location.href = '#/manage';
                      }}
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
