/**
 * Enhanced Heatmap page with interactive knowledge visualization
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
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
  Upload,
  Database,
  Clock,
  TrendingDown,
  Minus,
  Lightbulb,
  Target,
  BarChart,
  PieChart,
  LineChart,
  Download
} from 'lucide-react';
import KnowledgeTreemap from '../components/KnowledgeTreemap';
import { cn, getPercentageColor, getTopicColor } from '../lib/utils';

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

/**
 * Mock data generation for heatmap
 */
const generateMockHeatmapData = () => {
  const topics = [
    'Compute Engine', 'Cloud Storage', 'BigQuery', 'Cloud IAM', 
    'VPC Networking', 'Cloud SQL', 'GKE', 'App Engine',
    'Cloud Functions', 'Pub/Sub', 'Cloud Monitoring', 'Cloud Security'
  ];
  
  const difficulties = ['easy', 'medium', 'hard'];
  
  return topics.map(topic => {
    const difficultyData = difficulties.map(difficulty => {
      const answered = Math.floor(Math.random() * 15) + 1;
      const correct = Math.floor(answered * (0.4 + Math.random() * 0.5));
      const accuracy = (correct / answered) * 100;
      
      return {
        difficulty,
        accuracy: Math.round(accuracy),
        answered,
        total: answered + Math.floor(Math.random() * 5)
      };
    });
    
    const totalAnswered = difficultyData.reduce((sum, d) => sum + d.answered, 0);
    const totalCorrect = difficultyData.reduce((sum, d) => sum + Math.floor(d.answered * d.accuracy / 100), 0);
    const overallAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    
    return {
      topic,
      overallAccuracy: Math.round(overallAccuracy),
      totalAnswered,
      totalQuestions: difficultyData.reduce((sum, d) => sum + d.total, 0),
      difficulties: difficultyData
    };
  });
};

export default function HeatmapPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [viewMode, setViewMode] = useState<'heatmap' | 'treemap' | 'list' | 'trends'>('heatmap');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: 'month',
    minAccuracy: 0,
    topics: [],
    difficulty: []
  });

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Generate real heatmap data from user answers and questions
   */
  const heatmapData = useMemo(() => {
    const questions = state.questions || [];
    const userAnswers = state.userAnswers || [];
    
    if (questions.length === 0) {
      return [];
    }

    // Group by topic and difficulty
    const topicMap = new Map();
    
    questions.forEach(question => {
      const key = question.topic;
      if (!topicMap.has(key)) {
        topicMap.set(key, {
          topic: question.topic,
          difficulties: {
            beginner: { answered: 0, correct: 0, total: 0 },
            intermediate: { answered: 0, correct: 0, total: 0 },
            advanced: { answered: 0, correct: 0, total: 0 }
          }
        });
      }
      
      const topicData = topicMap.get(key);
      const diffKey = question.difficulty || 'intermediate';
      topicData.difficulties[diffKey].total++;
    });

    // Add user answer data
    userAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const topicData = topicMap.get(question.topic);
        if (topicData) {
          const diffKey = question.difficulty || 'intermediate';
          topicData.difficulties[diffKey].answered++;
          if (answer.isCorrect) {
            topicData.difficulties[diffKey].correct++;
          }
        }
      }
    });

    // Convert to array format
    return Array.from(topicMap.values()).map(topicData => {
      const difficulties = Object.entries(topicData.difficulties).map(([difficulty, data]) => ({
        difficulty,
        accuracy: data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0,
        answered: data.answered,
        total: data.total
      }));

      const totalAnswered = difficulties.reduce((sum, d) => sum + d.answered, 0);
      const totalCorrect = difficulties.reduce((sum, d) => sum + (d.answered > 0 ? Math.round(d.answered * d.accuracy / 100) : 0), 0);
      const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      return {
        topic: topicData.topic,
        overallAccuracy,
        totalAnswered,
        totalQuestions: difficulties.reduce((sum, d) => sum + d.total, 0),
        difficulties
      };
    });
  }, [state.questions, state.userAnswers, lastRefresh]); // Re-calculate when data changes

  /**
   * Calculate performance summary
   */
  const performanceSummary: PerformanceSummary = useMemo(() => {
    if (heatmapData.length === 0) {
      return {
        totalQuestions: 0,
        accuracy: 0,
        strongAreas: [],
        weakAreas: [],
        improvementTrend: 0
      };
    }
    
    const totalQuestions = heatmapData.reduce((sum, item) => sum + item.totalAnswered, 0);
    const totalCorrect = heatmapData.reduce((sum, item) => 
      sum + Math.floor(item.totalAnswered * item.overallAccuracy / 100), 0
    );
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    const strongAreas = heatmapData
      .filter(item => item.overallAccuracy >= 80 && item.totalAnswered >= 3)
      .map(item => item.topic)
      .slice(0, 3);
    
    const weakAreas = heatmapData
      .filter(item => item.overallAccuracy < 60 || item.totalAnswered === 0)
      .map(item => item.topic)
      .slice(0, 3);
    
    return {
      totalQuestions,
      accuracy: Math.round(accuracy),
      strongAreas,
      weakAreas,
      improvementTrend: 0
    };
  }, [heatmapData]);

  /**
   * Generate treemap data for visualization
   */
  const treemapData = useMemo(() => {
    return heatmapData.map(item => ({
      keyword: item.topic,
      frequency: item.totalAnswered,
      accuracy: item.overallAccuracy / 100,
      topic: item.topic
    }));
  }, [heatmapData]);

  /**
   * Generate time-based performance data
   */
  const timeBasedPerformance = useMemo(() => {
    const userAnswers = state.userAnswers || [];
    const performanceData: TimeBasedPerformance[] = [];
    
    // Group answers by date
    const answersByDate = new Map<string, any[]>();
    
    userAnswers.forEach(answer => {
      const date = new Date(answer.timestamp).toISOString().split('T')[0];
      if (!answersByDate.has(date)) {
        answersByDate.set(date, []);
      }
      answersByDate.get(date)!.push(answer);
    });
    
    // Calculate daily performance
    Array.from(answersByDate.entries()).forEach(([date, answers]) => {
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const accuracy = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0;
      
      // Get unique topics for the day
      const topics = new Set<string>();
      answers.forEach(answer => {
        const question = state.questions.find(q => q.id === answer.questionId);
        if (question) {
          topics.add(question.topic);
        }
      });
      
      performanceData.push({
        date,
        accuracy: Math.round(accuracy),
        questionsAnswered: answers.length,
        topics: Array.from(topics)
      });
    });
    
    return performanceData.sort((a, b) => a.date.localeCompare(b.date));
  }, [state.userAnswers, state.questions, lastRefresh]);

  /**
   * Generate learning trends analysis
   */
  const learningTrends = useMemo(() => {
    const trends: LearningTrend[] = [];
    const topics = new Set(heatmapData.map(item => item.topic));
    
    topics.forEach(topic => {
      const topicData = heatmapData.find(item => item.topic === topic);
      if (topicData && topicData.totalAnswered > 0) {
        // Simulate trend analysis (in real app, this would use historical data)
        const currentAccuracy = topicData.overallAccuracy;
        const lastWeekAccuracy = Math.max(0, currentAccuracy - (Math.random() * 20 - 10));
        const improvementRate = currentAccuracy - lastWeekAccuracy;
        const prediction = Math.min(100, currentAccuracy + improvementRate);
        
        let trend: 'improving' | 'declining' | 'stable';
        if (improvementRate > 5) trend = 'improving';
        else if (improvementRate < -5) trend = 'declining';
        else trend = 'stable';
        
        trends.push({
          topic,
          trend,
          improvementRate: Math.round(improvementRate),
          lastWeekAccuracy: Math.round(lastWeekAccuracy),
          currentAccuracy,
          prediction: Math.round(prediction)
        });
      }
    });
    
    return trends;
  }, [heatmapData, lastRefresh]);

  /**
   * Detect study patterns
   */
  const studyPatterns = useMemo(() => {
    const patterns: StudyPattern[] = [];
    const userAnswers = state.userAnswers || [];
    
    if (userAnswers.length === 0) {
      patterns.push({
        type: 'new',
        description: 'You\'re just getting started with GCP learning',
        recommendation: 'Start with basic concepts and build your foundation',
        strength: 1
      });
      return patterns;
    }
    
    // Analyze study frequency
    const recentAnswers = userAnswers.filter(answer => {
      const answerDate = new Date(answer.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return answerDate > weekAgo;
    });
    
    const dailyAverages = recentAnswers.length / 7;
    
    if (dailyAverages >= 5) {
      patterns.push({
        type: 'intensive',
        description: 'You\'re studying intensively with high daily activity',
        recommendation: 'Consider taking breaks to avoid burnout and review previous topics',
        strength: 0.9
      });
    } else if (dailyAverages >= 2) {
      patterns.push({
        type: 'consistent',
        description: 'You maintain a consistent study routine',
        recommendation: 'Great! Keep up the regular practice and focus on weak areas',
        strength: 0.8
      });
    } else if (dailyAverages >= 0.5) {
      patterns.push({
        type: 'sporadic',
        description: 'Your study pattern is irregular',
        recommendation: 'Try to establish a more regular study schedule for better retention',
        strength: 0.6
      });
    }
    
    return patterns;
  }, [state.userAnswers, lastRefresh]);

  /**
   * Generate keyword-level treemap data
   */
  const keywordTreemapData = useMemo(() => {
    console.log('Recalculating keywordTreemapData...', {
      questionsCount: state.questions.length,
      answersCount: state.userAnswers.length
    });
    
    const keywordStats = new Map();
    
    // Process all questions to get keyword statistics
    state.questions.forEach(question => {
      if (question.keywords && Array.isArray(question.keywords)) {
        question.keywords.forEach(keyword => {
          if (!keywordStats.has(keyword)) {
            keywordStats.set(keyword, {
              keyword: keyword,
              topic: question.topic,
              totalQuestions: 0,
              answered: 0,
              correct: 0
            });
          }
          keywordStats.get(keyword).totalQuestions++;
        });
      }
    });

    // Add user answer data
    state.userAnswers.forEach(answer => {
      const question = state.questions.find(q => q.id === answer.questionId);
      if (question && question.keywords && Array.isArray(question.keywords)) {
        question.keywords.forEach(keyword => {
          const stats = keywordStats.get(keyword);
          if (stats) {
            stats.answered++;
            if (answer.isCorrect) {
              stats.correct++;
            }
          }
        });
      }
    });

    // Convert to array and calculate accuracy
    const result = Array.from(keywordStats.values()).map(stats => ({
      keyword: stats.keyword,
      frequency: stats.answered,
      accuracy: stats.answered > 0 ? stats.correct / stats.answered : 0,
      topic: stats.topic,
      correctAnswers: stats.correct,
      totalAnswers: stats.answered
    }));

    console.log('Keyword treemap result:', {
      totalKeywords: result.length,
      answeredKeywords: result.filter(item => item.frequency > 0).length,
      sampleKeywords: result.slice(0, 3)
    });

    // Return all keywords, not just answered ones for debugging
    return result;
  }, [state.questions, state.userAnswers]);

  /**
   * Handle navigation to quiz with selected topic
   */
  const navigateToQuiz = (topic?: string) => {
    navigate('/quiz', {
      state: {
        selectedTopic: topic || 'all',
        autoStart: true
      }
    });
  };

  /**
   * Export heatmap data
   */
  const exportHeatmapData = () => {
    const exportData = {
      heatmapData,
      performanceSummary,
      learningTrends,
      studyPatterns,
      timeBasedPerformance,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gcp-heatmap-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Refresh data manually
   */
  const handleRefreshData = () => {
    setLastRefresh(new Date());
  };

  /**
   * Get trend icon
   */
  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  /**
   * Handle keyword click from treemap
   */
  const handleKeywordClick = (keyword: string) => {
    navigateToQuiz(keyword);
  };

  /**
   * Get accuracy color for heatmap cells
   */
  const getAccuracyColor = (accuracy: number, answered: number) => {
    if (answered === 0) return 'bg-slate-100 border-slate-200';
    if (accuracy >= 80) return 'bg-green-500 border-green-600';
    if (accuracy >= 60) return 'bg-yellow-500 border-yellow-600';
    return 'bg-red-500 border-red-600';
  };

  /**
   * Get text color for heatmap cells
   */
  const getTextColor = (accuracy: number, answered: number) => {
    if (answered === 0) return 'text-slate-600';
    return 'text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile-content">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                Knowledge Heatmap
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
              Visualize your learning progress across different GCP topics and identify areas for improvement.
            </p>
            <div className="flex items-center space-x-2 mt-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={() => navigateToQuiz()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Practice Quiz
            </Button>
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={exportHeatmapData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            {[
              { mode: 'heatmap' as const, icon: BarChart3, label: 'Heatmap' },
              { mode: 'treemap' as const, icon: Target, label: 'Treemap' },
              { mode: 'list' as const, icon: Activity, label: 'List' },
              { mode: 'trends' as const, icon: LineChart, label: 'Trends' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  viewMode === mode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Questions Answered</p>
                <p className="text-2xl font-bold text-slate-900">{performanceSummary.totalQuestions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overall Accuracy</p>
                <p className={cn("text-2xl font-bold", getPercentageColor(performanceSummary.accuracy))}>
                  {performanceSummary.accuracy}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Strong Areas</p>
                <p className="text-2xl font-bold text-slate-900">{performanceSummary.strongAreas.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Improvement</p>
                <p className="text-2xl font-bold text-green-600">+{performanceSummary.improvementTrend}%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Visualization */}
        <div className="lg:col-span-3">
          {viewMode === 'heatmap' && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Topic Performance Heatmap
                </CardTitle>
                <CardDescription>
                  {heatmapData.length > 0 
                    ? "Click on any cell to practice questions for that topic and difficulty level"
                    : "Start practicing questions to see your performance heatmap"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {heatmapData.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      No Performance Data Available
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Start practicing questions to generate your learning heatmap and track progress across different topics.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/import')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Questions
                      </Button>
                      <Button 
                        onClick={() => navigate('/manage')}
                        variant="outline"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Create Questions
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-700">Accuracy:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div>
                          <span className="text-xs text-slate-600">No data</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="text-xs text-slate-600">&lt; 60%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-xs text-slate-600">60-79%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-xs text-slate-600">≥ 80%</span>
                        </div>
                      </div>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="overflow-x-auto">
                      <div className="min-w-[600px]">
                        {/* Header */}
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <div className="p-3 text-sm font-medium text-slate-700">Topic</div>
                          <div className="p-3 text-sm font-medium text-slate-700 text-center">Easy</div>
                          <div className="p-3 text-sm font-medium text-slate-700 text-center">Medium</div>
                          <div className="p-3 text-sm font-medium text-slate-700 text-center">Hard</div>
                        </div>

                        {/* Data Rows */}
                        {heatmapData.map((topic, topicIndex) => (
                          <div key={topicIndex} className="grid grid-cols-4 gap-2 mb-2">
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <div className="font-medium text-slate-900 capitalize text-sm">
                                {topic.topic}
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                {topic.totalAnswered}/{topic.totalQuestions} answered
                              </div>
                            </div>
                            
                            {topic.difficulties.map((diff, diffIndex) => (
                              <button
                                key={diffIndex}
                                onClick={() => navigateToQuiz(topic.topic)}
                                className={cn(
                                  "p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md",
                                  getAccuracyColor(diff.accuracy, diff.answered)
                                )}
                              >
                                <div className={cn("text-center", getTextColor(diff.accuracy, diff.answered))}>
                                  <div className="text-lg font-bold">
                                    {diff.answered > 0 ? `${diff.accuracy}%` : '-'}
                                  </div>
                                  <div className="text-xs opacity-80">
                                    {diff.answered}/{diff.total}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {viewMode === 'treemap' && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Knowledge Treemap
                </CardTitle>
                <CardDescription>
                  {treemapData.length > 0 
                    ? "Interactive visualization of your knowledge areas. Size represents questions answered, color represents accuracy."
                    : "Practice questions to see your knowledge visualization"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {treemapData.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      No Knowledge Data Available
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Answer quiz questions to generate your interactive knowledge treemap visualization.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/import')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Questions
                      </Button>
                      <Button 
                        onClick={() => navigate('/manage')}
                        variant="outline"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Create Questions
                      </Button>
                    </div>
                  </div>
                ) : (
                  <KnowledgeTreemap
                    data={treemapData}
                    keywordData={keywordTreemapData}
                    selectedTopic={selectedTopic}
                    onTopicChange={setSelectedTopic}
                    onKeywordClick={handleKeywordClick}
                    onNavigateToQuiz={navigateToQuiz}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {viewMode === 'list' && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Detailed Performance List
                </CardTitle>
                <CardDescription>
                  {heatmapData.length > 0 
                    ? "Comprehensive breakdown of your performance across all topics"
                    : "Practice questions to see detailed performance breakdown"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {heatmapData.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      No Performance Data Available
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Complete quiz questions to see detailed performance metrics and topic-wise breakdown.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/import')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Questions  
                      </Button>
                      <Button 
                        onClick={() => navigate('/manage')}
                        variant="outline"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Create Questions
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {heatmapData.map((topic, index) => (
                      <div
                        key={index}
                        className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1 mb-4 lg:mb-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 capitalize">
                                {topic.topic}
                              </h3>
                              <Badge className={getTopicColor(topic.topic)}>
                                {topic.totalAnswered}/{topic.totalQuestions} questions
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-slate-600">Overall Accuracy:</span>
                                <span className={cn("font-semibold", getPercentageColor(topic.overallAccuracy))}>
                                  {topic.overallAccuracy}%
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                {topic.difficulties.map((diff, diffIndex) => (
                                  <div key={diffIndex} className="text-center">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                                      {diff.difficulty}
                                    </div>
                                    <div className={cn("font-semibold", getPercentageColor(diff.accuracy))}>
                                      {diff.answered > 0 ? `${diff.accuracy}%` : '-'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-3">
                              <Progress value={topic.overallAccuracy} className="h-2" />
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => navigateToQuiz(topic.topic)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Practice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {viewMode === 'trends' && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                  Learning Trends & Patterns
                </CardTitle>
                <CardDescription>
                  Analyze your learning patterns, trends, and predictions for better study planning.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Learning Trends */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Learning Trends
                    </h3>
                    <div className="space-y-3">
                      {learningTrends.map((trend, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 capitalize">{trend.topic}</h4>
                            {getTrendIcon(trend.trend)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Current:</span>
                              <span className="font-semibold ml-1">{trend.currentAccuracy}%</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Prediction:</span>
                              <span className="font-semibold ml-1">{trend.prediction}%</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Last Week:</span>
                              <span className="font-semibold ml-1">{trend.lastWeekAccuracy}%</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Change:</span>
                              <span className={cn("font-semibold ml-1", 
                                trend.improvementRate > 0 ? "text-green-600" : 
                                trend.improvementRate < 0 ? "text-red-600" : "text-slate-600"
                              )}>
                                {trend.improvementRate > 0 ? '+' : ''}{trend.improvementRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Study Patterns */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                      Study Patterns
                    </h3>
                    <div className="space-y-3">
                      {studyPatterns.map((pattern, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 capitalize">{pattern.type}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              {Math.round(pattern.strength * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{pattern.description}</p>
                          <p className="text-xs text-blue-700 font-medium">{pattern.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time-based Performance */}
                {timeBasedPerformance.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                      <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                      Daily Performance
                    </h3>
                    <div className="overflow-x-auto">
                      <div className="min-w-[600px]">
                        <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium text-slate-700">
                          <div>Date</div>
                          <div className="text-center">Accuracy</div>
                          <div className="text-center">Questions</div>
                          <div className="text-center">Topics</div>
                        </div>
                        {timeBasedPerformance.slice(-7).map((day, index) => (
                          <div key={index} className="grid grid-cols-4 gap-2 mb-2 p-2 bg-slate-50 rounded">
                            <div className="text-sm">{day.date}</div>
                            <div className={cn("text-center text-sm font-semibold", getPercentageColor(day.accuracy))}>
                              {day.accuracy}%
                            </div>
                            <div className="text-center text-sm">{day.questionsAnswered}</div>
                            <div className="text-center text-sm">{day.topics.length}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigateToQuiz()}
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Practice All Topics
              </Button>
              
              {performanceSummary.weakAreas.length > 0 && (
                <Button
                  onClick={() => navigateToQuiz(performanceSummary.weakAreas[0])}
                  variant="outline"
                  className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Focus on Weak Areas
                </Button>
              )}
              
              <Button
                onClick={() => navigate('/portfolio')}
                variant="outline"
                className="w-full justify-start"
              >
                <Award className="h-4 w-4 mr-2" />
                View Portfolio
              </Button>
            </CardContent>
          </Card>

          {/* Strong Areas */}
          {performanceSummary.strongAreas.length > 0 ? (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {performanceSummary.strongAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                    <span className="font-medium text-green-800 capitalize">{area}</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-slate-600">
                  <Target className="h-5 w-5 mr-2" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600 mb-4">
                  Build your question database to start tracking performance:
                </p>
                <Button
                  onClick={() => navigate('/import')}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Questions
                </Button>
                <Button
                  onClick={() => navigate('/manage')}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Create Questions
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Weak Areas */}
          {performanceSummary.weakAreas.length > 0 && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-red-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {performanceSummary.weakAreas.map((area, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToQuiz(area)}
                    className="w-full flex items-center justify-between p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors group"
                  >
                    <span className="font-medium text-red-800 capitalize">{area}</span>
                    <ArrowRight className="h-4 w-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Real-time Insights */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-purple-800">
                <Lightbulb className="h-5 w-5 mr-2" />
                Real-time Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studyPatterns.length > 0 && (
                <div className="p-3 bg-white/60 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800 capitalize">
                      {studyPatterns[0].type}
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {Math.round(studyPatterns[0].strength * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-purple-700">{studyPatterns[0].recommendation}</p>
                </div>
              )}
              
              {learningTrends.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-800">Top Trends</h4>
                  {learningTrends.slice(0, 2).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/60 rounded">
                      <span className="text-xs text-purple-700 capitalize">{trend.topic}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(trend.trend)}
                        <span className={cn("text-xs font-semibold", 
                          trend.improvementRate > 0 ? "text-green-600" : 
                          trend.improvementRate < 0 ? "text-red-600" : "text-slate-600"
                        )}>
                          {trend.improvementRate > 0 ? '+' : ''}{trend.improvementRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Resources */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-800">
                <BookOpen className="h-5 w-5 mr-2" />
                Study Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate('/guide')}
                variant="outline"
                size="sm"
                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Study Guide
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Video Tutorials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
