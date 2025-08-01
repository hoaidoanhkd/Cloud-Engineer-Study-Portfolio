/**
 * Recommendations list component displaying improvement suggestions
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Target, 
  Shield, 
  Eye, 
  Zap, 
  TrendingUp,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  solution: string;
  icon: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  /**
   * Toggle expanded state for recommendation item
   */
  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  /**
   * Get icon component based on icon name
   */
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (iconName) {
      case 'shield': return <Shield {...iconProps} className="h-5 w-5 text-red-500" />;
      case 'eye': return <Eye {...iconProps} className="h-5 w-5 text-blue-500" />;
      case 'zap': return <Zap {...iconProps} className="h-5 w-5 text-yellow-500" />;
      case 'target': return <Target {...iconProps} className="h-5 w-5 text-green-500" />;
      case 'trending-up': return <TrendingUp {...iconProps} className="h-5 w-5 text-purple-500" />;
      case 'file-check': return <FileCheck {...iconProps} className="h-5 w-5 text-blue-500" />;
      default: return <Lightbulb {...iconProps} className="h-5 w-5 text-yellow-500" />;
    }
  };

  /**
   * Get priority badge style
   */
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  /**
   * Filter recommendations based on selected filters
   */
  const filteredRecommendations = recommendations.filter(rec => {
    const priorityMatch = filterPriority === 'all' || rec.priority === filterPriority;
    const categoryMatch = filterCategory === 'all' || rec.category === filterCategory;
    return priorityMatch && categoryMatch;
  });

  /**
   * Get unique categories for filter
   */
  const categories = Array.from(new Set(recommendations.map(rec => rec.category)));

  /**
   * Sort recommendations by priority
   */
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Perfect! No Recommendations Needed
          </h3>
          <p className="text-green-600">
            Your file is already optimized and follows best practices.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Smart Recommendations ({recommendations.length})
            </CardTitle>
            <CardDescription>
              Actionable suggestions to improve your file quality and performance
            </CardDescription>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedRecommendations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No recommendations match your current filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setFilterPriority('all');
                setFilterCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          sortedRecommendations.map((recommendation, index) => {
            const isExpanded = expandedItems.has(index);
            
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
              >
                {/* Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getIcon(recommendation.icon)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {recommendation.title}
                          </h4>
                          <Badge className={getPriorityBadge(recommendation.priority)}>
                            {recommendation.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recommendation.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-slate-50 border-t border-slate-200">
                    <div className="pt-4 space-y-3">
                      <div>
                        <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1 text-blue-500" />
                          Solution
                        </h5>
                        <p className="text-sm text-slate-700 bg-white p-3 rounded border">
                          {recommendation.solution}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Priority: {recommendation.priority}</span>
                          <span>Category: {recommendation.category}</span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this could link to documentation or tutorials
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        
        {/* Summary */}
        {sortedRecommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Implementation Priority</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Focus on high-priority recommendations first for maximum impact on your file quality.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-2 bg-white rounded border border-red-200">
                <div className="font-bold text-red-600">
                  {recommendations.filter(r => r.priority === 'high').length}
                </div>
                <div className="text-red-700">High Priority</div>
              </div>
              <div className="text-center p-2 bg-white rounded border border-yellow-200">
                <div className="font-bold text-yellow-600">
                  {recommendations.filter(r => r.priority === 'medium').length}
                </div>
                <div className="text-yellow-700">Medium Priority</div>
              </div>
              <div className="text-center p-2 bg-white rounded border border-green-200">
                <div className="font-bold text-green-600">
                  {recommendations.filter(r => r.priority === 'low').length}
                </div>
                <div className="text-green-700">Low Priority</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
