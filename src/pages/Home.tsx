/**
 * Home page - GCP Quiz Dashboard
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Brain, 
  PlayCircle, 
  BookOpen,
  BarChart3
} from 'lucide-react';
import { gcpQuestions } from '../../gcpQuestions';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            GCP Associate Cloud Engineer Quiz
          </h1>
          <p className="text-lg text-slate-600">
            Complete practice test with all {gcpQuestions.length} questions covering Google Cloud Platform
          </p>
        </div>

        {/* Main Quiz Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Complete GCP Practice Test
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Test your knowledge with all {gcpQuestions.length} carefully curated questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gcpQuestions.length}</div>
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
            
            <Link to="/gcp-quiz" className="block">
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
              >
                <PlayCircle className="mr-3 h-6 w-6" />
                Start Complete GCP Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
              </div>
              <CardDescription>
                Real-time progress tracking with detailed performance analytics
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
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Complete Coverage</CardTitle>
              </div>
              <CardDescription>
                All GCP topics covered for Associate Cloud Engineer certification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Topics:</span>
                <Badge variant="outline">All GCP Services</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Questions:</span>
                <Badge variant="outline">Single & Multiple Choice</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Difficulty:</span>
                <Badge variant="outline">Exam Level</Badge>
              </div>
            </CardContent>
          </Card>
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
                Start Complete GCP Quiz Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
