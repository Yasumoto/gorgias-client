import type { AxiosInstance } from 'axios';
import { Event, PaginatedResponse, PaginationParams } from '../types.js';
export declare class Events {
    private _axios;
    constructor(_axios: AxiosInstance);
    /**
     * List events
     * @param params - Pagination and filtering parameters
     * @returns Paginated list of events
     */
    list(params?: PaginationParams & {
        object_type?: string;
        object_id?: number;
        type?: string;
        user_id?: number;
    }): Promise<PaginatedResponse<Event>>;
    /**
     * Get an event by ID
     * @param id - Event ID
     * @returns Event object
     */
    get(id: number): Promise<Event>;
}
