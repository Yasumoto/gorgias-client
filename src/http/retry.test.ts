import { describe, it, expect, vi } from 'vitest';
import { withRetry, calculateBackoff, shouldRetry } from './retry.js';
import { DEFAULT_RETRY_CONFIG } from './types.js';
import { RateLimitError, NetworkError, GorgiasAPIError } from '../errors/index.js';

describe('calculateBackoff', () => {
  it('calculates exponential backoff', () => {
    const config = { ...DEFAULT_RETRY_CONFIG, baseDelayMs: 1000 };

    // First attempt: baseDelay * 2^0 = 1000ms (plus jitter)
    const delay1 = calculateBackoff(1, config);
    expect(delay1).toBeGreaterThanOrEqual(1000);
    expect(delay1).toBeLessThanOrEqual(1300); // 30% jitter max

    // Second attempt: baseDelay * 2^1 = 2000ms (plus jitter)
    const delay2 = calculateBackoff(2, config);
    expect(delay2).toBeGreaterThanOrEqual(2000);
    expect(delay2).toBeLessThanOrEqual(2600);
  });

  it('respects maxDelayMs', () => {
    const config = { ...DEFAULT_RETRY_CONFIG, baseDelayMs: 10000, maxDelayMs: 5000 };
    const delay = calculateBackoff(3, config);
    expect(delay).toBeLessThanOrEqual(5000);
  });

  it('respects Retry-After header for rate limits', () => {
    const config = { ...DEFAULT_RETRY_CONFIG };
    const error = new RateLimitError(
      'Rate limited',
      { method: 'GET', path: '/test' },
      2000 // 2 seconds
    );

    const delay = calculateBackoff(1, config, error);
    expect(delay).toBe(2000);
  });
});

describe('shouldRetry', () => {
  const config = DEFAULT_RETRY_CONFIG;

  it('retries rate limit errors', () => {
    const error = new RateLimitError('Rate limited', { method: 'GET', path: '/test' });
    expect(shouldRetry(error, config, 1)).toBe(true);
  });

  it('retries network errors', () => {
    const error = new NetworkError('Connection failed');
    expect(shouldRetry(error, config, 1)).toBe(true);
  });

  it('retries 502, 503, 504 errors', () => {
    const error502 = new GorgiasAPIError('Bad Gateway', 502, { method: 'GET', path: '/test' });
    const error503 = new GorgiasAPIError('Service Unavailable', 503, { method: 'GET', path: '/test' });
    const error504 = new GorgiasAPIError('Gateway Timeout', 504, { method: 'GET', path: '/test' });

    expect(shouldRetry(error502, config, 1)).toBe(true);
    expect(shouldRetry(error503, config, 1)).toBe(true);
    expect(shouldRetry(error504, config, 1)).toBe(true);
  });

  it('does not retry 400 errors', () => {
    const error = new GorgiasAPIError('Bad Request', 400, { method: 'GET', path: '/test' });
    expect(shouldRetry(error, config, 1)).toBe(false);
  });

  it('does not retry 404 errors', () => {
    const error = new GorgiasAPIError('Not Found', 404, { method: 'GET', path: '/test' });
    expect(shouldRetry(error, config, 1)).toBe(false);
  });

  it('stops after max attempts', () => {
    const error = new RateLimitError('Rate limited', { method: 'GET', path: '/test' });
    expect(shouldRetry(error, { ...config, maxAttempts: 3 }, 3)).toBe(false);
    expect(shouldRetry(error, { ...config, maxAttempts: 3 }, 4)).toBe(false);
  });
});

describe('withRetry', () => {
  it('returns result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    const result = await withRetry(operation, DEFAULT_RETRY_CONFIG);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries on retryable errors', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new RateLimitError('Rate limited', { method: 'GET', path: '/test' }, 10))
      .mockResolvedValue('success');

    const result = await withRetry(operation, { ...DEFAULT_RETRY_CONFIG, maxAttempts: 3 });

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('throws after max retries', async () => {
    const error = new RateLimitError('Rate limited', { method: 'GET', path: '/test' }, 10);
    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(operation, { ...DEFAULT_RETRY_CONFIG, maxAttempts: 2 })
    ).rejects.toThrow(RateLimitError);

    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('does not retry non-retryable errors', async () => {
    const error = new GorgiasAPIError('Bad Request', 400, { method: 'GET', path: '/test' });
    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(operation, DEFAULT_RETRY_CONFIG)
    ).rejects.toThrow(GorgiasAPIError);

    expect(operation).toHaveBeenCalledTimes(1);
  });
});
