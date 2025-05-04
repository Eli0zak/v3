import { captureError, captureMessage } from './sentry';
import { measurePerformance } from './performance';

export function trackError(error: Error, context?: Record<string, unknown>) {
  console.error('Error:', error, context);
  captureError(error, context);
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  console.log('Event:', name, properties);
  captureMessage(`Event: ${name}`, 'info');
}

export function trackPageView(path: string) {
  console.log('Page View:', path);
  captureMessage(`Page View: ${path}`, 'info');
}

export function trackPerformance<T>(
  name: string,
  fn: () => T
): { result: T; duration: number } {
  const { result, duration } = measurePerformance(name, fn);
  console.log(`Performance: ${name} - ${duration.toFixed(2)}ms`);
  return { result, duration };
}

export function trackApiCall(
  endpoint: string,
  method: string,
  status: number,
  duration: number
) {
  console.log(`API Call: ${method} ${endpoint} - ${status} (${duration.toFixed(2)}ms)`);
  captureMessage(
    `API Call: ${method} ${endpoint} - ${status} (${duration.toFixed(2)}ms)`,
    'info'
  );
}

export function trackUserAction(
  action: string,
  userId: string,
  properties?: Record<string, unknown>
) {
  console.log('User Action:', action, userId, properties);
  captureMessage(`User Action: ${action} - ${userId}`, 'info');
} 