/**
 * User resource operations.
 */

import { BaseResource } from './base.js';
import type { HttpClient, RequestOptions } from '../http/index.js';
import { paginate } from '../pagination/index.js';
import type { PaginationConfig } from '../pagination/index.js';
import type {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types.js';

export class Users extends BaseResource {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * List users with pagination.
   * @param params - Pagination parameters
   * @param options - Request options
   * @returns Paginated list of users
   */
  async list(
    params: PaginationParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<User>> {
    return this._get<PaginatedResponse<User>>(
      '/users',
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all users automatically handling pagination.
   * @param config - Pagination configuration
   * @yields Individual users
   */
  async *listAll(
    config?: PaginationConfig
  ): AsyncGenerator<User, void, undefined> {
    yield* paginate(
      (cursor, limit) => this.list({ cursor, limit }),
      config
    );
  }

  /**
   * Get a user by ID.
   * @param id - User ID
   * @param options - Request options
   * @returns User object
   */
  async get(id: number, options?: RequestOptions): Promise<User> {
    this.validateResourceId(id, 'user');
    return this._get<User>(`/users/${id}`, undefined, options);
  }

  /**
   * Create a new user.
   * @param data - User creation data
   * @param options - Request options
   * @returns Created user object
   */
  async create(
    data: UserCreateRequest,
    options?: RequestOptions
  ): Promise<User> {
    return this._post<User>('/users', data, options);
  }

  /**
   * Update a user.
   * @param id - User ID
   * @param data - User update data
   * @param options - Request options
   * @returns Updated user object
   */
  async update(
    id: number,
    data: UserUpdateRequest,
    options?: RequestOptions
  ): Promise<User> {
    this.validateResourceId(id, 'user');
    return this._put<User>(`/users/${id}`, data, options);
  }

  /**
   * Delete a user.
   * @param id - User ID
   * @param options - Request options
   */
  async delete(id: number, options?: RequestOptions): Promise<void> {
    this.validateResourceId(id, 'user');
    await this._delete(`/users/${id}`, undefined, options);
  }
}
