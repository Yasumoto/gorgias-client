import type { AxiosInstance } from 'axios';
import { Integration, PaginatedResponse, PaginationParams } from '../types.js';
export declare class Integrations {
    private _axios;
    constructor(_axios: AxiosInstance);
    /**
     * List integrations
     * @param params - Pagination parameters
     * @returns Paginated list of integrations
     */
    list(params?: PaginationParams): Promise<PaginatedResponse<Integration>>;
    /**
     * Get an integration by ID
     * @param id - Integration ID
     * @returns Integration object
     */
    get(id: number): Promise<Integration>;
}
