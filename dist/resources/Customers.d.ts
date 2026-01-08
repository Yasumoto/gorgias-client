import type { AxiosInstance } from 'axios';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest, PaginatedResponse, PaginationParams } from '../types.js';
export declare class Customers {
    private _axios;
    constructor(_axios: AxiosInstance);
    /**
     * List customers
     * @param params - Pagination and filtering parameters
     * @returns Paginated list of customers
     */
    list(params?: PaginationParams & {
        email?: string;
        external_id?: string;
    }): Promise<PaginatedResponse<Customer>>;
    /**
     * Get a customer by ID
     * @param id - Customer ID
     * @returns Customer object
     */
    get(id: number): Promise<Customer>;
    /**
     * Create a new customer
     * @param data - Customer creation data
     * @returns Created customer object
     */
    create(data: CustomerCreateRequest): Promise<Customer>;
    /**
     * Update a customer
     * @param id - Customer ID
     * @param data - Customer update data
     * @returns Updated customer object
     */
    update(id: number, data: CustomerUpdateRequest): Promise<Customer>;
    /**
     * Delete a customer
     * @param id - Customer ID
     */
    delete(id: number): Promise<void>;
    /**
     * Delete multiple customers
     * @param customerIds - Array of customer IDs to delete
     */
    deleteMany(customerIds: number[]): Promise<void>;
}
