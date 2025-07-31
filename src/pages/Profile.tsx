/**
 * User profile page with detailed statistics and achievements
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Calendar,
  TrendingUp,
  Star,
  Award,
  Edit3,
  Save,
  X,
  BookOpen,
  Zap,
  Medal
} from 'lucide-react';

export default function ProfilePage() {
  const { state: authState, updateProfile } = useAuth();
  const { state: appState } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: authState.user?.name || '',
  });

  if (!authState.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg text-slate-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const user = authState.user;
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Calculate statistics
  const totalQuestions = appState.userAnswers.length;
  const correctAnswers = appState.userAnswers.filter(a => a.isCorrect).length;
  const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const portfolioValue = Object.values(appState.portfolio).reduce((sum, item) => sum + item.credit, 0);
  
  // XP calculation for next level
  const currentLevelXP = (user.level - 1) * 100;
  const nextLevelXP = user.level * 100;
  const progressToNextLevel = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const handleSaveProfile = () => {
    updateProfile({ name: editData.name });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({ name: user.name });
    setIsEditing(false);
  };

  // Recent activity
  const recentAnswers = appState.userAnswers
    .slice(-10)
    .reverse()
    .map(answer => {
      const question = appState.questions.find(q => q.id === answer.questionId);
      return { ...answer, question };
    });

  return (
    <div className="max-w-6xl mx-auto space-y-8 mobile-content">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-base sm:text-lg text-slate-600">Track your GCP learning journey</p>
      </div>

      {/* Profile Card */}
      <Card className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"></div>
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl sm:text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ name: e.target.value })}
                      className="text-2xl font-bold border-2"
                    />
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-slate-600">{user.email}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">
                  <Star className="h-4 w-4 mr-1" />
                  Level {user.level}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Zap className="h-4 w-4 mr-1" />
                  {user.xp} XP
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {user.streak} day streak
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {user.level + 1}</span>
                  <span>{user.xp - currentLevelXP}/{nextLevelXP - currentLevelXP} XP</span>
                </div>
                <Progress value={progressToNextLevel} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.totalQuizzes}</div>
                <p className="text-xs text-muted-foreground">
                  +{totalQuestions} questions answered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {accuracyRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {correctAnswers}/{totalQuestions} correct
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ${portfolioValue.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Learning investments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {user.totalTime}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Total study time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your knowledge growth over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Questions Answered</span>
                    <span className="text-sm font-medium">{totalQuestions}</span>
                  </div>
                  <Progress value={(totalQuestions / 100) * 100} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Accuracy Rate</span>
                    <span className="text-sm font-medium">{accuracyRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={accuracyRate} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Level Progress</span>
                    <span className="text-sm font-medium">{progressToNextLevel.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressToNextLevel} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
                <CardDescription>Your strongest knowledge areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(appState.portfolio)
                    .sort(([, a], [, b]) => b.credit - a.credit)
                    .slice(0, 5)
                    .map(([keyword, data], index) => (
                      <div key={keyword} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{keyword}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">${data.credit.toFixed(0)}</div>
                          <div className={`text-xs ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                Milestones you've unlocked on your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Medal className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="font-medium text-slate-900">{achievement}</p>
                        <p className="text-sm text-slate-600">Unlocked</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Placeholder for more achievements */}
                <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg opacity-50">
                  <div className="flex items-center space-x-3">
                    <Award className="h-8 w-8 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-600">🏆 Quiz Master</p>
                      <p className="text-sm text-slate-500">Complete 50 quizzes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Activity</CardTitle>
              <CardDescription>Your latest question attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAnswers.map((answer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        answer.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {answer.isCorrect ? '✓' : '✗'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {answer.question?.topic || 'Unknown Topic'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {answer.question?.question.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        {new Date(answer.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentAnswers.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    No quiz activity yet. Start taking quizzes to see your progress!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} disabled />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed in this demo
                </p>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input 
                  value={new Date(user.joinDate).toLocaleDateString()} 
                  disabled 
                />
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This action cannot be undone. All your progress will be lost.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
