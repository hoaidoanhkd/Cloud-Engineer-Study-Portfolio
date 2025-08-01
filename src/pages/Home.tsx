/**
 * Home page component - GCP Learning Hub Dashboard
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Zap,
  Award,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';
import { cn, getHoverClasses, getGradientClasses } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export default function Home() {
  // Get stats from localStorage
  const getStats = () => {
    try {
      const stats = localStorage.getItem('gcp-quiz-stats');
      const defaultStats = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalAttempts: 0,
        averageScore: 0,
        lastQuizDate: null,
        topics: {}
      };
      
      if (!stats) return defaultStats;
      
      const parsedStats = JSON.parse(stats);
      return {
        totalQuestions: parsedStats.totalQuestions || 0,
        correctAnswers: parsedStats.correctAnswers || 0,
        totalAttempts: parsedStats.totalAttempts || 0,
        averageScore: parsedStats.averageScore || 0,
        lastQuizDate: parsedStats.lastQuizDate || null,
        topics: parsedStats.topics || {}
      };
    } catch {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        totalAttempts: 0,
        averageScore: 0,
        lastQuizDate: null,
        topics: {}
      };
    }
  };

  const stats = getStats();
  const accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              GCP Learning Hub
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master Google Cloud Platform and prepare for your Associate Cloud Engineer certification
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/gcp-quiz">
                <Button 
                  size="lg" 
                  className={cn(
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6",
                    getHoverClasses('scale')
                  )}
                >
                  <Brain className="h-6 w-6 mr-3" />
                  Start GCP Quiz
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Your Learning Progress
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Track your performance and see how you're progressing in your GCP journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Questions */}
            <Card className={cn("border-0 shadow-lg", getGradientClasses('blue'))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-700">Questions Attempted</span>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {stats.totalQuestions}
                </div>
                <p className="text-sm text-slate-600">Total questions answered</p>
              </CardContent>
            </Card>

            {/* Accuracy */}
            <Card className={cn("border-0 shadow-lg", getGradientClasses('green'))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-700">Accuracy Rate</span>
                  <Target className="h-5 w-5 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {accuracy}%
                </div>
                <p className="text-sm text-slate-600">Correct answers</p>
              </CardContent>
            </Card>

            {/* Quiz Attempts */}
            <Card className={cn("border-0 shadow-lg", getGradientClasses('purple'))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-700">Quiz Attempts</span>
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {stats.totalAttempts}
                </div>
                <p className="text-sm text-slate-600">Total quiz sessions</p>
              </CardContent>
            </Card>

            {/* Average Score */}
            <Card className={cn("border-0 shadow-lg", getGradientClasses('orange'))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-700">Average Score</span>
                  <Award className="h-5 w-5 text-orange-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {(stats.averageScore || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-slate-600">Per quiz session</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {stats.totalQuestions > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Overall Progress</CardTitle>
                <CardDescription>
                  Your journey to GCP Associate Cloud Engineer certification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm font-medium text-slate-900">{accuracy}%</span>
                  </div>
                  <Progress value={parseFloat(accuracy)} className="h-3" />
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Keep practicing to improve your score!</span>
                    <span>{stats.correctAnswers} / {stats.totalQuestions} correct</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose GCP Learning Hub?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Comprehensive study materials and practice tests designed specifically for the GCP Associate Cloud Engineer exam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg w-fit">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-slate-900">Comprehensive Questions</CardTitle>
                <CardDescription>
                  Practice with hundreds of carefully crafted questions covering all exam domains
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg w-fit">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-slate-900">Detailed Explanations</CardTitle>
                <CardDescription>
                  Learn from detailed explanations for every question to understand concepts better
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg w-fit">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-slate-900">Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your progress and identify areas that need more focus
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg w-fit">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-slate-900">Exam Simulation</CardTitle>
                <CardDescription>
                  Experience real exam conditions with timed practice tests
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg w-fit">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-slate-900">Community Support</CardTitle>
                <CardDescription>
                  Join a community of learners preparing for the same certification
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg w-fit">
                  <Calendar className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-slate-900">Flexible Learning</CardTitle>
                <CardDescription>
                  Study at your own pace with 24/7 access to all materials
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className={cn("border-0 shadow-2xl text-center", getGradientClasses('blue'))}>
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your GCP Journey?
              </CardTitle>
              <CardDescription className="text-xl text-blue-100">
                Begin practicing with our comprehensive GCP quiz questions today
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <Link to="/gcp-quiz">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className={cn(
                    "bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6",
                    getHoverClasses('scale')
                  )}
                >
                  <Brain className="h-6 w-6 mr-3" />
                  Start GCP Quiz Now
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
