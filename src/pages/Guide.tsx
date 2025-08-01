/**
 * Guide page - Study materials and resources
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Video, 
  ExternalLink,
  Download,
  Star,
  Clock,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Brain,
  Database,
  Shield,
  Cloud,
  Server,
  Network,
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

interface StudyResource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'interactive' | 'practice';
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  url?: string;
  icon: React.ComponentType<any>;
}

interface StudyCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  resources: number;
}

export default function GuidePage() {
  const categories: StudyCategory[] = [
    {
      id: 'compute',
      name: 'Compute Engine',
      description: 'Virtual machines, instance groups, and compute resources',
      icon: Server,
      color: 'blue',
      resources: 12
    },
    {
      id: 'storage',
      name: 'Cloud Storage',
      description: 'Object storage, databases, and data management',
      icon: Database,
      color: 'green',
      resources: 8
    },
    {
      id: 'networking',
      name: 'Networking',
      description: 'VPC, load balancing, and network security',
      icon: Network,
      color: 'purple',
      resources: 10
    },
    {
      id: 'security',
      name: 'Security & IAM',
      description: 'Identity management, access control, and security best practices',
      icon: Shield,
      color: 'orange',
      resources: 15
    },
    {
      id: 'serverless',
      name: 'Serverless',
      description: 'Cloud Functions, App Engine, and serverless computing',
      icon: Zap,
      color: 'pink',
      resources: 6
    },
    {
      id: 'monitoring',
      name: 'Monitoring & Logging',
      description: 'Stackdriver, logging, and observability',
      icon: Settings,
      color: 'indigo',
      resources: 9
    }
  ];

  const resources: StudyResource[] = [
    {
      id: 'gcp-overview',
      title: 'GCP Fundamentals',
      description: 'Complete overview of Google Cloud Platform services and architecture',
      type: 'document',
      category: 'Fundamentals',
      duration: '2 hours',
      difficulty: 'beginner',
      rating: 4.8,
      icon: BookOpen
    },
    {
      id: 'compute-engine-deep-dive',
      title: 'Compute Engine Deep Dive',
      description: 'Advanced concepts in Compute Engine including instance management and optimization',
      type: 'video',
      category: 'Compute',
      duration: '1.5 hours',
      difficulty: 'intermediate',
      rating: 4.6,
      icon: Server
    },
    {
      id: 'security-best-practices',
      title: 'Security Best Practices',
      description: 'Comprehensive guide to securing your GCP infrastructure',
      type: 'interactive',
      category: 'Security',
      duration: '3 hours',
      difficulty: 'advanced',
      rating: 4.9,
      icon: Shield
    },
    {
      id: 'networking-lab',
      title: 'Networking Lab',
      description: 'Hands-on lab for VPC, firewall rules, and load balancing',
      type: 'practice',
      category: 'Networking',
      duration: '2.5 hours',
      difficulty: 'intermediate',
      rating: 4.7,
      icon: Network
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'interactive':
        return <PlayCircle className="h-4 w-4" />;
      case 'practice':
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'purple':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'orange':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'pink':
        return 'bg-pink-100 text-pink-600 border-pink-200';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">GCP Study Guide</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive study materials and resources to help you master Google Cloud Platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900">60+</div>
              <div className="text-sm text-slate-600">Study Resources</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900">120+</div>
              <div className="text-sm text-slate-600">Hours of Content</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900">10K+</div>
              <div className="text-sm text-slate-600">Active Learners</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900">4.8</div>
              <div className="text-sm text-slate-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Study Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Study Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-3 rounded-lg border", getCategoryColor(category.color))}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{category.resources} resources</span>
                    <Button variant="outline" size="sm" className="group-hover:bg-slate-100">
                      Explore
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Featured Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Resources</h2>
        <div className="space-y-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{resource.title}</h3>
                          <p className="text-slate-600 mb-3">{resource.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {resource.duration}
                            </span>
                            <span className="flex items-center">
                              {getTypeIcon(resource.type)}
                              <span className="ml-1 capitalize">{resource.type}</span>
                            </span>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium ml-1">{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm">
                        Start Learning
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Learning Path */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommended Learning Path</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">GCP Fundamentals</h3>
                  <p className="text-sm text-slate-600">Start with the basics of Google Cloud Platform</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Compute & Storage</h3>
                  <p className="text-sm text-slate-600">Learn about Compute Engine and Cloud Storage</p>
                </div>
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Networking & Security</h3>
                  <p className="text-sm text-slate-600">Master VPC, IAM, and security concepts</p>
                </div>
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Advanced Topics</h3>
                  <p className="text-sm text-slate-600">Explore Kubernetes, serverless, and monitoring</p>
                </div>
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to start your GCP journey?</h2>
            <p className="text-lg mb-6 opacity-90">
              Access all study materials and begin your path to GCP certification
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Brain className="h-5 w-5 mr-2" />
                Take Practice Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 