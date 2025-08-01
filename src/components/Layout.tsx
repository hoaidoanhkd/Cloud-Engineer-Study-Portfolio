/**
 * Simple layout component for GCP Quiz app
 */

import React from 'react';
import { Outlet } from 'react-router';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {children || <Outlet />}
    </div>
  );
}
