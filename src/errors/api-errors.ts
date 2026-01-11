/**
 * API-specific error classes for Gorgias responses.
 */

import { GorgiasError, RequestContext } from './base.js';

/**
 * Error response shape from Gorgias API.
 */
export interface GorgiasErrorResponse {
  error?: string;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  error_code?: string;
}

/**
 * Base class for errors from the Gorgias API.
 */
export class GorgiasAPIError extends GorgiasError {
  readonly code: string = 'API_ERROR';
  /** HTTP status code */
  readonly status: number;
  /** Gorgias-specific error code if provided */
  readonly errorCode?: string;
  /** Request ID from response headers */
  readonly requestId?: string;
  /** Request context for debugging (no sensitive data) */
  readonly requestContext: RequestContext;

  constructor(
    message: string,
    status: number,
    requestContext: RequestContext,
    options?: {
      errorCode?: string;
      requestId?: string;
      traceId?: string;
    }
  ) {
    super(message, options?.traceId);
    this.status = status;
    this.requestContext = requestContext;
    this.errorCode = options?.errorCode;
    this.requestId = options?.requestId;
  }

  /**
   * Create appropriate error subclass based on HTTP status.
   */
  static fromResponse(
    status: number,
    body: GorgiasErrorResponse | null,
    requestContext: RequestContext,
    headers?: Headers,
    traceId?: string
  ): GorgiasAPIError {
    const message = body?.error || body?.message || `HTTP ${status} error`;
    const errorCode = body?.error_code;
    const requestId = headers?.get('x-request-id') ?? undefined;
    const options = { errorCode, requestId, traceId };

    switch (status) {
      case 401:
      case 403:
        return new AuthenticationError(message, status, requestContext, options);
      case 404:
        return new NotFoundError(message, requestContext, options);
      case 429: {
        const retryAfter = headers?.get('retry-after');
        const retryAfterMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;
        return new RateLimitError(message, requestContext, retryAfterMs, options);
      }
      case 422:
        return new ValidationAPIError(message, requestContext, body?.errors, options);
      default:
        return new GorgiasAPIError(message, status, requestContext, options);
    }
  }
}

/**
 * Authentication or authorization failed.
 */
export class AuthenticationError extends GorgiasAPIError {
  readonly code = 'AUTHENTICATION_FAILED';

  constructor(
    message: string,
    status: number,
    requestContext: RequestContext,
    options?: { errorCode?: string; requestId?: string; traceId?: string }
  ) {
    super(message, status, requestContext, options);
  }
}

/**
 * Resource not found.
 */
export class NotFoundError extends GorgiasAPIError {
  readonly code = 'NOT_FOUND';

  constructor(
    message: string,
    requestContext: RequestContext,
    options?: { errorCode?: string; requestId?: string; traceId?: string }
  ) {
    super(message, 404, requestContext, options);
  }
}

/**
 * Rate limit exceeded.
 */
export class RateLimitError extends GorgiasAPIError {
  readonly code = 'RATE_LIMITED';
  /** Milliseconds to wait before retrying, if provided by server */
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    requestContext: RequestContext,
    retryAfterMs?: number,
    options?: { errorCode?: string; requestId?: string; traceId?: string }
  ) {
    super(message, 429, requestContext, options);
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * Validation error from API (422).
 */
export class ValidationAPIError extends GorgiasAPIError {
  readonly code = 'API_VALIDATION_ERROR';
  /** Field-level validation errors */
  readonly fieldErrors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    requestContext: RequestContext,
    fieldErrors?: Array<{ field: string; message: string }>,
    options?: { errorCode?: string; requestId?: string; traceId?: string }
  ) {
    super(message, 422, requestContext, options);
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Network-level error (connection failed, DNS error, etc.)
 */
export class NetworkError extends GorgiasError {
  readonly code = 'NETWORK_ERROR';
  /** Underlying error cause */
  readonly cause?: Error;

  constructor(message: string, cause?: Error, traceId?: string) {
    super(message, traceId);
    this.cause = cause;
  }
}

/**
 * Request timed out.
 */
export class TimeoutError extends GorgiasError {
  readonly code = 'TIMEOUT';
  /** Timeout duration in milliseconds */
  readonly timeoutMs: number;

  constructor(timeoutMs: number, traceId?: string) {
    super(`Request timed out after ${timeoutMs}ms`, traceId);
    this.timeoutMs = timeoutMs;
  }
}
