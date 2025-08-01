/**
 * Optimized imports for better bundle size
 */

// Core React imports
export { default as React } from 'react';
export { Suspense, lazy } from 'react';

// Router imports
export { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router';

// UI Component imports - only import what we need
export { default as Button } from '../components/ui/button';
export { default as Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
export { default as Badge } from '../components/ui/badge';
export { default as Progress } from '../components/ui/progress';

// Icon imports - only import what we use
export {
  Home,
  FileText,
  BarChart3,
  TrendingUp,
  HelpCircle,
  Brain,
  LogIn,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  Bell,
  Upload,
  Database,
  BookOpen,
  Target,
  PlayCircle,
  Trophy,
  Users,
  Clock,
  Zap,
  Star,
  Activity,
  Award,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Utility imports
export { cn, getGradientClasses, getHoverClasses } from '../lib/utils'; 