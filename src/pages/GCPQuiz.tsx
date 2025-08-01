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
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { gcpQuestions, Question } from '@/data/gcpQuestions';

const GCPQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    setQuestions(gcpQuestions);
    setLoading(false);
  }, []);

  const handleAnswer = (answer: string | string[]) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].userAnswer = answer;
    
    if (updatedQuestions[currentQuestion].type === 'radio') {
      updatedQuestions[currentQuestion].isCorrect = answer === updatedQuestions[currentQuestion].correctAnswer;
    } else {
      const correctAnswers = updatedQuestions[currentQuestion].correctAnswer.split(',');
      const userAnswers = Array.isArray(answer) ? answer : [answer];
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
    setQuestions(gcpQuestions.map(q => ({ ...q, userAnswer: undefined, isCorrect: undefined })));
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
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
                      <p className="font-medium">Question {index + 1}</p>
                      <p className="text-sm text-muted-foreground">{question.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={resetQuiz} variant="outline">
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
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQ.text}</h3>
            
            {currentQ.type === 'radio' ? (
              <RadioGroup
                value={currentQ.userAnswer as string || ''}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={getOptionLabel(index)} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{getOptionLabel(index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${index}`}
                      checked={Array.isArray(currentQ.userAnswer) && currentQ.userAnswer.includes(getOptionLabel(index))}
                      onCheckedChange={(checked) => {
                        const currentAnswers = Array.isArray(currentQ.userAnswer) ? currentQ.userAnswer : [];
                        const newAnswers = checked
                          ? [...currentAnswers, getOptionLabel(index)]
                          : currentAnswers.filter(ans => ans !== getOptionLabel(index));
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
            <Button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            
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