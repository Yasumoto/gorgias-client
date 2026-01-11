/**
 * HTTP-related types for the Gorgias client.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpRequestConfig {
  method: HttpMethod;
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface HttpResponse<T> {
  status: number;
  data: T;
  headers: Headers;
}

export interface RetryConfig {
  /** Maximum number of retry attempts. Default: 3 */
  maxAttempts: number;
  /** Base delay in milliseconds for exponential backoff. Default: 1000 */
  baseDelayMs: number;
  /** Maximum delay in milliseconds. Default: 30000 */
  maxDelayMs: number;
  /** HTTP status codes that trigger a retry. Default: [429, 502, 503, 504] */
  retryableStatuses: number[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  retryableStatuses: [429, 502, 503, 504],
};

export interface RequestOptions {
  /** Override timeout for this request */
  timeoutMs?: number;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Override retry config, or false to disable retries */
  retry?: Partial<RetryConfig> | false;
  /** Trace ID for request correlation */
  traceId?: string;
}
