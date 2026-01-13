import { describe, it, expect } from 'vitest';
import {
  extractErrorMessage,
  GorgiasAPIError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationAPIError,
} from './api-errors.js';
import type { RequestContext } from './base.js';

const mockContext: RequestContext = { method: 'GET', path: '/tickets' };

describe('extractErrorMessage', () => {
  it('returns string values unchanged', () => {
    expect(extractErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('returns undefined for empty strings', () => {
    expect(extractErrorMessage('')).toBeUndefined();
  });

  it('returns undefined for null', () => {
    expect(extractErrorMessage(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(extractErrorMessage(undefined)).toBeUndefined();
  });

  it('extracts message property from objects', () => {
    expect(extractErrorMessage({ message: 'Nested error' })).toBe('Nested error');
  });

  it('extracts detail property from objects', () => {
    expect(extractErrorMessage({ detail: 'Error detail' })).toBe('Error detail');
  });

  it('prefers message over detail', () => {
    expect(extractErrorMessage({ message: 'Message', detail: 'Detail' })).toBe('Message');
  });

  it('JSON stringifies objects without message/detail', () => {
    expect(extractErrorMessage({ code: 'ERR_001', info: 'test' })).toBe(
      '{"code":"ERR_001","info":"test"}'
    );
  });

  it('JSON stringifies arrays', () => {
    expect(extractErrorMessage(['error1', 'error2'])).toBe('["error1","error2"]');
  });

  it('handles empty objects', () => {
    expect(extractErrorMessage({})).toBe('{}');
  });

  it('ignores empty message property', () => {
    expect(extractErrorMessage({ message: '' })).toBe('{"message":""}');
  });

  it('returns undefined for numbers', () => {
    expect(extractErrorMessage(42)).toBeUndefined();
  });

  it('returns undefined for booleans', () => {
    expect(extractErrorMessage(true)).toBeUndefined();
  });
});

describe('GorgiasAPIError.fromResponse', () => {
  it('extracts string error message', () => {
    const error = GorgiasAPIError.fromResponse(
      500,
      { error: 'Internal server error' },
      mockContext
    );
    expect(error.message).toBe('Internal server error');
    expect(error.status).toBe(500);
  });

  it('extracts string message field', () => {
    const error = GorgiasAPIError.fromResponse(
      400,
      { message: 'Bad request' },
      mockContext
    );
    expect(error.message).toBe('Bad request');
  });

  it('prefers error over message', () => {
    const error = GorgiasAPIError.fromResponse(
      500,
      { error: 'Primary', message: 'Secondary' },
      mockContext
    );
    expect(error.message).toBe('Primary');
  });

  it('handles object error field (the bug fix)', () => {
    const body = { error: { detail: 'Rate limit exceeded' } } as unknown as {
      error: string;
    };
    const error = GorgiasAPIError.fromResponse(500, body, mockContext);
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.message).not.toBe('[object Object]');
  });

  it('JSON stringifies unknown object structures', () => {
    const body = { error: { code: 123, extra: 'data' } } as unknown as {
      error: string;
    };
    const error = GorgiasAPIError.fromResponse(500, body, mockContext);
    expect(error.message).toBe('{"code":123,"extra":"data"}');
  });

  it('falls back to HTTP status message for null body', () => {
    const error = GorgiasAPIError.fromResponse(503, null, mockContext);
    expect(error.message).toBe('HTTP 503 error');
  });

  it('falls back to HTTP status message for empty body', () => {
    const error = GorgiasAPIError.fromResponse(500, {}, mockContext);
    expect(error.message).toBe('HTTP 500 error');
  });

  it('creates AuthenticationError for 401', () => {
    const error = GorgiasAPIError.fromResponse(
      401,
      { message: 'Unauthorized' },
      mockContext
    );
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.code).toBe('AUTHENTICATION_FAILED');
  });

  it('creates AuthenticationError for 403', () => {
    const error = GorgiasAPIError.fromResponse(
      403,
      { message: 'Forbidden' },
      mockContext
    );
    expect(error).toBeInstanceOf(AuthenticationError);
  });

  it('creates NotFoundError for 404', () => {
    const error = GorgiasAPIError.fromResponse(
      404,
      { message: 'Not found' },
      mockContext
    );
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('creates RateLimitError for 429', () => {
    const error = GorgiasAPIError.fromResponse(
      429,
      { message: 'Too many requests' },
      mockContext
    );
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.code).toBe('RATE_LIMITED');
  });

  it('parses retry-after header for 429', () => {
    const headers = new Headers({ 'retry-after': '30' });
    const error = GorgiasAPIError.fromResponse(
      429,
      { message: 'Too many requests' },
      mockContext,
      headers
    );
    expect((error as RateLimitError).retryAfterMs).toBe(30000);
  });

  it('handles malformed retry-after header', () => {
    const headers = new Headers({ 'retry-after': 'invalid' });
    const error = GorgiasAPIError.fromResponse(
      429,
      { message: 'Too many requests' },
      mockContext,
      headers
    );
    expect((error as RateLimitError).retryAfterMs).toBeUndefined();
  });

  it('creates ValidationAPIError for 422', () => {
    const error = GorgiasAPIError.fromResponse(
      422,
      { message: 'Validation failed', errors: [{ field: 'email', message: 'Invalid' }] },
      mockContext
    );
    expect(error).toBeInstanceOf(ValidationAPIError);
    expect(error.code).toBe('API_VALIDATION_ERROR');
    expect((error as ValidationAPIError).fieldErrors).toEqual([
      { field: 'email', message: 'Invalid' },
    ]);
  });

  it('creates base GorgiasAPIError for other status codes', () => {
    const error = GorgiasAPIError.fromResponse(
      502,
      { message: 'Bad gateway' },
      mockContext
    );
    expect(error).toBeInstanceOf(GorgiasAPIError);
    expect(error.code).toBe('API_ERROR');
  });

  it('extracts error_code from body', () => {
    const error = GorgiasAPIError.fromResponse(
      400,
      { message: 'Bad request', error_code: 'INVALID_PARAMS' },
      mockContext
    );
    expect(error.errorCode).toBe('INVALID_PARAMS');
  });

  it('extracts request ID from headers', () => {
    const headers = new Headers({ 'x-request-id': 'req-123' });
    const error = GorgiasAPIError.fromResponse(500, null, mockContext, headers);
    expect(error.requestId).toBe('req-123');
  });

  it('includes traceId when provided', () => {
    const error = GorgiasAPIError.fromResponse(
      500,
      null,
      mockContext,
      undefined,
      'trace-abc'
    );
    expect(error.traceId).toBe('trace-abc');
  });

  it('includes request context', () => {
    const error = GorgiasAPIError.fromResponse(500, null, mockContext);
    expect(error.requestContext).toEqual({ method: 'GET', path: '/tickets' });
  });
});
