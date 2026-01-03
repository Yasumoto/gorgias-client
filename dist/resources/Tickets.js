"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tickets = void 0;
class Tickets {
    // eslint-disable-next-line no-unused-vars
    constructor(_axios) {
        this._axios = _axios;
    }
    /**
     * List tickets
     * @param params - Pagination and filtering parameters
     * @returns Paginated list of tickets
     */
    async list(params = {}) {
        const response = await this._axios.get('/tickets', { params });
        return response.data;
    }
    /**
     * Get a ticket by ID
     * @param id - Ticket ID
     * @returns Ticket object
     */
    async get(id) {
        const response = await this._axios.get(`/tickets/${id}`);
        return response.data;
    }
    /**
     * Create a new ticket
     * @param data - Ticket creation data
     * @returns Created ticket object
     */
    async create(data) {
        const response = await this._axios.post('/tickets', data);
        return response.data;
    }
    /**
     * Update a ticket
     * @param id - Ticket ID
     * @param data - Ticket update data
     * @returns Updated ticket object
     */
    async update(id, data) {
        const response = await this._axios.put(`/tickets/${id}`, data);
        return response.data;
    }
    /**
     * Delete a ticket
     * @param id - Ticket ID
     */
    async delete(id) {
        await this._axios.delete(`/tickets/${id}`);
    }
    /**
     * Add tags to a ticket
     * @param ticketId - Ticket ID
     * @param tags - Array of tag names
     */
    async addTags(ticketId, tags) {
        await this._axios.post(`/tickets/${ticketId}/tags`, { tags });
    }
    /**
     * Remove tags from a ticket
     * @param ticketId - Ticket ID
     * @param tags - Array of tag names
     */
    async removeTags(ticketId, tags) {
        await this._axios.delete(`/tickets/${ticketId}/tags`, { data: { tags } });
    }
    /**
     * Set ticket tags
     * @param ticketId - Ticket ID
     * @param tags - Array of tag names
     */
    async setTags(ticketId, tags) {
        await this._axios.put(`/tickets/${ticketId}/tags`, { tags });
    }
    /**
     * List ticket tags
     * @param ticketId - Ticket ID
     * @returns Array of tag objects
     */
    async listTags(ticketId) {
        const response = await this._axios.get(`/tickets/${ticketId}/tags`);
        return response.data;
    }
}
exports.Tickets = Tickets;
