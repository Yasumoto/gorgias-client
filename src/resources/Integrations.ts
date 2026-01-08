import type { AxiosInstance } from 'axios';
import {
  Integration, PaginatedResponse, PaginationParams } from '../types.js';

export class Integrations {
  // eslint-disable-next-line no-unused-vars
  constructor(private _axios: AxiosInstance) {}

  /**
   * List integrations
   * @param params - Pagination parameters
   * @returns Paginated list of integrations
   */
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<Integration>> {
    const response = await this._axios.get('/integrations', { params });
    return response.data;
  }

  /**
   * Get an integration by ID
   * @param id - Integration ID
   * @returns Integration object
   */
  async get(id: number): Promise<Integration> {
    const response = await this._axios.get(`/integrations/${id}`);
    return response.data;
  }
}