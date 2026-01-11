/**
 * Customer resource operations.
 */

import { BaseResource } from './base.js';
import type { HttpClient, RequestOptions } from '../http/index.js';
import { paginate } from '../pagination/index.js';
import type { PaginationConfig } from '../pagination/index.js';
import type {
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types.js';
import { validateNonEmptyArray } from '../validation/index.js';

export interface CustomerListParams extends PaginationParams {
  email?: string;
  external_id?: string;
}

export class Customers extends BaseResource {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * List customers with pagination.
   * @param params - Pagination and filtering parameters
   * @param options - Request options
   * @returns Paginated list of customers
   */
  async list(
    params: CustomerListParams = {},
    options?: RequestOptions
  ): Promise<PaginatedResponse<Customer>> {
    return this._get<PaginatedResponse<Customer>>(
      '/customers',
      params as Record<string, string | number | boolean | undefined>,
      options
    );
  }

  /**
   * Iterate through all customers automatically handling pagination.
   * @param params - Filtering parameters
   * @param config - Pagination configuration
   * @yields Individual customers
   *
   * @example
   * ```typescript
   * for await (const customer of client.customers.listAll({ email: 'test@example.com' })) {
   *   console.log(customer.id);
   * }
   * ```
   */
  async *listAll(
    params?: Omit<CustomerListParams, 'cursor' | 'limit'>,
    config?: PaginationConfig
  ): AsyncGenerator<Customer, void, undefined> {
    yield* paginate(
      (cursor, limit) => this.list({ ...params, cursor, limit }),
      config
    );
  }

  /**
   * Get a customer by ID.
   * @param id - Customer ID
   * @param options - Request options
   * @returns Customer object
   */
  async get(id: number, options?: RequestOptions): Promise<Customer> {
    this.validateResourceId(id, 'customer');
    return this._get<Customer>(`/customers/${id}`, undefined, options);
  }

  /**
   * Create a new customer.
   * @param data - Customer creation data
   * @param options - Request options
   * @returns Created customer object
   */
  async create(
    data: CustomerCreateRequest,
    options?: RequestOptions
  ): Promise<Customer> {
    return this._post<Customer>('/customers', data, options);
  }

  /**
   * Update a customer.
   * @param id - Customer ID
   * @param data - Customer update data
   * @param options - Request options
   * @returns Updated customer object
   */
  async update(
    id: number,
    data: CustomerUpdateRequest,
    options?: RequestOptions
  ): Promise<Customer> {
    this.validateResourceId(id, 'customer');
    return this._put<Customer>(`/customers/${id}`, data, options);
  }

  /**
   * Delete a customer.
   * @param id - Customer ID
   * @param options - Request options
   */
  async delete(id: number, options?: RequestOptions): Promise<void> {
    this.validateResourceId(id, 'customer');
    await this._delete(`/customers/${id}`, undefined, options);
  }

  /**
   * Delete multiple customers.
   * @param customerIds - Array of customer IDs to delete
   * @param options - Request options
   */
  async deleteMany(customerIds: number[], options?: RequestOptions): Promise<void> {
    validateNonEmptyArray(customerIds, 'customerIds');
    for (const id of customerIds) {
      this.validateResourceId(id, 'customer');
    }
    await this._delete('/customers', { customers: customerIds }, options);
  }
}
