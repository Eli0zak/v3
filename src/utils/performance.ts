export function measurePerformance<T>(
  name: string,
  fn: () => T
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

  return { result, duration };
}

export function createPerformanceLogger(name: string) {
  return {
    start: () => performance.now(),
    end: (start: number) => {
      const end = performance.now();
      const duration = end - start;
      console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    },
  };
}

export function withPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  return fn().finally(() => {
    const end = performance.now();
    const duration = end - start;
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  });
} 