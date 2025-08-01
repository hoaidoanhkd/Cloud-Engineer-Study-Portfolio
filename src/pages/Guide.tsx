/**
 * Guide page component with exam information and usage instructions
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BookOpen, 
  Target, 
  Clock, 
  Award,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Study Guide</h1>
        <p className="text-lg text-slate-600">
          Everything you need to know about Google Associate Cloud Engineer certification
        </p>
      </div>

      <Tabs defaultValue="exam-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="exam-info">Exam Info</TabsTrigger>
          <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
          <TabsTrigger value="study-tips">Study Tips</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Exam Information */}
        <TabsContent value="exam-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-blue-600" />
                Google Associate Cloud Engineer Certification
              </CardTitle>
              <CardDescription>
                Official certification overview and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Exam Duration</p>
                      <p className="text-sm text-slate-600">2 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Question Format</p>
                      <p className="text-sm text-slate-600">Multiple choice & multiple select</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Number of Questions</p>
                      <p className="text-sm text-slate-600">~50 questions</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Passing Score</p>
                      <p className="text-sm text-slate-600">70% (estimated)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Exam Cost</p>
                      <p className="text-sm text-slate-600">$125 USD</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Validity</p>
                      <p className="text-sm text-slate-600">3 years</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Exam Domains</h3>
                <div className="space-y-3">
                  {[
                    { domain: 'Setting up a cloud solution environment', weight: '17.5%' },
                    { domain: 'Planning and configuring a cloud solution', weight: '17.5%' },
                    { domain: 'Deploying and implementing a cloud solution', weight: '25%' },
                    { domain: 'Ensuring successful operation of a cloud solution', weight: '17.5%' },
                    { domain: 'Configuring access and security', weight: '17.5%' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">{item.domain}</span>
                      <Badge variant="outline">{item.weight}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How to Use */}
        <TabsContent value="how-to-use" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600" />
                  Taking Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium">Choose Your Topic</p>
                      <p className="text-sm text-slate-600">Select a specific GCP service or take a comprehensive test</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium">Answer Questions</p>
                      <p className="text-sm text-slate-600">Take your time and read each question carefully</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="font-medium">Learn from Results</p>
                      <p className="text-sm text-slate-600">Review explanations and note related keywords</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-red-600" />
                  Understanding Heatmaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded mt-1"></div>
                    <div>
                      <p className="font-medium">Red = Problem Areas</p>
                      <p className="text-sm text-slate-600">Darker colors indicate more incorrect answers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-slate-100 border rounded mt-1"></div>
                    <div>
                      <p className="font-medium">Light = Doing Well</p>
                      <p className="text-sm text-slate-600">Light colors show mastered concepts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-4 w-4 text-slate-600 mt-1" />
                    <div>
                      <p className="font-medium">Track Over Time</p>
                      <p className="text-sm text-slate-600">See your improvement day by day</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Learning Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Correct Answer = +5%</p>
                      <p className="text-sm text-slate-600">Your keyword credit grows with correct answers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium">Wrong Answer = -5%</p>
                      <p className="text-sm text-slate-600">Incorrect answers decrease your investment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Track Growth</p>
                      <p className="text-sm text-slate-600">Monitor which topics are performing best</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-yellow-100 rounded mt-1"></div>
                    <div>
                      <p className="font-medium">Focus on Red Areas</p>
                      <p className="text-sm text-slate-600">Use heatmap to identify weak topics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-green-100 rounded mt-1"></div>
                    <div>
                      <p className="font-medium">Build Strong Holdings</p>
                      <p className="text-sm text-slate-600">Maintain high accuracy in key areas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-blue-100 rounded mt-1"></div>
                    <div>
                      <p className="font-medium">Regular Practice</p>
                      <p className="text-sm text-slate-600">Consistent daily practice yields best results</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Study Tips */}
        <TabsContent value="study-tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                Effective Study Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">📚 Study Schedule</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Study 1-2 hours per day consistently</li>
                      <li>• Take breaks every 45 minutes</li>
                      <li>• Review weak areas daily</li>
                      <li>• Take full practice exams weekly</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">🎯 Focus Areas</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Compute Engine and networking basics</li>
                      <li>• IAM roles and permissions</li>
                      <li>• Cloud Storage classes and lifecycle</li>
                      <li>• Kubernetes and GKE fundamentals</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">💡 Exam Strategies</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Read questions carefully - watch for "NOT" or "EXCEPT"</li>
                      <li>• Eliminate obviously wrong answers first</li>
                      <li>• Look for Google-specific terminology</li>
                      <li>• Consider cost-effectiveness in answers</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">🔄 Review Process</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Review incorrect answers immediately</li>
                      <li>• Create flashcards for key concepts</li>
                      <li>• Practice hands-on labs regularly</li>
                      <li>• Join study groups or forums</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                  Official Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { title: 'Exam Guide', url: 'https://cloud.google.com/certification/cloud-engineer' },
                    { title: 'Sample Questions', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfexWKtXT2OSFJ-obA4iT3GmzgiOCGvjrT9OfxilWC1yPtmfQ/viewform' },
                    { title: 'Google Cloud Documentation', url: 'https://cloud.google.com/docs' },
                    { title: 'Cloud Architecture Center', url: 'https://cloud.google.com/architecture' }
                  ].map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-900">{resource.title}</span>
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-green-600" />
                  Practice Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { title: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/' },
                    { title: 'Coursera GCP Courses', url: 'https://www.coursera.org/google-cloud' },
                    { title: 'A Cloud Guru', url: 'https://acloudguru.com' },
                    { title: 'Qwiklabs Hands-on Labs', url: 'https://www.qwiklabs.com' }
                  ].map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-900">{resource.title}</span>
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Topics to Master</CardTitle>
              <CardDescription>
                Essential areas for the Associate Cloud Engineer exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  'Compute Engine', 'Cloud Storage', 'VPC Networking', 'Cloud IAM',
                  'Cloud SQL', 'BigQuery', 'Kubernetes Engine', 'App Engine',
                  'Cloud Functions', 'Pub/Sub', 'Cloud Monitoring', 'Cloud Logging',
                  'Cloud DNS', 'Load Balancing', 'Cloud CDN', 'Security'
                ].map((topic) => (
                  <Badge key={topic} variant="outline" className="justify-center py-2">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
