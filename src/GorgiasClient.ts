import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosConfig, PaginationParams, PaginatedResponse } from './types';
import { handleAxiosError } from './errors';

export class GorgiasClient {
  private axiosInstance: AxiosInstance;

  public customers: Customers;
  public tickets: Tickets;
  public messages: Messages;
  public users: Users;
  public integrations: Integrations;
  public events: Events;

  /**
   * Creates a new GorgiasClient instance
   * @param subdomain - Your Gorgias account subdomain (e.g., "mycompany")
   * @param email - The email address used for authentication
   * @param apiKey - The API key from Settings > REST API in Gorgias
   * @param axiosConfig - Optional additional axios configuration
   */
  constructor(
    subdomain: string,
    email: string,
    apiKey: string,
    axiosConfig: AxiosConfig = {}
  ) {
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
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: any) => {
        throw handleAxiosError(error);
      }
    );

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
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }
}

// Import resource classes here to avoid circular dependencies
import { Customers } from './resources/Customers';
import { Tickets } from './resources/Tickets';
import { Messages } from './resources/Messages';
import { Users } from './resources/Users';
import { Integrations } from './resources/Integrations';
import { Events } from './resources/Events';