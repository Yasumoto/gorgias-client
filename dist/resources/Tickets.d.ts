import type { AxiosInstance } from 'axios';
import { Ticket, TicketCreateRequest, TicketUpdateRequest, PaginatedResponse, PaginationParams } from '../types.js';
export declare class Tickets {
    private _axios;
    constructor(_axios: AxiosInstance);
    /**
     * List tickets
     * @param params - Pagination and filtering parameters
     * @returns Paginated list of tickets
     */
    list(params?: PaginationParams & {
        customer_id?: number;
        assignee_user_id?: number;
        status?: string;
        channel?: string;
    }): Promise<PaginatedResponse<Ticket>>;
    /**
     * Get a ticket by ID
     * @param id - Ticket ID
     * @returns Ticket object
     */
    get(id: number): Promise<Ticket>;
    /**
     * Create a new ticket
     * @param data - Ticket creation data
     * @returns Created ticket object
     */
    create(data: TicketCreateRequest): Promise<Ticket>;
    /**
     * Update a ticket
     * @param id - Ticket ID
     * @param data - Ticket update data
     * @returns Updated ticket object
     */
    update(id: number, data: TicketUpdateRequest): Promise<Ticket>;
    /**
     * Delete a ticket
     * @param id - Ticket ID
     */
    delete(id: number): Promise<void>;
    /**
     * Add tags to a ticket
     * @param ticketId - Ticket ID
     * @param tags - Array of tag names
     */
    addTags(ticketId: number, tags: string[]): Promise<void>;
    /**
     * Remove tags from a ticket
     * @param ticketId - Ticket ID
     * @param tags - Array of tag names
     */
    removeTags(ticketId: number, tags: string[]): Promise<void>;
    /**
     * Set ticket tags
     * @param ticketId - Ticket ID
     * @param tags - Array of tag names
     */
    setTags(ticketId: number, tags: string[]): Promise<void>;
    /**
     * List ticket tags
     * @param ticketId - Ticket ID
     * @returns Array of tag objects
     */
    listTags(ticketId: number): Promise<Array<{
        name: string;
    }>>;
}
