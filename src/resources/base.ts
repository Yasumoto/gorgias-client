/**
 * Base resource class for all Gorgias API resources.
 */

import type { HttpClient, RequestOptions } from '../http/index.js';
import { validateId } from '../validation/index.js';

/**
 * Base class providing common functionality for API resources.
 */
export abstract class BaseResource {
  constructor(protected readonly http: HttpClient) {}

  /**
   * Validate a resource ID before making a request.
   */
  protected validateResourceId(id: number, resourceName: string): void {
    validateId(id, `${resourceName}Id`);
  }

  /**
   * Make a GET request.
   */
  protected async _get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.http.request<T>(
      { method: 'GET', path, params },
      options
    );
    return response.data;
  }

  /**
   * Make a POST request.
   */
  protected async _post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.http.request<T>(
      { method: 'POST', path, body },
      options
    );
    return response.data;
  }

  /**
   * Make a PUT request.
   */
  protected async _put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.http.request<T>(
      { method: 'PUT', path, body },
      options
    );
    return response.data;
  }

  /**
   * Make a DELETE request.
   */
  protected async _delete<T = void>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.http.request<T>(
      { method: 'DELETE', path, body },
      options
    );
    return response.data;
  }
}
