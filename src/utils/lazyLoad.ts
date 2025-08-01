import React from 'react';

/**
 * Utility function for lazy loading components with error boundary
 */
export const lazyLoad = (importFunc: () => Promise<any>) => {
  const Component = React.lazy(importFunc);
  
  return (props: any) => (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  );
};

/**
 * Preload component for better performance
 */
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return () => {
    importFunc();
    return null;
  };
}; 