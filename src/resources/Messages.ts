/**
 * Message resource operations.
 */

import { BaseResource } from './base.js';
import type { HttpClient, RequestOptions } from '../http/index.js';
import { paginate } from '../pagination/index.js';
import type { PaginationConfig } from '../pagination/index.js';
import type {
  TicketMessage,
  TicketMessageCreateRequest,
  TicketMessageUpdateRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types.js';

export class Messages extends BaseResource {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * List messages for a ticket.
   * @param ticketId - Ticket ID
   * @param params - Pagination parameters
   * @param options - Request options
   * @returns Paginated list of messages
   */
  async listForTicket(
    ticketId: number,
    params: PaginationParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<TicketMessage>> {
    this.validateResourceId(ticketId, 'ticket');
    return this._get<PaginatedResponse<TicketMessage>>(
      `/tickets/${ticketId}/messages`,
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all messages for a ticket.
   * @param ticketId - Ticket ID
   * @param config - Pagination configuration
   * @yields Individual messages
   */
  async *listAllForTicket(
    ticketId: number,
    config?: PaginationConfig
  ): AsyncGenerator<TicketMessage, void, undefined> {
    this.validateResourceId(ticketId, 'ticket');
    yield* paginate(
      (cursor, limit) => this.listForTicket(ticketId, { cursor, limit }),
      config
    );
  }

  /**
   * List all messages.
   * @param params - Pagination parameters
   * @param options - Request options
   * @returns Paginated list of messages
   */
  async list(
    params: PaginationParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<TicketMessage>> {
    return this._get<PaginatedResponse<TicketMessage>>(
      '/messages',
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all messages.
   * @param config - Pagination configuration
   * @yields Individual messages
   */
  async *listAll(
    config?: PaginationConfig
  ): AsyncGenerator<TicketMessage, void, undefined> {
    yield* paginate(
      (cursor, limit) => this.list({ cursor, limit }),
      config
    );
  }

  /**
   * Get a message by ID.
   * @param id - Message ID
   * @param options - Request options
   * @returns Message object
   */
  async get(id: number, options?: RequestOptions): Promise<TicketMessage> {
    this.validateResourceId(id, 'message');
    return this._get<TicketMessage>(`/messages/${id}`, undefined, options);
  }

  /**
   * Create a new message.
   * @param ticketId - Ticket ID
   * @param data - Message creation data
   * @param options - Request options
   * @returns Created message object
   */
  async create(
    ticketId: number,
    data: TicketMessageCreateRequest,
    options?: RequestOptions
  ): Promise<TicketMessage> {
    this.validateResourceId(ticketId, 'ticket');
    return this._post<TicketMessage>(
      `/tickets/${ticketId}/messages`,
      data,
      options
    );
  }

  /**
   * Update a message.
   * @param id - Message ID
   * @param data - Message update data
   * @param options - Request options
   * @returns Updated message object
   */
  async update(
    id: number,
    data: TicketMessageUpdateRequest,
    options?: RequestOptions
  ): Promise<TicketMessage> {
    this.validateResourceId(id, 'message');
    return this._put<TicketMessage>(`/messages/${id}`, data, options);
  }

  /**
   * Delete a message.
   * @param id - Message ID
   * @param options - Request options
   */
  async delete(id: number, options?: RequestOptions): Promise<void> {
    this.validateResourceId(id, 'message');
    await this._delete(`/messages/${id}`, undefined, options);
  }
}
