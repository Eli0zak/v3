import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  loading?: boolean;
  loadingCount?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  className,
  loading = false,
  loadingCount = 10,
}: VirtualizedListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: loading ? loadingCount : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className={cn('h-full w-full overflow-auto', className)}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <div
          key={virtualRow.index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            renderItem(items[virtualRow.index], virtualRow.index)
          )}
        </div>
      ))}
    </div>
  );
} 