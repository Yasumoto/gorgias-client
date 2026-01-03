import type { AxiosInstance } from 'axios';
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  PaginatedResponse,
  PaginationParams
} from '../types';

export class Users {
  // eslint-disable-next-line no-unused-vars
  constructor(private _axios: AxiosInstance) {}

  /**
   * List users
   * @param params - Pagination parameters
   * @returns Paginated list of users
   */
  async list(params: PaginationParams = {}): Promise<PaginatedResponse<User>> {
    const response = await this._axios.get('/users', { params });
    return response.data;
  }

  /**
   * Get a user by ID
   * @param id - User ID
   * @returns User object
   */
  async get(id: number): Promise<User> {
    const response = await this._axios.get(`/users/${id}`);
    return response.data;
  }

  /**
   * Create a new user
   * @param data - User creation data
   * @returns Created user object
   */
  async create(data: UserCreateRequest): Promise<User> {
    const response = await this._axios.post('/users', data);
    return response.data;
  }

  /**
   * Update a user
   * @param id - User ID
   * @param data - User update data
   * @returns Updated user object
   */
  async update(id: number, data: UserUpdateRequest): Promise<User> {
    const response = await this._axios.put(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Delete a user
   * @param id - User ID
   */
  async delete(id: number): Promise<void> {
    await this._axios.delete(`/users/${id}`);
  }
}