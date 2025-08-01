/**
 * Enhanced Heatmap page with interactive knowledge visualization
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Filter,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  RefreshCw,
  PlayCircle,
  ArrowRight,
  Eye,
  Brain,
  BookOpen,
  Clock,
  TrendingDown,
  Minus,
  Lightbulb,
  BarChart,
  PieChart,
  LineChart,
  Download
} from 'lucide-react';
import KnowledgeTreemap from '../components/KnowledgeTreemap';
import { cn, getPercentageColor, getTopicColor } from '../lib/utils';
import { gcpQuestions, Question } from '../data/gcpQuestions';

/**
 * Filter options for heatmap view
 */
interface FilterOptions {
  timeRange: 'week' | 'month' | 'quarter' | 'all';
  minAccuracy: number;
  topics: string[];
  difficulty: string[];
}

/**
 * Time-based performance tracking
 */
interface TimeBasedPerformance {
  date: string;
  accuracy: number;
  questionsAnswered: number;
  topics: string[];
}

/**
 * Learning trend analysis
 */
interface LearningTrend {
  topic: string;
  trend: 'improving' | 'declining' | 'stable';
  improvementRate: number;
  lastWeekAccuracy: number;
  currentAccuracy: number;
  prediction: number;
}

/**
 * Study pattern detection
 */
interface StudyPattern {
  type: 'consistent' | 'sporadic' | 'intensive' | 'new';
  description: string;
  recommendation: string;
  strength: number;
}

/**
 * Performance summary interface
 */
interface PerformanceSummary {
  totalQuestions: number;
  accuracy: number;
  strongAreas: string[];
  weakAreas: string[];
  improvementTrend: number;
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

// Generate heatmap data from quiz state
const generateHeatmapData = () => {
  try {
    const savedState = localStorage.getItem('gcp-quiz-state');
    if (!savedState) return [];

    const state = JSON.parse(savedState);
    const userAnswers = state.userAnswers || {};
    
    const heatmapData = [];
    
    // Process each question that was answered
    Object.keys(userAnswers).forEach(questionId => {
      const question = gcpQuestions.find(q => q.id === parseInt(questionId));
      if (!question) return;
      
      const userAnswer = userAnswers[questionId];
      const isCorrect = question.type === 'radio' 
        ? userAnswer === question.correctAnswer
        : Array.isArray(userAnswer) && 
          question.correctAnswer.split(',').every(ans => userAnswer.includes(ans)) &&
          userAnswer.length === question.correctAnswer.split(',').length;
      
      const topic = extractTopic(question.text);
      const keywords = extractKeywords(question.text);
      
      // Add topic data
      heatmapData.push({
        keyword: topic,
        value: isCorrect ? 1 : -1,
        type: 'topic',
        questionId: question.id
      });
      
      // Add keyword data
      keywords.forEach(keyword => {
        heatmapData.push({
          keyword,
          value: isCorrect ? 1 : -1,
          type: 'keyword',
          questionId: question.id
        });
      });
    });
    
    return heatmapData;
  } catch (error) {
    console.error('Error generating heatmap data:', error);
    return [];
  }
};

// Generate time-based performance data
const generateTimeBasedData = (): TimeBasedPerformance[] => {
  try {
    const savedState = localStorage.getItem('gcp-quiz-state');
    if (!savedState) return [];

    const state = JSON.parse(savedState);
    const userAnswers = state.userAnswers || {};
    
    const timeData: Record<string, { correct: number; total: number; topics: string[] }> = {};
    
    Object.keys(userAnswers).forEach(questionId => {
      const question = gcpQuestions.find(q => q.id === parseInt(questionId));
      if (!question) return;
      
      const userAnswer = userAnswers[questionId];
      const isCorrect = question.type === 'radio' 
        ? userAnswer === question.correctAnswer
        : Array.isArray(userAnswer) && 
          question.correctAnswer.split(',').every(ans => userAnswer.includes(ans)) &&
          userAnswer.length === question.correctAnswer.split(',').length;
      
      const date = new Date().toISOString().split('T')[0]; // Today's date
      const topic = extractTopic(question.text);
      
      if (!timeData[date]) {
        timeData[date] = { correct: 0, total: 0, topics: [] };
      }
      
      timeData[date].total++;
      if (isCorrect) {
        timeData[date].correct++;
      }
      if (!timeData[date].topics.includes(topic)) {
        timeData[date].topics.push(topic);
      }
    });
    
    return Object.entries(timeData).map(([date, data]) => ({
      date,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      questionsAnswered: data.total,
      topics: data.topics
    }));
  } catch (error) {
    console.error('Error generating time-based data:', error);
    return [];
  }
};

// Generate learning trends
const generateLearningTrends = (): LearningTrend[] => {
  const heatmapData = generateHeatmapData();
  const topicData: Record<string, { correct: number; total: number }> = {};
  
  heatmapData.forEach(item => {
    if (item.type === 'topic') {
      if (!topicData[item.keyword]) {
        topicData[item.keyword] = { correct: 0, total: 0 };
      }
      topicData[item.keyword].total++;
      if (item.value > 0) {
        topicData[item.keyword].correct++;
      }
    }
  });
  
  return Object.entries(topicData).map(([topic, data]) => {
    const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    return {
      topic,
      trend: 'stable' as const,
      improvementRate: 0,
      lastWeekAccuracy: accuracy,
      currentAccuracy: accuracy,
      prediction: accuracy
    };
  });
};

// Generate study patterns
const generateStudyPatterns = (): StudyPattern[] => {
  const timeData = generateTimeBasedData();
  
  if (timeData.length === 0) {
    return [{
      type: 'new',
      description: 'No study data available yet',
      recommendation: 'Start taking quizzes to build your learning profile',
      strength: 0
    }];
  }
  
  const totalQuestions = timeData.reduce((sum, day) => sum + day.questionsAnswered, 0);
  const avgAccuracy = timeData.reduce((sum, day) => sum + day.accuracy, 0) / timeData.length;
  
  if (totalQuestions < 5) {
    return [{
      type: 'new',
      description: 'Just getting started',
      recommendation: 'Continue practicing to establish your learning pattern',
      strength: 0.3
    }];
  }
  
  if (avgAccuracy >= 80) {
    return [{
      type: 'consistent',
      description: 'Excellent performance maintained',
      recommendation: 'Focus on advanced topics and edge cases',
      strength: 0.9
    }];
  }
  
  if (avgAccuracy >= 60) {
    return [{
      type: 'improving',
      description: 'Good progress with room for improvement',
      recommendation: 'Review weak areas and practice more',
      strength: 0.7
    }];
  }
  
  return [{
    type: 'sporadic',
    description: 'Inconsistent performance detected',
    recommendation: 'Establish a regular study routine',
    strength: 0.4
  }];
};

// Calculate performance summary
const calculatePerformanceSummary = (heatmapData: any[]): PerformanceSummary => {
  const topicData: Record<string, { correct: number; total: number }> = {};
  
  heatmapData.forEach(item => {
    if (item.type === 'topic') {
      if (!topicData[item.keyword]) {
        topicData[item.keyword] = { correct: 0, total: 0 };
      }
      topicData[item.keyword].total++;
      if (item.value > 0) {
        topicData[item.keyword].correct++;
      }
    }
  });
  
  const totalQuestions = Object.values(topicData).reduce((sum, data) => sum + data.total, 0);
  const totalCorrect = Object.values(topicData).reduce((sum, data) => sum + data.correct, 0);
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  
  const strongAreas = Object.entries(topicData)
    .filter(([_, data]) => data.total >= 3 && (data.correct / data.total) >= 0.8)
    .map(([topic, _]) => topic);
  
  const weakAreas = Object.entries(topicData)
    .filter(([_, data]) => data.total >= 2 && (data.correct / data.total) < 0.6)
    .map(([topic, _]) => topic);
  
  return {
    totalQuestions,
    accuracy,
    strongAreas,
    weakAreas,
    improvementTrend: 0
  };
};

export default function HeatmapPage() {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'all'>('all');
  const [selectedMinAccuracy, setSelectedMinAccuracy] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'patterns' | 'details'>('overview');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate data
  const heatmapData = useMemo(() => generateHeatmapData(), []);
  const timeBasedData = useMemo(() => generateTimeBasedData(), []);
  const learningTrends = useMemo(() => generateLearningTrends(), []);
  const studyPatterns = useMemo(() => generateStudyPatterns(), []);
  const performanceSummary = useMemo(() => calculatePerformanceSummary(heatmapData), [heatmapData]);

  // Filter data based on selected options
  const filteredData = useMemo(() => {
    let filtered = heatmapData;
    
    if (selectedMinAccuracy > 0) {
      // Filter by accuracy (simplified)
      filtered = filtered.filter(item => {
        const topicData = heatmapData.filter(h => h.keyword === item.keyword);
        const correct = topicData.filter(h => h.value > 0).length;
        const total = topicData.length;
        return total > 0 && (correct / total) * 100 >= selectedMinAccuracy;
      });
    }
    
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(item => selectedTopics.includes(item.keyword));
    }
    
    return filtered;
  }, [heatmapData, selectedMinAccuracy, selectedTopics]);

  const navigateToQuiz = (topic?: string) => {
    if (topic) {
      navigate('/quiz', { state: { selectedTopic: topic } });
    } else {
      navigate('/quiz');
    }
  };

  const exportHeatmapData = () => {
    const data = {
      heatmapData,
      timeBasedData,
      learningTrends,
      studyPatterns,
      performanceSummary,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gcp-heatmap-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(selectedKeyword === keyword ? null : keyword);
  };

  const getAccuracyColor = (accuracy: number, answered: number) => {
    if (answered < 2) return 'bg-gray-100';
    if (accuracy >= 80) return 'bg-green-100';
    if (accuracy >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTextColor = (accuracy: number, answered: number) => {
    if (answered < 2) return 'text-gray-500';
    if (accuracy >= 80) return 'text-green-700';
    if (accuracy >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Progress Heatmap</h1>
            <p className="text-slate-600 mt-2">
              Visualize your learning progress and identify areas for improvement
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleRefreshData} variant="outline" disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={exportHeatmapData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigateToQuiz()}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceSummary.totalQuestions}</div>
                  <div className="text-sm text-slate-600">Questions Answered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceSummary.accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-slate-600">Accuracy Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceSummary.strongAreas.length}</div>
                  <div className="text-sm text-slate-600">Strong Areas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceSummary.weakAreas.length}</div>
                  <div className="text-sm text-slate-600">Weak Areas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Knowledge Heatmap
              </CardTitle>
              <CardDescription>
                Visual representation of your knowledge across different GCP topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {heatmapData.length > 0 ? (
                <KnowledgeTreemap data={filteredData} onKeywordClick={handleKeywordClick} />
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data Available</h3>
                  <p className="text-slate-600 mb-4">
                    Start taking quizzes to build your knowledge heatmap
                  </p>
                  <Button onClick={() => navigateToQuiz()}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Your First Quiz
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningTrends.map((trend) => (
                <div key={trend.topic} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(trend.trend)}
                    <div>
                      <div className="font-medium">{gcpTopics[trend.topic as keyof typeof gcpTopics] || trend.topic}</div>
                      <div className="text-sm text-slate-600">{trend.currentAccuracy.toFixed(1)}% accuracy</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToQuiz(trend.topic)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Study Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Study Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyPatterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{pattern.type}</Badge>
                    <div className="text-sm text-slate-600">Strength: {pattern.strength * 100}%</div>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{pattern.description}</p>
                  <p className="text-xs text-slate-600">{pattern.recommendation}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => navigateToQuiz()} className="w-full">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Custom Quiz
              </Button>
              <Button onClick={() => navigate('/gcp-quiz')} variant="outline" className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Full GCP Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
