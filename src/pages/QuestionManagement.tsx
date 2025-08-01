/**
 * Question Management page - CRUD operations for quiz questions
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { databaseService } from '../services/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Database,
  FileText,
  Target,
  BookOpen,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { cn, formatDate, getDifficultyColor, getStatusColor, truncate } from '../lib/utils';

/**
 * Question interface for management
 */
interface QuestionWithDates {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at?: Date;
  updated_at?: Date;
  status?: 'active' | 'inactive' | 'draft';
}

/**
 * Form data interface
 */
interface QuestionFormData {
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'draft';
}

/**
 * Filter options interface
 */
interface FilterOptions {
  topic: string;
  difficulty: string;
  status: string;
  search: string;
}

export default function QuestionManagementPage() {
  const { state, addQuestions, updateQuestion, deleteQuestion, dispatch } = useApp();
  const questions = state.questions;
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithDates | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState<QuestionWithDates | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    topic: 'all',
    difficulty: 'all',
    status: 'all',
    search: ''
  });

  /**
   * Default form data
   */
  const defaultFormData: QuestionFormData = {
    topic: '',
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    keywords: [],
    difficulty: 'intermediate',
    status: 'active'
  };

  const [formData, setFormData] = useState<QuestionFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Available topics for selection
   */
  const availableTopics = [
    'Compute Engine', 'Cloud Storage', 'BigQuery', 'Cloud IAM', 
    'VPC Networking', 'Cloud SQL', 'GKE', 'App Engine',
    'Cloud Functions', 'Pub/Sub', 'Cloud Monitoring', 'Cloud Security'
  ];

  /**
   * Filter and search questions
   */
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = filters.search === '' || 
        question.question.toLowerCase().includes(filters.search.toLowerCase()) ||
        question.topic.toLowerCase().includes(filters.search.toLowerCase()) ||
        question.keywords.some(k => k.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesTopic = filters.topic === 'all' || question.topic === filters.topic;
      const matchesDifficulty = filters.difficulty === 'all' || question.difficulty === filters.difficulty;
      const matchesStatus = filters.status === 'all' || (question.status || 'active') === filters.status;

      return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
    });
  }, [questions, filters]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (!formData.question.trim()) newErrors.question = 'Question is required';
    if (formData.options.filter(opt => opt.trim()).length < 2) {
      newErrors.options = 'At least 2 options are required';
    }
    if (!formData.correct_answer.trim()) newErrors.correct_answer = 'Correct answer is required';
    if (!formData.options.includes(formData.correct_answer)) {
      newErrors.correct_answer = 'Correct answer must be one of the options';
    }
    if (!formData.explanation.trim()) newErrors.explanation = 'Explanation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle create question
   */
  const handleCreateQuestion = async () => {
    if (!validateForm()) return;

    const newQuestion = {
      id: Date.now(),
      ...formData,
      created_at: new Date(),
      updated_at: new Date(),
      status: formData.status || 'active'
    };

    try {
      // Save to database via import flow
      await databaseService.insertQuestions([newQuestion], {
        filename: 'manual-creation',
        file_size: 0,
        file_type: 'manual'
      });
      
      // Reload questions from database
      const allQuestions = await databaseService.getAllQuestions();
      const formattedQuestions = allQuestions.map(q => ({
        ...q,
        created_at: new Date(q.created_at),
        updated_at: new Date(q.updated_at)
      }));
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: formattedQuestions } });
      
      setFormData(defaultFormData);
      setIsCreateDialogOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to create question:', error);
      alert('Failed to create question. Please try again.');
    }
  };

  /**
   * Handle edit question
   */
  const handleEditQuestion = async () => {
    if (!validateForm() || !editingQuestion) return;

    const updatedQuestion = {
      ...editingQuestion,
      ...formData,
      updated_at: new Date(),
      created_at: editingQuestion.created_at || new Date()
    };

    await updateQuestion(updatedQuestion);
    setFormData(defaultFormData);
    setEditingQuestion(null);
    setIsEditDialogOpen(false);
    setErrors({});
  };

  /**
   * Handle delete question
   */
  const handleDeleteQuestionById = (question: QuestionWithDates) => {
    console.log('Setting deleting question:', question);
    setDeletingQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Confirm single delete
   */
  const confirmDeleteQuestion = async () => {
    if (!deletingQuestion) {
      console.log('No deleting question found');
      return;
    }
    
    console.log('Deleting question:', deletingQuestion.id);
    setIsDeleting(true);
    
    try {
      await deleteQuestion(deletingQuestion.id);
      console.log('Question deleted successfully');
      setSelectedQuestions(prev => prev.filter(qId => qId !== deletingQuestion.id));
      setIsDeleteDialogOpen(false);
      setDeletingQuestion(null);
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Failed to delete question. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = () => {
    if (selectedQuestions.length === 0) return;
    setIsBulkDeleteDialogOpen(true);
  };

  /**
   * Confirm bulk delete
   */
  const confirmBulkDelete = async () => {
    if (selectedQuestions.length === 0) return;
    
    setIsDeleting(true);
    try {
      await Promise.all(selectedQuestions.map(id => deleteQuestion(id)));
      setSelectedQuestions([]);
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete questions:', error);
      alert('Failed to delete questions. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Open edit dialog
   */
  const openEditDialog = (question: QuestionWithDates) => {
    setEditingQuestion(question);
    setFormData({
      topic: question.topic,
      question: question.question,
      options: [...question.options],
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      keywords: [...question.keywords],
      difficulty: question.difficulty,
      status: question.status || 'active'
    });
    setIsEditDialogOpen(true);
  };

  /**
   * Handle option change
   */
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  /**
   * Handle keywords change
   */
  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    setFormData(prev => ({ ...prev, keywords }));
  };



  /**
   * Question form component
   */
  const QuestionForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic *</Label>
          <select
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Topic</option>
            {availableTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          {errors.topic && <p className="text-red-600 text-sm">{errors.topic}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty *</Label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Textarea
          id="question"
          placeholder="Enter your question here..."
          value={formData.question}
          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          rows={3}
        />
        {errors.question && <p className="text-red-600 text-sm">{errors.question}</p>}
      </div>

      {/* Options */}
      <div className="space-y-2">
        <Label>Answer Options *</Label>
        <div className="space-y-2">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-600 w-8">{index + 1}.</span>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
        {errors.options && <p className="text-red-600 text-sm">{errors.options}</p>}
      </div>

      {/* Correct Answer */}
      <div className="space-y-2">
        <Label htmlFor="correct_answer">Correct Answer *</Label>
        <select
          id="correct_answer"
          value={formData.correct_answer}
          onChange={(e) => setFormData(prev => ({ ...prev, correct_answer: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select correct answer</option>
          {formData.options.filter(opt => opt.trim()).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        {errors.correct_answer && <p className="text-red-600 text-sm">{errors.correct_answer}</p>}
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation *</Label>
        <Textarea
          id="explanation"
          placeholder="Explain why this is the correct answer..."
          value={formData.explanation}
          onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
          rows={3}
        />
        {errors.explanation && <p className="text-red-600 text-sm">{errors.explanation}</p>}
      </div>

      {/* Keywords & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="keyword1, keyword2, keyword3"
            value={formData.keywords.join(', ')}
            onChange={(e) => handleKeywordsChange(e.target.value)}
          />
          <p className="text-xs text-slate-500">Separate keywords with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setFormData(defaultFormData);
            setErrors({});
            isEdit ? setIsEditDialogOpen(false) : setIsCreateDialogOpen(false);
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleEditQuestion : handleCreateQuestion}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? 'Update Question' : 'Create Question'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Question Management
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              Create, edit, and manage your quiz questions database with full CRUD operations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Question</DialogTitle>
                </DialogHeader>
                <QuestionForm />
              </DialogContent>
            </Dialog>
            
            {selectedQuestions.length > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkDelete}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedQuestions.length})
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Questions</p>
                  <p className="text-2xl font-bold text-slate-900">{questions.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Questions</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {questions.filter(q => (q.status || 'active') === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Draft Questions</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {questions.filter(q => q.status === 'draft').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Topics Covered</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {new Set(questions.map(q => q.topic)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filters.topic}
                onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                {availableTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Questions ({filteredQuestions.length})</span>
            {filteredQuestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedQuestions.length === filteredQuestions.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedQuestions(filteredQuestions.map(q => q.id));
                    } else {
                      setSelectedQuestions([]);
                    }
                  }}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-600">Select All</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No Questions Found
              </h3>
              <p className="text-slate-500 mb-6">
                {questions.length === 0 
                  ? "Start building your question database by creating your first question."
                  : "No questions match your current filters. Try adjusting the search or filter criteria."
                }
              </p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Question</DialogTitle>
                  </DialogHeader>
                  <QuestionForm />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuestions(prev => [...prev, question.id]);
                          } else {
                            setSelectedQuestions(prev => prev.filter(id => id !== question.id));
                          }
                        }}
                        className="mt-1 rounded border-slate-300"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Badge variant="outline">{question.topic}</Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(question.status || 'active')}>
                            {question.status || 'active'}
                          </Badge>
                          <span className="text-xs text-slate-500">#{question.id}</span>
                        </div>
                        
                        <h3 className="font-medium text-slate-900 leading-relaxed">
                          {question.question}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={cn(
                                "p-2 text-sm rounded border",
                                option === question.correct_answer
                                  ? "bg-green-100 border-green-300 text-green-800 font-medium"
                                  : "bg-white border-slate-200"
                              )}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                        
                        {question.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {question.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500">
                          Created: {question.created_at ? new Date(question.created_at).toLocaleDateString() : 'Unknown'} | 
                          Updated: {question.updated_at ? new Date(question.updated_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestionById(question)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <QuestionForm isEdit={true} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>Delete Question</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {deletingQuestion && (
              <div className="space-y-4">
                <p className="text-slate-600">
                  Are you sure you want to delete this question? This action cannot be undone.
                </p>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900 mb-2">Question #{deletingQuestion.id}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {deletingQuestion.question}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{deletingQuestion.topic}</Badge>
                    <Badge className={getDifficultyColor(deletingQuestion.difficulty)}>
                      {deletingQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteQuestion}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Question
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>Delete Multiple Questions</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 mb-4">
              Are you sure you want to delete {selectedQuestions.length} selected questions? This action cannot be undone.
            </p>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium">
                {selectedQuestions.length} questions will be permanently deleted
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete {selectedQuestions.length} Questions
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
