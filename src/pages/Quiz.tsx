/**
 * Quiz page - Interactive quiz interface with review functionality
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  Home,
  Eye,
  Target,
  Lightbulb,
  AlertCircle,
  PlayCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { gcpTopics } from '../data/mockData';

interface QuizStats {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  timeSpent: number;
}

export default function QuizPage() {
  const { state, submitAnswer, dispatch, refreshQuestions } = useApp();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState('all');
  const [selectionMode, setSelectionMode] = useState<'topic' | 'keyword'>('topic');
  const [questionCount, setQuestionCount] = useState(10);
  const [useCustomCount, setUseCustomCount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load questions when component mounts
  useEffect(() => {
    if (state.questions.length === 0) {
      refreshQuestions();
    }
  }, []);

  /**
   * Get question count for each topic
   */
  const getTopicCounts = () => {
    const counts: Record<string, number> = {
      'all': state.questions.length
    };
    
    // Count questions by topic
    state.questions.forEach(question => {
      if (question.topic) {
        const topicKey = question.topic.toLowerCase().trim();
        counts[topicKey] = (counts[topicKey] || 0) + 1;
      }
    });
    
    return counts;
  };

  /**
   * Get question count for each keyword
   */
  const getKeywordCounts = () => {
    const counts: Record<string, number> = {
      'all': state.questions.length
    };
    
    // Count questions by keyword
    state.questions.forEach(question => {
      if (question.keywords && Array.isArray(question.keywords)) {
        question.keywords.forEach(keyword => {
          const keywordKey = keyword.toLowerCase().trim();
          counts[keywordKey] = (counts[keywordKey] || 0) + 1;
        });
      }
    });
    
    return counts;
  };

  /**
   * Get all unique keywords with statistics
   */
  const getKeywordStats = () => {
    const keywordStats = new Map();
    
    // Process all questions to get keyword statistics
    state.questions.forEach(question => {
      if (question.keywords && Array.isArray(question.keywords)) {
        question.keywords.forEach(keyword => {
          if (!keywordStats.has(keyword)) {
            keywordStats.set(keyword, {
              keyword: keyword,
              topic: question.topic,
              totalQuestions: 0,
              answered: 0,
              correct: 0,
              accuracy: 0
            });
          }
          keywordStats.get(keyword).totalQuestions++;
        });
      }
    });

    // Add user answer data
    state.userAnswers.forEach(answer => {
      const question = state.questions.find(q => q.id === answer.questionId);
      if (question && question.keywords && Array.isArray(question.keywords)) {
        question.keywords.forEach(keyword => {
          const stats = keywordStats.get(keyword);
          if (stats) {
            stats.answered++;
            if (answer.isCorrect) {
              stats.correct++;
            }
          }
        });
      }
    });

    // Calculate accuracy and convert to array
    return Array.from(keywordStats.values()).map(stats => ({
      ...stats,
      accuracy: stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0
    })).sort((a, b) => a.keyword.localeCompare(b.keyword));
  };

  // Memoize expensive calculations
  const topicCounts = React.useMemo(() => getTopicCounts(), [state.questions]);
  const keywordCounts = React.useMemo(() => getKeywordCounts(), [state.questions]);
  const keywordStats = React.useMemo(() => getKeywordStats(), [state.questions, state.userAnswers]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  // Set to true if selecting an option should immediately submit the answer
  const autoSubmitOnSelect = true;

  const currentQuiz = state.currentQuiz;
  const currentQuestion = currentQuiz?.questions?.[currentQuiz.currentIndex];
  const isLastQuestion = currentQuiz ? currentQuiz.currentIndex >= currentQuiz.questions.length - 1 : false;

  /**
   * Start quiz with selected topic/keyword and question count
   */
  const handleStartQuiz = () => {
    if (state.questions.length === 0) {
      alert('No questions available. Please import questions first.');
      return;
    }

    try {
      setIsLoading(true);
      
      let filteredQuestions = [...state.questions];
      
      // Filter by selection mode
      if (selectionMode === 'topic' && selectedTopic && selectedTopic !== 'all') {
        filteredQuestions = state.questions.filter(q => 
          q.topic && q.topic.toLowerCase() === selectedTopic.toLowerCase()
        );
      } else if (selectionMode === 'keyword' && selectedKeyword && selectedKeyword !== 'all') {
        filteredQuestions = state.questions.filter(q => 
          q.keywords && 
          Array.isArray(q.keywords) && 
          q.keywords.some(keyword => keyword.toLowerCase() === selectedKeyword.toLowerCase())
        );
      }
      
      if (filteredQuestions.length === 0) {
        alert('No questions available for the selected criteria. Please try a different selection.');
        return;
      }
      
      // Determine final question count
      const maxAvailable = filteredQuestions.length;
      const finalQuestionCount = Math.min(questionCount, maxAvailable);
      
      // Shuffle and select questions
      const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffledQuestions.slice(0, finalQuestionCount);
      
      // Start quiz through context
      dispatch({ type: 'START_QUIZ', payload: { questions: selectedQuestions } });
      
      // Reset local state
      setSelectedAnswer('');
      setShowExplanation(false);
      setIsAnswered(false);
      setReviewMode(false);
      setReviewIndex(0);
      
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Error starting quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get current selection info for display
   */
  const getCurrentSelection = useMemo(() => {
    if (selectionMode === 'topic') {
      const topicName = selectedTopic === 'all' ? 'All Topics' : 
        gcpTopics.find(t => t.toLowerCase() === selectedTopic || t === selectedTopic) || 
        selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1);
      
      return {
        mode: 'Topic',
        selection: topicName,
        count: topicCounts[selectedTopic] || 0
      };
    } else {
      const keywordName = selectedKeyword === 'all' ? 'All Keywords' : selectedKeyword;
      
      return {
        mode: 'Keyword', 
        selection: keywordName,
        count: keywordCounts[selectedKeyword] || 0
      };
    }
  }, [selectionMode, selectedTopic, selectedKeyword, topicCounts, keywordCounts]);

  /**
   * Submit answer and show explanation
   */
  const handleSubmitAnswer = (answer?: string) => {
    const finalAnswer = answer ?? selectedAnswer;
    if (!finalAnswer || !currentQuestion) return;

    submitAnswer(currentQuestion.id, finalAnswer);
    setIsAnswered(true);
    setShowExplanation(true);
  };

  /**
   * Move to next question
   */
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Quiz completed - enter review mode
      setReviewMode(true);
      setReviewIndex(0);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
      setSelectedAnswer('');
      setShowExplanation(false);
      setIsAnswered(false);
    }
  };

  /**
   * Calculate quiz statistics
   */
  const getQuizStats = (): QuizStats => {
    if (!currentQuiz) return { total: 0, correct: 0, incorrect: 0, percentage: 0, timeSpent: 0 };

    const total = currentQuiz.answers.length;
    const correct = currentQuiz.answers.filter(a => a.isCorrect).length;
    const incorrect = total - correct;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpent = Math.floor((Date.now() - currentQuiz.startTime.getTime()) / 1000);

    return { total, correct, incorrect, percentage, timeSpent };
  };

  /**
   * Format time in minutes and seconds
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get performance color based on percentage
   */
  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Navigate in review mode
   */
  const handleReviewNavigation = (direction: 'prev' | 'next') => {
    if (!currentQuiz) return;
    
    if (direction === 'prev' && reviewIndex > 0) {
      setReviewIndex(reviewIndex - 1);
    } else if (direction === 'next' && reviewIndex < currentQuiz.questions.length - 1) {
      setReviewIndex(reviewIndex + 1);
    }
  };

  /**
   * Exit review mode and finish quiz
   */
  const handleFinishQuiz = () => {
    dispatch({ type: 'FINISH_QUIZ' });
    setReviewMode(false);
    setReviewIndex(0);
  };

  // Quiz not started - Topic Selection
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">GCP Quiz</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Test your Google Cloud Platform knowledge with our comprehensive quiz system.
              Choose a topic to get started!
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Configure Your Quiz</span>
              </CardTitle>
              <CardDescription>
                Choose by topic, specific keywords, or take a comprehensive quiz covering all areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selection Mode Tabs */}
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setSelectionMode('topic')}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    selectionMode === 'topic'
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>By Topic</span>
                </button>
                <button
                  onClick={() => setSelectionMode('keyword')}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    selectionMode === 'keyword'
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Target className="h-4 w-4" />
                  <span>By Keyword</span>
                </button>
              </div>
              {/* Selection Content */}
              {selectionMode === 'topic' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {gcpTopics.map((topic) => {
                    const topicKey = topic === 'All Topics' ? 'all' : topic.toLowerCase().trim();
                    const questionCount = getTopicCounts()[topicKey] || 0;
                    
                    return (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topicKey)}
                        className={cn(
                          "p-3 rounded-lg border text-sm font-medium transition-all text-left",
                          selectedTopic === topicKey
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{topic}</span>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "ml-2 text-xs",
                              selectedTopic === topicKey
                                ? "bg-blue-200 text-blue-800"
                                : "bg-slate-200 text-slate-600"
                            )}
                          >
                            {questionCount}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* All Keywords Option */}
                  <button
                    onClick={() => setSelectedKeyword('all')}
                    className={cn(
                      "w-full p-4 rounded-lg border text-sm font-medium transition-all text-left",
                      selectedKeyword === 'all'
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">All Keywords</div>
                        <div className="text-xs text-slate-500 mt-1">Practice questions from all keyword areas</div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          selectedKeyword === 'all'
                            ? "bg-blue-200 text-blue-800"
                            : "bg-slate-200 text-slate-600"
                        )}
                      >
                        {keywordCounts.all || 0}
                      </Badge>
                    </div>
                  </button>

                  {/* Keyword Grid */}
                  <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {keywordStats.map((stats) => (
                        <button
                          key={stats.keyword}
                          onClick={() => setSelectedKeyword(stats.keyword)}
                          className={cn(
                            "p-2 rounded-lg border text-xs font-medium transition-all text-left h-20 flex flex-col justify-between",
                            selectedKeyword === stats.keyword
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded truncate max-w-20">
                              {stats.keyword}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs px-1 py-0.5 min-w-6 text-center",
                                selectedKeyword === stats.keyword
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-slate-200 text-slate-600"
                              )}
                            >
                              {stats.totalQuestions}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-slate-600 truncate" title={stats.topic}>
                              {stats.topic}
                            </div>
                            {stats.answered > 0 && (
                              <div className={cn(
                                "text-xs font-semibold",
                                stats.accuracy >= 80 ? "text-green-600" :
                                stats.accuracy >= 60 ? "text-yellow-600" : "text-red-600"
                              )}>
                                {stats.accuracy}% ({stats.answered})
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {keywordStats.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No keywords available</p>
                      <p className="text-sm">Import questions to see keyword options</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 space-y-4">
                {/* Selection Summary */}
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Selected {getCurrentSelection.mode}:</span>
                    <span className="font-medium text-slate-900">
                      {getCurrentSelection.selection}
                      <Badge variant="outline" className="ml-2">
                        {getCurrentSelection.count} available
                      </Badge>
                    </span>
                  </div>
                </div>

                {/* Question Count Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Number of Questions</Label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Select 
                        value={useCustomCount ? 'custom' : questionCount.toString()} 
                        onValueChange={(value) => {
                          if (value === 'custom') {
                            setUseCustomCount(true);
                          } else {
                            setUseCustomCount(false);
                            const numValue = value === 'all' ? getCurrentSelection.count : parseInt(value);
                            setQuestionCount(numValue);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose number of questions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 questions</SelectItem>
                          <SelectItem value="10">10 questions</SelectItem>
                          <SelectItem value="15">15 questions</SelectItem>
                          <SelectItem value="20">20 questions</SelectItem>
                          <SelectItem value="25">25 questions</SelectItem>
                          {getCurrentSelection.count > 25 && (
                            <SelectItem value="50">50 questions</SelectItem>
                          )}
                          {getCurrentSelection.count > 50 && (
                            <SelectItem value="all">All {getCurrentSelection.count} questions</SelectItem>
                          )}
                          <SelectItem value="custom">Custom number...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {useCustomCount && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="1"
                          max={getCurrentSelection.count}
                          value={questionCount}
                          onChange={(e) => {
                            const value = Math.min(Math.max(1, parseInt(e.target.value) || 1), getCurrentSelection.count);
                            setQuestionCount(value);
                          }}
                          className="w-20 text-center"
                          placeholder="1"
                        />
                        <span className="text-xs text-slate-500 whitespace-nowrap">max {getCurrentSelection.count}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Helper text */}
                  <div className="text-xs text-slate-500">
                    Available questions in {getCurrentSelection.selection}: {getCurrentSelection.count}
                  </div>
                  
                  {/* Warning when exceeding available questions */}
                  {questionCount > getCurrentSelection.count && getCurrentSelection.count > 0 && (
                    <div className="flex items-center space-x-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-xs text-orange-700">
                        Only {getCurrentSelection.count} questions available. Quiz will use maximum available.
                      </span>
                    </div>
                  )}
                </div>

                {/* Quiz Settings Summary */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <div className="flex items-center justify-between">
                      <span>Quiz Settings:</span>
                      <span className="font-medium">
                        {Math.min(questionCount, getCurrentSelection.count)} questions from {getCurrentSelection.selection}
                        {questionCount > getCurrentSelection.count && (
                          <span className="text-orange-700 ml-1">(max available)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStartQuiz}
                  disabled={state.questions.length === 0 || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  size="lg"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  {isLoading ? 'Starting Quiz...' : `Start Quiz (${Math.min(questionCount, getCurrentSelection.count)} ${Math.min(questionCount, getCurrentSelection.count) === 1 ? 'question' : 'questions'})`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = getQuizStats();

  // Review Mode - Show all answers
  if (reviewMode && currentQuiz) {
    const reviewQuestion = currentQuiz.questions?.[reviewIndex];
    const userAnswer = currentQuiz.answers?.[reviewIndex];
    const isCorrect = userAnswer?.isCorrect || false;
    
    if (!reviewQuestion) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Review Error</h2>
              <p className="text-slate-600 mb-4">Unable to load review data.</p>
              <Button onClick={() => setReviewMode(false)}>
                Back to Quiz
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Review Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Review Answers</h1>
                  <p className="text-slate-600">Review your quiz performance</p>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("text-2xl font-bold", getPerformanceColor(stats.percentage))}>
                  {stats.percentage}%
                </div>
                <div className="text-sm text-slate-500">
                  {stats.correct}/{stats.total} correct
                </div>
              </div>
            </div>

            {/* Progress and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-600">Total Questions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                  <div className="text-sm text-slate-600">Correct</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                  <div className="text-sm text-slate-600">Incorrect</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatTime(stats.timeSpent)}</div>
                  <div className="text-sm text-slate-600">Time Spent</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Question Review */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span>Question {reviewIndex + 1} of {currentQuiz.questions.length}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{reviewQuestion.topic}</Badge>
                  <Badge className={
                    reviewQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    reviewQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    reviewQuestion.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {reviewQuestion.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium text-slate-900">
                {reviewQuestion.question}
              </div>

              <div className="space-y-3">
                {reviewQuestion.options.map((option, index) => {
                  const isUserAnswer = userAnswer?.selectedAnswer === option;
                  const isCorrectAnswer = reviewQuestion.correct_answer === option;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border transition-colors",
                        isCorrectAnswer 
                          ? "border-green-500 bg-green-50 text-green-800"
                          : isUserAnswer && !isCorrectAnswer
                          ? "border-red-500 bg-red-50 text-red-800"
                          : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        <div className="flex items-center space-x-2">
                          {isCorrectAnswer && (
                            <Badge className="bg-green-100 text-green-800">Correct</Badge>
                          )}
                          {isUserAnswer && (
                            <Badge variant="outline">Your Answer</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-2">Explanation</div>
                    <div className="text-blue-800">{reviewQuestion.explanation}</div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {reviewQuestion.keywords && reviewQuestion.keywords.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {reviewQuestion.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex justify-center sm:justify-start">
              <Button
                variant="outline"
                onClick={() => handleReviewNavigation('prev')}
                disabled={reviewIndex === 0}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-slate-600 text-center">
                {reviewIndex + 1} of {currentQuiz.questions.length}
              </span>
              <Progress 
                value={(reviewIndex + 1) / currentQuiz.questions.length * 100} 
                className="w-full sm:w-32"
              />
            </div>

            <div className="flex justify-center sm:justify-end">
              {reviewIndex < currentQuiz.questions.length - 1 ? (
                <Button
                  onClick={() => handleReviewNavigation('next')}
                  className="w-full sm:w-auto"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleFinishQuiz}
                    className="w-full sm:w-auto"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Finish Review
                  </Button>
                  <Link to="/portfolio" className="w-full sm:w-auto">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 w-full sm:w-auto">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Mode - Add safety checks
  if (!currentQuestion) {
    console.error('No current question available:', { currentQuiz, currentIndex: currentQuiz?.currentIndex });
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Quiz Loading Error</h2>
            <p className="text-slate-600 mb-4">Unable to load quiz questions. Please try again.</p>
            <Button onClick={() => dispatch({ type: 'FINISH_QUIZ' })}>
              Return to Topic Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Quiz in Progress</h1>
                <p className="text-slate-600">Question {currentQuiz.currentIndex + 1} of {currentQuiz.questions.length}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(Math.floor((Date.now() - currentQuiz.startTime.getTime()) / 1000))}</span>
              </div>
            </div>
          </div>
          
          <Progress 
            value={(currentQuiz.currentIndex + 1) / currentQuiz.questions.length * 100} 
            className="mb-4"
          />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Question {currentQuiz.currentIndex + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{currentQuestion?.topic}</Badge>
                <Badge className={
                  currentQuestion?.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  currentQuestion?.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  currentQuestion?.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {currentQuestion?.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium text-slate-900">
              {currentQuestion?.question || 'Question text not available'}
            </div>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={(value) => {
                setSelectedAnswer(value);
                if (autoSubmitOnSelect && !isAnswered) {
                  handleSubmitAnswer(value);
                }
              }}
              disabled={isAnswered}
            >
              {(currentQuestion?.options || []).map((option, index) => {
                const isCorrect = option === currentQuestion?.correct_answer;
                const isSelected = option === selectedAnswer;
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                      isAnswered && isCorrect 
                        ? "border-green-500 bg-green-50"
                        : isAnswered && isSelected && !isCorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected && !isAnswered
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer font-medium"
                    >
                      {option}
                    </Label>
                    {isAnswered && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>

            {showExplanation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-2">Explanation</div>
                    <div className="text-blue-800">{currentQuestion?.explanation}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-slate-600 text-center sm:text-left">
            Progress: {currentQuiz.answers.length}/{currentQuiz.questions.length} answered
          </div>

          <div className="flex items-center justify-center sm:justify-end space-x-3">
            {!isAnswered ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 w-full sm:w-auto"
              >
                {isLastQuestion ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Review Answers
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
