import { AxiosRequestConfig } from 'axios';
import { AxiosConfig } from './types';
export declare class GorgiasClient {
    private axiosInstance;
    customers: Customers;
    tickets: Tickets;
    messages: Messages;
    users: Users;
    integrations: Integrations;
    events: Events;
    /**
     * Creates a new GorgiasClient instance
     * @param subdomain - Your Gorgias account subdomain (e.g., "mycompany")
     * @param email - The email address used for authentication
     * @param apiKey - The API key from Settings > REST API in Gorgias
     * @param axiosConfig - Optional additional axios configuration
     */
    constructor(subdomain: string, email: string, apiKey: string, axiosConfig?: AxiosConfig);
    /**
     * Make a raw request to the Gorgias API
     */
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
}
import { Customers } from './resources/Customers';
import { Tickets } from './resources/Tickets';
import { Messages } from './resources/Messages';
import { Users } from './resources/Users';
import { Integrations } from './resources/Integrations';
import { Events } from './resources/Events';
