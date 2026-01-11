/**
 * HTTP client implementation using native fetch.
 */

import type { HttpClient } from './HttpClient.js';
import type { HttpRequestConfig, HttpResponse, RetryConfig, RequestOptions } from './types.js';
import { DEFAULT_RETRY_CONFIG } from './types.js';
import { withRetry } from './retry.js';
import {
  GorgiasAPIError,
  NetworkError,
  TimeoutError,
} from '../errors/index.js';
import type { GorgiasErrorResponse } from '../errors/index.js';
import type { Logger } from '../logging/types.js';

export interface FetchHttpClientConfig {
  baseUrl: string;
  authHeader: string;
  defaultTimeoutMs: number;
  retry: RetryConfig;
  logger?: Logger;
  traceIdHeader: string;
}

export class FetchHttpClient implements HttpClient {
  private readonly config: FetchHttpClientConfig;

  constructor(config: FetchHttpClientConfig) {
    this.config = config;
  }

  async request<T>(
    requestConfig: HttpRequestConfig,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const effectiveRetry = this.getEffectiveRetryConfig(options?.retry);
    const traceId = options?.traceId;

    if (effectiveRetry === null) {
      // Retry disabled, make single request
      return this.executeRequest<T>(requestConfig, options);
    }

    return withRetry(
      () => this.executeRequest<T>(requestConfig, options),
      effectiveRetry,
      this.config.logger,
      traceId
    );
  }

  private getEffectiveRetryConfig(
    override?: Partial<RetryConfig> | false
  ): RetryConfig | null {
    if (override === false) {
      return null;
    }

    if (override) {
      return { ...this.config.retry, ...override };
    }

    return this.config.retry;
  }

  private async executeRequest<T>(
    requestConfig: HttpRequestConfig,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(requestConfig.path, requestConfig.params);
    const timeoutMs = options?.timeoutMs ?? this.config.defaultTimeoutMs;
    const traceId = options?.traceId;

    // Create abort controller for timeout
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

    // Combine with user-provided signal
    const signal = options?.signal
      ? this.combineSignals(options.signal, timeoutController.signal)
      : timeoutController.signal;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: this.config.authHeader,
      ...requestConfig.headers,
    };

    if (traceId) {
      headers[this.config.traceIdHeader] = traceId;
    }

    const fetchOptions: RequestInit = {
      method: requestConfig.method,
      headers,
      signal,
    };

    if (requestConfig.body !== undefined) {
      fetchOptions.body = JSON.stringify(requestConfig.body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const requestContext = {
        method: requestConfig.method,
        path: requestConfig.path,
      };

      if (!response.ok) {
        const body = await this.parseErrorBody(response);
        throw GorgiasAPIError.fromResponse(
          response.status,
          body,
          requestContext,
          response.headers,
          traceId
        );
      }

      // Handle empty responses (204 No Content, etc.)
      const contentLength = response.headers.get('content-length');
      if (response.status === 204 || contentLength === '0') {
        return {
          status: response.status,
          data: undefined as T,
          headers: response.headers,
        };
      }

      const data = await response.json() as T;
      return {
        status: response.status,
        data,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw Gorgias errors
      if (error instanceof GorgiasAPIError) {
        throw error;
      }

      // Handle abort/timeout
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Check if it was our timeout or user cancellation
          if (options?.signal?.aborted) {
            throw new NetworkError('Request cancelled', error, traceId);
          }
          throw new TimeoutError(timeoutMs, traceId);
        }

        // Network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new NetworkError(error.message, error, traceId);
        }
      }

      // Unknown error
      throw new NetworkError(
        error instanceof Error ? error.message : 'Unknown error',
        error instanceof Error ? error : undefined,
        traceId
      );
    }
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(path, this.config.baseUrl);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async parseErrorBody(
    response: Response
  ): Promise<GorgiasErrorResponse | null> {
    try {
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text) as GorgiasErrorResponse;
    } catch {
      return null;
    }
  }

  private combineSignals(
    userSignal: AbortSignal,
    timeoutSignal: AbortSignal
  ): AbortSignal {
    const controller = new AbortController();

    const abort = () => controller.abort();
    // Use { once: true } to auto-remove listeners after first invocation
    userSignal.addEventListener('abort', abort, { once: true });
    timeoutSignal.addEventListener('abort', abort, { once: true });

    return controller.signal;
  }
}
