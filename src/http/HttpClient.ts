/**
 * HTTP client interface for making API requests.
 * Abstraction allows for different implementations (fetch, test mocks, etc.)
 */

import type { HttpRequestConfig, HttpResponse, RequestOptions } from './types.js';

export interface HttpClient {
  /**
   * Make an HTTP request.
   * @param config - Request configuration
   * @param options - Per-request options (timeout, signal, retry override)
   * @returns Promise resolving to the response
   * @throws GorgiasAPIError on API errors
   * @throws NetworkError on network failures
   * @throws TimeoutError when request times out
   */
  request<T>(config: HttpRequestConfig, options?: RequestOptions): Promise<HttpResponse<T>>;
}
