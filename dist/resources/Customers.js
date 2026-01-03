"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customers = void 0;
class Customers {
    // eslint-disable-next-line no-unused-vars
    constructor(_axios) {
        this._axios = _axios;
    }
    /**
     * List customers
     * @param params - Pagination and filtering parameters
     * @returns Paginated list of customers
     */
    async list(params = {}) {
        const response = await this._axios.get('/customers', { params });
        return response.data;
    }
    /**
     * Get a customer by ID
     * @param id - Customer ID
     * @returns Customer object
     */
    async get(id) {
        const response = await this._axios.get(`/customers/${id}`);
        return response.data;
    }
    /**
     * Create a new customer
     * @param data - Customer creation data
     * @returns Created customer object
     */
    async create(data) {
        const response = await this._axios.post('/customers', data);
        return response.data;
    }
    /**
     * Update a customer
     * @param id - Customer ID
     * @param data - Customer update data
     * @returns Updated customer object
     */
    async update(id, data) {
        const response = await this._axios.put(`/customers/${id}`, data);
        return response.data;
    }
    /**
     * Delete a customer
     * @param id - Customer ID
     */
    async delete(id) {
        await this._axios.delete(`/customers/${id}`);
    }
    /**
     * Delete multiple customers
     * @param customerIds - Array of customer IDs to delete
     */
    async deleteMany(customerIds) {
        await this._axios.delete('/customers', { data: { customers: customerIds } });
    }
}
exports.Customers = Customers;
