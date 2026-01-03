"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integrations = void 0;
class Integrations {
    // eslint-disable-next-line no-unused-vars
    constructor(_axios) {
        this._axios = _axios;
    }
    /**
     * List integrations
     * @param params - Pagination parameters
     * @returns Paginated list of integrations
     */
    async list(params = {}) {
        const response = await this._axios.get('/integrations', { params });
        return response.data;
    }
    /**
     * Get an integration by ID
     * @param id - Integration ID
     * @returns Integration object
     */
    async get(id) {
        const response = await this._axios.get(`/integrations/${id}`);
        return response.data;
    }
}
exports.Integrations = Integrations;
