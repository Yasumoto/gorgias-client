"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
class Events {
    // eslint-disable-next-line no-unused-vars
    constructor(_axios) {
        this._axios = _axios;
    }
    /**
     * List events
     * @param params - Pagination and filtering parameters
     * @returns Paginated list of events
     */
    async list(params = {}) {
        const response = await this._axios.get('/events', { params });
        return response.data;
    }
    /**
     * Get an event by ID
     * @param id - Event ID
     * @returns Event object
     */
    async get(id) {
        const response = await this._axios.get(`/events/${id}`);
        return response.data;
    }
}
exports.Events = Events;
