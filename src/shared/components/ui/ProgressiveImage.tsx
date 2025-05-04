import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string;
  placeholderClassName?: string;
}

export function ProgressiveImage({
  src,
  placeholderSrc,
  className,
  placeholderClassName,
  ...props
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-muted',
          className
        )}
      >
        <span className="text-sm text-muted-foreground">Failed to load image</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Skeleton
        className={cn('h-full w-full', placeholderClassName)}
      />
    );
  }

  return (
    <img
      src={src}
      className={cn('h-full w-full object-cover', className)}
      {...props}
    />
  );
} 