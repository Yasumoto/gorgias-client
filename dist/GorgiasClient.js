import axios from 'axios';
import { handleAxiosError } from './errors.js';
export class GorgiasClient {
    /**
     * Creates a new GorgiasClient instance
     * @param subdomain - Your Gorgias account subdomain (e.g., "mycompany")
     * @param email - The email address used for authentication
     * @param apiKey - The API key from Settings > REST API in Gorgias
     * @param axiosConfig - Optional additional axios configuration
     */
    constructor(subdomain, email, apiKey, axiosConfig = {}) {
        const baseURL = `https://${subdomain}.gorgias.com/api`;
        this.axiosInstance = axios.create({
            baseURL,
            auth: {
                username: email,
                password: apiKey,
            },
            headers: {
                'Content-Type': 'application/json',
                ...axiosConfig.headers,
            },
            timeout: axiosConfig.timeout || 30000,
            ...axiosConfig,
        });
        // Add response interceptor for error handling
        this.axiosInstance.interceptors.response.use((response) => response, (error) => {
            throw handleAxiosError(error);
        });
        // Initialize resource classes
        this.customers = new Customers(this.axiosInstance);
        this.tickets = new Tickets(this.axiosInstance);
        this.messages = new Messages(this.axiosInstance);
        this.users = new Users(this.axiosInstance);
        this.integrations = new Integrations(this.axiosInstance);
        this.events = new Events(this.axiosInstance);
    }
    /**
     * Make a raw request to the Gorgias API
     */
    async request(config) {
        const response = await this.axiosInstance.request(config);
        return response.data;
    }
}
// Import resource classes here to avoid circular dependencies
import { Customers } from './resources/Customers.js';
import { Tickets } from './resources/Tickets.js';
import { Messages } from './resources/Messages.js';
import { Users } from './resources/Users.js';
import { Integrations } from './resources/Integrations.js';
import { Events } from './resources/Events.js';
