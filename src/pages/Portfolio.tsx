/**
 * Portfolio page - Investment-style tracking of learning progress
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target,
  BarChart3,
  Zap,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Eye,
  PlayCircle,
  Star,
  Filter,
  DollarSign,
  PieChart,
  Activity,
  Download,
  Lightbulb,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Goal,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from 'lucide-react';
import { cn, truncate, formatDate, getDifficultyColor, getStatusColor } from '../lib/utils';

/**
 * Utility functions for Portfolio
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPercentage = (value: number): { text: string; color: string } => {
  const sign = value >= 0 ? '+' : '';
  const text = `${sign}${value.toFixed(2)}%`;
  const color = value >= 0 ? 'text-green-600' : 'text-red-600';
  return { text, color };
};

const getPercentageColor = (value: number): string => {
  if (value >= 80) return 'text-green-600';
  if (value >= 60) return 'text-yellow-600';
  if (value >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getTopicColor = (topic: string): string => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800'
  ];
  
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const generateMockData = () => {
  const topics = [
    'Compute Engine', 'Cloud Storage', 'BigQuery', 'Cloud IAM', 
    'VPC Networking', 'Cloud SQL', 'GKE', 'App Engine'
  ];
  
  return topics.map(topic => {
    const credit = 80 + Math.random() * 40;
    const growth = (Math.random() - 0.5) * 20;
    const accuracy = 40 + Math.random() * 50;
    const volume = Math.floor(Math.random() * 50) + 10;
    
    return {
      keyword: topic.toLowerCase().replace(/\s+/g, '-'),
      credit,
      growth,
      accuracy,
      volume,
      topic,
      trend: growth > 2 ? 'up' as const : growth < -2 ? 'down' as const : 'stable' as const,
      marketCap: credit * volume,
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    };
  });
};

/**
 * Achievement system
 */
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'accuracy' | 'volume' | 'streak' | 'mastery';
}

const generateAchievements = (portfolioData: PortfolioItem[], userAnswers: any[]): Achievement[] => {
  const totalQuestions = userAnswers.length;
  const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  const uniqueTopics = new Set(portfolioData.map(item => item.topic));
  const masteredTopics = portfolioData.filter(item => item.accuracy >= 80).length;
  
  return [
    {
      id: 'first-quiz',
      title: 'First Steps',
      description: 'Complete your first quiz',
      icon: '🎯',
      unlocked: totalQuestions >= 1,
      progress: Math.min(totalQuestions, 1),
      maxProgress: 1,
      category: 'volume'
    },
    {
      id: 'accuracy-80',
      title: 'Sharp Shooter',
      description: 'Achieve 80% accuracy',
      icon: '🎯',
      unlocked: accuracy >= 80,
      progress: accuracy,
      maxProgress: 80,
      category: 'accuracy'
    },
    {
      id: 'master-topic',
      title: 'Topic Master',
      description: 'Master 3 different topics',
      icon: '🏆',
      unlocked: masteredTopics >= 3,
      progress: masteredTopics,
      maxProgress: 3,
      category: 'mastery'
    },
    {
      id: 'high-volume',
      title: 'Dedicated Learner',
      description: 'Answer 50 questions',
      icon: '📚',
      unlocked: totalQuestions >= 50,
      progress: totalQuestions,
      maxProgress: 50,
      category: 'volume'
    }
  ];
};

/**
 * Learning recommendations
 */
interface LearningRecommendation {
  type: 'weak-area' | 'growth-opportunity' | 'maintenance' | 'exploration';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  topic?: string;
}

const generateRecommendations = (portfolioData: PortfolioItem[]): LearningRecommendation[] => {
  const recommendations: LearningRecommendation[] = [];
  
  // Find weak areas (accuracy < 60%)
  const weakAreas = portfolioData.filter(item => item.accuracy < 60);
  weakAreas.forEach(item => {
    recommendations.push({
      type: 'weak-area',
      title: `Focus on ${item.topic}`,
      description: `Your accuracy in ${item.topic} is ${Math.round(item.accuracy)}%. Practice more questions in this area.`,
      priority: 'high',
      action: `Practice ${item.topic} questions`,
      topic: item.topic
    });
  });
  
  // Find growth opportunities (high volume, low accuracy)
  const growthOpportunities = portfolioData.filter(item => item.volume > 10 && item.accuracy < 70);
  growthOpportunities.forEach(item => {
    recommendations.push({
      type: 'growth-opportunity',
      title: `Improve ${item.topic} Performance`,
      description: `You've practiced ${item.volume} questions in ${item.topic} but accuracy is ${Math.round(item.accuracy)}%.`,
      priority: 'medium',
      action: `Review ${item.topic} concepts`,
      topic: item.topic
    });
  });
  
  // Suggest exploration for topics with no data
  const exploredTopics = new Set(portfolioData.map(item => item.topic));
  const allTopics = ['Compute Engine', 'Cloud Storage', 'BigQuery', 'Cloud IAM', 'VPC Networking', 'Cloud SQL', 'GKE', 'App Engine'];
  const unexploredTopics = allTopics.filter(topic => !exploredTopics.has(topic));
  
  if (unexploredTopics.length > 0) {
    recommendations.push({
      type: 'exploration',
      title: 'Explore New Topics',
      description: `Try questions from ${unexploredTopics.slice(0, 2).join(' and ')} to expand your knowledge.`,
      priority: 'medium',
      action: 'Explore new topics'
    });
  }
  
  return recommendations.slice(0, 5); // Limit to top 5 recommendations
};

/**
 * Portfolio item interface
 */
interface PortfolioItem {
  keyword: string;
  credit: number; // Like stock price
  growth: number; // Percentage change
  accuracy: number; // Performance metric
  volume: number; // Questions answered
  topic: string;
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Total learning value
  lastUpdated: Date;
}

/**
 * Sorting options
 */
type SortOption = 'value' | 'growth' | 'accuracy' | 'volume' | 'alphabetical';

/**
 * Learning goals system
 */
interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: Date;
  category: 'accuracy' | 'volume' | 'mastery' | 'streak';
  completed: boolean;
  createdAt: Date;
}

export default function PortfolioPage() {
  const { state } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [filterTopic, setFilterTopic] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showGoals, setShowGoals] = useState(true);
  const [goals, setGoals] = useState<LearningGoal[]>(() => {
    const stored = localStorage.getItem('gcp-learning-goals');
    if (stored) {
      return JSON.parse(stored).map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined
      }));
    }
    return [];
  });

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('gcp-learning-goals', JSON.stringify(goals));
  }, [goals]);

  // Update goals with current data
  useEffect(() => {
    if (goals.length === 0) {
      // Generate default goals after portfolioData is available
      const generateDefaultGoals = (portfolioData: PortfolioItem[], userAnswers: any[]): LearningGoal[] => {
        const totalQuestions = userAnswers.length;
        const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        return [
          {
            id: 'accuracy-90',
            title: 'Achieve 90% Accuracy',
            description: 'Maintain a high accuracy rate across all topics',
            targetValue: 90,
            currentValue: accuracy,
            unit: '%',
            category: 'accuracy',
            completed: accuracy >= 90,
            createdAt: new Date()
          },
          {
            id: 'answer-100',
            title: 'Answer 100 Questions',
            description: 'Complete 100 quiz questions to build experience',
            targetValue: 100,
            currentValue: totalQuestions,
            unit: 'questions',
            category: 'volume',
            completed: totalQuestions >= 100,
            createdAt: new Date()
          },
          {
            id: 'master-5-topics',
            title: 'Master 5 Topics',
            description: 'Achieve 80%+ accuracy in 5 different topics',
            targetValue: 5,
            currentValue: portfolioData.filter(item => item.accuracy >= 80).length,
            unit: 'topics',
            category: 'mastery',
            completed: portfolioData.filter(item => item.accuracy >= 80).length >= 5,
            createdAt: new Date()
          }
        ];
      };
      
      setGoals(generateDefaultGoals(portfolioData, state.userAnswers || []));
    } else {
      setGoals(prevGoals => prevGoals.map(goal => {
        const updatedGoal = { ...goal };
        
        switch (goal.category) {
          case 'accuracy':
            const totalQuestions = (state.userAnswers || []).length;
            const correctAnswers = (state.userAnswers || []).filter(a => a.isCorrect).length;
            const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
            updatedGoal.currentValue = accuracy;
            updatedGoal.completed = accuracy >= goal.targetValue;
            break;
          case 'volume':
            updatedGoal.currentValue = (state.userAnswers || []).length;
            updatedGoal.completed = (state.userAnswers || []).length >= goal.targetValue;
            break;
          case 'mastery':
            // For mastery goals, we'll update them separately when portfolioData is available
            break;
        }
        
        return updatedGoal;
      }));
    }
  }, [state.userAnswers]);



  /**
   * Generate portfolio data from real user performance
   */
  const portfolioData: PortfolioItem[] = useMemo(() => {
    const portfolio = state.portfolio || {};
    const questions = state.questions || [];
    const userAnswers = state.userAnswers || [];
    
    if (Object.keys(portfolio).length === 0) {
      // Return mock data if no real data available
      const mockData = generateMockData();
      return mockData.map(item => ({
        ...item,
        marketCap: item.credit * item.volume
      }));
    }

    // Generate real portfolio data
    return Object.entries(portfolio).map(([keyword, data]) => {
      const relatedAnswers = userAnswers.filter(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        return question && question.keywords.includes(keyword);
      });

      const correctAnswers = relatedAnswers.filter(a => a.isCorrect).length;
      const accuracy = relatedAnswers.length > 0 ? (correctAnswers / relatedAnswers.length) * 100 : 50;
      
      const relatedQuestion = questions.find(q => q.keywords.includes(keyword));
      const topic = relatedQuestion?.topic || 'General';

      return {
        keyword,
        credit: data.credit,
        growth: data.growth,
        accuracy,
        volume: relatedAnswers.length,
        topic,
        trend: data.growth > 2 ? 'up' : data.growth < -2 ? 'down' : 'stable',
        marketCap: data.credit * Math.max(relatedAnswers.length, 1),
        lastUpdated: data.lastUpdated
      };
    });
  }, [state.portfolio, state.questions, state.userAnswers, lastRefresh]); // Re-calculate when data changes

  // Update mastery goals when portfolioData is available
  useEffect(() => {
    if (goals.length > 0) {
      setGoals(prevGoals => prevGoals.map(goal => {
        if (goal.category === 'mastery') {
          const masteredTopics = portfolioData.filter(item => item.accuracy >= 80).length;
          return {
            ...goal,
            currentValue: masteredTopics,
            completed: masteredTopics >= goal.targetValue
          };
        }
        return goal;
      }));
    }
  }, [portfolioData, goals.length]);

  /**
   * Filter and sort portfolio data
   */
  const processedData = useMemo(() => {
    let filtered = portfolioData;
    
    // Filter by topic
    if (filterTopic !== 'all') {
      filtered = filtered.filter(item => item.topic.toLowerCase() === filterTopic.toLowerCase());
    }
    
    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.marketCap - a.marketCap;
        case 'growth':
          return b.growth - a.growth;
        case 'accuracy':
          return b.accuracy - a.accuracy;
        case 'volume':
          return b.volume - a.volume;
        case 'alphabetical':
          return a.keyword.localeCompare(b.keyword);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [portfolioData, sortBy, filterTopic]);



  /**
   * Calculate portfolio summary
   */
  const portfolioSummary = useMemo(() => {
    const totalValue = portfolioData.reduce((sum, item) => sum + item.marketCap, 0);
    const avgGrowth = portfolioData.length > 0 
      ? portfolioData.reduce((sum, item) => sum + item.growth, 0) / portfolioData.length 
      : 0;
    const avgAccuracy = portfolioData.length > 0
      ? portfolioData.reduce((sum, item) => sum + item.accuracy, 0) / portfolioData.length
      : 0;
    const topPerformer = portfolioData.sort((a, b) => b.growth - a.growth)[0];
    
    return {
      totalValue,
      avgGrowth,
      avgAccuracy,
      holdings: portfolioData.length,
      topPerformer
    };
  }, [portfolioData]);

  /**
   * Generate achievements and recommendations
   */
  const achievements = useMemo(() => generateAchievements(portfolioData, state.userAnswers || []), [portfolioData, state.userAnswers]);
  const recommendations = useMemo(() => generateRecommendations(portfolioData), [portfolioData]);

  /**
   * Get trend icon
   */
  const getTrendIcon = (trend: 'up' | 'down' | 'stable', growth: number) => {
    if (trend === 'up') return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
    return <MinusIcon className="h-4 w-4 text-slate-400" />;
  };

  /**
   * Get available topics for filter
   */
  const availableTopics = [...new Set(portfolioData.map(item => item.topic))];

  /**
   * Export portfolio data
   */
  const exportPortfolioData = () => {
    const exportData = {
      portfolio: state.portfolio,
      userAnswers: state.userAnswers,
      summary: portfolioSummary,
      achievements: achievements.filter(a => a.unlocked),
      recommendations,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gcp-portfolio-${new Date().toISOString().split('T')[0]}.json`;
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
   * Add new learning goal
   */
  const addLearningGoal = (goal: Omit<LearningGoal, 'id' | 'createdAt'>) => {
    const newGoal: LearningGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  /**
   * Remove learning goal
   */
  const removeLearningGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Learning Portfolio
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">
                Track your knowledge like an investment portfolio. Monitor performance, 
                identify opportunities, and optimize your learning strategy.
              </p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Link to="/quiz">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Practice Quiz
                </Button>
              </Link>
              <Button variant="outline" onClick={handleRefreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" onClick={exportPortfolioData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="value">Sort by Value</option>
                <option value="growth">Sort by Growth</option>
                <option value="accuracy">Sort by Accuracy</option>
                <option value="volume">Sort by Volume</option>
                <option value="alphabetical">Sort Alphabetically</option>
              </select>
              
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                {availableTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
                )}
              >
                <PieChart className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
                )}
              >
                <Activity className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Learning Goals Section */}
        {showGoals && (
          <Card className="mb-8 border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Goal className="h-5 w-5 mr-2" />
                Learning Goals
                <Badge className="ml-2">{goals.filter(g => g.completed).length}/{goals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    goal.completed 
                      ? "border-green-200 bg-green-50" 
                      : "border-purple-200 bg-white"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {goal.completed ? '🎯' : '🎯'}
                        </div>
                        <div>
                          <h4 className={cn(
                            "font-semibold",
                            goal.completed ? "text-green-800" : "text-slate-900"
                          )}>
                            {goal.title}
                          </h4>
                          <p className="text-sm text-slate-600">{goal.description}</p>
                        </div>
                      </div>
                      {goal.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-semibold">
                          {Math.min(goal.currentValue, goal.targetValue)} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <Progress 
                        value={(goal.currentValue / goal.targetValue) * 100} 
                        className="h-2"
                      />
                      {goal.deadline && (
                        <div className="text-xs text-slate-500">
                          Deadline: {goal.deadline.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {goals.length === 0 && (
                  <div className="text-center py-8">
                    <Goal className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Learning Goals</h3>
                    <p className="text-slate-500 mb-4">Set learning goals to track your progress</p>
                    <Button 
                      variant="outline" 
                      onClick={() => addLearningGoal({
                        title: 'New Goal',
                        description: 'Set a custom learning goal',
                        targetValue: 10,
                        currentValue: 0,
                        unit: 'items',
                        category: 'volume',
                        completed: false
                      })}
                    >
                      Add Goal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <Card className="mb-8 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Lightbulb className="h-5 w-5 mr-2" />
                Learning Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      rec.priority === 'high' ? 'bg-red-500' : 
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    )} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                      <p className="text-sm text-slate-600">{rec.description}</p>
                      {rec.topic && (
                        <Link to={`/quiz?topic=${rec.topic}`}>
                          <Button size="sm" variant="outline" className="mt-2">
                            {rec.action}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(portfolioSummary.totalValue)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Growth</p>
                  <p className={cn("text-2xl font-bold", getPercentageColor(portfolioSummary.avgGrowth))}>
                    {formatPercentage(portfolioSummary.avgGrowth).text}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Accuracy</p>
                  <p className={cn("text-2xl font-bold", getPercentageColor(portfolioSummary.avgAccuracy))}>
                    {Math.round(portfolioSummary.avgAccuracy)}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Holdings</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {portfolioSummary.holdings}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <PieChart className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Achievements
              <Badge className="ml-2">{achievements.filter(a => a.unlocked).length}/{achievements.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  achievement.unlocked 
                    ? "border-green-200 bg-green-50" 
                    : "border-slate-200 bg-slate-50"
                )}>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={cn(
                        "font-semibold text-sm",
                        achievement.unlocked ? "text-green-800" : "text-slate-600"
                      )}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {achievement.description}
                      </p>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="mt-2 h-1"
                      />
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performer Highlight */}
        {portfolioSummary.topPerformer && (
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Trophy className="h-5 w-5 mr-2" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge className={getTopicColor(portfolioSummary.topPerformer.topic)}>
                    {portfolioSummary.topPerformer.keyword}
                  </Badge>
                  <div className="text-sm text-green-700">
                    <span className="font-semibold">
                      {formatPercentage(portfolioSummary.topPerformer.growth).text}
                    </span> growth
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-800">
                    {formatCurrency(portfolioSummary.topPerformer.credit)}
                  </div>
                  <div className="text-sm text-green-600">
                    {Math.round(portfolioSummary.topPerformer.accuracy)}% accuracy
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Items */}
        <div className="space-y-6">
          {/* Portfolio Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {processedData.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getTopicColor(item.topic)}>
                        {item.keyword}
                      </Badge>
                      {getTrendIcon(item.trend, item.growth)}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Credit Value</span>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.credit)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Growth</span>
                        <span className={cn("font-semibold", formatPercentage(item.growth).color)}>
                          {formatPercentage(item.growth).text}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Accuracy</span>
                        <span className={cn("font-semibold", getPercentageColor(item.accuracy))}>
                          {Math.round(item.accuracy)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Volume</span>
                        <span className="font-semibold text-slate-900">
                          {item.volume} questions
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>Market Cap</span>
                          <span>{formatCurrency(item.marketCap)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">Topic</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Credit</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Growth</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Accuracy</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Volume</th>
                        <th className="text-right p-4 font-semibold text-slate-700">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              {getTrendIcon(item.trend, item.growth)}
                              <Badge className={getTopicColor(item.topic)}>
                                {item.keyword}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4 text-right font-semibold">
                            {formatCurrency(item.credit)}
                          </td>
                          <td className={cn("p-4 text-right font-semibold", formatPercentage(item.growth).color)}>
                            {formatPercentage(item.growth).text}
                          </td>
                          <td className={cn("p-4 text-right font-semibold", getPercentageColor(item.accuracy))}>
                            {Math.round(item.accuracy)}%
                          </td>
                          <td className="p-4 text-right text-slate-600">
                            {item.volume}
                          </td>
                          <td className="p-4 text-right font-semibold">
                            {formatCurrency(item.marketCap)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {processedData.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <PieChart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No Holdings Found
                </h3>
                <p className="text-slate-500 mb-6">
                  Start taking quizzes to build your learning portfolio!
                </p>
                <Link to="/quiz">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">View Heatmap</h3>
              <p className="text-sm text-slate-600 mb-4">
                Visualize your learning progress across topics
              </p>
              <Link to="/heatmap">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Heatmap
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                <PlayCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Practice Quiz</h3>
              <p className="text-sm text-slate-600 mb-4">
                Improve your portfolio with targeted practice
              </p>
              <Link to="/quiz">
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full inline-block mb-4">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Achievements</h3>
              <p className="text-sm text-slate-600 mb-4">
                Track your milestones and accomplishments
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowAchievements(!showAchievements)}>
                <Award className="h-4 w-4 mr-2" />
                View Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
