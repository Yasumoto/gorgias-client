"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GorgiasClient = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("./errors");
class GorgiasClient {
    /**
     * Creates a new GorgiasClient instance
     * @param subdomain - Your Gorgias account subdomain (e.g., "mycompany")
     * @param email - The email address used for authentication
     * @param apiKey - The API key from Settings > REST API in Gorgias
     * @param axiosConfig - Optional additional axios configuration
     */
    constructor(subdomain, email, apiKey, axiosConfig = {}) {
        const baseURL = `https://${subdomain}.gorgias.com/api`;
        this.axiosInstance = axios_1.default.create({
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
            throw (0, errors_1.handleAxiosError)(error);
        });
        // Initialize resource classes
        this.customers = new Customers_1.Customers(this.axiosInstance);
        this.tickets = new Tickets_1.Tickets(this.axiosInstance);
        this.messages = new Messages_1.Messages(this.axiosInstance);
        this.users = new Users_1.Users(this.axiosInstance);
        this.integrations = new Integrations_1.Integrations(this.axiosInstance);
        this.events = new Events_1.Events(this.axiosInstance);
    }
    /**
     * Make a raw request to the Gorgias API
     */
    async request(config) {
        const response = await this.axiosInstance.request(config);
        return response.data;
    }
}
exports.GorgiasClient = GorgiasClient;
// Import resource classes here to avoid circular dependencies
const Customers_1 = require("./resources/Customers");
const Tickets_1 = require("./resources/Tickets");
const Messages_1 = require("./resources/Messages");
const Users_1 = require("./resources/Users");
const Integrations_1 = require("./resources/Integrations");
const Events_1 = require("./resources/Events");
