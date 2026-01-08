import type { AxiosInstance } from 'axios';
import { TicketMessage, TicketMessageCreateRequest, TicketMessageUpdateRequest, PaginatedResponse, PaginationParams } from '../types.js';
export declare class Messages {
    private _axios;
    constructor(_axios: AxiosInstance);
    /**
     * List messages for a ticket
     * @param ticketId - Ticket ID
     * @param params - Pagination parameters
     * @returns Paginated list of messages
     */
    listForTicket(ticketId: number, params?: PaginationParams): Promise<PaginatedResponse<TicketMessage>>;
    /**
     * List all messages
     * @param params - Pagination parameters
     * @returns Paginated list of messages
     */
    list(params?: PaginationParams): Promise<PaginatedResponse<TicketMessage>>;
    /**
     * Get a message by ID
     * @param id - Message ID
     * @returns Message object
     */
    get(id: number): Promise<TicketMessage>;
    /**
     * Create a new message
     * @param ticketId - Ticket ID
     * @param data - Message creation data
     * @returns Created message object
     */
    create(ticketId: number, data: TicketMessageCreateRequest): Promise<TicketMessage>;
    /**
     * Update a message
     * @param id - Message ID
     * @param data - Message update data
     * @returns Updated message object
     */
    update(id: number, data: TicketMessageUpdateRequest): Promise<TicketMessage>;
    /**
     * Delete a message
     * @param id - Message ID
     */
    delete(id: number): Promise<void>;
}
