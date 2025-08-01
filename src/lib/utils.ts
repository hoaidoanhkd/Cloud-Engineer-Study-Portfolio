/**
 * Utility functions for the GCP learning application
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get time ago string from date
 */
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

/**
 * Format date in readable format
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get color class based on percentage value
 */
export const getPercentageColor = (value: number): string => {
  if (value >= 80) return 'text-green-600';
  if (value >= 60) return 'text-yellow-600';
  if (value >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get color class for topic badges
 */
export const getTopicColor = (topic: string): string => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800'
  ];
  
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get color class for difficulty badges
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'advanced':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

/**
 * Get color class for status badges
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

/**
 * Get gradient classes for cards
 */
export const getGradientClasses = (type: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'): string => {
  switch (type) {
    case 'blue':
      return 'bg-gradient-to-br from-blue-50 to-indigo-50';
    case 'green':
      return 'bg-gradient-to-br from-green-50 to-emerald-50';
    case 'purple':
      return 'bg-gradient-to-br from-purple-50 to-pink-50';
    case 'orange':
      return 'bg-gradient-to-br from-orange-50 to-red-50';
    case 'pink':
      return 'bg-gradient-to-br from-pink-50 to-rose-50';
    case 'indigo':
      return 'bg-gradient-to-br from-indigo-50 to-blue-50';
    default:
      return 'bg-gradient-to-br from-slate-50 to-gray-50';
  }
};

/**
 * Get hover effect classes
 */
export const getHoverClasses = (type: 'scale' | 'shadow' | 'both'): string => {
  switch (type) {
    case 'scale':
      return 'transform hover:scale-105 transition-transform duration-300';
    case 'shadow':
      return 'hover:shadow-xl transition-shadow duration-300';
    case 'both':
      return 'transform hover:scale-105 hover:shadow-xl transition-all duration-300';
    default:
      return '';
  }
};

/**
 * Truncate text to specified length
 */
export const truncate = (text: string, length: number = 50): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
