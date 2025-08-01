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

/**
 * Generate heatmap data from GCP questions
 */
const generateHeatmapData = () => {
  const questionsWithMetadata = gcpQuestions.map(q => ({
    ...q,
    topic: extractTopic(q.text),
    keywords: extractKeywords(q.text)
  }));

  // Group questions by topic
  const topicStats = new Map<string, { total: number; keywords: Set<string> }>();
  
  questionsWithMetadata.forEach(question => {
    const topic = question.topic as string;
    if (!topicStats.has(topic)) {
      topicStats.set(topic, { total: 0, keywords: new Set() });
    }
    
    const stats = topicStats.get(topic)!;
    stats.total++;
    (question.keywords as string[]).forEach(keyword => stats.keywords.add(keyword));
  });

  // Convert to heatmap format
  const heatmapData = Array.from(topicStats.entries()).map(([topic, stats]) => ({
    topic,
    topicName: gcpTopics[topic as keyof typeof gcpTopics] || topic,
    totalQuestions: stats.total,
    keywords: Array.from(stats.keywords),
    accuracy: Math.floor(Math.random() * 40) + 60, // Mock accuracy for demo
    questionsAnswered: Math.floor(Math.random() * stats.total) + 1,
    trend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)] as 'improving' | 'declining' | 'stable',
    lastWeekAccuracy: Math.floor(Math.random() * 30) + 50,
    currentAccuracy: Math.floor(Math.random() * 40) + 60,
    improvementRate: Math.floor(Math.random() * 20) - 10
  }));

  return heatmapData;
};

/**
 * Generate time-based performance data
 */
const generateTimeBasedData = (): TimeBasedPerformance[] => {
  const data: TimeBasedPerformance[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      accuracy: Math.floor(Math.random() * 40) + 60,
      questionsAnswered: Math.floor(Math.random() * 20) + 5,
      topics: ['compute', 'storage', 'networking', 'iam'].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return data;
};

/**
 * Generate learning trends
 */
const generateLearningTrends = (): LearningTrend[] => {
  const topics = Object.keys(gcpTopics);
  
  return topics.map(topic => ({
    topic,
    trend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)] as 'improving' | 'declining' | 'stable',
    improvementRate: Math.floor(Math.random() * 20) - 10,
    lastWeekAccuracy: Math.floor(Math.random() * 30) + 50,
    currentAccuracy: Math.floor(Math.random() * 40) + 60,
    prediction: Math.floor(Math.random() * 40) + 60
  }));
};

/**
 * Generate study patterns
 */
const generateStudyPatterns = (): StudyPattern[] => {
  return [
    {
      type: 'consistent',
      description: 'Regular daily practice sessions',
      recommendation: 'Maintain your consistent study schedule',
      strength: 85
    },
    {
      type: 'intensive',
      description: 'Focused study on weak areas',
      recommendation: 'Continue intensive practice on challenging topics',
      strength: 72
    },
    {
      type: 'sporadic',
      description: 'Irregular study patterns detected',
      recommendation: 'Establish a more consistent study routine',
      strength: 45
    }
  ];
};

/**
 * Calculate performance summary
 */
const calculatePerformanceSummary = (heatmapData: any[]): PerformanceSummary => {
  const totalQuestions = heatmapData.reduce((sum, item) => sum + item.totalQuestions, 0);
  const totalAnswered = heatmapData.reduce((sum, item) => sum + item.questionsAnswered, 0);
  const averageAccuracy = heatmapData.reduce((sum, item) => sum + item.accuracy, 0) / heatmapData.length;
  
  const strongAreas = heatmapData
    .filter(item => item.accuracy >= 80)
    .map(item => item.topicName)
    .slice(0, 3);
    
  const weakAreas = heatmapData
    .filter(item => item.accuracy < 60)
    .map(item => item.topicName)
    .slice(0, 3);
    
  const improvementTrend = heatmapData.reduce((sum, item) => sum + item.improvementRate, 0) / heatmapData.length;
  
  return {
    totalQuestions,
    accuracy: Math.round(averageAccuracy),
    strongAreas,
    weakAreas,
    improvementTrend: Math.round(improvementTrend)
  };
};

export default function HeatmapPage() {
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    timeRange: 'month',
    minAccuracy: 0,
    topics: [],
    difficulty: []
  });
  
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [timeBasedData, setTimeBasedData] = useState<TimeBasedPerformance[]>([]);
  const [learningTrends, setLearningTrends] = useState<LearningTrend[]>([]);
  const [studyPatterns, setStudyPatterns] = useState<StudyPattern[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const data = generateHeatmapData();
    setHeatmapData(data);
    setTimeBasedData(generateTimeBasedData());
    setLearningTrends(generateLearningTrends());
    setStudyPatterns(generateStudyPatterns());
    setPerformanceSummary(calculatePerformanceSummary(data));
    setIsLoading(false);
  }, []);

  // Filtered data based on options
  const filteredData = useMemo(() => {
    let filtered = heatmapData;
    
    if (filterOptions.topics.length > 0) {
      filtered = filtered.filter(item => filterOptions.topics.includes(item.topic));
    }
    
    if (filterOptions.minAccuracy > 0) {
      filtered = filtered.filter(item => item.accuracy >= filterOptions.minAccuracy);
    }
    
    return filtered;
  }, [heatmapData, filterOptions]);

  const navigateToQuiz = (topic?: string) => {
    if (topic) {
      navigate(`/quiz?topic=${topic}`);
    } else {
      navigate('/quiz');
    }
  };

  const exportHeatmapData = () => {
    const data = {
      heatmapData: filteredData,
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
      const data = generateHeatmapData();
      setHeatmapData(data);
      setTimeBasedData(generateTimeBasedData());
      setLearningTrends(generateLearningTrends());
      setStudyPatterns(generateStudyPatterns());
      setPerformanceSummary(calculatePerformanceSummary(data));
      setIsLoading(false);
    }, 1000);
  };

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleKeywordClick = (keyword: string) => {
    navigateToQuiz();
  };

  const getAccuracyColor = (accuracy: number, answered: number) => {
    if (answered === 0) return 'bg-slate-100';
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (accuracy: number, answered: number) => {
    if (answered === 0) return 'text-slate-400';
    if (accuracy >= 80) return 'text-green-700';
    if (accuracy >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-slate-600">Loading heatmap data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Knowledge Heatmap</h1>
              <p className="text-slate-600">Visualize your GCP learning progress and identify areas for improvement</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleRefreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportHeatmapData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      {performanceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Questions</p>
                  <p className="text-2xl font-bold text-slate-900">{performanceSummary.totalQuestions}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Accuracy</p>
                  <p className="text-2xl font-bold text-slate-900">{performanceSummary.accuracy}%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Improvement Trend</p>
                  <p className="text-2xl font-bold text-slate-900">{performanceSummary.improvementTrend > 0 ? '+' : ''}{performanceSummary.improvementTrend}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Study Streak</p>
                  <p className="text-2xl font-bold text-slate-900">7 days</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Knowledge Treemap */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Knowledge Distribution
              </CardTitle>
              <CardDescription>
                Interactive visualization of your GCP knowledge areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgeTreemap data={filteredData} onTopicClick={setSelectedTopic} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
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
                Start Practice Quiz
              </Button>
              <Button onClick={() => navigate('/gcp-quiz')} variant="outline" className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Full GCP Quiz
              </Button>
              <Button onClick={() => navigate('/quiz')} variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Custom Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Strong Areas */}
          {performanceSummary && performanceSummary.strongAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceSummary.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">{area}</span>
                      <Badge variant="secondary" className="bg-green-200 text-green-800">
                        Strong
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Areas for Improvement */}
          {performanceSummary && performanceSummary.weakAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceSummary.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-orange-800">{area}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-orange-600 border-orange-200 hover:bg-orange-100"
                        onClick={() => navigateToQuiz(area.toLowerCase())}
                      >
                        Practice
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Learning Trends */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Trends
            </CardTitle>
            <CardDescription>
              Track your progress across different GCP topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learningTrends.map((trend, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{trend.topic}</h4>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Current:</span>
                      <span className="font-medium">{trend.currentAccuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Last Week:</span>
                      <span className="font-medium">{trend.lastWeekAccuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Prediction:</span>
                      <span className="font-medium">{trend.prediction}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Patterns */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Study Patterns
            </CardTitle>
            <CardDescription>
              Analysis of your learning behavior and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {studyPatterns.map((pattern, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900 capitalize">{pattern.type}</h4>
                    <Badge variant="secondary">{pattern.strength}%</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{pattern.description}</p>
                  <p className="text-xs text-slate-500">{pattern.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
