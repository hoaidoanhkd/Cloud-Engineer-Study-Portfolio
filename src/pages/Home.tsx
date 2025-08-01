/**
 * Home page - Main dashboard and entry point
 */

import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  PlayCircle,
  Brain,
  BarChart3,
  Target,
  Activity,
  Trophy,
  Star,
  Zap,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { gcpQuestions } from '../data/gcpQuestions';

export default function HomePage() {
  // Get quiz statistics from localStorage
  const getQuizStats = () => {
    try {
      const savedState = localStorage.getItem('gcp-quiz-state');
      if (savedState) {
        const state = JSON.parse(savedState);
        return {
          totalAnswered: Object.keys(state.userAnswers || {}).length,
          correctAnswers: 0, // Will calculate below
          accuracy: 0
        };
      }
    } catch (error) {
      console.error('Error loading quiz stats:', error);
    }
    return { totalAnswered: 0, correctAnswers: 0, accuracy: 0 };
  };

  const stats = getQuizStats();
  const totalQuestions = gcpQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                GCP Quiz App
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 px-4">
              Master Google Cloud Platform with our comprehensive quiz system. 
              Practice with 302 carefully curated questions covering all GCP topics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/quiz">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </Link>
              <Link to="/gcp-quiz">
                <Button size="lg" variant="outline">
                  <Brain className="h-5 w-5 mr-2" />
                  Full GCP Quiz
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
                <BookOpen className="h-6 w-6 text-blue-600" />
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
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalAnswered}</div>
              <div className="text-sm text-slate-600">Questions Answered</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full inline-block mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.correctAnswers}</div>
              <div className="text-sm text-slate-600">Correct Answers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-yellow-100 rounded-full inline-block mb-4">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.accuracy}%</div>
              <div className="text-sm text-slate-600">Accuracy Rate</div>
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
              <CardTitle>Custom Quiz</CardTitle>
              <CardDescription>
                Create personalized quizzes with topic filtering and customizable question counts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/quiz">
                <Button className="w-full">
                  Start Custom Quiz
                  <PlayCircle className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Full GCP Quiz Feature */}
          <Card className="group hover:shadow-xl transition-shadow border-0 shadow-lg">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-2 group-hover:bg-green-200 transition-colors">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Full GCP Quiz</CardTitle>
              <CardDescription>
                Take the complete 302-question GCP exam simulation with all topics covered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/gcp-quiz">
                <Button variant="outline" className="w-full">
                  Start Full Quiz
                  <Brain className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Progress Heatmap Feature */}
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
                  <BarChart3 className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {stats.totalAnswered > 0 && (
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
                        {stats.totalAnswered} questions answered
                      </div>
                      <div className="text-sm text-slate-600">
                        {stats.correctAnswers} correct • {stats.accuracy}% accuracy rate
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.accuracy >= 80 && (
                      <Badge className="bg-green-100 text-green-800">
                        <Trophy className="h-3 w-3 mr-1" />
                        Excellent
                      </Badge>
                    )}
                    {stats.accuracy >= 60 && stats.accuracy < 80 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        Good
                      </Badge>
                    )}
                    {stats.accuracy < 60 && (
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
            <h2 className="text-3xl font-bold mb-4">Ready to master GCP?</h2>
            <p className="text-xl mb-6 opacity-90">
              Practice with 302 carefully curated questions covering all GCP topics
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/quiz">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Custom Quiz
                </Button>
              </Link>
              <Link to="/gcp-quiz">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Brain className="h-5 w-5 mr-2" />
                  Take Full Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
