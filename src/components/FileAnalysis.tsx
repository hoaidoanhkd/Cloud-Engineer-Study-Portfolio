/**
 * File analysis results display component
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Shield,
  Eye,
  Code,
  BarChart3
} from 'lucide-react';

interface AnalysisResult {
  file: File;
  structure: {
    type: string;
    size: string;
    lines?: number;
    characters?: number;
    encoding?: string;
  };
  issues: {
    critical: Array<{ type: string; message: string; line?: number; }>;
    warnings: Array<{ type: string; message: string; line?: number; }>;
    suggestions: Array<{ type: string; message: string; improvement: string; }>;
  };
  score: number;
}

interface FileAnalysisProps {
  result: AnalysisResult;
}

export default function FileAnalysis({ result }: FileAnalysisProps) {
  /**
   * Get score color based on value
   */
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Get score background color
   */
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  /**
   * Get issue icon based on type
   */
  const getIssueIcon = (type: 'critical' | 'warning' | 'suggestion') => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'suggestion':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* File Overview */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            File Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Score */}
          <div className={`p-4 rounded-lg ${getScoreBg(result.score)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
              </div>
              <div className="text-sm font-medium text-slate-600">Quality Score</div>
              <Progress 
                value={result.score} 
                className="mt-2 h-2"
              />
            </div>
          </div>

          {/* File Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-600">File Name:</span>
              <span className="text-sm text-slate-900 truncate max-w-32" title={result.file.name}>
                {result.file.name}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-600">Type:</span>
              <Badge variant="outline" className="text-xs">
                {result.structure.type}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-600">Size:</span>
              <span className="text-sm text-slate-900">{result.structure.size}</span>
            </div>
            
            {result.structure.lines && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-600">Lines:</span>
                <span className="text-sm text-slate-900">{result.structure.lines.toLocaleString()}</span>
              </div>
            )}
            
            {result.structure.characters && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-600">Characters:</span>
                <span className="text-sm text-slate-900">{result.structure.characters.toLocaleString()}</span>
              </div>
            )}
            
            {result.structure.encoding && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-600">Encoding:</span>
                <span className="text-sm text-slate-900">{result.structure.encoding}</span>
              </div>
            )}
          </div>

          {/* Issues Summary */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Issues Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-slate-600">Critical</span>
                </div>
                <Badge className={`${result.issues.critical.length > 0 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'}`}>
                  {result.issues.critical.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-slate-600">Warnings</span>
                </div>
                <Badge className={`${result.issues.warnings.length > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-600'}`}>
                  {result.issues.warnings.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-600">Suggestions</span>
                </div>
                <Badge className={`${result.issues.suggestions.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                  {result.issues.suggestions.length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Issues */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Detailed Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive breakdown of identified issues and areas for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Critical Issues */}
            {result.issues.critical.length > 0 && (
              <div>
                <h4 className="flex items-center font-semibold text-red-700 mb-3">
                  <XCircle className="h-5 w-5 mr-2" />
                  Critical Issues ({result.issues.critical.length})
                </h4>
                <div className="space-y-2">
                  {result.issues.critical.map((issue, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon('critical')}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-red-900">{issue.type}</div>
                          <div className="text-sm text-red-700 mt-1">{issue.message}</div>
                          {issue.line && (
                            <div className="text-xs text-red-600 mt-1">
                              Line {issue.line}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.issues.warnings.length > 0 && (
              <div>
                <h4 className="flex items-center font-semibold text-yellow-700 mb-3">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Warnings ({result.issues.warnings.length})
                </h4>
                <div className="space-y-2">
                  {result.issues.warnings.map((issue, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon('warning')}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-yellow-900">{issue.type}</div>
                          <div className="text-sm text-yellow-700 mt-1">{issue.message}</div>
                          {issue.line && (
                            <div className="text-xs text-yellow-600 mt-1">
                              Line {issue.line}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.issues.suggestions.length > 0 && (
              <div>
                <h4 className="flex items-center font-semibold text-blue-700 mb-3">
                  <Info className="h-5 w-5 mr-2" />
                  Suggestions ({result.issues.suggestions.length})
                </h4>
                <div className="space-y-2">
                  {result.issues.suggestions.map((issue, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon('suggestion')}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-blue-900">{issue.type}</div>
                          <div className="text-sm text-blue-700 mt-1">{issue.message}</div>
                          <div className="text-xs text-blue-600 mt-2 font-medium">
                            💡 {issue.improvement}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Issues Found */}
            {result.issues.critical.length === 0 && 
             result.issues.warnings.length === 0 && 
             result.issues.suggestions.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Excellent! No Issues Found
                </h3>
                <p className="text-green-600">
                  Your file appears to be well-structured and follows good practices.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
