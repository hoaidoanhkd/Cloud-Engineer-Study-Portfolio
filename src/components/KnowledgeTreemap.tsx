/**
 * Knowledge Treemap component displaying learning performance like stock heatmap
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Filter,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

interface KeywordData {
  keyword: string;
  frequency: number;
  accuracy: number;
  topic?: string;
  correctAnswers?: number;
  totalAnswers?: number;
}

interface KnowledgeTreemapProps {
  data: KeywordData[];
  keywordData?: KeywordData[]; // Separate keyword-level data
  selectedTopic?: string;
  onTopicChange?: (topic: string) => void;
  onKeywordClick?: (keyword: string) => void;
  onNavigateToQuiz?: (topic?: string) => void;
}

export default function KnowledgeTreemap({ 
  data, 
  keywordData = [],
  selectedTopic = 'all',
  onTopicChange,
  onKeywordClick,
  onNavigateToQuiz
}: KnowledgeTreemapProps) {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'topic' | 'keyword'>('topic');

  // Debug effect to track data changes
  useEffect(() => {
    console.log('KnowledgeTreemap data updated:', {
      topicData: data.length,
      keywordData: keywordData.length,
      activeTab
    });
  }, [data, keywordData, activeTab]);

  // Get current data based on active tab
  const currentData = useMemo(() => {
    console.log('Recalculating currentData for tab:', activeTab);
    
    if (activeTab === 'topic') {
      // Filter by topic for topic view
      const topicData = selectedTopic === 'all' ? data : data.filter(item => item.topic?.toLowerCase() === selectedTopic.toLowerCase());
      console.log('Topic data:', topicData.length, 'items');
      return topicData;
    } else {
      // Use keyword data for keyword view
      console.log('Keyword data:', keywordData.length, 'items');
      return keywordData;
    }
  }, [data, keywordData, selectedTopic, activeTab]);

  // Calculate layout weights
  const processedData = useMemo(() => {
    if (currentData.length === 0) return [];
    
    const maxFrequency = Math.max(...currentData.map(d => d.frequency));
    const minFrequency = Math.min(...currentData.map(d => d.frequency));
    
    return currentData.map(item => {
      const normalizedSize = maxFrequency > minFrequency 
        ? ((item.frequency - minFrequency) / (maxFrequency - minFrequency)) * 10 + 1
        : 5;
      
      let colorClass = '';
      let textColorClass = '';
      
      if (item.accuracy >= 0.8) {
        colorClass = 'bg-green-500';
        textColorClass = 'text-white';
      } else if (item.accuracy >= 0.7) {
        colorClass = 'bg-green-400';
        textColorClass = 'text-white';
      } else if (item.accuracy >= 0.6) {
        colorClass = 'bg-yellow-400';
        textColorClass = 'text-slate-900';
      } else if (item.accuracy >= 0.5) {
        colorClass = 'bg-orange-400';
        textColorClass = 'text-white';
      } else if (item.accuracy >= 0.4) {
        colorClass = 'bg-red-400';
        textColorClass = 'text-white';
      } else {
        colorClass = 'bg-red-500';
        textColorClass = 'text-white';
      }

      return {
        ...item,
        size: Math.max(1, normalizedSize),
        colorClass,
        textColorClass
      };
    });
  }, [currentData]);

  // Handle mouse events for tooltip
  const handleMouseEnter = (keyword: string, event: React.MouseEvent) => {
    setHoveredKeyword(keyword);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredKeyword) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredKeyword(null);
  };

  // Get unique topics
  const topics = Array.from(new Set(data.map(item => item.topic).filter(Boolean)));

  const hoveredData = processedData.find(item => item.keyword === hoveredKeyword);

  // Calculate statistics
  const strongAreas = processedData.filter(item => item.accuracy >= 0.8).length;
  const improvingAreas = processedData.filter(item => item.accuracy >= 0.5 && item.accuracy < 0.8).length;
  const needFocusAreas = processedData.filter(item => item.accuracy < 0.5).length;

  console.log('KnowledgeTreemap render:', {
    activeTab,
    dataLength: data.length,
    keywordDataLength: keywordData.length,
    currentDataLength: currentData.length,
    processedDataLength: processedData.length
  });

  return (
    <div className="space-y-6">
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <strong>Debug:</strong> {activeTab} tab | 
          Data: {data.length} topics, {keywordData.length} keywords | 
          Showing: {processedData.length} items
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('topic')}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === 'topic'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span>By Topic</span>
          </button>
          <button
            onClick={() => setActiveTab('keyword')}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === 'keyword'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Target className="h-4 w-4" />
            <span>By Keyword</span>
          </button>
        </div>

        {/* Topic Filter - Only show in topic tab */}
        {activeTab === 'topic' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Filter by Topic</label>
            <Select value={selectedTopic} onValueChange={onTopicChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic?.toLowerCase() || ''}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" />
            <span>{processedData.length} {activeTab === 'topic' ? 'topics' : 'keywords'}</span>
            {/* Debug refresh button */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => window.location.reload()}
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                Refresh
              </button>
            )}
          </div>
          
          {/* Active Filters - Only show topic filter */}
          {activeTab === 'topic' && selectedTopic !== 'all' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Active filter:</span>
              <Badge variant="secondary" className="text-xs">
                Topic: {selectedTopic}
                <button
                  onClick={() => onTopicChange && onTopicChange('all')}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Excellent (≥80%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-sm">Good (60-79%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-sm">Fair (40-59%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Needs Work (less than 40%)</span>
        </div>
      </div>

      {/* Treemap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {activeTab === 'topic' ? (
              <>
                <BarChart3 className="mr-2 w-5 h-5 text-blue-600" />
                Knowledge Performance by Topic
              </>
            ) : (
              <>
                <Target className="mr-2 w-5 h-5 text-green-600" />
                Knowledge Performance by Keyword
              </>
            )}
          </CardTitle>
          <CardDescription>
            {activeTab === 'topic' 
              ? "Performance grouped by GCP topics. Size represents questions answered, color represents accuracy."
              : "Performance for individual keywords like compute-engine, vm, instance. Click to practice."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="relative min-h-[400px] p-4"
            onMouseMove={handleMouseMove}
          >
            {/* Treemap Container */}
            <div className="flex flex-wrap gap-2 justify-center items-start h-full">
              {processedData.map((item) => {
                const width = Math.max(120, item.size * 20);
                const height = Math.max(80, item.size * 15);
                
                const boxClasses = [
                  item.colorClass,
                  item.textColorClass,
                  'rounded-lg',
                  'p-3',
                  'cursor-pointer',
                  'transition-all',
                  'duration-200',
                  'hover:scale-105',
                  'hover:shadow-lg',
                  'flex',
                  'flex-col',
                  'justify-between',
                  'border',
                  'border-white/20'
                ].join(' ');
                
                return (
                  <div
                    key={item.keyword}
                    className={boxClasses}
                    style={{
                      width: width + 'px',
                      height: height + 'px',
                      minWidth: '100px',
                      minHeight: '70px'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(item.keyword, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onKeywordClick && onKeywordClick(item.keyword)}
                  >
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="font-bold text-sm mb-1 text-center">
                        {item.keyword}
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {Math.round(item.accuracy * 100)}%
                        </div>
                        <div className="text-xs opacity-90">
                          {item.frequency} questions
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      {item.accuracy >= 0.8 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : item.accuracy < 0.5 ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {processedData.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                {activeTab === 'topic' ? (
                  <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                ) : (
                  <Target className="w-12 h-12 mb-4 opacity-50" />
                )}
                <p className="text-lg mb-2">
                  {activeTab === 'topic' ? 'No topic data available' : 'No keyword data available'}
                </p>
                <p className="text-sm">
                  {activeTab === 'topic' 
                    ? 'Start taking quizzes to see your topic performance!'
                    : 'Answer quiz questions to see individual keyword performance!'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Floating Tooltip */}
      {hoveredKeyword && hoveredData && (
        <div
          className="fixed z-50 bg-slate-900 text-white p-3 rounded-lg shadow-xl pointer-events-none border border-slate-700"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-2">
            <div className="font-bold text-lg">{hoveredData.keyword}</div>
            {hoveredData.topic && (
              <Badge variant="outline" className="text-xs">
                {hoveredData.topic}
              </Badge>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-300">Accuracy</div>
                <div className="font-bold text-lg">
                  {Math.round(hoveredData.accuracy * 100)}%
                </div>
              </div>
              <div>
                <div className="text-slate-300">Frequency</div>
                <div className="font-bold text-lg">
                  {hoveredData.frequency}
                </div>
              </div>
            </div>
            {hoveredData.correctAnswers !== undefined && hoveredData.totalAnswers !== undefined && (
              <div className="text-sm border-t border-slate-700 pt-2">
                <div className="text-slate-300">
                  {hoveredData.correctAnswers}/{hoveredData.totalAnswers} correct answers
                </div>
                <div className="text-slate-300">
                  {hoveredData.totalAnswers - hoveredData.correctAnswers} wrong answers
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Strong Areas</div>
                <div className="text-2xl font-bold text-green-600">
                  {strongAreas}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Improving</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {improvingAreas}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Need Focus</div>
                <div className="text-2xl font-bold text-red-600">
                  {needFocusAreas}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
