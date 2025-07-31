/**
 * Mobile optimization utility component
 */

import React from 'react';
import { cn } from '../lib/utils';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
  mobileClass?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function MobileOptimized({ 
  children, 
  className, 
  mobileClass = 'mobile-card',
  as: Component = 'div' 
}: MobileOptimizedProps) {
  return (
    <Component className={cn(mobileClass, className)}>
      {children}
    </Component>
  );
}

/**
 * Mobile-optimized button component
 */
export function MobileButton({ 
  children, 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className={cn('btn-mobile mobile-touch-target', className)} 
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Mobile-optimized card component
 */
export function MobileCard({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('mobile-card mobile-spacing', className)} 
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Mobile-optimized input component
 */
export function MobileInput({ 
  className, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn('mobile-input mobile-focus', className)} 
      {...props}
    />
  );
}

/**
 * Mobile-optimized text component
 */
export function MobileText({ 
  children, 
  className, 
  as: Component = 'p' 
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className={cn('mobile-text', className)}>
      {children}
    </Component>
  );
}

/**
 * Mobile-optimized grid component
 */
export function MobileGrid({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('mobile-grid mobile-gap', className)} 
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Mobile-optimized button group component
 */
export function MobileButtonGroup({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('mobile-button-group', className)} 
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Mobile-optimized loading component
 */
export function MobileLoading({ 
  children, 
  className 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mobile-loading', className)}>
      {children}
    </div>
  );
}

/**
 * Mobile-optimized error component
 */
export function MobileError({ 
  children, 
  className 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mobile-error', className)}>
      {children}
    </div>
  );
}

/**
 * Mobile-optimized success component
 */
export function MobileSuccess({ 
  children, 
  className 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mobile-success', className)}>
      {children}
    </div>
  );
} 