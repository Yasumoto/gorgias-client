export class Messages {
    // eslint-disable-next-line no-unused-vars
    constructor(_axios) {
        this._axios = _axios;
    }
    /**
     * List messages for a ticket
     * @param ticketId - Ticket ID
     * @param params - Pagination parameters
     * @returns Paginated list of messages
     */
    async listForTicket(ticketId, params = {}) {
        const response = await this._axios.get(`/tickets/${ticketId}/messages`, { params });
        return response.data;
    }
    /**
     * List all messages
     * @param params - Pagination parameters
     * @returns Paginated list of messages
     */
    async list(params = {}) {
        const response = await this._axios.get('/messages', { params });
        return response.data;
    }
    /**
     * Get a message by ID
     * @param id - Message ID
     * @returns Message object
     */
    async get(id) {
        const response = await this._axios.get(`/messages/${id}`);
        return response.data;
    }
    /**
     * Create a new message
     * @param ticketId - Ticket ID
     * @param data - Message creation data
     * @returns Created message object
     */
    async create(ticketId, data) {
        const response = await this._axios.post(`/tickets/${ticketId}/messages`, data);
        return response.data;
    }
    /**
     * Update a message
     * @param id - Message ID
     * @param data - Message update data
     * @returns Updated message object
     */
    async update(id, data) {
        const response = await this._axios.put(`/messages/${id}`, data);
        return response.data;
    }
    /**
     * Delete a message
     * @param id - Message ID
     */
    async delete(id) {
        await this._axios.delete(`/messages/${id}`);
    }
}
