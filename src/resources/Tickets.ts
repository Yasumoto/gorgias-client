/**
 * Ticket resource operations.
 */

import { BaseResource } from './base.js';
import type { HttpClient, RequestOptions } from '../http/index.js';
import { paginate } from '../pagination/index.js';
import type { PaginationConfig } from '../pagination/index.js';
import type {
  Ticket,
  TicketCreateRequest,
  TicketUpdateRequest,
  PaginatedResponse,
  PaginationParams,
  Tag,
} from '../types.js';
import { validateNonEmptyArray } from '../validation/index.js';

export interface TicketListParams extends PaginationParams {
  customer_id?: number;
  assignee_user_id?: number;
  status?: string;
  channel?: string;
}

export class Tickets extends BaseResource {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * List tickets with pagination.
   * @param params - Pagination and filtering parameters
   * @param options - Request options
   * @returns Paginated list of tickets
   */
  async list(
    params: TicketListParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<Ticket>> {
    return this._get<PaginatedResponse<Ticket>>(
      '/tickets',
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all tickets automatically handling pagination.
   * @param params - Filtering parameters
   * @param config - Pagination configuration
   * @yields Individual tickets
   */
  async *listAll(
    params?: Omit<TicketListParams, 'cursor' | 'limit'>,
    config?: PaginationConfig
  ): AsyncGenerator<Ticket, void, undefined> {
    yield* paginate(
      (cursor, limit) => this.list({ ...params, cursor, limit }),
      config
    );
  }

  /**
   * Get a ticket by ID.
   * @param id - Ticket ID
   * @param options - Request options
   * @returns Ticket object
   */
  async get(id: number, options?: RequestOptions): Promise<Ticket> {
    this.validateResourceId(id, 'ticket');
    return this._get<Ticket>(`/tickets/${id}`, undefined, options);
  }

  /**
   * Create a new ticket.
   * @param data - Ticket creation data
   * @param options - Request options
   * @returns Created ticket object
   */
  async create(
    data: TicketCreateRequest,
    options?: RequestOptions
  ): Promise<Ticket> {
    return this._post<Ticket>('/tickets', data, options);
  }

  /**
   * Update a ticket.
   * @param id - Ticket ID
   * @param data - Ticket update data
   * @param options - Request options
   * @returns Updated ticket object
   */
  async update(
    id: number,
    data: TicketUpdateRequest,
    options?: RequestOptions
  ): Promise<Ticket> {
    this.validateResourceId(id, 'ticket');
    return this._put<Ticket>(`/tickets/${id}`, data, options);
  }

  /**
   * Delete a ticket.
   * @param id - Ticket ID
   * @param options - Request options
   */
  async delete(id: number, options?: RequestOptions): Promise<void> {
    this.validateResourceId(id, 'ticket');
    await this._delete(`/tickets/${id}`, undefined, options);
  }

  /**
   * Add tags to a ticket.
   * @param ticketId - Ticket ID
   * @param tags - Array of tag names
   * @param options - Request options
   */
  async addTags(
    ticketId: number,
    tags: string[],
    options?: RequestOptions
  ): Promise<void> {
    this.validateResourceId(ticketId, 'ticket');
    validateNonEmptyArray(tags, 'tags');
    await this._post(`/tickets/${ticketId}/tags`, { tags }, options);
  }

  /**
   * Remove tags from a ticket.
   * @param ticketId - Ticket ID
   * @param tags - Array of tag names to remove
   * @param options - Request options
   */
  async removeTags(
    ticketId: number,
    tags: string[],
    options?: RequestOptions
  ): Promise<void> {
    this.validateResourceId(ticketId, 'ticket');
    validateNonEmptyArray(tags, 'tags');
    await this._delete(`/tickets/${ticketId}/tags`, { tags }, options);
  }

  /**
   * Set ticket tags (replaces all existing tags).
   * @param ticketId - Ticket ID
   * @param tags - Array of tag names
   * @param options - Request options
   */
  async setTags(
    ticketId: number,
    tags: string[],
    options?: RequestOptions
  ): Promise<void> {
    this.validateResourceId(ticketId, 'ticket');
    await this._put(`/tickets/${ticketId}/tags`, { tags }, options);
  }

  /**
   * List ticket tags.
   * @param ticketId - Ticket ID
   * @param options - Request options
   * @returns Array of tag objects
   */
  async listTags(
    ticketId: number,
    options?: RequestOptions
  ): Promise<Tag[]> {
    this.validateResourceId(ticketId, 'ticket');
    return this._get<Tag[]>(`/tickets/${ticketId}/tags`, undefined, options);
  }
}
