/**
 * Home page - Main dashboard and entry point
 */

import React from 'react';
import { Link } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  BarChart3, 
  PlayCircle,
  Trophy,
  Users,
  Clock,
  Zap,
  Star,
  Activity,
  Award,
  Eye,
  FileText,
  Settings,
  Upload,
  Database
} from 'lucide-react';

export default function HomePage() {
  const { state } = useApp();

  // Calculate statistics
  const totalQuestions = state.questions.length;
  const totalAnswered = state.userAnswers.length;
  const correctAnswers = state.userAnswers.filter(a => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  const portfolioItems = Object.keys(state.portfolio).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mobile-content">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                GCP Learning Hub
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 px-4">
              Master Google Cloud Platform with our interactive quiz system. 
              Track your progress like an investment portfolio and visualize your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/quiz">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button size="lg" variant="outline">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalQuestions}</div>
              <div className="text-sm text-slate-600">Total Questions</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{accuracy}%</div>
              <div className="text-sm text-slate-600">Accuracy Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full inline-block mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{portfolioItems}</div>
              <div className="text-sm text-slate-600">Portfolio Items</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-yellow-100 rounded-full inline-block mb-4">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalAnswered}</div>
              <div className="text-sm text-slate-600">Questions Answered</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Quiz Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-2 group-hover:bg-blue-200 transition-colors">
                <PlayCircle className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Interactive Quiz</CardTitle>
              <CardDescription>
                Take comprehensive quizzes on various GCP topics with instant feedback and explanations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/quiz">
                <Button className="w-full">
                  Start Quiz
                  <PlayCircle className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Portfolio Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-2 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Learning Portfolio</CardTitle>
              <CardDescription>
                Track your knowledge like an investment portfolio with performance metrics and growth tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/portfolio">
                <Button variant="outline" className="w-full">
                  View Portfolio
                  <TrendingUp className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Heatmap Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-2 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Progress Heatmap</CardTitle>
              <CardDescription>
                Visualize your learning patterns and identify areas that need more attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/heatmap">
                <Button variant="outline" className="w-full">
                  View Heatmap
                  <Eye className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Guide Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-indigo-100 rounded-lg inline-block mb-2 group-hover:bg-indigo-200 transition-colors">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Study Guide</CardTitle>
              <CardDescription>
                Access comprehensive study materials and best practices for GCP certification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/guide">
                <Button variant="outline" className="w-full">
                  Read Guide
                  <BookOpen className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Import Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-orange-100 rounded-lg inline-block mb-2 group-hover:bg-orange-200 transition-colors">
                <Upload className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Import Questions</CardTitle>
              <CardDescription>
                Upload your own questions from JSON or CSV files to expand the quiz database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/import">
                <Button variant="outline" className="w-full">
                  Import Questions
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Management Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-red-100 rounded-lg inline-block mb-2 group-hover:bg-red-200 transition-colors">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Question Management</CardTitle>
              <CardDescription>
                Manage your question database, edit existing questions, and organize content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/manage">
                <Button variant="outline" className="w-full">
                  Manage Questions
                  <Settings className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {totalAnswered > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {totalAnswered} questions answered
                      </div>
                      <div className="text-sm text-slate-600">
                        {correctAnswers} correct • {accuracy}% accuracy rate
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {accuracy >= 80 && (
                      <Badge className="bg-green-100 text-green-800">
                        <Trophy className="h-3 w-3 mr-1" />
                        Excellent
                      </Badge>
                    )}
                    {accuracy >= 60 && accuracy < 80 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        Good
                      </Badge>
                    )}
                    {accuracy < 60 && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Zap className="h-3 w-3 mr-1" />
                        Keep Practicing
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to level up your GCP skills?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of professionals mastering Google Cloud Platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/quiz">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/guide">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <FileText className="h-5 w-5 mr-2" />
                  Read Study Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
