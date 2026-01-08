import type { AxiosInstance } from 'axios';
import {
  TicketMessage,
  TicketMessageCreateRequest,
  TicketMessageUpdateRequest,
  PaginatedResponse,
  PaginationParams
} from '../types.js';

export class Messages {
  // eslint-disable-next-line no-unused-vars
  constructor(private _axios: AxiosInstance) {}

  /**
   * List messages for a ticket
   * @param ticketId - Ticket ID
   * @param params - Pagination parameters
   * @returns Paginated list of messages
   */
  async listForTicket(ticketId: number, params: PaginationParams = {}): Promise<PaginatedResponse<TicketMessage>> {
    const response = await this._axios.get(`/tickets/${ticketId}/messages`, { params });
    return response.data;
  }

  /**
   * List all messages
   * @param params - Pagination parameters
   * @returns Paginated list of messages
   */
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<TicketMessage>> {
    const response = await this._axios.get('/messages', { params });
    return response.data;
  }

  /**
   * Get a message by ID
   * @param id - Message ID
   * @returns Message object
   */
  async get(id: number): Promise<TicketMessage> {
    const response = await this._axios.get(`/messages/${id}`);
    return response.data;
  }

  /**
   * Create a new message
   * @param ticketId - Ticket ID
   * @param data - Message creation data
   * @returns Created message object
   */
  async create(ticketId: number, data: TicketMessageCreateRequest): Promise<TicketMessage> {
    const response = await this._axios.post(`/tickets/${ticketId}/messages`, data);
    return response.data;
  }

  /**
   * Update a message
   * @param id - Message ID
   * @param data - Message update data
   * @returns Updated message object
   */
  async update(id: number, data: TicketMessageUpdateRequest): Promise<TicketMessage> {
    const response = await this._axios.put(`/messages/${id}`, data);
    return response.data;
  }

  /**
   * Delete a message
   * @param id - Message ID
   */
  async delete(id: number): Promise<void> {
    await this._axios.delete(`/messages/${id}`);
  }
}