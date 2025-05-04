import { QueryClient } from '@tanstack/react-query';

export function createOptimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updater: (oldData: T) => T
) {
  queryClient.setQueryData(queryKey, updater);
}

export function rollbackOptimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  oldData: T
) {
  queryClient.setQueryData(queryKey, oldData);
}

export function withOptimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updater: (oldData: T) => T
) {
  const oldData = queryClient.getQueryData<T>(queryKey);
  createOptimisticUpdate(queryClient, queryKey, updater);
  return () => {
    if (oldData) {
      rollbackOptimisticUpdate(queryClient, queryKey, oldData);
    }
  };
} 