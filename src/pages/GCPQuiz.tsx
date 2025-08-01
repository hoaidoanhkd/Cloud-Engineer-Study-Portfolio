/**
 * GCP Quiz Page - Interactive quiz using gcpQuestions.ts data
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  Home,
  Eye,
  PlayCircle,
  BarChart3,
  Brain
} from 'lucide-react';
import { cn } from '../lib/utils';
import { gcpQuestions } from '../../gcpQuestions';

interface QuizStats {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  timeSpent: number;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: string | string[];
  isCorrect: boolean;
  timestamp: Date;
}

export default function GCPQuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Use all questions without shuffling to maintain order
  const allQuestions = useMemo(() => {
    return gcpQuestions;
  }, []);

  const currentQuestion = allQuestions[currentQuestionIndex];

  /**
   * Start the quiz
   */
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(new Date());
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer([]);
    setQuizFinished(false);
    setShowReview(false);
  };

  /**
   * Handle answer selection
   */
  const handleAnswerChange = (value: string | string[]) => {
    setSelectedAnswer(value);
  };

  /**
   * Submit answer and handle feedback
   */
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    // For now, all questions are single choice (radio)
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timestamp: new Date()
    };

    setUserAnswers((prev: UserAnswer[]) => [...prev, userAnswer]);
    setAnsweredQuestions((prev: Set<number>) => new Set([...prev, currentQuestion.id]));

    if (isCorrect) {
      // If correct, automatically move to next question
      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex((prev: number) => prev + 1);
        setSelectedAnswer([]);
        setShowAnswer(false);
      } else {
        setQuizFinished(true);
      }
    } else {
      // If incorrect, show the correct answer
      setShowAnswer(true);
    }
  };

  /**
   * Get quiz statistics
   */
  const getQuizStats = (): QuizStats => {
    const total = userAnswers.length;
    const correct = userAnswers.filter((answer: UserAnswer) => answer.isCorrect).length;
    const incorrect = total - correct;
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;

    return { total, correct, incorrect, percentage, timeSpent };
  };

  /**
   * Format time display
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get performance color
   */
  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Reset quiz
   */
  const handleReset = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer([]);
    setStartTime(null);
    setShowReview(false);
    setReviewIndex(0);
    setShowAnswer(false);
    setAnsweredQuestions(new Set());
  };

  /**
   * Navigate review
   */
  const handleReviewNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && reviewIndex > 0) {
      setReviewIndex((prev: number) => prev - 1);
    } else if (direction === 'next' && reviewIndex < userAnswers.length - 1) {
      setReviewIndex((prev: number) => prev + 1);
    }
  };

  const stats = getQuizStats();

  // Quiz not started - show start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
                GCP Associate Cloud Engineer Quiz
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Test your knowledge with all {allQuestions.length} carefully curated questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{allQuestions.length}</div>
                  <div className="text-sm text-blue-600">Total Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Complete</div>
                  <div className="text-sm text-green-600">Full Coverage</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">All Topics</div>
                  <div className="text-sm text-purple-600">GCP Services</div>
                </div>
              </div>
              
              <Button 
                onClick={handleStartQuiz}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Complete Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz finished - show results
  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
                Quiz Completed!
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Great job! You've completed all {allQuestions.length} questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                  <div className="text-sm text-green-600">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                  <div className="text-sm text-red-600">Incorrect</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getPerformanceColor(stats.percentage)}`}>
                    {stats.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-600">Accuracy</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Time Spent:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatTime(stats.timeSpent)}
                  </span>
                </div>
                <Progress value={stats.percentage} className="h-2" />
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowReview(true)}
                  variant="outline"
                  size="lg"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Review All Answers
                </Button>
                <Button 
                  onClick={handleReset}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Take Quiz Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Review mode
  if (showReview) {
    const reviewAnswer = userAnswers[reviewIndex];
    const reviewQuestion = allQuestions.find(q => q.id === reviewAnswer.questionId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Review Answers ({reviewIndex + 1} of {userAnswers.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewNavigation('prev')}
                    disabled={reviewIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewNavigation('next')}
                    disabled={reviewIndex === userAnswers.length - 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {reviewQuestion && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant={reviewAnswer.isCorrect ? "default" : "destructive"}>
                        {reviewAnswer.isCorrect ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {reviewAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                      <Badge variant="outline">
                        Question {reviewIndex + 1}
                      </Badge>
                    </div>
                    
                    <div className="text-lg font-medium text-slate-900">
                      {reviewQuestion.text}
                    </div>

                    <div className="space-y-2">
                      {reviewQuestion.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index);
                        const isSelected = Array.isArray(reviewAnswer.selectedAnswer) 
                          ? reviewAnswer.selectedAnswer.includes(optionLetter)
                          : reviewAnswer.selectedAnswer === optionLetter;
                        const isCorrect = reviewQuestion.correctAnswer.includes(optionLetter);
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "p-3 rounded-lg border",
                              isCorrect && "bg-green-50 border-green-200",
                              isSelected && !isCorrect && "bg-red-50 border-red-200",
                              isSelected && isCorrect && "bg-green-50 border-green-200",
                              !isSelected && !isCorrect && "bg-slate-50 border-slate-200"
                            )}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-600 w-6">
                                {optionLetter}.
                              </span>
                              <span className="flex-1">{option}</span>
                              {isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900 mb-2">Your Answer:</div>
                      <div className="text-blue-700">
                        {Array.isArray(reviewAnswer.selectedAnswer) 
                          ? reviewAnswer.selectedAnswer.join(', ')
                          : reviewAnswer.selectedAnswer}
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900 mb-2">Correct Answer:</div>
                      <div className="text-green-700">{reviewQuestion.correctAnswer}</div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setShowReview(false)}
                  variant="outline"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Results
                </Button>
                <Button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Take Quiz Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active quiz - show current question
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                GCP Quiz - Complete Set
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">
                    {formatTime(stats.timeSpent)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">
                    {currentQuestionIndex + 1} / {allQuestions.length}
                  </span>
                </div>
              </div>
            </div>
            <Progress 
              value={((currentQuestionIndex + 1) / allQuestions.length) * 100} 
              className="h-2" 
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1}
                </Badge>
                <Badge variant="outline">
                  Single Choice
                </Badge>
              </div>
              
              <div className="text-lg font-medium text-slate-900">
                {currentQuestion.text}
              </div>

              <RadioGroup
                value={selectedAnswer as string}
                onValueChange={handleAnswerChange}
                className="space-y-3"
                disabled={showAnswer}
              >
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index);
                  const isSelected = selectedAnswer === optionLetter;
                  const isCorrect = currentQuestion.correctAnswer === optionLetter;
                  
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={optionLetter} 
                        id={`option-${index}`}
                        disabled={showAnswer}
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className={cn(
                          "flex-1 cursor-pointer",
                          showAnswer && isCorrect && "text-green-700 font-medium",
                          showAnswer && isSelected && !isCorrect && "text-red-700 font-medium"
                        )}
                      >
                        <span className="font-medium text-slate-600 w-6">
                          {optionLetter}.
                        </span>
                        <span>{option}</span>
                        {showAnswer && isCorrect && <CheckCircle className="ml-2 h-4 w-4 text-green-600 inline" />}
                        {showAnswer && isSelected && !isCorrect && <XCircle className="ml-2 h-4 w-4 text-red-600 inline" />}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>

              {/* Show correct answer when wrong */}
              {showAnswer && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="font-medium text-green-900">Đáp án đúng:</div>
                  </div>
                  <div className="text-green-700">
                    {currentQuestion.correctAnswer}: {currentQuestion.options[currentQuestion.correctAnswer.charCodeAt(0) - 65]}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Quiz
              </Button>
              
              {!showAnswer ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || 
                    (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Trả lời
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (currentQuestionIndex < allQuestions.length - 1) {
                      setCurrentQuestionIndex((prev: number) => prev + 1);
                      setSelectedAnswer([]);
                      setShowAnswer(false);
                    } else {
                      setQuizFinished(true);
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {currentQuestionIndex === allQuestions.length - 1 ? 'Kết thúc' : 'Tiếp tục'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 