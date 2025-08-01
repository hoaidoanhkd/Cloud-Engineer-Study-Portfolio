import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Shuffle, RotateCcw } from 'lucide-react';
import { gcpQuestions, Question } from '@/data/gcpQuestions';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

interface ShuffledQuestion extends Question {
  shuffledOptions: string[];
  shuffledOptionIndices: number[];
  topic: string;
  keywords: string[];
}

const GCPQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);

  // Initialize questions with shuffled options
  useEffect(() => {
    const shuffledQuestions = gcpQuestions.map(q => {
      const topic = extractTopic(q.text);
      const keywords = extractKeywords(q.text);
      
      // Create shuffled options with their original indices
      const optionIndices = Array.from({ length: q.options.length }, (_, i) => i);
      const shuffledIndices = shuffleArray(optionIndices);
      const shuffledOptions = shuffledIndices.map(index => q.options[index]);
      
      return {
        ...q,
        shuffledOptions,
        shuffledOptionIndices: shuffledIndices,
        topic,
        keywords
      };
    });
    
    setQuestions(shuffledQuestions);
    setLoading(false);
  }, []);

  const handleAnswer = (answer: string | string[]) => {
    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQuestion];
    
    // Convert shuffled answer back to original format
    let originalAnswer: string | string[];
    if (Array.isArray(answer)) {
      originalAnswer = answer.map(ans => {
        const shuffledIndex = currentQ.shuffledOptions.findIndex(opt => opt.startsWith(ans));
        return String.fromCharCode(65 + currentQ.shuffledOptionIndices[shuffledIndex]);
      });
    } else {
      const shuffledIndex = currentQ.shuffledOptions.findIndex(opt => opt.startsWith(answer));
      originalAnswer = String.fromCharCode(65 + currentQ.shuffledOptionIndices[shuffledIndex]);
    }
    
    updatedQuestions[currentQuestion].userAnswer = originalAnswer;
    
    if (updatedQuestions[currentQuestion].type === 'radio') {
      updatedQuestions[currentQuestion].isCorrect = originalAnswer === updatedQuestions[currentQuestion].correctAnswer;
    } else {
      const correctAnswers = updatedQuestions[currentQuestion].correctAnswer.split(',');
      const userAnswers = Array.isArray(originalAnswer) ? originalAnswer : [originalAnswer];
      updatedQuestions[currentQuestion].isCorrect = 
        correctAnswers.every(ans => userAnswers.includes(ans)) && 
        userAnswers.length === correctAnswers.length;
    }
    
    setQuestions(updatedQuestions);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    setScore(correctAnswers);
  };

  const resetQuiz = () => {
    const shuffledQuestions = gcpQuestions.map(q => {
      const topic = extractTopic(q.text);
      const keywords = extractKeywords(q.text);
      
      const optionIndices = Array.from({ length: q.options.length }, (_, i) => i);
      const shuffledIndices = shuffleArray(optionIndices);
      const shuffledOptions = shuffledIndices.map(index => q.options[index]);
      
      return {
        ...q,
        shuffledOptions,
        shuffledOptionIndices: shuffledIndices,
        topic,
        keywords,
        userAnswer: undefined,
        isCorrect: undefined
      };
    });
    
    setQuestions(shuffledQuestions);
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
    setIsShuffled(true);
  };

  const shuffleCurrentQuestion = () => {
    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQuestion];
    
    // Re-shuffle options for current question
    const optionIndices = Array.from({ length: currentQ.options.length }, (_, i) => i);
    const shuffledIndices = shuffleArray(optionIndices);
    const shuffledOptions = shuffledIndices.map(index => currentQ.options[index]);
    
    updatedQuestions[currentQuestion] = {
      ...currentQ,
      shuffledOptions,
      shuffledOptionIndices: shuffledIndices,
      userAnswer: undefined,
      isCorrect: undefined
    };
    
    setQuestions(updatedQuestions);
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D, E...
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading GCP Quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">GCP Exam Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">{score}/{questions.length}</div>
              <div className="text-xl mb-4">
                {percentage >= 80 ? (
                  <Badge variant="default" className="bg-green-500">Excellent!</Badge>
                ) : percentage >= 60 ? (
                  <Badge variant="default" className="bg-yellow-500">Good</Badge>
                ) : (
                  <Badge variant="destructive">Needs Improvement</Badge>
                )}
              </div>
              <Progress value={percentage} className="w-full" />
              <p className="mt-2 text-sm text-muted-foreground">
                {percentage.toFixed(1)}% correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Question Review:</h3>
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {question.isCorrect ? (
                      <CheckCircle className="text-green-500 mt-1" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mt-1" size={20} />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">Question {index + 1}</p>
                        <Badge variant="outline" className="text-xs">
                          {gcpTopics[question.topic as keyof typeof gcpTopics] || 'General'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{question.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">GCP Cloud Engineer Exam Practice</CardTitle>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={getProgressPercentage()} className="w-full" />
          
          {/* Topic and Keywords */}
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {gcpTopics[currentQ.topic as keyof typeof gcpTopics] || 'General'}
            </Badge>
            {currentQ.keywords.length > 0 && (
              <div className="flex gap-2">
                {currentQ.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQ.text}</h3>
            
            {currentQ.type === 'radio' ? (
              <RadioGroup
                value={currentQ.userAnswer ? 
                  currentQ.shuffledOptions.findIndex(opt => 
                    opt.startsWith(String.fromCharCode(65 + currentQ.shuffledOptionIndices.indexOf(
                      currentQ.userAnswer.charCodeAt(0) - 65
                    )))
                  ).toString() : ''
                }
                onValueChange={(value) => {
                  const optionIndex = parseInt(value);
                  const answer = getOptionLabel(optionIndex);
                  handleAnswer(answer);
                }}
                className="space-y-3"
              >
                {currentQ.shuffledOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{getOptionLabel(index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQ.shuffledOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${index}`}
                      checked={Array.isArray(currentQ.userAnswer) && 
                        currentQ.userAnswer.some(ans => {
                          const originalIndex = currentQ.shuffledOptionIndices[index];
                          return ans === String.fromCharCode(65 + originalIndex);
                        })
                      }
                      onCheckedChange={(checked) => {
                        const originalIndex = currentQ.shuffledOptionIndices[index];
                        const answer = String.fromCharCode(65 + originalIndex);
                        const currentAnswers = Array.isArray(currentQ.userAnswer) ? currentQ.userAnswer : [];
                        const newAnswers = checked
                          ? [...currentAnswers, answer]
                          : currentAnswers.filter(ans => ans !== answer);
                        handleAnswer(newAnswers);
                      }}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{getOptionLabel(index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentQ.userAnswer && (
            <Alert className={currentQ.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertCircle className={currentQ.isCorrect ? "text-green-600" : "text-red-600"} />
              <AlertDescription className={currentQ.isCorrect ? "text-green-800" : "text-red-800"}>
                {currentQ.isCorrect ? "Correct!" : "Incorrect. Please review the question and try again."}
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <Button
                onClick={shuffleCurrentQuestion}
                variant="outline"
                size="sm"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle Options
              </Button>
            </div>
            
            <Button
              onClick={nextQuestion}
              disabled={!currentQ.userAnswer}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GCPQuiz; 