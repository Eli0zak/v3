import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import { Skeleton } from '@/shared/components/ui/Skeleton';

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T> & LazyComponentProps) {
    const fallbackContent = fallback ? fallback : React.createElement(
      'div',
      { className: 'flex h-full w-full items-center justify-center' },
      React.createElement(Skeleton, { className: 'h-8 w-8 rounded-full' })
    );

    return React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        Suspense,
        { fallback: fallbackContent },
        React.createElement(LazyComponent, props)
      )
    );
  };
}

// Route-based code splitting
export const lazyRoutes = {
  Index: createLazyComponent(() => import('@/pages/Index')),
  Login: createLazyComponent(() => import('@/pages/Login')),
  Register: createLazyComponent(() => import('@/pages/Register')),
  Dashboard: createLazyComponent(() => import('@/pages/Dashboard')),
  AdminDashboard: createLazyComponent(() => import('@/pages/AdminDashboard')),
  PetsPage: createLazyComponent(() => import('@/pages/PetsPage')),
  NewPet: createLazyComponent(() => import('@/pages/NewPet')),
  EditPet: createLazyComponent(() => import('@/pages/EditPet')),
  TagPage: createLazyComponent(() => import('@/pages/TagPage')),
  ScansPage: createLazyComponent(() => import('@/pages/ScansPage')),
  AccountPage: createLazyComponent(() => import('@/pages/AccountPage')),
  NotFound: createLazyComponent(() => import('@/pages/NotFound')),
}; 