import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
}

export function InfiniteScroll({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.8,
  className,
  loadingComponent,
}: InfiniteScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { threshold }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore, onLoadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {children}
      {hasMore && (
        <div ref={lastElementRef} className="w-full">
          {loadingComponent || (
            <div className="flex w-full items-center justify-center p-4">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 