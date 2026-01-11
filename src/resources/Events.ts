/**
 * Event resource operations.
 */

import { BaseResource } from './base.js';
import type { HttpClient, RequestOptions } from '../http/index.js';
import { paginate } from '../pagination/index.js';
import type { PaginationConfig } from '../pagination/index.js';
import type {
  Event,
  PaginatedResponse,
  PaginationParams,
} from '../types.js';

export interface EventListParams extends PaginationParams {
  object_type?: string;
  object_id?: number;
  type?: string;
  user_id?: number;
}

export class Events extends BaseResource {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * List events with pagination.
   * @param params - Pagination and filtering parameters
   * @param options - Request options
   * @returns Paginated list of events
   */
  async list(
    params: EventListParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<Event>> {
    return this._get<PaginatedResponse<Event>>(
      '/events',
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all events automatically handling pagination.
   * @param params - Filtering parameters
   * @param config - Pagination configuration
   * @yields Individual events
   */
  async *listAll(
    params?: Omit<EventListParams, 'cursor' | 'limit'>,
    config?: PaginationConfig
  ): AsyncGenerator<Event, void, undefined> {
    yield* paginate(
      (cursor, limit) => this.list({ ...params, cursor, limit }),
      config
    );
  }

  /**
   * Get an event by ID.
   * @param id - Event ID
   * @param options - Request options
   * @returns Event object
   */
  async get(id: number, options?: RequestOptions): Promise<Event> {
    this.validateResourceId(id, 'event');
    return this._get<Event>(`/events/${id}`, undefined, options);
  }
}
