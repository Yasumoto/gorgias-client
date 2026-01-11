/**
 * Integration resource operations.
 */

import { BaseResource } from './base.js';
import type { HttpClient, RequestOptions } from '../http/index.js';
import { paginate } from '../pagination/index.js';
import type { PaginationConfig } from '../pagination/index.js';
import type {
  Integration,
  PaginatedResponse,
  PaginationParams,
} from '../types.js';

export class Integrations extends BaseResource {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * List integrations with pagination.
   * @param params - Pagination parameters
   * @param options - Request options
   * @returns Paginated list of integrations
   */
  async list(
    params: PaginationParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<Integration>> {
    return this._get<PaginatedResponse<Integration>>(
      '/integrations',
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all integrations automatically handling pagination.
   * @param config - Pagination configuration
   * @yields Individual integrations
   */
  async *listAll(
    config?: PaginationConfig
  ): AsyncGenerator<Integration, void, undefined> {
    yield* paginate(
      (cursor, limit) => this.list({ cursor, limit }),
      config
    );
  }

  /**
   * Get an integration by ID.
   * @param id - Integration ID
   * @param options - Request options
   * @returns Integration object
   */
  async get(id: number, options?: RequestOptions): Promise<Integration> {
    this.validateResourceId(id, 'integration');
    return this._get<Integration>(`/integrations/${id}`, undefined, options);
  }
}
