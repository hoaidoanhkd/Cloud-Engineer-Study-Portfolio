/**
 * Quiz page - Interactive quiz interface with review functionality
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
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
  BarChart3,
  Brain
} from 'lucide-react';
import { cn } from '../lib/utils';
import { gcpQuestions, Question } from '../data/gcpQuestions';

interface QuizStats {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  timeSpent: number;
}

// GCP Topics mapping
const gcpTopics = {
  'compute': 'Compute Engine & GKE',
  'storage': 'Cloud Storage & Databases',
  'networking': 'Networking & Security',
  'iam': 'Identity & Access Management',
  'monitoring': 'Monitoring & Logging',
  'billing': 'Billing & Cost Management',
  'deployment': 'Deployment & DevOps',
  'data': 'Data & Analytics',
  'ai': 'AI & Machine Learning',
  'serverless': 'Serverless & App Engine'
};

// Extract topic from question text
const extractTopic = (questionText: string): string => {
  const text = questionText.toLowerCase();
  
  if (text.includes('compute engine') || text.includes('gke') || text.includes('kubernetes') || text.includes('vm')) {
    return 'compute';
  } else if (text.includes('cloud storage') || text.includes('bigquery') || text.includes('cloud sql') || text.includes('spanner') || text.includes('bigtable')) {
    return 'storage';
  } else if (text.includes('vpc') || text.includes('network') || text.includes('firewall') || text.includes('load balancer')) {
    return 'networking';
  } else if (text.includes('iam') || text.includes('service account') || text.includes('role') || text.includes('permission')) {
    return 'iam';
  } else if (text.includes('monitoring') || text.includes('logging') || text.includes('stackdriver')) {
    return 'monitoring';
  } else if (text.includes('billing') || text.includes('cost') || text.includes('pricing')) {
    return 'billing';
  } else if (text.includes('deployment') || text.includes('terraform') || text.includes('deployment manager')) {
    return 'deployment';
  } else if (text.includes('data') || text.includes('analytics') || text.includes('pub/sub')) {
    return 'data';
  } else if (text.includes('ai') || text.includes('machine learning') || text.includes('ml')) {
    return 'ai';
  } else if (text.includes('app engine') || text.includes('cloud run') || text.includes('functions')) {
    return 'serverless';
  }
  
  return 'general';
};

// Extract keywords from question text
const extractKeywords = (questionText: string): string[] => {
  const keywords = [];
  const text = questionText.toLowerCase();
  
  // Common GCP services and concepts
  const commonKeywords = [
    'compute engine', 'cloud storage', 'bigquery', 'cloud sql', 'spanner', 'bigtable',
    'vpc', 'firewall', 'load balancer', 'iam', 'service account', 'monitoring',
    'logging', 'billing', 'deployment', 'terraform', 'kubernetes', 'gke',
    'app engine', 'cloud run', 'functions', 'pub/sub', 'dataflow', 'dataproc'
  ];
  
  for (const keyword of commonKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  
  return keywords.slice(0, 3); // Limit to 3 keywords
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  // Load quiz state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('gcp-quiz-state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.quizStarted && !state.quizCompleted) {
          setQuizStarted(state.quizStarted);
          setCurrentQuestionIndex(state.currentQuestionIndex);
          setUserAnswers(state.userAnswers);
          setStartTime(state.startTime);
          setFilteredQuestions(state.filteredQuestions);
          setQuestionCount(state.questionCount);
        }
      } catch (error) {
        console.error('Error loading quiz state:', error);
      }
    }
  }, []);

  // Save quiz state to localStorage
  useEffect(() => {
    if (quizStarted) {
      const state = {
        quizStarted,
        currentQuestionIndex,
        userAnswers,
        startTime,
        filteredQuestions,
        questionCount,
        quizCompleted
      };
      localStorage.setItem('gcp-quiz-state', JSON.stringify(state));
    }
  }, [quizStarted, currentQuestionIndex, userAnswers, startTime, filteredQuestions, questionCount, quizCompleted]);

  // Initialize questions with topics and keywords
  useEffect(() => {
    const questionsWithMetadata = gcpQuestions.map(q => ({
      ...q,
      topic: extractTopic(q.text),
      keywords: extractKeywords(q.text)
    }));
    setQuestions(questionsWithMetadata);
    if (!quizStarted) {
      setFilteredQuestions(questionsWithMetadata);
    }
  }, []);

  /**
   * Get question count for each topic
   */
  const getTopicCounts = () => {
    const counts: Record<string, number> = {
      'all': questions.length
    };
    
    questions.forEach(question => {
      const topic = question.topic as string;
      if (topic) {
        counts[topic] = (counts[topic] || 0) + 1;
      }
    });
    
    return counts;
  };

  /**
   * Get question count for each keyword
   */
  const getKeywordCounts = () => {
    const counts: Record<string, number> = {
      'all': questions.length
    };
    
    questions.forEach(question => {
      const keywords = question.keywords as string[];
      if (keywords && Array.isArray(keywords)) {
        keywords.forEach(keyword => {
          counts[keyword] = (counts[keyword] || 0) + 1;
        });
      }
    });
    
    return counts;
  };

  /**
   * Filter questions based on selected topic and keyword
   */
  useEffect(() => {
    let filtered = questions;

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic === selectedTopic);
    }

    if (selectedKeyword !== 'all') {
      filtered = filtered.filter(q => {
        const keywords = q.keywords as string[];
        return keywords && keywords.includes(selectedKeyword);
      });
    }

    setFilteredQuestions(filtered);
  }, [questions, selectedTopic, selectedKeyword]);

  const handleStartQuiz = () => {
    const shuffledQuestions = [...filteredQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);
    
    setFilteredQuestions(shuffledQuestions);
    setQuizStarted(true);
    setStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  const handleSubmitAnswer = (answer?: string | string[]) => {
    if (answer) {
      const currentQuestion = filteredQuestions[currentQuestionIndex];

      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const getQuizStats = (): QuizStats => {
    const total = filteredQuestions.length;
    const correct = filteredQuestions.filter(q => {
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return false;
      
      if (q.type === 'radio') {
        return userAnswer === q.correctAnswer;
      } else {
        // For checkbox questions
        const correctAnswers = q.correctAnswer.split(',');
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        return correctAnswers.every(ans => userAnswers.includes(ans)) && 
               userAnswers.length === correctAnswers.length;
      }
    }).length;
    
    const incorrect = total - correct;
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    const timeSpent = startTime > 0 ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    return { total, correct, incorrect, percentage, timeSpent };
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleReviewNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && reviewIndex > 0) {
      setReviewIndex(reviewIndex - 1);
    } else if (direction === 'next' && reviewIndex < filteredQuestions.length - 1) {
      setReviewIndex(reviewIndex + 1);
    }
  };

  const handleFinishQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setReviewMode(false);
    setReviewIndex(0);
    // Clear localStorage
    localStorage.removeItem('gcp-quiz-state');
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setReviewMode(false);
    setReviewIndex(0);
    setSelectedTopic('all');
    setSelectedKeyword('all');
    setQuestionCount(10);
    // Clear localStorage
    localStorage.removeItem('gcp-quiz-state');
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const stats = getQuizStats();

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Configuration */}
          <div className="lg:col-span-2">
            <Card>
                             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <BookOpen className="h-5 w-5" />
                   GCP Quiz Configuration
                 </CardTitle>
                 <CardDescription>
                   Configure your quiz settings and select topics to focus on
                 </CardDescription>
                 {quizStarted && (
                   <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                     <p className="text-sm text-blue-800">
                       <strong>Quiz in progress:</strong> Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                     </p>
                   </div>
                 )}
               </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Count */}
                <div className="space-y-2">
                  <Label htmlFor="questionCount">Number of Questions</Label>
                  <Input
                    id="questionCount"
                    type="number"
                    min="1"
                    max={filteredQuestions.length}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Math.min(parseInt(e.target.value) || 1, filteredQuestions.length))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Available: {filteredQuestions.length} questions
                  </p>
                </div>

                {/* Topic Selection */}
                <div className="space-y-2">
                  <Label>Filter by Topic</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics ({questions.length})</SelectItem>
                      {Object.entries(getTopicCounts()).map(([topic, count]) => {
                        if (topic === 'all') return null;
                        return (
                          <SelectItem key={topic} value={topic}>
                            {gcpTopics[topic as keyof typeof gcpTopics] || topic} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Keyword Selection */}
                <div className="space-y-2">
                  <Label>Filter by Keyword</Label>
                  <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a keyword" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Keywords ({questions.length})</SelectItem>
                      {Object.entries(getKeywordCounts()).map(([keyword, count]) => {
                        if (keyword === 'all') return null;
                        return (
                          <SelectItem key={keyword} value={keyword}>
                            {keyword} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                                 <div className="flex gap-2">
                   <Button 
                     onClick={handleStartQuiz}
                     className="flex-1"
                     disabled={filteredQuestions.length === 0}
                   >
                     <PlayCircle className="h-4 w-4 mr-2" />
                     Start Quiz ({questionCount} questions)
                   </Button>
                   <Button 
                     onClick={handleResetQuiz}
                     variant="outline"
                     size="sm"
                   >
                     <RotateCcw className="h-4 w-4" />
                   </Button>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quiz Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Total Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{filteredQuestions.length}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Topics Covered:</span>
                    <span>{Object.keys(getTopicCounts()).length - 1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Keywords Available:</span>
                    <span>{Object.keys(getKeywordCounts()).length - 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/gcp-quiz">
                    <Brain className="h-4 w-4 mr-2" />
                    Full GCP Quiz (302 questions)
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/heatmap">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Progress Heatmap
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Summary */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{stats.correct}/{stats.total}</div>
              <div className="text-xl">
                <Badge 
                  variant="default" 
                  className={cn(
                    "text-lg px-4 py-2",
                    stats.percentage >= 80 ? "bg-green-500" : 
                    stats.percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                  )}
                >
                  {stats.percentage >= 80 ? "Excellent!" : 
                   stats.percentage >= 60 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
              <Progress value={stats.percentage} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {stats.percentage.toFixed(1)}% correct • {formatTime(stats.timeSpent)} time
              </p>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatTime(stats.timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>

                         {/* Action Buttons */}
             <div className="flex justify-center gap-4">
               <Button onClick={() => setReviewMode(true)} variant="outline">
                 <Eye className="h-4 w-4 mr-2" />
                 Review Answers
               </Button>
               <Button onClick={handleFinishQuiz}>
                 <Home className="h-4 w-4 mr-2" />
                 Back to Quiz Setup
               </Button>
               <Button onClick={handleResetQuiz} variant="outline">
                 <RotateCcw className="h-4 w-4 mr-2" />
                 Reset Quiz
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviewMode) {
    const reviewQuestion = filteredQuestions[reviewIndex];
    const userAnswer = userAnswers[reviewQuestion.id];
    

    
    // Calculate if answer is correct
    let isCorrect = false;
    if (userAnswer) {
      if (reviewQuestion.type === 'radio') {
        isCorrect = userAnswer === reviewQuestion.correctAnswer;
      } else {
        // For checkbox questions
        const correctAnswers = reviewQuestion.correctAnswer.split(',');
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        isCorrect = correctAnswers.every(ans => userAnswers.includes(ans)) && 
                   userAnswers.length === correctAnswers.length;
      }
    }
    


    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Review Answers</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReviewNavigation('prev')}
                  disabled={reviewIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {reviewIndex + 1} of {filteredQuestions.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReviewNavigation('next')}
                  disabled={reviewIndex === filteredQuestions.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
                         <div className="space-y-4">
               <div className="flex items-center gap-2">
                 {isCorrect ? (
                   <CheckCircle className="text-green-500" size={20} />
                 ) : (
                   <XCircle className="text-red-500" size={20} />
                 )}
                 <Badge variant="outline">
                   {gcpTopics[reviewQuestion.topic as keyof typeof gcpTopics] || 'General'}
                 </Badge>
                 <Badge variant={isCorrect ? "default" : "destructive"} className="ml-auto">
                   {isCorrect ? "Correct" : "Incorrect"}
                 </Badge>
               </div>
               
               <h3 className="text-lg font-semibold">{reviewQuestion.text}</h3>
               
                               {/* Show user's answer */}
                {userAnswer ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Your Answer:</p>
                    <p className="text-blue-700">
                      {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-1">Your Answer:</p>
                    <p className="text-gray-700">No answer provided</p>
                  </div>
                )}
                
                {/* Show correct answer */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Correct Answer:</p>
                  <p className="text-green-700">
                    {reviewQuestion.correctAnswer}
                  </p>
                </div>
              
                             <div className="space-y-2">
                 {reviewQuestion.options.map((option, index) => {
                   const optionLetter = String.fromCharCode(65 + index);
                   const isSelected = reviewQuestion.type === 'radio' 
                     ? safeUserAnswer === optionLetter
                     : Array.isArray(safeUserAnswer) && safeUserAnswer.includes(optionLetter);
                   const isCorrectOption = reviewQuestion.correctAnswer.includes(optionLetter);
                   
                   // Handle undefined userAnswer
                   const safeUserAnswer = userAnswer || '';
                   

                   

                   
                   return (
                     <div
                       key={index}
                       className={cn(
                         "p-3 rounded-lg border",
                         isCorrectOption && "bg-green-50 border-green-200",
                         isSelected && !isCorrectOption && "bg-red-50 border-red-200",
                         isSelected && isCorrectOption && "bg-green-50 border-green-200",
                         !isSelected && !isCorrectOption && "bg-gray-50 border-gray-200"
                       )}
                     >
                       <div className="flex items-center gap-2">
                         <span className="font-medium">{optionLetter}.</span>
                         <span>{option}</span>
                         <div className="ml-auto flex items-center gap-2">
                           {isCorrectOption && <CheckCircle className="text-green-500" size={16} />}
                           {isSelected && !isCorrectOption && <XCircle className="text-red-500" size={16} />}
                           {isSelected && isCorrectOption && <CheckCircle className="text-green-500" size={16} />}
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>

                         <div className="flex justify-center gap-4">
               <Button onClick={handleFinishQuiz}>
                 <Home className="h-4 w-4 mr-2" />
                 Back to Quiz Setup
               </Button>
               <Button onClick={handleResetQuiz} variant="outline">
                 <RotateCcw className="h-4 w-4 mr-2" />
                 Reset Quiz
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatTime(Math.floor((Date.now() - startTime) / 1000))}
              </span>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / filteredQuestions.length) * 100} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {gcpTopics[currentQuestion.topic as keyof typeof gcpTopics] || 'General'}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold">{currentQuestion.text}</h3>
            
            {currentQuestion.type === 'radio' ? (
              <RadioGroup
                value={userAnswers[currentQuestion.id] as string || ''}
                onValueChange={handleSubmitAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={String.fromCharCode(65 + index)} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`option-${index}`}
                      checked={Array.isArray(userAnswers[currentQuestion.id]) && 
                        (userAnswers[currentQuestion.id] as string[]).includes(String.fromCharCode(65 + index))}
                      onChange={(e) => {
                        const currentAnswers = Array.isArray(userAnswers[currentQuestion.id]) 
                          ? userAnswers[currentQuestion.id] as string[] 
                          : [];
                        const newAnswers = e.target.checked
                          ? [...currentAnswers, String.fromCharCode(65 + index)]
                          : currentAnswers.filter(ans => ans !== String.fromCharCode(65 + index));
                        handleSubmitAnswer(newAnswers);
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

                     <div className="flex justify-between items-center">
             <div className="flex gap-2">
               <Button
                 onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                 disabled={currentQuestionIndex === 0}
                 variant="outline"
               >
                 <ArrowLeft className="h-4 w-4 mr-2" />
                 Previous
               </Button>
               
               <Button
                 onClick={handleNextQuestion}
                 disabled={!userAnswers[currentQuestion.id]}
               >
                 {currentQuestionIndex === filteredQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                 <ArrowRight className="h-4 w-4 ml-2" />
               </Button>
             </div>
             
             <Button
               onClick={handleResetQuiz}
               variant="outline"
               size="sm"
             >
               <RotateCcw className="h-4 w-4 mr-2" />
               Reset
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
