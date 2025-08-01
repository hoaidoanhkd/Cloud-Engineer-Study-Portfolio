/**
 * Home page - GCP Learning Hub Dashboard
 */

import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Brain, 
  PlayCircle, 
  Trophy, 
  Clock, 
  Target,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { gcpQuestions } from '../../gcpQuestions';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            GCP Learning Hub
          </h1>
          <p className="text-lg text-slate-600">
            Master Google Cloud Platform with interactive quizzes and comprehensive learning resources
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* GCP Quiz Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl">GCP Quiz</CardTitle>
              </div>
              <CardDescription>
                Test your knowledge with {gcpQuestions.length} carefully curated questions covering all GCP topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Questions:</span>
                <Badge variant="outline">{gcpQuestions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Types:</span>
                <Badge variant="outline">Single & Multiple Choice</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Topics:</span>
                <Badge variant="outline">All GCP Services</Badge>
              </div>
              
              <Link to="/gcp-quiz">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
              </div>
              <CardDescription>
                Monitor your learning progress and identify areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Real-time:</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Analytics:</span>
                <Badge variant="outline">Performance Metrics</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Review:</span>
                <Badge variant="outline">Answer Analysis</Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Progress
              </Button>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Learning Resources</CardTitle>
              </div>
              <CardDescription>
                Access comprehensive study materials and official GCP documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Materials:</span>
                <Badge variant="outline">Official Docs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Practice:</span>
                <Badge variant="outline">Hands-on Labs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Updates:</span>
                <Badge variant="outline">Latest Content</Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{gcpQuestions.length}</div>
            <div className="text-sm text-blue-600">Total Questions</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">Multiple</div>
            <div className="text-sm text-green-600">Question Types</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">Real-time</div>
            <div className="text-sm text-purple-600">Progress Tracking</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">Interactive</div>
            <div className="text-sm text-orange-600">Learning Experience</div>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              Ready to Test Your GCP Knowledge?
            </CardTitle>
            <CardDescription className="text-blue-100">
              Start your journey to becoming a Google Cloud Certified Associate Cloud Engineer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/gcp-quiz">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start GCP Quiz Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
