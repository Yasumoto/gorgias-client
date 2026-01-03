import type { AxiosInstance } from 'axios';
import {
  Event, PaginatedResponse, PaginationParams } from '../types';

export class Events {
  // eslint-disable-next-line no-unused-vars
  constructor(private _axios: AxiosInstance) {}

  /**
   * List events
   * @param params - Pagination and filtering parameters
   * @returns Paginated list of events
   */
  async list(params: PaginationParams & { 
    object_type?: string; 
    object_id?: number; 
    type?: string; 
    user_id?: number 
  } = {}): Promise<PaginatedResponse<Event>> {
    const response = await this._axios.get('/events', { params });
    return response.data;
  }

  /**
   * Get an event by ID
   * @param id - Event ID
   * @returns Event object
   */
  async get(id: number): Promise<Event> {
    const response = await this._axios.get(`/events/${id}`);
    return response.data;
  }
}