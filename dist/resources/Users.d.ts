import type { AxiosInstance } from 'axios';
import { User, UserCreateRequest, UserUpdateRequest, PaginatedResponse, PaginationParams } from '../types';
export declare class Users {
    private _axios;
    constructor(_axios: AxiosInstance);
    /**
     * List users
     * @param params - Pagination parameters
     * @returns Paginated list of users
     */
    list(params?: PaginationParams): Promise<PaginatedResponse<User>>;
    /**
     * Get a user by ID
     * @param id - User ID
     * @returns User object
     */
    get(id: number): Promise<User>;
    /**
     * Create a new user
     * @param data - User creation data
     * @returns Created user object
     */
    create(data: UserCreateRequest): Promise<User>;
    /**
     * Update a user
     * @param id - User ID
     * @param data - User update data
     * @returns Updated user object
     */
    update(id: number, data: UserUpdateRequest): Promise<User>;
    /**
     * Delete a user
     * @param id - User ID
     */
    delete(id: number): Promise<void>;
}
