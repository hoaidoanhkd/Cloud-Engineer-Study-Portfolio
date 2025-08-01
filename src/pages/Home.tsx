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
  XCircle,
  TrendingUp,
  Award,
  Eye
} from 'lucide-react';
import { gcpQuestions } from '../data/gcpQuestions';

export default function HomePage() {
  // Get quiz statistics from localStorage
  const getQuizStats = () => {
    try {
      const savedState = localStorage.getItem('gcp-quiz-state');
      if (savedState) {
        const state = JSON.parse(savedState);
        const userAnswers = state.userAnswers || {};
        const totalAnswered = Object.keys(userAnswers).length;
        
        // Calculate correct answers
        let correctAnswers = 0;
        Object.keys(userAnswers).forEach(questionId => {
          const question = gcpQuestions.find(q => q.id === parseInt(questionId));
          if (question) {
            const userAnswer = userAnswers[questionId];
            const isCorrect = question.type === 'radio' 
              ? userAnswer === question.correctAnswer
              : Array.isArray(userAnswer) && 
                question.correctAnswer.split(',').every(ans => userAnswer.includes(ans)) &&
                userAnswer.length === question.correctAnswer.split(',').length;
            if (isCorrect) correctAnswers++;
          }
        });
        
        return {
          totalAnswered,
          correctAnswers,
          accuracy: totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                GCP Quiz App
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto mb-10 px-4 leading-relaxed">
              Master Google Cloud Platform with our comprehensive quiz system. 
              Practice with <span className="font-semibold text-blue-600">302 carefully curated questions</span> covering all GCP topics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/quiz">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                  <PlayCircle className="h-6 w-6 mr-3" />
                  Start Custom Quiz
                </Button>
              </Link>
              <Link to="/gcp-quiz">
                <Button size="lg" variant="outline" className="border-2 border-slate-300 hover:border-slate-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                  <Brain className="h-6 w-6 mr-3" />
                  Full GCP Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-20">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl inline-block mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">{totalQuestions}</div>
              <div className="text-lg text-slate-600 font-medium">Total Questions</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl inline-block mb-6">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">{stats.totalAnswered}</div>
              <div className="text-lg text-slate-600 font-medium">Questions Answered</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl inline-block mb-6">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">{stats.correctAnswers}</div>
              <div className="text-lg text-slate-600 font-medium">Correct Answers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl inline-block mb-6">
                <Activity className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">{stats.accuracy}%</div>
              <div className="text-lg text-slate-600 font-medium">Accuracy Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* Quiz Feature */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl inline-block mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                <PlayCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Custom Quiz</CardTitle>
              <CardDescription className="text-lg">
                Create personalized quizzes with topic filtering and customizable question counts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/quiz">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6">
                  Start Custom Quiz
                  <PlayCircle className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Full GCP Quiz Feature */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl inline-block mb-4 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Full GCP Quiz</CardTitle>
              <CardDescription className="text-lg">
                Take the complete 302-question GCP exam simulation with all topics covered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/gcp-quiz">
                <Button variant="outline" className="w-full border-2 border-green-300 hover:border-green-400 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6">
                  Start Full Quiz
                  <Brain className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Progress Heatmap Feature */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl inline-block mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Progress Heatmap</CardTitle>
              <CardDescription className="text-lg">
                Visualize your learning patterns and identify areas that need more attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/heatmap">
                <Button variant="outline" className="w-full border-2 border-purple-300 hover:border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6">
                  View Heatmap
                  <Eye className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {stats.totalAnswered > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Recent Activity</h2>
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                      <Activity className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {stats.totalAnswered} questions answered
                      </div>
                      <div className="text-lg text-slate-600">
                        {stats.correctAnswers} correct • {stats.accuracy}% accuracy rate
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {stats.accuracy >= 80 && (
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 px-4 py-2 text-lg">
                        <Trophy className="h-5 w-5 mr-2" />
                        Excellent
                      </Badge>
                    )}
                    {stats.accuracy >= 60 && stats.accuracy < 80 && (
                      <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 px-4 py-2 text-lg">
                        <Star className="h-5 w-5 mr-2" />
                        Good
                      </Badge>
                    )}
                    {stats.accuracy < 60 && (
                      <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-0 px-4 py-2 text-lg">
                        <Zap className="h-5 w-5 mr-2" />
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
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">Ready to master GCP?</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Practice with <span className="font-bold">302 carefully curated questions</span> covering all GCP topics
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/quiz">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                  <PlayCircle className="h-6 w-6 mr-3" />
                  Start Custom Quiz
                </Button>
              </Link>
              <Link to="/gcp-quiz">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                  <Brain className="h-6 w-6 mr-3" />
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
