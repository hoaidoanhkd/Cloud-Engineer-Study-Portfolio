/**
 * Profile page - User profile and settings
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Edit,
  Save,
  X,
  Trophy,
  Star,
  Clock,
  Target,
  Activity,
  Award,
  BookOpen,
  Brain,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievements: Achievement[];
  stats: UserStats;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  unlockedDate?: string;
}

interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  studyTime: number;
  streakDays: number;
  certificates: number;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/api/placeholder/150/150',
    joinDate: '2024-01-15',
    level: 8,
    xp: 2450,
    nextLevelXp: 3000,
    achievements: [
      {
        id: 'first-quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: Target,
        unlocked: true,
        unlockedDate: '2024-01-16'
      },
      {
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Achieve 100% on any quiz',
        icon: Trophy,
        unlocked: true,
        unlockedDate: '2024-01-20'
      },
      {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        icon: Calendar,
        unlocked: true,
        unlockedDate: '2024-01-25'
      },
      {
        id: 'gcp-master',
        name: 'GCP Master',
        description: 'Complete all GCP topics',
        icon: Brain,
        unlocked: false
      }
    ],
    stats: {
      totalQuizzes: 24,
      totalQuestions: 156,
      correctAnswers: 128,
      accuracy: 82,
      studyTime: 42,
      streakDays: 7,
      certificates: 2
    }
  });

  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email
  });

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      email: profile.email
    });
    setIsEditing(false);
  };

  const getProgressPercentage = () => {
    return ((profile.xp / profile.nextLevelXp) * 100);
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600';
    if (level >= 7) return 'text-blue-600';
    if (level >= 4) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
            <p className="text-slate-600 mt-2">
              Manage your account and view your learning progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.name}</h2>
                    <p className="text-slate-600 mb-4">{profile.email}</p>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Level {profile.level}</span>
                  <span className={cn("text-sm font-bold", getLevelColor(profile.level))}>
                    {profile.xp} / {profile.nextLevelXp} XP
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="mb-2" />
                <p className="text-xs text-slate-500">
                  {profile.nextLevelXp - profile.xp} XP to next level
                </p>
              </div>

              {/* Member Since */}
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Member since {new Date(profile.joinDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.stats.totalQuizzes}</div>
                <div className="text-sm text-slate-600">Quizzes Taken</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.stats.accuracy}%</div>
                <div className="text-sm text-slate-600">Accuracy</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.stats.studyTime}</div>
                <div className="text-sm text-slate-600">Study Hours</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{profile.stats.certificates}</div>
                <div className="text-sm text-slate-600">Certificates</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Track your learning milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300",
                        achievement.unlocked
                          ? "bg-green-50 border-green-200"
                          : "bg-slate-50 border-slate-200 opacity-60"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          achievement.unlocked
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-400"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-semibold",
                            achievement.unlocked ? "text-green-900" : "text-slate-500"
                          )}>
                            {achievement.name}
                          </h3>
                          <p className={cn(
                            "text-sm",
                            achievement.unlocked ? "text-green-700" : "text-slate-400"
                          )}>
                            {achievement.description}
                          </p>
                          {achievement.unlocked && achievement.unlockedDate && (
                            <p className="text-xs text-green-600 mt-1">
                              Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {achievement.unlocked ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">Completed Security Quiz</div>
                    <div className="text-sm text-blue-700">Achieved 85% accuracy</div>
                  </div>
                  <span className="text-xs text-blue-600">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-green-900">Earned "Week Warrior" Badge</div>
                    <div className="text-sm text-green-700">7-day study streak completed</div>
                  </div>
                  <span className="text-xs text-green-600">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-purple-900">Started Advanced Topics</div>
                    <div className="text-sm text-purple-700">Kubernetes Engine module</div>
                  </div>
                  <span className="text-xs text-purple-600">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 