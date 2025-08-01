/**
 * Portfolio page - Learning portfolio and analytics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Activity, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Trophy,
  Star,
  Zap,
  Clock,
  BookOpen,
  Brain,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  value: number;
  change: number;
  changeType: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
}

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'up' | 'down' | 'stable';
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 'compute',
      name: 'Compute Engine',
      category: 'Infrastructure',
      value: 85,
      change: 12,
      changeType: 'up',
      icon: Brain,
      color: 'blue'
    },
    {
      id: 'storage',
      name: 'Cloud Storage',
      category: 'Data',
      value: 72,
      change: -3,
      changeType: 'down',
      icon: BookOpen,
      color: 'green'
    },
    {
      id: 'networking',
      name: 'Networking',
      category: 'Infrastructure',
      value: 91,
      change: 8,
      changeType: 'up',
      icon: Activity,
      color: 'purple'
    },
    {
      id: 'security',
      name: 'Security & IAM',
      category: 'Security',
      value: 68,
      change: 0,
      changeType: 'stable',
      icon: Target,
      color: 'orange'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    {
      label: 'Total Questions',
      value: 156,
      unit: 'questions',
      change: 23,
      changeType: 'up'
    },
    {
      label: 'Accuracy Rate',
      value: 78.5,
      unit: '%',
      change: 5.2,
      changeType: 'up'
    },
    {
      label: 'Study Time',
      value: 42,
      unit: 'hours',
      change: -2,
      changeType: 'down'
    },
    {
      label: 'Streak Days',
      value: 7,
      unit: 'days',
      change: 1,
      changeType: 'up'
    }
  ]);

  const getChangeIcon = (type: 'up' | 'down' | 'stable') => {
    switch (type) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'purple':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'orange':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Learning Portfolio</h1>
            <p className="text-slate-600 mt-2">
              Track your knowledge investments and learning performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
                    <span className="text-sm text-slate-500">{metric.unit}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(metric.changeType)}
                  <span className={cn(
                    "text-sm font-medium",
                    metric.changeType === 'up' ? "text-green-600" : 
                    metric.changeType === 'down' ? "text-red-600" : "text-gray-600"
                  )}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Items */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Knowledge Portfolio
              </CardTitle>
              <CardDescription>
                Your learning investments across different GCP topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg border", getColorClasses(item.color))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-600">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{item.value}%</div>
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(item.changeType)}
                          <span className={cn(
                            "text-sm font-medium",
                            item.changeType === 'up' ? "text-green-600" : 
                            item.changeType === 'down' ? "text-red-600" : "text-gray-600"
                          )}>
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={item.value} className="w-20" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Your learning progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Performance chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Perfect Score</div>
                  <div className="text-sm text-green-700">Achieved 100% on Networking quiz</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Star className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">7-Day Streak</div>
                  <div className="text-sm text-blue-700">Consistent daily practice</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">Quick Learner</div>
                  <div className="text-sm text-purple-700">Completed 50 questions in one session</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions to improve your GCP knowledge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Focus on Security</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Your Security & IAM score is below average. Consider spending more time on IAM policies and security best practices.
                </p>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  Start Security Quiz
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Advanced Topics</h3>
                <p className="text-sm text-green-700 mb-3">
                  You're doing great with basics! Try advanced topics like Kubernetes Engine and Cloud Functions.
                </p>
                <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  Explore Advanced
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Practice Regularly</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Maintain your momentum with daily practice sessions. Consistency is key to long-term retention.
                </p>
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                  Daily Practice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 