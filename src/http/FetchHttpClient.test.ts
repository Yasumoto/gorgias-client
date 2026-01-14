import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchHttpClient } from './FetchHttpClient.js';
import { DEFAULT_RETRY_CONFIG } from './types.js';

describe('FetchHttpClient', () => {
  const baseConfig = {
    baseUrl: 'https://test.gorgias.com/api/',
    authHeader: 'Basic dGVzdDp0ZXN0',
    defaultTimeoutMs: 5000,
    retry: DEFAULT_RETRY_CONFIG,
    traceIdHeader: 'x-trace-id',
  };

  let fetchMock: ReturnType<typeof vi.fn>;
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('URL construction', () => {
    it('correctly appends path without leading slash to base URL', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new FetchHttpClient(baseConfig);
      await client.request({ method: 'GET', path: 'tickets' });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.gorgias.com/api/tickets',
        expect.any(Object)
      );
    });

    it('correctly handles path with leading slash (strips it)', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new FetchHttpClient(baseConfig);
      await client.request({ method: 'GET', path: '/tickets' });

      // Should NOT be https://test.gorgias.com/tickets (which would discard /api/)
      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.gorgias.com/api/tickets',
        expect.any(Object)
      );
    });

    it('correctly handles nested paths with leading slash', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new FetchHttpClient(baseConfig);
      await client.request({ method: 'GET', path: '/tickets/123/messages' });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.gorgias.com/api/tickets/123/messages',
        expect.any(Object)
      );
    });

    it('correctly appends query parameters', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new FetchHttpClient(baseConfig);
      await client.request({
        method: 'GET',
        path: '/tickets',
        params: { limit: 100, cursor: 'abc123' },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.gorgias.com/api/tickets?limit=100&cursor=abc123',
        expect.any(Object)
      );
    });

    it('omits undefined query parameters', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new FetchHttpClient(baseConfig);
      await client.request({
        method: 'GET',
        path: '/tickets',
        params: { limit: 100, cursor: undefined },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.gorgias.com/api/tickets?limit=100',
        expect.any(Object)
      );
    });
  });
});
