/**
 * Retry logic with exponential backoff and jitter.
 */

import type { RetryConfig } from './types.js';
import { GorgiasError, RateLimitError } from '../errors/index.js';
import type { Logger } from '../logging/types.js';

/**
 * Sleep for a specified duration.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate backoff delay with exponential growth and jitter.
 */
export function calculateBackoff(
  attempt: number,
  config: RetryConfig,
  error?: GorgiasError
): number {
  // Respect Retry-After header for rate limits
  if (error instanceof RateLimitError && error.retryAfterMs) {
    return Math.min(error.retryAfterMs, config.maxDelayMs);
  }

  // Exponential backoff: baseDelay * 2^(attempt-1)
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt - 1);

  // Add jitter (0-30% of exponential delay) to prevent thundering herd
  const jitter = Math.random() * 0.3 * exponentialDelay;

  return Math.min(exponentialDelay + jitter, config.maxDelayMs);
}

/**
 * Determine if an error should be retried.
 */
export function shouldRetry(
  error: unknown,
  config: RetryConfig,
  attempt: number
): boolean {
  if (attempt >= config.maxAttempts) {
    return false;
  }

  // Only retry GorgiasError types
  if (!(error instanceof GorgiasError)) {
    return false;
  }

  // Rate limits are always retryable (429)
  if (error instanceof RateLimitError) {
    return true;
  }

  // Check if it's an API error with a retryable status
  if ('status' in error && typeof error.status === 'number') {
    return config.retryableStatuses.includes(error.status);
  }

  // Network errors are retryable
  if (error.code === 'NETWORK_ERROR') {
    return true;
  }

  return false;
}

/**
 * Execute an operation with retry logic.
 * @param operation - Function returning a promise to execute
 * @param config - Retry configuration
 * @param logger - Optional logger for retry events
 * @param traceId - Optional trace ID for logging
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
  logger?: Logger,
  traceId?: string
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, config, attempt)) {
        throw error;
      }

      const delay = calculateBackoff(attempt, config, error as GorgiasError);

      logger?.debug('Retrying request', {
        traceId,
        attempt,
        maxAttempts: config.maxAttempts,
        delayMs: Math.round(delay),
        errorCode: error instanceof GorgiasError ? error.code : 'UNKNOWN',
      });

      await sleep(delay);
    }
  }

  // Should not reach here, but throw last error if we do
  throw lastError;
}
