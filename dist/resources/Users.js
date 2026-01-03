"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
class Users {
    // eslint-disable-next-line no-unused-vars
    constructor(_axios) {
        this._axios = _axios;
    }
    /**
     * List users
     * @param params - Pagination parameters
     * @returns Paginated list of users
     */
    async list(params = {}) {
        const response = await this._axios.get('/users', { params });
        return response.data;
    }
    /**
     * Get a user by ID
     * @param id - User ID
     * @returns User object
     */
    async get(id) {
        const response = await this._axios.get(`/users/${id}`);
        return response.data;
    }
    /**
     * Create a new user
     * @param data - User creation data
     * @returns Created user object
     */
    async create(data) {
        const response = await this._axios.post('/users', data);
        return response.data;
    }
    /**
     * Update a user
     * @param id - User ID
     * @param data - User update data
     * @returns Updated user object
     */
    async update(id, data) {
        const response = await this._axios.put(`/users/${id}`, data);
        return response.data;
    }
    /**
     * Delete a user
     * @param id - User ID
     */
    async delete(id) {
        await this._axios.delete(`/users/${id}`);
    }
}
exports.Users = Users;
